# AWS IAM — Exhaustive Deep Dive

> **Numbers ke baare me disclaimer (ek baar, upar hi):** is document ke saare quotas aur prices **6 August 2026** ko AWS ke official docs se verify kiye gaye hain (`docs.aws.amazon.com/IAM/latest/UserGuide/reference_iam-quotas.html` aur IAM Access Analyzer pricing page). AWS ye numbers chupchaap badalta rehta hai. Production decision lene se pehle apne account me `aws service-quotas list-service-quotas --service-code iam --region us-east-1` chala ke confirm kar lena. Jahan number extra volatile hai wahan maine alag se `⚠️ verify` likha hai.

---

## 1. Ek Line Me

IAM AWS ka **authentication + authorization control plane** hai — ye decide karta hai ki *kaun* (principal) *kis resource* par *kaun sa API call* kar sakta hai, aur ye decision har single AWS API request par run hota hai.

---

## 2. Problem Statement

### Before IAM (2006–2010 wala daur)

Jab AWS launch hua tha, tab har AWS account ke paas sirf **ek** credential set hota tha — root account ka email/password aur ek pair of access keys. Bas. Koi users nahi, koi roles nahi, koi granular permissions nahi.

Iska matlab practically kya tha:

- **Ek key sabke paas.** Team me 8 log hain? Sabko wahi root access key milti thi, Slack/email par. Koi resign kar gaya? Poori company ki key rotate karo aur har deployment script me update karo.
- **All-or-nothing access.** Intern ko sirf ek S3 bucket se logs padhne the — lekin usko wo key milti thi jisse wo poore production RDS ko `DeleteDBInstance` kar sakta tha.
- **Audit impossible.** CloudTrail me har entry me wahi ek identity dikhti thi. "Ye instance kisne terminate kiya?" ka jawab tha "root ne". Bahut helpful. 🙃
- **Applications me hardcoded keys.** EC2 par chal rahe app ko S3 access chahiye? Key ko `config.json` me daalo aur AMI me bake kar do. Wo AMI kisi ne share kar diya to keys leak.
- **Cross-company access ka koi tareeka nahi.** Third-party vendor (jaise backup service) ko access dena hai? Unko apni permanent key de do aur bhagwan bharose baith jao.

Ye exactly wahi dard hai jo tumne **SQL Server** me dekha hoga agar kisi legacy project me sab log `sa` login se connect karte hain. Har app, har developer, har cron job — sab `sa`. Kaam chal jaata hai jab tak koi galti se `DROP DATABASE` nahi maar deta.

### After IAM

AWS ne 2010 me IAM launch kiya aur model completely badal gaya:

| Problem | IAM ka solution |
|---|---|
| Ek shared credential | Har insaan ka apna IAM user / SSO identity |
| All-or-nothing access | JSON policies — action-level aur resource-level granularity |
| Audit nahi ho pata | Har API call CloudTrail me actual principal ke saath log hoti hai |
| Hardcoded keys in apps | IAM roles — temporary credentials jo automatically rotate hote hain |
| Third-party access | Cross-account role assume with External ID |
| Manual key rotation | STS temporary credentials — default 1 ghante me khud expire |

### Aaj ka reality check

Modern AWS setup me **IAM users banate hi nahi hain** (except kuch legacy edge cases). Human logon ke liye **IAM Identity Center (ex-AWS SSO)** hota hai jo tumhare corporate IdP (Okta/Entra ID/Google) se federate karta hai. Machines ke liye **IAM roles** hote hain. Long-lived access keys ab anti-pattern maane jaate hain.

Aur ek important baat: **IAM control plane har AWS API call ke beech me baitha hai.** Tum jab bhi `s3:GetObject` maarte ho, wo request pehle IAM policy evaluation engine se guzarti hai. Ye Express.js ke `app.use(authMiddleware)` jaisa hai — sirf ye ki tum ise bypass nahi kar sakte, aur ye AWS-wide global middleware hai.

---

## 3. Vocabulary Table

| Term | Matlab | Analogy tumhari duniya se |
|---|---|---|
| **Principal** | Wo entity jo request kar rahi hai — user, role session, AWS service, ya federated identity | Node/Express me `req.user` — request kaun kar raha hai |
| **IAM User** | Permanent identity, long-lived credentials (password + access keys) | SQL Server ka permanent SQL login |
| **IAM Group** | Users ka collection, policies group par attach hoti hain | SQL Server database role (`db_datareader`) — user ko role me daalo |
| **IAM Role** | Identity jiske paas permissions hain lekin credentials nahi. Koi bhi ise "assume" karke temporary credentials le sakta hai | `EXECUTE AS` in SQL Server, ya ek JWT jo tum har ghante refresh karte ho |
| **Policy** | JSON document jo permissions define karta hai | `GRANT SELECT ON dbo.Orders TO reader` — bas JSON me aur zyada expressive |
| **Statement** | Policy ke andar ek individual rule block | Ek `GRANT` line |
| **Effect** | `Allow` ya `Deny` | `GRANT` vs `DENY` in T-SQL |
| **Action** | Kaun sa API call, e.g. `s3:GetObject`, `dynamodb:Query` | `SELECT`, `INSERT`, `EXECUTE` |
| **Resource** | Kis cheez par, ARN format me | `dbo.Orders` table name |
| **Condition** | Extra checks — IP, MFA, time, tags | `WHERE` clause on the permission itself |
| **ARN** | Amazon Resource Name — har AWS resource ka globally unique ID | Fully qualified name: `server.database.schema.table` |
| **Identity-based policy** | Policy jo user/group/role par attach hoti hai — "ye banda kya kar sakta hai" | Login ko GRANT dena |
| **Resource-based policy** | Policy jo resource par attach hoti hai — "is resource ko kaun chhoo sakta hai" | Table par ACL lagana. SQL me exact equivalent nahi hai |
| **Trust policy** | Role ki resource-based policy — "mujhe kaun assume kar sakta hai" | API ka `allowedIssuers` whitelist |
| **STS** | Security Token Service — temporary credentials issue karne wala service | Auth server jo short-lived JWT deta hai |
| **AssumeRole** | STS API jo role ki temporary credentials return karta hai | `POST /auth/token` — refresh token se access token lena |
| **Access Key ID** | Public part of a credential pair, `AKIA...` (user) ya `ASIA...` (temporary) | Username |
| **Secret Access Key** | Private part — request signing ke liye | Password (lekin wire par kabhi nahi jaata) |
| **Session Token** | Teesra component jo sirf temporary credentials ke saath aata hai | JWT ka signature part |
| **SigV4** | AWS ka request signing algorithm (HMAC-SHA256 chain) | HMAC-signed webhook — GitHub webhook signature jaisa |
| **Instance Profile** | Wrapper jo IAM role ko EC2 instance se attach karta hai | Container ka service account |
| **Managed Policy** | Standalone reusable policy object, kai identities par attach ho sakti hai | Shared stored procedure / npm package |
| **Inline Policy** | Policy jo directly ek hi identity me embedded hai, reusable nahi | Inline SQL query — ek jagah, copy-paste karo to duplicate |
| **AWS Managed Policy** | AWS ki banayi policy (`ReadOnlyAccess`), AWS hi maintain karta hai | `@types/node` — koi aur maintain kar raha hai |
| **Customer Managed Policy** | Tumhari banayi policy, tum version control karte ho | Tumhara internal npm package |
| **Permissions Boundary** | Maximum permissions ka ceiling — grant nahi karta, sirf limit karta hai | TypeScript ka `Pick<T, K>` — jo hai usme se subset hi allow |
| **SCP (Service Control Policy)** | AWS Organizations level ka guardrail, poore account par ceiling | Firewall rule at the perimeter — andar chahe jo GRANT ho, ye upar se block karega |
| **RCP (Resource Control Policy)** | Org-level ceiling **resource-based** access par | Reverse-direction SCP |
| **Session Policy** | Policy jo AssumeRole call ke waqt pass hoti hai, us ek session ke liye | Query hint — ek specific execution ke liye |
| **Service-Linked Role** | AWS service ki apni pre-defined role, wo khud manage karta hai | Framework ka internal system user |
| **Service Principal** | AWS service jo principal ki tarah act karta hai, e.g. `lambda.amazonaws.com` | Microservice ka service account |
| **Federation** | External IdP (SAML/OIDC) se AWS access | OAuth "Login with Google" |
| **IAM Identity Center** | AWS ka SSO product — human access ka modern tareeka | Okta/Keycloak ka AWS-native version |
| **External ID** | Shared secret jo third-party role assumption me confused deputy rokhta hai | Webhook shared secret |
| **PassRole** | Special permission — kisi service ko role "de" paana | Delegation right — "main is service ko ye badge de sakta hoon" |
| **IMDS** | Instance Metadata Service — `169.254.169.254`, EC2 ko credentials deta hai | `localhost:port` par chalne wala sidecar jo token deta hai |
| **IRSA / Pod Identity** | EKS pods ko IAM roles dene ka mechanism | Kubernetes ServiceAccount ↔ IAM role mapping |
| **Access Advisor** | Report — is identity ne kaun se services actually use kiye | SQL Server ka `sys.dm_exec_procedure_stats` — kya actually chala |
| **Credential Report** | Account-wide CSV — sab users, unki keys, MFA status, last used | Audit table dump |
| **IAM Access Analyzer** | Automated reasoning tool — external access, unused access, policy validation | Static analysis / ESLint for policies |

---

## 4. Mental Model

### Core idea

IAM ko **do alag cheezon** ki tarah socho, aur ye distinction 90% confusion khatam kar deta hai:

1. **Identity plane** — kaun ho tum? (Authentication). Ye access key, session token, ya federated assertion se prove hota hai.
2. **Policy evaluation engine** — tumhe ye karne ki ijaazat hai ya nahi? (Authorization). Ye ek deterministic function hai jo har request par run hota hai.

Sabse important: **IAM ek pure function hai.** Input: (principal, action, resource, context). Output: `Allow` ya `Deny`. Bas. Koi state nahi, koi "session me kya hua tha" nahi. Har request independently evaluate hoti hai — Express middleware jaise, lekin **stateless**.

### Request ka poora journey

```
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: CREDENTIALS KAHAN SE AAYE?                                 │
└─────────────────────────────────────────────────────────────────────┘

   IAM User                Federated (SAML/OIDC)         EC2 / Lambda / ECS
   (AKIA... key)           (Okta, GitHub Actions)        (attached role)
        │                          │                            │
        │                          ▼                            ▼
        │                  ┌───────────────┐            ┌───────────────┐
        │                  │ sts:AssumeRole│            │  IMDSv2 /     │
        │                  │ WithSAML /    │            │  container    │
        │                  │ WithWebIdentity│           │  cred endpoint│
        │                  └───────┬───────┘            └───────┬───────┘
        │                          │                            │
        │                          ▼                            ▼
        │              ┌────────────────────────────────────────────┐
        │              │             AWS STS                        │
        │              │  Returns: AccessKeyId (ASIA...)            │
        │              │           SecretAccessKey                  │
        │              │           SessionToken                     │
        │              │           Expiration (default 1 hour)      │
        │              └──────────────────┬─────────────────────────┘
        │                                 │
        └────────────────┬────────────────┘
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: REQUEST SIGN KARO (SigV4)                                  │
│  SDK khud karta hai — HMAC-SHA256 chain over canonical request      │
│  Header: Authorization: AWS4-HMAC-SHA256 Credential=... Signature=..│
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: SERVICE ENDPOINT (e.g. s3.ap-south-1.amazonaws.com)        │
│  Signature verify → principal identify → IAM se poocho              │
└──────────────────────────────┬──────────────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: POLICY EVALUATION ENGINE  ← YAHAN ASLI KHEL HAI            │
│                                                                     │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4a. Koi bhi explicit DENY hai? (kahin bhi)               │    │
│   │      → HAAN? request DENY. Khatam. Aage kuch nahi dekha.  │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ nahi                               │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4b. Organizations SCP allow karti hai?  (agar org me ho) │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ haan                               │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4c. Resource Control Policy (RCP) allow karti hai?       │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ haan                               │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4d. Resource-based policy explicitly allow karti hai?    │    │
│   │      (S3 bucket policy, KMS key policy, SQS queue policy) │    │
│   │      → Same account + IAM principal? ye OR condition hai  │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼                                    │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4e. Identity-based policy allow karti hai?               │    │
│   │      (inline + managed + group-inherited, sab union)      │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ haan                               │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4f. Permissions Boundary allow karti hai? (agar set ho)  │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ haan                               │
│   ┌───────────────────────────────────────────────────────────┐    │
│   │  4g. Session Policy allow karti hai? (agar pass ki ho)    │    │
│   └───────────────────────────┬───────────────────────────────┘    │
│                               ▼ haan                               │
│                        ✅  ALLOW                                    │
│                                                                     │
│   Kisi bhi step par "nahi" → ❌ implicit DENY (403 AccessDenied)    │
└─────────────────────────────────────────────────────────────────────┘
```

### Do golden rules

```
RULE 1: DEFAULT DENY
        Jo explicitly allow nahi hai, wo deny hai.
        SQL me tumhe DENY likhna padta hai. Yahan silence hi DENY hai.

RULE 2: EXPLICIT DENY WINS, ALWAYS
        Ek hi Deny statement kahin bhi ho — 500 Allow statements bekaar.
        Ye override nahi ho sakta. Root user bhi nahi kar sakta (SCP ke case me).
```

### Ek aur mental model: "Boundary vs Grant"

Ye wo cheez hai jo log sabse late samajhte hain:

```
     Kaun sa policy type GRANT karta hai vs LIMIT karta hai?

     ┌─────────────────────┬─────────┬─────────┐
     │ Policy type         │ Grants? │ Limits? │
     ├─────────────────────┼─────────┼─────────┤
     │ Identity-based      │   ✅    │   ❌    │
     │ Resource-based      │   ✅    │   ❌    │
     │ Permissions boundary│   ❌    │   ✅    │
     │ SCP                 │   ❌    │   ✅    │
     │ RCP                 │   ❌    │   ✅    │
     │ Session policy      │   ❌    │   ✅    │
     └─────────────────────┴─────────┴─────────┘

     Effective permissions = INTERSECTION of all "limits"
                             ∩ UNION of all "grants"
```

Yaani agar SCP me `s3:*` allow hai aur identity policy me `s3:GetObject` allow hai → effective = `s3:GetObject`. Aur agar SCP me sirf `dynamodb:*` allow hai, chahe identity policy me `AdministratorAccess` ho — S3 par kuch nahi kar paoge.

Node analogy: identity policies `Array.concat()` hain (union), boundaries/SCPs `Array.filter()` hain (intersection).

---

## 5. Questions & Answers

### 🟢 Q1–Q15 — Fundamentals (Basic)

**Q1: IAM actually hai kya — ek service, ek database, ya ek middleware?**

Teeno thoda-thoda. Technically IAM ek **globally replicated control plane service** hai jo do kaam karta hai: (a) identity objects store karta hai — users, roles, policies, aur (b) ek **policy evaluation engine** expose karta hai jise har doosra AWS service har API call par consult karta hai. Jab tum `s3:GetObject` maarte ho, S3 ka frontend pehle signature verify karta hai, phir IAM ke evaluation logic se poochta hai "is principal ko allowed hai?". Ye poochna network call nahi hai — policies har region me replicate hoti hain, isliye evaluation local hoti hai. Isi wajah se IAM changes **eventually consistent** hain (Q51 dekho). "Kyun" ye design: agar har S3 request ko us-east-1 me IAM se sync poochna padta to latency aur blast radius dono unacceptable ho jaate.

> 💡 **Gotcha:** IAM sirf **AWS API calls** ko control karta hai. Tumhare EC2 par chal rahe Postgres ka `pg_hba.conf`, ya SQL Server ka login — IAM unko nahi jaanta. IAM ye control karta hai ki tum `rds:DeleteDBInstance` kar sakte ho ya nahi, na ki database ke andar `SELECT` kar sakte ho ya nahi. Do alag layers hain.

---

**Q2: Root user kya hai aur usse dur rehne ko kyun kehte hain?**

Root user = wo email address jisse tumne AWS account banaya tha. Ye **IAM ke bahar** hai — root ke paas koi IAM policy attach nahi hoti, aur usko koi identity policy ya permissions boundary rok nahi sakti. Root effectively `*:*` hai aur ye hardcoded hai. Sirf SCP `RootSessionAccess` type restrictions kuch had tak rok sakti hain (member accounts me, management account ke root ko nahi). Kyun khatarnaak: root credentials leak hone ka matlab hai account ka poora control gaya — billing, account closure, doosre users delete karna, sab. Aur root ke actions ko tum apni hi policies se rok nahi sakte.

Sahi tareeka: root par **hardware MFA** lagao, uske access keys **delete** kar do (agar hain to), password ko password manager me daal ke bhool jao, aur alerting laga do ki jab bhi root sign-in ho CloudTrail se alert aaye.

> 💡 **Gotcha:** Kuch kaam sirf root hi kar sakta hai — account close karna, support plan badalna, AWS account settings (jaise account name/email), S3 bucket policy ko "unlock" karna jab tumne galti se khud ko lock out kar liya ho, aur kuch region enable/disable operations. Isliye root delete nahi kar sakte, sirf lock kar sakte ho.

---

**Q3: IAM User vs IAM Role — asli fark kya hai?**

**User** ke paas permanent credentials hain jo hamesha uske saath rehti hain — password (console ke liye), access key pair (API ke liye). User ek insaan ya ek machine ko represent karta hai, aur wo credentials kabhi expire nahi hoti jab tak tum manually rotate na karo.

**Role** ke paas **koi credentials nahi hoti**. Role sirf ek permission set + ek trust policy hai. Jab koi role assume karta hai, STS us waqt **fresh temporary credentials** generate karta hai jo default 1 ghante me expire ho jaati hain. Role ko "assume" karne ka matlab hai ek naya identity pehen lena — jaise `EXECUTE AS USER = 'reporting_user'` in SQL Server, sirf ye ki wo automatically revert ho jaata hai.

Kyun roles better hain: leak hui temporary credential ki shelf-life 1 ghanta hai, permanent access key ki shelf-life "jab tak koi notice na kare" hai. Aur roles rotate karne ka concept hi nahi — har assume par naya credential.

> 💡 **Gotcha:** Ek role ko ek waqt me hazaaron log/machines simultaneously assume kar sakte hain. Role koi "seat" nahi hai. Har assume ek independent session banata hai apne `RoleSessionName` ke saath — aur wahi CloudTrail me dikhta hai, isliye session name meaningful rakhna (`shani@jmfs`, na ki `session1`).

---

**Q4: Policy JSON ka structure kya hai — har field ka matlab?**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowReadOnClientData",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::jmfs-client-data",
        "arn:aws:s3:::jmfs-client-data/*"
      ],
      "Condition": {
        "IpAddress": { "aws:SourceIp": "203.0.113.0/24" }
      }
    }
  ]
}
```

- **Version** — policy *language* ka version, tumhari policy ka nahi. `2012-10-17` hi likhna hai, ye latest hai. Purana `2008-10-17` policy variables (`${aws:username}`) support nahi karta.
- **Statement** — array of rules. Har statement independently evaluate hota hai.
- **Sid** — optional label, sirf tumhare aur debugging ke liye. Identity policies me ye unique hona zaroori nahi, resource policies me (kuch services me) hona chahiye.
- **Effect** — `Allow` ya `Deny`.
- **Action** — service prefix + API name, `service:ApiName`. Case-insensitive matching hoti hai lekin convention CamelCase hai.
- **Resource** — ARN(s). Kuch actions resource-level support nahi karte, unke liye `"*"` likhna padta hai.
- **Condition** — optional. Ye policy ka `WHERE` clause hai.

> 💡 **Gotcha:** `s3:ListBucket` **bucket** par lagta hai (`arn:aws:s3:::bucket`), aur `s3:GetObject` **object** par (`arn:aws:s3:::bucket/*`). Dono ARN chahiye. Sirf `/*` wala ARN diya to `aws s3 ls` fail hoga par `aws s3 cp` chal jaayega — aur tum 20 minute confuse rahoge. Ye IAM ki sabse common galti hai.

---

**Q5: Identity-based aur resource-based policy me fark kya hai, aur dono kab chahiye?**

**Identity-based** policy user/group/role par attach hoti hai — perspective: *"main kya kar sakta hoon"*. Isme `Principal` field nahi hota (kyunki principal wahi hai jispar policy lagi hai).

**Resource-based** policy resource par attach hoti hai — perspective: *"mujhe kaun chhoo sakta hai"*. Isme `Principal` field **compulsory** hai. Sab services support nahi karte — S3, KMS, SQS, SNS, Lambda, Secrets Manager, ECR, EFS, API Gateway, EventBridge, aur IAM roles ki trust policy support karte hain. DynamoDB, EC2, RDS **nahi** karte (DynamoDB ne recently resource policies add ki hain — ⚠️ verify apne region me).

Rules:
- **Same account:** identity policy **YA** resource policy — dono me se kisi ek me Allow kaafi hai (union).
- **Cross account:** **DONO** me Allow chahiye. Source account ki identity policy allow kare, aur target account ki resource policy allow kare. Ye AND hai, OR nahi.

> 💡 **Gotcha:** Ye "cross-account me dono chahiye" wala rule hi 70% cross-account debugging sessions ka reason hai. Ek exception hai — **IAM role trust policy** ke case me, agar trust policy ne allow kiya to source side me `sts:AssumeRole` permission chahiye hi hai, wo bhi AND hai. Lekin agar trust policy me pura account principal (`arn:aws:iam::111122223333:root`) diya hai, to target account effectively kehta hai "us account ki koi bhi identity jise apni side se permission mili ho".

---

**Q6: ARN ka structure kya hai?**

```
arn:partition:service:region:account-id:resource-type/resource-id
 │      │        │       │        │            │
 │      │        │       │        │            └─ e.g. role/DeployRole
 │      │        │       │        └────────────── 123456789012
 │      │        │       └─────────────────────── ap-south-1 (global services me khaali)
 │      │        └─────────────────────────────── s3, iam, dynamodb
 │      └──────────────────────────────────────── aws | aws-cn | aws-us-gov
 └─────────────────────────────────────────────── literally "arn"
```

Examples:
```
arn:aws:iam::123456789012:role/PaymentServiceRole       ← region khaali (IAM global hai)
arn:aws:s3:::jmfs-client-data/reports/2026/*            ← region aur account dono khaali (S3 legacy)
arn:aws:dynamodb:ap-south-1:123456789012:table/Orders
arn:aws:sts::123456789012:assumed-role/DeployRole/shani ← assumed role session ka ARN
```

Kyun important: policies me `Resource` ARN se match hoti hai, aur wildcards ARN ke **kisi bhi hisse** me lag sakte hain. `arn:aws:s3:::jmfs-*` sab matching buckets ko cover karega.

> 💡 **Gotcha:** Role ka ARN `arn:aws:iam::...:role/X` hota hai, lekin jab wo role assume hota hai to session ka ARN `arn:aws:sts::...:assumed-role/X/session-name` ban jaata hai. Agar tum resource policy me `iam` wala ARN likhoge to trust policy me kaam karega, lekin **condition me** `aws:PrincipalArn` compare karte waqt `sts` wala form aata hai. Isliye conditions me `ArnLike` with `arn:aws:sts::*:assumed-role/X/*` use karo. Ye trap bahut logon ko lagta hai.

---

**Q7: "Principal" ke kitne types hote hain?**

```json
"Principal": { "AWS": "arn:aws:iam::123456789012:root" }        // poora account
"Principal": { "AWS": "arn:aws:iam::123456789012:role/Deploy" } // specific role
"Principal": { "AWS": "arn:aws:iam::123456789012:user/shani" }  // specific user
"Principal": { "Service": "lambda.amazonaws.com" }              // AWS service
"Principal": { "Federated": "arn:aws:iam::123:oidc-provider/token.actions.githubusercontent.com" }
"Principal": { "Federated": "cognito-identity.amazonaws.com" }
"Principal": { "CanonicalUser": "79a59df9..." }                 // legacy S3
"Principal": "*"                                                // ANYONE. Danger.
```

`:root` ka matlab "root user" **nahi** hai — iska matlab hai "us account ki koi bhi principal, jise apni account ki identity policy se permission mili ho". Naming AWS ki galti hai, log isse hamesha confuse hote hain.

> 💡 **Gotcha:** `"Principal": "*"` bina strong `Condition` ke = internet ko access de diya. Agar tumne S3 bucket policy me `"Principal": "*"` + `"Action": "s3:GetObject"` likha, wo bucket public hai. Access Analyzer isko turant flag karega — aur karna bhi chahiye.

---

**Q8: Managed policy vs inline policy — kaunsi kab?**

**Managed policy** ek alag AWS object hai apne ARN ke saath, jo multiple identities par attach ho sakti hai. Versioning support karti hai (5 versions tak), rollback ho sakta hai, aur ek jagah edit karo to sab jagah apply.

**Inline policy** identity ke andar embedded JSON hai. Uska koi ARN nahi, koi version nahi. Identity delete → policy bhi gayi.

Practical rule: **99% cases me managed policy use karo.** Inline sirf tab jab tum chahte ho ki policy aur identity ka **1:1 lifecycle** ho aur koi galti se usko kisi aur par attach na kar de — jaise ek highly privileged break-glass role.

> 💡 **Gotcha:** Size limits alag hain aur ye tumhe surprise karega. Managed policy: **6,144 characters** per policy. Inline: aggregate limit per entity — **user 2,048**, **role 10,240**, **group 5,120** characters. Yaani ek role par tum 10,240 chars ki inline policy daal sakte ho lekin ek user par sirf 2,048. Whitespace count nahi hota, isliye minify karne se jagah bachti hai.

---

**Q9: AWS managed vs customer managed policy — production me kaunsi?**

AWS managed policies (`ReadOnlyAccess`, `AmazonS3FullAccess`, `PowerUserAccess`) AWS banata aur maintain karta hai. Fayda: naye services aane par AWS khud update kar deta hai. Nuksaan: **AWS unhe tumhari permission ke bina badal deta hai**, aur wo hamesha over-permissive hoti hain kyunki wo har customer ke liye likhi gayi hain.

`AmazonS3FullAccess` ka matlab hai poore account ke **har** bucket par sab kuch. Tumhe shayad ek bucket chahiye tha.

Production rule: **AWS managed policies sirf prototyping ke liye. Production me customer managed.** Exception: service-linked roles aur kuch service-specific policies jaise `AWSLambdaBasicExecutionRole` (jo sirf CloudWatch Logs deti hai) theek hain.

> 💡 **Gotcha:** Jab AWS kisi managed policy me permission **add** karta hai, wo silently har attached identity ko mil jaati hai. 2021 me AWS ne kai managed policies expand ki thi. Agar tumhara compliance audit "kis role ke paas kya hai" par depend karta hai, AWS managed policies tumhare audit ko non-deterministic bana deti hain. Ye financial services me — jahan tum kaam karte ho — audit finding ban sakta hai.

---

**Q10: IAM Group kya hai, aur kya group ko role assign kar sakte hain?**

Group users ka collection hai. Tum policies group par attach karte ho, aur us group ke sab users ko wo permissions mil jaati hain. Ye exactly SQL Server ke database role jaisa hai.

**Nahi, group ko role assign nahi kar sakte.** Group sirf **IAM users** rakh sakta hai. Group ke andar group bhi nahi ho sakta (koi nesting nahi). Aur group khud ek principal nahi hai — tum group ko `Principal` field me nahi likh sakte, aur group ARN se resource policy nahi likh sakte.

> 💡 **Gotcha:** Ek user maximum **10 groups** ka member ho sakta hai, aur account me default **300 groups** (max 500 tak badha sakte ho). Agar tum groups ko RBAC ke liye heavily use kar rahe ho to ye limit chubhegi. Modern jawab: IAM users use hi mat karo, IAM Identity Center **permission sets** use karo — wahan 3,500 permission sets ka quota hai.

---

**Q11: Access key, password, aur session token me kya fark hai?**

- **Password** — sirf **console** login ke liye. API calls ke liye kaam nahi aata. IAM user par optional hai.
- **Access key pair** (`AKIA...` + secret) — sirf **API/CLI/SDK** ke liye. Console login ke liye kaam nahi aata. Permanent, khud expire nahi hoti. Ek user ke paas maximum **2 active keys** ho sakti hain (ye rotation ke liye hai — nayi banao, apps switch karo, purani delete karo).
- **Session token** — temporary credentials ka teesra component. `ASIA...` se shuru hone wali access key ke saath aata hai. Expiry hoti hai. Har request me `X-Amz-Security-Token` header me jaata hai.

`AKIA` vs `ASIA` prefix se turant pata chal jaata hai ki credential permanent hai ya temporary — logs me ye bahut kaam aata hai.

> 💡 **Gotcha:** Agar tum temporary credentials use kar rahe ho aur session token pass karna bhool gaye, to error `InvalidClientTokenId` aayega — jo aisa lagta hai jaise key hi galat hai. Actually key sahi hai, teesra piece missing hai. Environment variable ka naam `AWS_SESSION_TOKEN` hai (purana `AWS_SECURITY_TOKEN` deprecated hai).

---

**Q12: STS kya hai aur AssumeRole ka flow kya hai?**

STS = Security Token Service. Iska ek hi kaam hai: **short-lived credentials issue karna.** Ye IAM ka "token endpoint" hai.

Flow:
```
1. Caller ke paas already koi valid credential honi chahiye
   (IAM user key, EC2 instance role, ya doosri assumed role)

2. Caller: sts:AssumeRole(
     RoleArn = "arn:aws:iam::999:role/CrossAccountReader",
     RoleSessionName = "shani@jmfs",
     DurationSeconds = 3600
   )

3. STS do checks karta hai:
   a) Target role ki TRUST POLICY caller ko allow karti hai? (resource-side)
   b) Caller ki IDENTITY POLICY me sts:AssumeRole on that ARN hai? (identity-side)
   Dono chahiye. Cross-account me ye AND strictly enforce hota hai.

4. STS return karta hai:
   { AccessKeyId: "ASIA...", SecretAccessKey: "...",
     SessionToken: "...", Expiration: "2026-08-06T12:00:00Z" }

5. Caller in credentials se naye role ki tarah API calls karta hai.
```

Kyun ye design: caller ko target account ki koi permanent credential kabhi nahi milti. Trust ek policy me declare hoti hai jo target account control karta hai, aur wo kabhi bhi hata sakta hai.

> 💡 **Gotcha:** `RoleSessionName` CloudTrail me `userIdentity.arn` me literally dikhta hai. Isko meaningful rakho — email, employee ID, pipeline run ID. Kai companies isko policy condition me bhi enforce karti hain (`sts:RoleSessionName` condition key). "Kisne kiya tha?" ka jawab isi field se milta hai.

---

**Q13: Instance Profile kya hai — role se alag kyun hai?**

EC2 instance ko tum directly role attach nahi kar sakte. Beech me ek wrapper object hota hai — **instance profile** — jisme exactly **ek** role hoti hai. Console me jab tum EC2 par role attach karte ho, console chupchaap same naam ka instance profile bana deta hai, isliye tumhe ye distinction dikhta hi nahi.

Lekin CLI/CDK/Terraform me ye alag object hai:
```bash
aws iam create-role --role-name AppRole --assume-role-policy-document file://trust.json
aws iam create-instance-profile --instance-profile-name AppProfile
aws iam add-role-to-instance-profile --instance-profile-name AppProfile --role-name AppRole
aws ec2 associate-iam-instance-profile --instance-id i-123 \
    --iam-instance-profile Name=AppProfile
```

Historical reason: instance profile 2012 me aaya jab ek instance profile me multiple roles daalne ka plan tha. Wo plan kabhi implement nahi hua, lekin abstraction reh gaya.

> 💡 **Gotcha:** Instance profile create karne ke baad wo EC2 ko available hone me **kuch seconds lagte hain** (eventual consistency). CLI/Terraform script me instance profile banane ke turant baad instance launch karoge to `Invalid IAM Instance Profile name` mil sakta hai. Terraform/CDK me ye classic flaky-apply ka reason hai — retry ya explicit `depends_on` + sleep lagta hai.

---

**Q14: Policy evaluation me exact precedence kya hai?**

Simplified but accurate order:

1. **Explicit `Deny` kahin bhi** → DENY. Immediately. Ye final hai.
2. **SCP** (Organizations) allow karti hai? Nahi → DENY.
3. **RCP** (Resource control policy) allow karti hai? Nahi → DENY.
4. **Resource-based policy** explicit allow deti hai? Haan → kuch cases me yahi kaafi hai (same account, IAM principal).
5. **Identity-based policy** allow karti hai? Nahi (aur step 4 bhi nahi) → DENY.
6. **Permissions boundary** allow karti hai? Nahi → DENY.
7. **Session policy** allow karti hai? Nahi → DENY.
8. Sab pass → **ALLOW**.

Kyun explicit Deny sabse upar: security me **fail-closed** hona chahiye. Agar Deny ko override kiya ja sakta to koi bhi "sensitive-data-block" policy meaningless ho jaati — koi bhi apni identity par ek naya Allow attach karke bypass kar leta.

> 💡 **Gotcha:** Ek non-obvious case — agar principal aur resource **alag accounts** me hain, to step 4 aur 5 **dono** chahiye. Aur agar permissions boundary set hai lekin **resource-based policy** se access aa raha hai (aur principal boundary wala IAM role hai), to boundary phir bhi lagti hai. Boundary ko bypass karne ka koi tareeka nahi.

---

**Q15: IAM "global" service hai — iska practical matlab kya hai?**

IAM ka control plane commercial partition me **us-east-1** me rehta hai. Jo bhi user/role/policy tum banate ho, wo poore account me har region me valid hai — usko per-region banane ki zaroorat nahi. Console me IAM khholne par region dropdown "Global" dikhata hai.

Practical implications:
1. **Quota increase requests sirf us-east-1 se maang sakte ho.** Service Quotas console me region us-east-1 par switch karo, warna IAM dikhega hi nahi.
2. **CloudTrail me IAM events us-east-1 me log hote hain** as global service events. Agar tum sirf ap-south-1 ka trail dekh rahe ho aur "global service events" include nahi kiya, to IAM changes miss ho jaayenge.
3. **us-east-1 ka outage IAM writes ko affect kar sakta hai** (naye roles banana, policies update karna). Existing credentials aur evaluation chalti rehti hai kyunki wo replicated hai — lekin control plane writes ruk sakti hain.
4. **STS global nahi hai** — uske regional endpoints hain. Ye important distinction hai (Q31–Q35).

> 💡 **Gotcha:** IAM global hai, lekin IAM **Access Analyzer regional** hai. External access analyzer har region me banana padta hai jahan resources hain. Unused access analyzer sirf ek chahiye poore partition ke liye (kyunki roles/users global hain) — aur agar tumne galti se 5 regions me banaya to **5 baar bill aayega**. Ye real paisa hai (Q48 dekho).

---

### 🟡 Q16–Q40 — Configuration, Networking, Security (Intermediate)

**Q16: Policy ke saare elements kaun se hain, aur `NotAction`/`NotResource` kab use karte hain?**

| Element | Zaroori? | Kaam |
|---|---|---|
| `Version` | Haan (practically) | Policy language version. Hamesha `2012-10-17` |
| `Id` | Nahi | Policy ka overall ID (mostly resource policies me) |
| `Statement` | Haan | Rules ka array |
| `Sid` | Nahi | Statement label |
| `Effect` | Haan | `Allow` / `Deny` |
| `Principal` / `NotPrincipal` | Resource policies me haan | Kaun |
| `Action` / `NotAction` | Haan (ek to chahiye) | Kya |
| `Resource` / `NotResource` | Identity policies me haan | Kis par |
| `Condition` | Nahi | Extra checks |

`NotAction` ka matlab hai "in actions ke **alawa** sab". Example — "sab kuch allow, lekin IAM aur Organizations nahi":
```json
{ "Effect": "Allow", "NotAction": ["iam:*", "organizations:*"], "Resource": "*" }
```

Ye kaam karega lekin **khatarnaak** hai: kal AWS naya service launch karega, wo automatically allow ho jaayega.

`NotAction` ka **sahi** use `Deny` ke saath hai:
```json
{ "Effect": "Deny", "NotAction": ["s3:GetObject", "s3:ListBucket"], "Resource": "*" }
```
Matlab: "in do ke alawa sab kuch deny". Ye fail-closed hai — naya service automatically deny ho jaayega.

> 💡 **Gotcha:** `NotResource` ke saath `Allow` almost hamesha bug hai. `{"Effect":"Allow","Action":"s3:*","NotResource":"arn:aws:s3:::secret-bucket/*"}` ka matlab hai "secret bucket ke alawa **duniya ke har** S3 resource par sab kuch" — including doosre accounts ke public buckets. Rule: `NotAction`/`NotResource` sirf `Deny` ke saath.

---

**Q17: Condition operators kaun-kaun se hain aur `IfExists` ka matlab kya hai?**

Categories:
- **String:** `StringEquals`, `StringNotEquals`, `StringEqualsIgnoreCase`, `StringLike` (wildcards `*` `?`), `StringNotLike`
- **Numeric:** `NumericEquals`, `NumericLessThan`, `NumericGreaterThanEquals`, etc.
- **Date:** `DateLessThan`, `DateGreaterThan` (ISO 8601 ya epoch)
- **Boolean:** `Bool`
- **Binary:** `BinaryEquals`
- **IP:** `IpAddress`, `NotIpAddress` (CIDR)
- **ARN:** `ArnEquals`, `ArnLike`, `ArnNotEquals`, `ArnNotLike`
- **Null:** `Null` — key present hai ya nahi
- **Set operators:** `ForAllValues:`, `ForAnyValue:` prefix — multi-valued keys ke liye

**`...IfExists` suffix** ka matlab: "agar ye key request me maujood hai to compare karo; agar nahi hai to ye condition pass maano". Ye implicit deny ko avoid karta hai un requests me jahan key applicable hi nahi hoti.

```json
"Condition": {
  "StringEqualsIfExists": { "aws:RequestedRegion": "ap-south-1" }
}
```

> 💡 **Gotcha:** Ye MFA ka classic trap hai. Ye **galat** hai:
> ```json
> "Condition": { "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" } }
> ```
> ...ke saath `Deny` — kyunki AWS service principals (jaise EC2 se AssumeRole) ke requests me ye key hoti hi nahi, to `IfExists` true return karta hai, aur tum unko deny kar dete ho. Ulta, agar tum `Bool` (bina IfExists) with `"true"` use karo `Allow` ke saath, to bhi wo requests deny ho jaate hain. Sahi pattern context par depend karta hai — human console access ke liye `BoolIfExists: false` + `Deny` sahi hai, lekin usme service-role exceptions add karne padte hain. Test karke deploy karna, warna production automation tootegi.

---

**Q18: Wildcards kaise kaam karte hain policies me?**

`*` = zero ya zyada characters. `?` = exactly ek character. **Regex nahi hai** — sirf ye do.

```json
"Action": "s3:Get*"                        // GetObject, GetBucketPolicy, sab
"Action": "s3:*"                           // poora S3
"Action": "*"                              // sab kuch. AdministratorAccess.
"Resource": "arn:aws:s3:::jmfs-*/reports/*"
"Resource": "arn:aws:dynamodb:*:*:table/Orders*"
```

Important: `Action` field me wildcard **hamesha** kaam karta hai. `Resource` field me wildcard ARN ke andar kahin bhi lag sakta hai. Lekin `Condition` values me wildcard sirf `StringLike`/`ArnLike` operators ke saath kaam karta hai — `StringEquals` me `*` literal asterisk maana jaayega.

> 💡 **Gotcha:** `"Action": "s3:Get*"` me `s3:GetBucketPolicy` bhi aa jaata hai, jo bucket policy padhne deta hai — reconnaissance ke liye useful. Aur `"Action": "iam:Get*"` se koi bhi tumhari saari policies padh sakta hai. `Get*` "harmless read" nahi hota, wo sensitive metadata expose karta hai.

---

**Q19: Permissions Boundary kya hai aur kab use karte hain?**

Permissions boundary ek **managed policy** hai jo tum ek IAM user ya role par **boundary ke roop me** attach karte ho (normal attach se alag). Ye kuch grant nahi karti — ye sirf **maximum ceiling** define karti hai.

```
Effective permissions = (identity policies) ∩ (permissions boundary)
```

Agar boundary me `s3:*` hai aur identity policy me `AdministratorAccess` hai → effective sirf `s3:*` hai.

Asli use case: **safe delegation.** Tum apni platform team ke developers ko `iam:CreateRole` dena chahte ho taaki wo apne Lambda roles bana sakein — lekin nahi chahte ki wo apne aap ko admin bana lein. Solution:

```json
{
  "Effect": "Allow",
  "Action": ["iam:CreateRole", "iam:AttachRolePolicy"],
  "Resource": "arn:aws:iam::*:role/app/*",
  "Condition": {
    "StringEquals": {
      "iam:PermissionsBoundary": "arn:aws:iam::123456789012:policy/DevBoundary"
    }
  }
}
```

Matlab: "tum role bana sakte ho, lekin **sirf tab** jab us role par DevBoundary boundary lagi ho". Ab wo jo bhi role banayenge, wo boundary se upar nahi ja sakta.

> 💡 **Gotcha:** Boundary ke saath tumhe `iam:DeleteRolePermissionsBoundary` aur `iam:PutRolePermissionsBoundary` bhi **explicitly deny** karna padta hai, warna developer boundary hi hata dega. Ye do actions boundary setup me deny karna bhool jaana sabse common escalation hole hai.

---

**Q20: SCP (Service Control Policy) kya hai aur ye boundary se kaise alag hai?**

SCP AWS **Organizations** ka feature hai. Ye poore **account** ya **OU** par lagti hai, aur us account ke **har principal** par ceiling lagati hai — including root user (member accounts me).

| | Permissions Boundary | SCP |
|---|---|---|
| Scope | Ek IAM user/role | Poora account ya OU |
| Kahan configure | IAM | AWS Organizations |
| Root user par lagti? | Nahi (root ke paas boundary nahi hoti) | Haan (member accounts me) |
| Service-linked roles par? | Haan | **Nahi** — SLRs exempt hain |
| Grant karti hai? | Nahi | Nahi |

Typical SCP:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyOutsideApprovedRegions",
    "Effect": "Deny",
    "NotAction": ["iam:*", "sts:*", "organizations:*", "cloudfront:*",
                  "route53:*", "support:*", "budgets:*"],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": { "aws:RequestedRegion": ["ap-south-1", "us-east-1"] }
    }
  }]
}
```

`NotAction` me global services isliye hain kyunki wo `us-east-1` me operate karte hain aur unhe block karne se account tut jaayega.

> 💡 **Gotcha:** SCP **management account** par lagu **nahi** hoti — chahe tum usko OU me daal do. Isliye best practice hai ki management account me koi workload na chalao. Aur `FullAWSAccess` SCP default me lagi hoti hai; agar tum apni pehli custom Allow-based SCP attach karte ho aur `FullAWSAccess` hata dete ho, to poora account instantly deny ho jaayega. Ye "maine poori company ka AWS band kar diya" wala moment hai.

---

**Q21: Session policy kya hai aur kab kaam aati hai?**

Session policy wo policy hai jo tum **AssumeRole call ke waqt** pass karte ho. Ye us ek session par extra ceiling lagati hai.

```typescript
await sts.send(new AssumeRoleCommand({
  RoleArn: "arn:aws:iam::123:role/TenantAccessRole",
  RoleSessionName: "tenant-42",
  Policy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [{
      Effect: "Allow",
      Action: "s3:GetObject",
      Resource: "arn:aws:s3:::shared-data/tenant-42/*"
    }]
  })
}));
```

Ye SaaS multi-tenancy ka bread-and-butter pattern hai: ek hi broad role banao, aur har tenant request par session policy se usko us tenant ke prefix tak scope kar do. Node ki duniya me socho — ek DB connection pool hai jo sab tables padh sakta hai, lekin har request ke liye tum ek narrower "view" pass kar rahe ho.

Limits: JSON document + managed policy ARNs milakar **2,048 characters**, aur maximum **10 managed policy ARNs** pass kar sakte ho. Response me `PackedPolicySize` field batata hai ki tum limit ke kitne percent tak pahunche ho.

> 💡 **Gotcha:** Session policy sirf **restrict** kar sakti hai. Agar role ke paas `dynamodb:*` nahi hai aur tum session policy me `dynamodb:*` allow karoge, kuch nahi hoga — intersection khaali hai. Log aksar sochte hain session policy se extra permission mil jaayegi. Nahi milti.

---

**Q22: Role ki trust policy kaise likhte hain, aur External ID kyun chahiye?**

Trust policy role ki **resource-based policy** hai. Iska action hamesha `sts:AssumeRole` (ya `AssumeRoleWithWebIdentity` / `AssumeRoleWithSAML`) hota hai.

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "AWS": "arn:aws:iam::999988887777:root" },
    "Action": "sts:AssumeRole",
    "Condition": {
      "StringEquals": { "sts:ExternalId": "jmfs-vendor-a7f3d91c" }
    }
  }]
}
```

**External ID kyun:** ye **confused deputy** problem solve karta hai. Scenario: tumne ek SaaS monitoring vendor ko apne account me role assume karne ka access diya. Wahi vendor 500 doosre customers ko bhi serve karta hai. Agar koi doosra customer vendor ko tumhara account ID + role name bata de, aur vendor confuse hokar tumhare account me us customer ke behalf par call kar de — to wo tumhara data padh lega. External ID ek secret hai jo sirf tum aur vendor jaante hain, jo request ke saath aana chahiye. Bina uske assume fail.

External ID: **2 se 1,224 characters**, alphanumeric + `+=,.@:/-`.

> 💡 **Gotcha:** External ID **tum** generate karte ho, vendor nahi. Agar vendor tumhe External ID de raha hai to wo pattern galat hai (kyunki phir wo guessable ho sakta hai). Aur ye secret nahi hai jo kisi ko chhupana hai — ye unguessable hona chahiye, bas. UUID theek hai.

---

**Q23: `MaxSessionDuration` kya hai — default aur maximum?**

Role par ek setting hoti hai `MaxSessionDuration`. Range: **3,600 seconds (1 hour) se 43,200 seconds (12 hours)**. Default role banate waqt **3,600 (1 hour)**.

Alag se, `AssumeRole` call me tum `DurationSeconds` pass kar sakte ho: **900 (15 min) se role ke MaxSessionDuration tak**. Agar tum kuch pass nahi karte to default **3,600 seconds** milta hai — chahe role ka Max 12 hours ho.

```bash
aws iam update-role --role-name DeployRole --max-session-duration 14400  # 4 hours
aws sts assume-role --role-arn ... --role-session-name x --duration-seconds 14400
```

Kyun 12 hour ceiling: ye risk-vs-convenience trade-off hai. Long-running jobs (ETL, data migration) ko lamba session chahiye, lekin infinitely lamba credential wapas permanent key jaisa ban jaata hai. 12 ghante ek working day cover karta hai.

> 💡 **Gotcha:** Console me "Switch Role" karne par tum **maximum 1 hour** hi paate ho, chahe role ka MaxSessionDuration 12 hours ho. Ye console ki alag limit hai. Aur agar credentials expire ho gaye beech me — long-running Node script me — tum `ExpiredToken` khaoge. AWS SDK v3 ke credential providers automatically refresh karte hain **agar** tum unhe provider function do (na ki static credentials object). Ye difference bahut logon ko production me kaatta hai.

---

**Q24: Role chaining kya hai aur uski 1-ghanta limit kya hai?**

Role chaining = ek assumed role se doosri role assume karna. Role A → Role B → Role C.

**Jab tum ek assumed-role session se AssumeRole call karte ho, maximum duration 1 hour ho jaati hai** — chahe target role ka MaxSessionDuration 12 hours ho. Agar tum `DurationSeconds > 3600` pass karoge to error milega.

Kyun: har hop par credential ki "distance" original identity se badh jaati hai. AWS chahta hai ki chained sessions frequently re-validate hon, taaki agar beech me kisi role ki trust policy hate to chain jaldi toot jaaye.

> 💡 **Gotcha:** Chaining me `aws:PrincipalArn` badal jaata hai har hop par — original identity **lose** ho jaati hai unless tum session tags forward karo (`sts:TagSession` + transitive tags). Agar tumhari audit requirement hai "kis insaan ne production me ye kiya", to 3-hop chain me wo answer gayab ho sakta hai. Solution: transitive session tags use karo:
> ```json
> "Condition": { "ForAllValues:StringEquals": { "sts:TransitiveTagKeys": ["OriginalUser"] } }
> ```

---

**Q25: Password policy me kya-kya set kar sakte ho, aur MFA ke kitne types hain?**

Account-level password policy (sirf IAM users par lagti hai, root par nahi):

| Setting | Default | Range |
|---|---|---|
| Minimum length | 8 | 6–128 |
| Require uppercase | off | on/off |
| Require lowercase | off | on/off |
| Require numbers | off | on/off |
| Require symbols | off | on/off |
| Max password age | unlimited | 1–1095 days |
| Password reuse prevention | off | 1–24 previous passwords |
| Allow users to change own password | off | on/off |
| Hard expiry (admin reset required) | off | on/off |

MFA types:
1. **Virtual MFA** — TOTP app (Authy, Google Authenticator). Free, but phone hi security boundary hai.
2. **Hardware TOTP token** — physical keyfob.
3. **FIDO2 / WebAuthn security key** — YubiKey. Phishing-resistant kyunki key origin bind karti hai. **Best option.**
4. **Passkeys** — FIDO2 ka syncable version. Root par bhi ab supported hai.

Ek IAM user/root par **8 MFA devices tak** register kar sakte ho (ye AWS ne 2022 me badhaya tha) — backup device rakhna practical hai.

> 💡 **Gotcha:** Password policy sirf IAM users par lagti hai. Agar tum IAM Identity Center use kar rahe ho (jo tumhe karna chahiye), password policy wahan alag configure hoti hai — ya tumhare corporate IdP me. Log account-level password policy set karke sochte hain sab covered hai, jabki unke asli users SSO se aa rahe hain.

---

**Q26: Access key rotation kaise karte hain bina downtime ke?**

Har IAM user ke paas maximum **2 active access keys** ho sakti hain. Ye exactly rotation ke liye hai:

```bash
# 1. Nayi key banao (ab 2 active hain)
aws iam create-access-key --user-name ci-deployer

# 2. Nayi key ko sab consumers me deploy karo (secrets manager, CI vars, etc.)

# 3. Purani key ko INACTIVE karo (delete mat karo — rollback ke liye)
aws iam update-access-key --user-name ci-deployer \
    --access-key-id AKIAOLDKEY --status Inactive

# 4. 24-48 ghante monitor karo. Kuch toota? Wapas Active kar do.
aws iam get-access-key-last-used --access-key-id AKIAOLDKEY

# 5. Sab theek? Ab delete
aws iam delete-access-key --user-name ci-deployer --access-key-id AKIAOLDKEY
```

`get-access-key-last-used` batata hai key aakhri baar kab, kaunse region me, kaunse service ke liye use hui — ye ye pata karne ka best tool hai ki key abhi bhi zinda hai ya nahi.

> 💡 **Gotcha:** `LastUsedDate` **eventual** hai aur usme lag hai (typically minutes, kabhi ghanta). Aur agar key kabhi use hi nahi hui to field hi missing hoti hai — `null` nahi. Node me `response.AccessKeyLastUsed.LastUsedDate` par optional chaining lagana, warna `TypeError` milega.

---

**Q27: IAM path kya hai, aur managed policy versions kaise kaam karte hain?**

**Path** ek organizational prefix hai: `arn:aws:iam::123:role/app/payments/ServiceRole`. Yahan path `/app/payments/` hai. Ye folders jaise dikhte hain lekin actually sirf naming convention hain — **koi hierarchy semantics nahi**. Lekin ye bahut useful hain kyunki policies me wildcard laga sakte ho:

```json
"Resource": "arn:aws:iam::123456789012:role/app/payments/*"
```

Path maximum **512 characters**. Path ko baad me badal nahi sakte — role rename/move ka koi API nahi hai, naya banana padega.

**Policy versions:** har customer managed policy me maximum **5 versions** ho sakte hain. Ek "default" version hota hai jo actually enforce hota hai.

```bash
aws iam create-policy-version --policy-arn arn:... \
    --policy-document file://new.json --set-as-default
aws iam list-policy-versions --policy-arn arn:...
aws iam set-policy-version --policy-arn arn:... --version-id v3   # rollback!
```

> 💡 **Gotcha:** 5 versions bharne ke baad `create-policy-version` **fail** ho jaata hai — `LimitExceeded`. Ye CI/CD pipelines ko silently todta hai jo har deploy par policy update karti hain. Solution: create se pehle purani non-default version delete karo. CDK/CloudFormation ye khud handle karta hai, raw CLI scripts nahi.

---

**Q28: `aws:SourceArn`, `aws:SourceAccount`, `aws:PrincipalOrgID` — ye conditions kab lagti hain?**

Ye teeno **confused deputy** ke different flavours solve karte hain.

**`aws:SourceAccount` / `aws:SourceArn`** — jab koi **AWS service** tumhare resource ko tumhare behalf par access karta hai. Example: S3 tumhare SNS topic ko notify kar raha hai. Bina condition ke, **kisi ka bhi** S3 bucket tumhare topic ko notify kar sakta hai:

```json
{
  "Effect": "Allow",
  "Principal": { "Service": "s3.amazonaws.com" },
  "Action": "SNS:Publish",
  "Resource": "arn:aws:sns:ap-south-1:123456789012:alerts",
  "Condition": {
    "StringEquals": { "aws:SourceAccount": "123456789012" },
    "ArnLike": { "aws:SourceArn": "arn:aws:s3:::jmfs-uploads" }
  }
}
```

**`aws:PrincipalOrgID`** — poori organization ko allow karo bina har account ID likhe:
```json
"Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }
```
Naya account org me add hoga to automatically covered. Ye enterprise setups me lifesaver hai.

Related: `aws:PrincipalOrgPaths` (specific OU), `aws:ResourceOrgID` (target resource kis org me hai), `aws:PrincipalIsAWSService`.

> 💡 **Gotcha:** `aws:SourceArn` sirf tab available hota hai jab calling service usko populate karta hai — har service nahi karta, aur alag-alag services alag-alag format bhejti hain. Agar tum `StringEquals` use karoge aur service partial ARN bhejta hai to condition fail hogi aur integration silently toot jaayega. `ArnLike` with trailing wildcard safer hai. Service ki docs check karo ki wo kaun si keys bhejta hai.

---

**Q29: IAM Identity Center vs IAM users — kaunsa kab?**

**IAM Identity Center** (purana naam AWS SSO) ek alag service hai jo human access handle karta hai. Ye tumhare corporate IdP (Okta, Entra ID, Google Workspace) se SAML/SCIM se jud jaata hai, aur users ko ek portal deta hai jahan se wo multiple AWS accounts me multiple roles me jump kar sakte hain.

Architecture:
```
Okta/Entra ID  ──SAML──►  IAM Identity Center
                                │
                                │ Permission Set = "policy template"
                                ▼
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
   Dev Account            Staging Account          Prod Account
   (IAM role auto-        (IAM role auto-          (IAM role auto-
    provisioned)           provisioned)             provisioned)
```

Ek **Permission Set** actually har target account me ek IAM role ban jaata hai, automatically. Tum ek jagah define karte ho, Identity Center 200 accounts me sync kar deta hai.

Decision rule:
- **Human** access → Identity Center. Hamesha.
- **Machine inside AWS** → IAM role (instance profile, Lambda execution role, IRSA).
- **Machine outside AWS** → OIDC federation (GitHub Actions), ya IAM Roles Anywhere (on-prem with X.509 certs).
- **IAM user with access keys** → sirf jab upar wala kuch bhi possible na ho. Ye 2026 me bahut rare hona chahiye.

Identity Center free hai. Quotas: 3,500 permission sets, 200,000 users, 100,000 groups, 500 provisioned permission sets per account, API throttle 20 TPS.

> 💡 **Gotcha:** Permission set me **maximum 10 managed policies** aa sakti hain (kyunki wo IAM role banti hai, aur IAM role ka default quota 10 hai) aur **exactly 1 inline policy** (max 32,768 bytes, 10,240 non-whitespace). Agar tumhe zyada chahiye to har target account me `Managed policies attached to an IAM role` quota 25 tak badhana padega — **har account me alag se**. 200 accounts = 200 quota requests. Plan karke chalo.

---

**Q30: OIDC aur SAML federation kaise kaam karte hain — GitHub Actions ka example?**

**OIDC federation** ka matlab: external identity provider ek signed JWT deta hai, AWS uska signature verify karta hai (provider ki public JWKS se) aur claims ko conditions me check karta hai, phir role ki credentials de deta hai. **Koi access key store nahi karni padti.**

GitHub Actions ka setup:
```bash
# 1. OIDC provider register karo (ek baar per account)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

Trust policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Federated": "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com"
    },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": {
        "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
      },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:jmfs/payment-service:ref:refs/heads/main"
      }
    }
  }]
}
```

`sub` claim me repo aur branch encode hote hain — isse tum exactly define kar sakte ho ki kaunsi repo ki kaunsi branch se deploy ho sakta hai.

**SAML federation** conceptually same hai, sirf assertion XML me aati hai aur `AssumeRoleWithSAML` use hota hai. SAML response ki limit **100,000 characters** (base64) hai.

> 💡 **Gotcha:** Agar tum `sub` condition me `StringLike` with `repo:jmfs/*` likhoge to **koi bhi branch, koi bhi PR** us role ko assume kar sakti hai — including ek fork se aayi PR jo malicious code chalati hai. Ye 2023-24 me real supply chain attacks ka vector tha. Hamesha `sub` ko specific branch/environment tak pin karo, aur `aud` claim check karna kabhi mat bhoolo (bina `aud` ke koi bhi GitHub repo tumhara role assume kar sakti hai).

---

**Q31: IAM aur STS ke endpoints kya hain — global ya regional?**

**IAM:** ek hi global endpoint — `https://iam.amazonaws.com` (jo physically us-east-1 me hai). Dual-stack (IPv6) version: `https://iam.global.api.aws`. IAM ke koi regional endpoints nahi hain (China aur GovCloud partitions me alag endpoints hain).

**STS:** dono hain —
- Global (legacy): `https://sts.amazonaws.com`
- Regional: `https://sts.ap-south-1.amazonaws.com`
- Dual-stack regional: `https://sts.<region>.api.aws`
- FIPS: `https://sts-fips.<region>.amazonaws.com`

**Important 2025 change:** AWS ne STS global endpoint ko badal diya. Ab default-enabled regions me global endpoint ke requests **usi region me serve hote hain** jahan se originate hue — pehle sab us-east-1 jaate the. Opt-in regions (jaise Hong Kong) se aane wale requests abhi bhi us-east-1 jaate hain.

Aur: **31 July 2025 se naye AWS SDK versions default me regional STS endpoint use karte hain**, bina koi config ke.

> 💡 **Gotcha:** Global endpoint ke requests me `aws:RequestedRegion` condition key ki value **hamesha `us-east-1`** hoti hai, chahe request physically Mumbai me serve hui ho. Agar tumhari SCP `aws:RequestedRegion` par region-restriction lagati hai aur tumne `us-east-1` allow nahi kiya, to global endpoint ke STS calls **deny** ho jaayenge. Region-restriction SCPs me `sts:*` ko `NotAction` me rakhna isiliye zaroori hai.

---

**Q32: IAM aur STS ke liye VPC endpoints ban sakte hain?**

**STS: haan, sab regions me.** `com.amazonaws.<region>.sts` interface endpoint. Ye common hai — private subnet me chal rahe workloads ko NAT gateway ke bina STS access chahiye.

**IAM: haan, lekin sirf teen jagah** (August 2026 tak): **US East (N. Virginia)**, **China (Beijing)**, aur **AWS GovCloud (US-West)**. ⚠️ verify — AWS ye list dheere-dheere badha raha hai.

Kyun ye restriction: IAM ka control plane us-east-1 me hai, aur VPC endpoints **regional** constructs hain. Agar tumhari VPC ap-south-1 me hai aur tumhe private IAM access chahiye, to tumhe **Transit Gateway** se us-east-1 tak jaana padega jahan endpoint hai.

```bash
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-0abc123 \
  --vpc-endpoint-type Interface \
  --service-name com.amazonaws.ap-south-1.sts \
  --subnet-ids subnet-0aaa subnet-0bbb \
  --security-group-ids sg-0xyz \
  --private-dns-enabled
```

Security group me **port 443 inbound** allow karna zaroori hai — warna endpoint bane ga par kuch connect nahi kar payega.

> 💡 **Gotcha:** VPC endpoint banane ke baad tumhe **regional STS endpoint use karna padega**, global nahi. Agar tumhara code `sts.amazonaws.com` hit kar raha hai to wo VPC endpoint se nahi jaayega (private DNS sirf `sts.<region>.amazonaws.com` ko override karta hai). Node me: `new STSClient({ region: "ap-south-1" })` — SDK v3 me ab ye default me regional hai, lekin purane SDK v2 code me `AWS.config.stsRegionalEndpoints = 'regional'` set karna padta tha.

---

**Q33: `aws:SourceIp` kaise kaam karta hai — aur ye VPC endpoint ke saath kyun tootta hai?**

`aws:SourceIp` request ke **public source IP** se match karta hai.

```json
{
  "Effect": "Deny",
  "Action": "*",
  "Resource": "*",
  "Condition": {
    "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24", "198.51.100.5/32"] },
    "Bool": { "aws:ViaAWSService": "false" }
  }
}
```

**VPC endpoint ke through jaane wale requests me `aws:SourceIp` maujood hi nahi hota** — kyunki request public internet se nahi aayi. Agar tumhari policy me `aws:SourceIp` par IP-allowlist hai aur tum VPC endpoint enable kar dete ho, to sab kuch **deny** ho jaayega. Ye classic "maine PrivateLink enable kiya aur production down ho gaya" scenario hai.

VPC endpoint ke through aane wale requests ke liye alag keys hain:
- `aws:SourceVpce` — endpoint ID (`vpce-0abc123`)
- `aws:SourceVpc` — VPC ID
- `aws:VpcSourceIp` — VPC ke andar ka private IP

Sahi pattern — dono cover karo:
```json
"Condition": {
  "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24"] },
  "StringNotEquals": { "aws:SourceVpce": "vpce-0abc123def456" },
  "Bool": { "aws:ViaAWSService": "false" }
}
```
Deny statement me multiple conditions **AND** hoti hain, isliye ye tabhi deny karega jab dono conditions match karein — matlab na approved IP se, na approved VPCE se.

> 💡 **Gotcha:** `aws:ViaAWSService` wali line critical hai. Jab koi AWS service tumhare behalf par call karta hai (jaise CloudFormation stack deploy kar raha hai, ya Athena S3 padh raha hai), to source IP AWS ka hota hai, tumhara nahi. Bina `aws:ViaAWSService: false` ke tum apni hi automation ko block kar doge. Same for `aws:SourceIp` on NAT gateway — sab instances ka same NAT public IP dikhega, so per-instance granularity nahi milegi.

---

**Q34: `aws:SourceVpce` aur `aws:SourceVpc` — S3 ko VPC tak lock kaise karte hain?**

Financial services me ye common requirement hai: "ye bucket sirf hamari VPC se accessible ho, internet se bilkul nahi". Bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyAccessOutsideVPC",
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": [
      "arn:aws:s3:::jmfs-client-pii",
      "arn:aws:s3:::jmfs-client-pii/*"
    ],
    "Condition": {
      "StringNotEquals": { "aws:SourceVpce": "vpce-0abc123def456789" },
      "Bool": { "aws:PrincipalIsAWSService": "false" }
    }
  }]
}
```

`aws:SourceVpc` (VPC ID) zyada broad hai — us VPC ke **kisi bhi** endpoint se access chalega. `aws:SourceVpce` (endpoint ID) tighter hai. Financial compliance me generally VPCE-level chahiye.

> 💡 **Gotcha:** Ye policy laga ke tum **khud console se bucket access nahi kar paoge** — kyunki console tumhare laptop se aata hai, VPC se nahi. Aur agar tumne `Principal: "*"` + `Deny` likha hai to ye **root user par bhi** lagta hai. Bucket effectively bricked. Recovery ke liye tumhe VPC ke andar se ek EC2 se policy hatani padegi, ya AWS Support se contact karna padega. Isliye hamesha ek escape hatch rakho: `"aws:PrincipalArn": "arn:aws:iam::123:role/BreakGlassAdmin"` ko `StringNotEquals` list me add kar do.

---

**Q35: STS regional vs global endpoint — token kis region me valid hai?**

Ye historical baggage hai jo ab mostly resolve ho chuka hai, lekin samajhna zaroori hai:

- **Global endpoint (`sts.amazonaws.com`) ka token** — version 1 token. Ye **default-enabled regions me valid** hai, lekin **opt-in regions** (jaise ap-east-1 Hong Kong, me-south-1 Bahrain) me valid **nahi**. Aur ye token bada hota hai.
- **Regional endpoint ka token** — version 2. **Sab regions me valid**, including opt-in.

Account setting hai: IAM console → Account settings → "Security Token Service (STS)" → "Global endpoint token version". Isko **"Valid in all AWS Regions"** par set kar do. Ye ek-baar ka kaam hai aur bahut logon ne nahi kiya.

Aur alag se — har opt-in region ke liye STS ko **activate** karna padta hai (IAM console → Account settings → STS per-region enable/disable).

> 💡 **Gotcha:** Agar tum kabhi `RegionDisabledException: STS is not activated in this region for account: xxx` dekho, to ye policy problem **nahi** hai — ye account-level region activation setting hai. Log ghanton IAM policies debug karte rehte hain. IAM console → Account settings → wahan region enable karo. Ye error message ka wording bahut misleading hai.

---

**Q36: Encryption — IAM data at rest aur in transit kaise protect hoti hai?**

**In transit:** IAM aur STS ke saare endpoints **TLS-only** hain. HTTP par connect karne ki koshish karoge to connection reject. Minimum TLS 1.2 (AWS ne 1.0/1.1 deprecate kar diye hain). SigV4 signature request body ka hash bhi cover karta hai, to tampering detect ho jaayega chahe TLS terminate ho jaaye.

**At rest:** IAM apna data AWS-managed encryption se store karta hai. Tumhe koi KMS key configure nahi karni padti — aur na hi tum kar sakte ho. Ye AWS-managed service internals hai.

**Secrets kabhi retrieve nahi hote:** Secret access key sirf **ek baar** dikhti hai — creation ke waqt. AWS uska hash/derived form store karta hai, plaintext nahi. Isliye `aws iam get-access-key` jaisa koi API hai hi nahi. Kho gayi? Nayi banao.

Passwords ko IAM salted hash form me store karta hai. Console login par verify hota hai, retrieve kabhi nahi.

> 💡 **Gotcha:** Tumhari **policies** encrypted at rest hain lekin **confidential nahi** hain — `iam:GetRolePolicy`, `iam:ListAttachedRolePolicies` wale kisi bhi principal ko dikhti hain. Kabhi policy me secrets mat daalna (koi log daal deta hai `Condition` me API keys). Aur policy documents CloudTrail me `requestParameters` me plaintext log hote hain jab tum unhe create/update karte ho.

---

**Q37: Cross-account access ke kitne tareeke hain, aur kaunsa better?**

**Tareeka 1: Role assumption (recommended)**
```
Account A ka user ──sts:AssumeRole──► Account B ka role ──► Account B ke resources
```
- Account B role banata hai, trust policy me Account A ko allow karta hai
- Account A apne user/role ko `sts:AssumeRole` permission deta hai
- Credentials temporary, CloudTrail me clean audit trail

**Tareeka 2: Resource-based policy (direct access)**
```
Account A ka user ──direct API call──► Account B ka S3 bucket
                                        (bucket policy me A allowed)
```
- Sirf un services me possible jo resource policies support karte hain
- Koi AssumeRole call nahi, seedha access

Kaunsa better? **Role assumption**, kyunki:
1. Ek jagah (role) par sab permissions define hain, har resource par alag policy nahi
2. Session duration limit hai
3. Session tags aur session policies se extra control
4. CloudTrail me `AssumeRole` event ek clean audit checkpoint deta hai

Resource policy tab better hai jab access **bahut narrow** hai (ek bucket, read-only) aur AssumeRole ka overhead nahi chahiye — jaise cross-account CloudTrail log delivery.

> 💡 **Gotcha:** S3 me cross-account object write ka classic **ownership** problem — Account A ne Account B ke bucket me object daala, to object ka owner A hai aur B usko padh nahi sakta! Fix: writer ko `s3:x-amz-acl: bucket-owner-full-control` bhejna padta tha. **Ab default nahi hai** — S3 Object Ownership setting "Bucket owner enforced" (naye buckets me default) ACLs ko disable kar deti hai aur ownership automatically bucket owner ko de deti hai. Purane buckets me ye setting check karna.

---

**Q38: MFA ko policy me enforce kaise karte hain?**

Do condition keys:
- `aws:MultiFactorAuthPresent` (Bool) — is session me MFA use hua tha?
- `aws:MultiFactorAuthAge` (Numeric, seconds) — MFA kitna purana hai?

Classic "MFA ke bina kuch nahi" policy:
```json
{
  "Sid": "DenyAllExceptSelfManageWithoutMFA",
  "Effect": "Deny",
  "NotAction": [
    "iam:CreateVirtualMFADevice", "iam:EnableMFADevice",
    "iam:ListMFADevices", "iam:ListVirtualMFADevices",
    "iam:ResyncMFADevice", "iam:ChangePassword",
    "iam:GetUser", "sts:GetSessionToken"
  ],
  "Resource": "*",
  "Condition": {
    "BoolIfExists": { "aws:MultiFactorAuthPresent": "false" }
  }
}
```

`NotAction` me wo actions hain jo user ko MFA setup karne ke liye chahiye — warna chicken-and-egg problem: MFA setup karne ke liye MFA chahiye.

Sensitive operations ke liye fresh MFA maango:
```json
"Condition": {
  "NumericGreaterThan": { "aws:MultiFactorAuthAge": "900" }
}
```
Matlab: "agar MFA 15 minute se purana hai to deny". Production deletion ke liye ye acha pattern hai.

> 💡 **Gotcha:** `aws:MultiFactorAuthPresent` **role sessions me hamesha `true` hota hai** agar original AssumeRole call MFA ke saath hui thi — chahe wo 11 ghante pehle hui ho. Ye "MFA present" ka matlab "abhi MFA kiya" nahi hai. Freshness ke liye `aws:MultiFactorAuthAge` hi use karo. Aur EC2 instance role se aane wale requests me ye key **maujood hi nahi** hoti — isliye `BoolIfExists` use karna padta hai (Q17 ka gotcha wapas dekho).

---

**Q39: `iam:PassRole` kya hai aur ye privilege escalation ka sabse bada vector kyun hai?**

Jab tum kisi AWS service ko role "dete" ho — Lambda banate waqt execution role specify karte ho, EC2 launch karte waqt instance profile dete ho, ECS task definition me task role likhte ho — to tum us role ki permissions ko us service ko **de** rahe ho. `iam:PassRole` wo permission hai jo ye allow karti hai.

Escalation scenario:
```
Developer ke paas: lambda:CreateFunction + lambda:InvokeFunction + iam:PassRole (Resource: "*")
Account me maujood: ek AdminRole jise Lambda assume kar sakti hai

Developer:
  1. Lambda function banata hai, execution role = AdminRole
  2. Function ka code: process.env se credentials nikaal ke jo chahe karo
  3. Invoke karta hai
  4. Ab wo effectively admin hai.
```

Developer ke paas kabhi `AdministratorAccess` nahi tha. Bas `iam:PassRole` with `"Resource": "*"` tha.

**Sahi tareeka — hamesha PassRole ko scope karo:**
```json
{
  "Effect": "Allow",
  "Action": "iam:PassRole",
  "Resource": "arn:aws:iam::123456789012:role/app/lambda/*",
  "Condition": {
    "StringEquals": { "iam:PassedToService": "lambda.amazonaws.com" }
  }
}
```

`iam:PassedToService` condition ye ensure karta hai ki role sirf Lambda ko pass ho sakta hai, EC2 ya kisi aur ko nahi.

> 💡 **Gotcha:** `PassRole` ke alawa aur bhi escalation paths hain jo audit me miss ho jaate hain: `iam:CreatePolicyVersion` (existing policy ka naya version bana ke `--set-as-default`), `iam:AttachUserPolicy`, `iam:PutUserPolicy`, `iam:UpdateAssumeRolePolicy` (kisi bhi role ki trust policy me khud ko add kar lo), `iam:CreateAccessKey` (kisi admin user ki nayi key bana lo), aur `lambda:UpdateFunctionCode` (existing privileged Lambda ka code badal do). In sabko ek group me treat karo — "IAM write access = admin access", chahe policy me `AdministratorAccess` na likha ho.

---

**Q40: IAM Access Analyzer kya karta hai — teeno modes?**

Teen alag capabilities hain, alag pricing ke saath:

**1. External access analyzer (FREE)** — automated reasoning (mathematical proof, guessing nahi) se batata hai ki kaunse resources tumhare account/org ke **bahar** se accessible hain. S3 buckets, IAM roles, KMS keys, Lambda functions, SQS queues, Secrets Manager secrets, EFS, ECR, RDS snapshots, SNS. Findings me exact external principal dikhta hai.

**2. Unused access analyzer (PAID — $0.20 per role/user per month)** — batata hai kaunse roles/users use hi nahi ho rahe, aur kaunse **actions** grant hain lekin kabhi call nahi hue. Ye least-privilege journey ka backbone hai. Configurable tracking period (default 90 days).

**3. Policy validation + custom policy checks** — validation FREE hai (grammar + best-practice warnings, `aws accessanalyzer validate-policy`). Custom policy checks PAID hain ($0.0020 per API request ⚠️ verify) — ye CI me chalte hain aur mathematically prove karte hain ki nayi policy purani se zyada permissive **nahi** hai.

Aur ek: **internal access analyzer** (paid, ~$9.00 per monitored resource per month in us-east-1 ⚠️ verify) — critical resources par internal access monitor karta hai.

Policy generation bhi hai: CloudTrail history se dekh ke actual-usage-based policy generate kar deta hai.

> 💡 **Gotcha:** Unused access analyzer ki pricing **findings par nahi, analyzed roles/users par** hai. Agar tumhare account me 800 roles hain (jinme se 600 service-linked ya CDK-generated hain), to bill 800 × $0.20 = $160/month — chahe koi finding aaye ya na aaye. Service-linked roles count nahi hote, ye rahat hai. Cost control ke liye: **ek hi org-level analyzer banao** (har account me alag nahi), aur tag-based exclusions use karo.

---
### 🔴 Q41–Q78 — Advanced, Edge Cases, Failure Modes

**Q41: Confused deputy problem exactly kya hai — do flavours?**

"Deputy" = ek entity jiske paas tumse zyada permissions hain aur jo tumhare kehne par kaam karti hai. "Confused" = usse dhokha dekar galat resource par kaam karwa lena.

**Flavour 1 — Cross-service (AWS service deputy):**
S3 tumhare SNS topic ko notify karta hai. S3 service principal ke paas broad permissions hain. Agar tumhari SNS topic policy sirf `"Principal": {"Service": "s3.amazonaws.com"}` kehti hai, to **duniya ke kisi bhi** account ka S3 bucket tumhare topic par publish kar sakta hai — kyunki service principal sabke liye same hai. Fix: `aws:SourceAccount` + `aws:SourceArn`.

**Flavour 2 — Cross-account (third-party deputy):**
SaaS vendor ke paas tumhare account ka role assume karne ka right hai, aur 500 doosre customers ka bhi. Agar attacker vendor ko tumhara account ID + role name feed kar de, vendor confuse hokar tumhare data par attacker ke behalf par kaam kar sakta hai. Fix: `sts:ExternalId`.

Kyun ye design flaw nahi hai: AWS ne intentionally service principals ko generic rakha hai (per-customer service principals scale nahi karte). Responsibility resource owner par daali hai ki wo condition lagaye. Debatable design, lekin ab yahi hai.

> 💡 **Gotcha:** Naye services me AWS ab **automatically** SourceArn condition suggest karta hai console me. Lekin Terraform/CDK se banaye gaye resources me tumhe manually likhna padta hai. Access Analyzer ye flag karta hai — uske findings ignore mat karna.

---

**Q42: IAM ka paisa kis cheez ka lagta hai?**

**IAM khud 100% FREE hai.** Users, groups, roles, policies, access keys — koi charge nahi. **STS bhi free hai** — AssumeRole calls ka koi charge nahi, chahe tum din me 50 million karo (rate limit hai, price nahi).

Paisa in cheezon ka lagta hai (⚠️ ye numbers verify karna, pricing badalti rehti hai — 6 Aug 2026 ke US East N. Virginia rates):

| Cheez | Rate | Notes |
|---|---|---|
| IAM (users, roles, policies) | **$0** | |
| STS API calls | **$0** | |
| IAM Identity Center | **$0** | Directory alag se charge kar sakti hai |
| Access Analyzer — external access | **$0** | |
| Access Analyzer — policy validation | **$0** | |
| Access Analyzer — **unused access** | **$0.20** / IAM role or user / month | SLRs exempt |
| Access Analyzer — **internal access** | **~$9.00** / monitored resource / month | ⚠️ verify |
| Access Analyzer — **custom policy checks** | **~$0.0020** / API request | ⚠️ verify |
| IAM Roles Anywhere | **$0** | Private CA alag se charge hoti hai |
| AWS Managed Microsoft AD (Identity Center ke saath) | **per-hour** | Directory ka charge |

**Indirect costs jo IAM ki wajah se aate hain:**

| Hidden cost | Kyun |
|---|---|
| **CloudTrail data events** | Management events free hain (90 days), lekin S3/Lambda data events **$0.10 per 100,000 events**. IAM debugging ke liye log jab data events on karte hain to bill spike karta hai |
| **CloudTrail second trail** | Pehla copy free, doosra trail full price |
| **AWS Config rules** | IAM compliance rules (`iam-user-mfa-enabled`, etc.) — per-evaluation charge |
| **AWS Private CA** | Roles Anywhere ke liye chahiye — **~$400/month per CA** ⚠️ verify. Ye bahut logon ko chubta hai |
| **Secrets Manager** | Agar tum access keys store kar rahe ho — **$0.40 per secret per month** |
| **KMS** | Encryption context IAM ke saath — **$1/month per CMK** + $0.03 per 10,000 requests |
| **VPC interface endpoint for STS** | **~$0.01/hour per AZ** + **$0.01/GB** data processed. 3 AZ = ~$22/month per endpoint |

> 💡 **Gotcha:** Sabse common surprise bill: **VPC interface endpoints**. Log sochte hain "private access free hoga" — nahi. Har endpoint har AZ me ek ENI banata hai, aur har ENI ka hourly charge hai. Agar tumne 12 services ke endpoints 3 AZs me banaye = 36 ENIs = **~$260/month** sirf idle rehne ka. NAT gateway se compare karo — wo **$0.045/hour + $0.045/GB** hai. Kam traffic par NAT sasta hai, zyada traffic par endpoints.

---

**Q43: Har cheez ki actual limit kya hai — aur kaunsi soft, kaunsi hard?**

**Adjustable (soft) — Service Quotas se automatically approve ho jaati hain:**

| Resource | Default | Maximum |
|---|---|---|
| Customer managed policies per account | 1,500 | 10,000 |
| Roles per account | 1,000 | 10,000 |
| Instance profiles per account | 1,000 | 10,000 |
| Groups per account | 300 | 500 |
| Managed policies per **role** | 10 | 25 |
| Managed policies per **user** | 10 | 20 |
| Managed policies per **group** | 10 | 10 (nahi badh sakta) |
| Role trust policy length | 2,048 chars | 8,192 chars |
| OIDC providers per account | 100 | 700 |
| Server certificates per account | 20 | 20 |

**Hard (badh nahi sakti):**

| Cheez | Limit |
|---|---|
| **Users per account** | **5,000** |
| Access keys per user | 2 |
| Groups per user | 10 |
| MFA devices per user/root | 8 |
| Versions per managed policy | 5 |
| Managed policy size | 6,144 chars (whitespace excluded) |
| Inline policy aggregate — **user** | 2,048 chars |
| Inline policy aggregate — **role** | 10,240 chars |
| Inline policy aggregate — **group** | 5,120 chars |
| Role name | 64 chars (path + name if console switch-role) |
| User name | 64 chars |
| Policy / group / instance profile name | 128 chars |
| Path | 512 chars |
| Role session name | 64 chars |
| Session duration | 900s – 43,200s (15 min – 12 hrs) |
| Role chaining session duration | max 3,600s |
| Session policy (JSON + ARNs combined) | 2,048 chars |
| Managed policy ARNs per session | 10 |
| Session tags | 50 (key 128, value 256 chars) |
| SAML response (base64) | 100,000 chars |
| External ID | 2 – 1,224 chars |
| Tags per IAM resource | 50 |

**STS request quota:** **600 requests/second per account per region**, shared across `AssumeRole`, `GetCallerIdentity`, `GetSessionToken`, `GetFederationToken`, `DecodeAuthorizationMessage`, `GetAccessKeyInfo`. Ye adjustable hai lekin sirf AWS Support ticket se.

> 💡 **Gotcha:** Quota increase requests **sirf us-east-1** se submit ho sakte hain, chahe tum ap-south-1 me kaam kar rahe ho. Service Quotas console me region us-east-1 par switch karo warna IAM service list me dikhega hi nahi. Bahut log 20 minute region dhoondhte rehte hain.

---

**Q44: IAM eventually consistent hai — iska practical impact kya hai?**

IAM ka data poore duniya me replicate hota hai. Jab tum ek role banate ho, wo write us-east-1 me hota hai aur phir sab regions me propagate hota hai. **Ye propagation instant nahi hai** — typically seconds, occasionally 10+ seconds.

Practical failure scenarios:

```typescript
// ❌ Ye flaky hai
await iam.send(new CreateRoleCommand({ ... }));
await lambda.send(new CreateFunctionCommand({ Role: roleArn }));
// → InvalidParameterValueException: The role defined for the function
//   cannot be assumed by Lambda
```

Ye role galat nahi hai — Lambda ke region me role abhi propagate nahi hua. Same pattern:
- Instance profile bana ke turant EC2 launch → `Invalid IAM Instance Profile name`
- Policy attach karke turant API call → `AccessDenied` (aur 5 second baad kaam kar jaata hai)
- Access key bana ke turant use → `InvalidClientTokenId`

Handling:
```typescript
async function retryOnEventualConsistency<T>(fn: () => Promise<T>, tries = 6): Promise<T> {
  const retryable = new Set([
    "InvalidParameterValueException", "AccessDenied",
    "InvalidClientTokenId", "NoSuchEntity", "MalformedPolicyDocument"
  ]);
  for (let i = 0; i < tries; i++) {
    try { return await fn(); }
    catch (e: any) {
      if (i === tries - 1 || !retryable.has(e.name)) throw e;
      await new Promise(r => setTimeout(r, 2 ** i * 1000)); // 1,2,4,8,16s
    }
  }
  throw new Error("unreachable");
}
```

> 💡 **Gotcha:** SQL Server me tum `COMMIT` ke baad turant `SELECT` kar sakte ho — ACID guarantee hai. IAM me ye guarantee **nahi** hai. Ye mental shift bahut logon ke liye mushkil hota hai. Aur ye sabse zyada CI/CD me kaatta hai kyunki wahan create-and-immediately-use pattern normal hai. CDK/CloudFormation ye internally handle karta hai (isliye CDK preferable hai raw SDK scripts se infra banane ke liye).

---

**Q45: STS ki rate limit kahan hit hoti hai aur credential caching kaise karte hain?**

Limit: **600 STS requests/second per account per region**, sab STS operations shared.

Kab hit hoti hai — real scenarios:
1. **Har HTTP request par AssumeRole.** Ek Node service 800 req/s handle kar rahi hai aur har request par role assume kar rahi hai → instant throttle.
2. **Multi-tenant SaaS** jo per-tenant session policy ke saath AssumeRole karta hai.
3. **Lambda cold start storm** — 2,000 concurrent Lambdas ek saath spin up, sab AssumeRole karte hain (though Lambda ka execution role credentials Lambda service khud inject karta hai, ye quota consume nahi karta — Q46 dekho).
4. **Kubernetes pods** IRSA ke saath, mass restart par.

Error: `Rate exceeded` ya `ThrottlingException` with HTTP 400.

**Fix — credentials cache karo:**
```typescript
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";

type Cached = { creds: any; expiresAt: number };
const cache = new Map<string, Cached>();
const SKEW_MS = 5 * 60 * 1000; // 5 min pehle refresh karo

async function getCredsFor(roleArn: string, sessionName: string) {
  const key = `${roleArn}|${sessionName}`;
  const hit = cache.get(key);
  if (hit && hit.expiresAt - SKEW_MS > Date.now()) return hit.creds;

  const sts = new STSClient({ region: "ap-south-1" });
  const out = await sts.send(new AssumeRoleCommand({
    RoleArn: roleArn, RoleSessionName: sessionName, DurationSeconds: 3600
  }));

  const creds = {
    accessKeyId: out.Credentials!.AccessKeyId!,
    secretAccessKey: out.Credentials!.SecretAccessKey!,
    sessionToken: out.Credentials!.SessionToken!,
  };
  cache.set(key, { creds, expiresAt: out.Credentials!.Expiration!.getTime() });
  return creds;
}
```

Ye exactly wahi pattern hai jo tum DB connection pool ke saath karte ho — har request par naya connection nahi banate. Credential bhi ek pooled resource hai.

> 💡 **Gotcha:** Cross-account AssumeRole me quota **caller** ke account se consume hota hai, target account se nahi. Aur AWS **service principals** (jaise Lambda service tumhare execution role ko assume kar raha hai) tumhara quota consume **nahi** karte. Isliye "mere 5000 Lambdas hain, kya main STS limit hit karunga?" ka jawab hai — nahi, execution role wale calls count nahi hote. Sirf tumhare **apne** SDK se kiye gaye AssumeRole calls count hote hain.

---

**Q46: EC2, Lambda, ECS ko credentials kaise milti hain — mechanism kya hai?**

**EC2 — IMDS (Instance Metadata Service):**
```bash
# IMDSv2 (token-based, ye use karo)
TOKEN=$(curl -sX PUT "http://169.254.169.254/latest/api/token" \
  -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
ROLE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/)
curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
  http://169.254.169.254/latest/meta-data/iam/security-credentials/$ROLE
# → { "AccessKeyId": "ASIA...", "SecretAccessKey": "...",
#     "Token": "...", "Expiration": "2026-08-06T18:00:00Z" }
```
EC2 agent ye credentials background me refresh karta rehta hai, typically expiry se ~5+ minutes pehle. SDK automatically yahan se padhta hai.

**Lambda — environment variables:** Lambda service execution role assume karke `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` env vars me daal deta hai. Credentials invocation ke liye valid rehti hain; long-running Lambda (15 min max) me SDK khud refresh nahi kar sakta kyunki env vars static hain — lekin 15 min < 1 hour, to problem nahi.

**ECS/Fargate — container credentials endpoint:** `http://169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI`. Env var ECS agent set karta hai.

**EKS — IRSA / Pod Identity:** projected service account token file par mount hota hai, SDK usse `AssumeRoleWithWebIdentity` karta hai.

> 💡 **Gotcha:** **IMDSv1 ko disable karo.** IMDSv1 simple GET hai — koi token nahi. Iska matlab agar tumhare app me **SSRF vulnerability** hai (attacker tumse arbitrary URL fetch karwa sakta hai), to wo `http://169.254.169.254/...` fetch karke tumhare instance ki credentials nikaal lega. Capital One ka 2019 breach (100 million records) exactly ye tha. IMDSv2 me PUT + custom header chahiye jo browser/proxy-based SSRF nahi kar sakta. Enforce:
> ```bash
> aws ec2 modify-instance-metadata-options --instance-id i-123 \
>   --http-tokens required --http-put-response-hop-limit 1
> ```
> `hop-limit 1` isliye ki container se IMDS reachable na ho (agar containers host network par nahi hain).

---

**Q47: EKS me IRSA aur Pod Identity — dono kyun hain?**

**IRSA (IAM Roles for Service Accounts)** — 2019 se hai. Mechanism:
1. Cluster ka OIDC issuer URL IAM me OIDC provider ke roop me register hota hai
2. Kubernetes ServiceAccount par annotation: `eks.amazonaws.com/role-arn: arn:aws:iam::123:role/AppRole`
3. Pod me projected token file mount hoti hai (`/var/run/secrets/eks.amazonaws.com/serviceaccount/token`)
4. SDK us token se `AssumeRoleWithWebIdentity` karta hai

Trust policy:
```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123:oidc-provider/oidc.eks.ap-south-1.amazonaws.com/id/ABC123" },
  "Action": "sts:AssumeRoleWithWebIdentity",
  "Condition": {
    "StringEquals": {
      "oidc.eks.ap-south-1.amazonaws.com/id/ABC123:sub": "system:serviceaccount:payments:payment-sa",
      "oidc.eks.ap-south-1.amazonaws.com/id/ABC123:aud": "sts.amazonaws.com"
    }
  }
}
```

**EKS Pod Identity** — 2023 me aaya. Simpler: EKS par ek addon chalta hai, tum ek "pod identity association" banate ho (cluster + namespace + SA → role), aur role ki trust policy me sirf `pods.eks.amazonaws.com` service principal hota hai. **Koi OIDC provider register karne ki zaroorat nahi, koi per-cluster trust policy nahi.**

Kyun dono: IRSA me har cluster ke liye alag OIDC provider register karna padta hai, aur role ki trust policy me cluster-specific issuer URL hota hai — matlab agar tum cluster recreate karo (naya OIDC ID), sab roles ki trust policies update karni padti hain. Pod Identity is pain ko khatam karta hai. Naye clusters ke liye **Pod Identity** use karo, jab tak koi feature gap na ho (Pod Identity kuch cases me cross-account me limited tha — ⚠️ verify current state).

> 💡 **Gotcha:** IRSA me `:sub` condition me `StringEquals` use karo, `StringLike` nahi. Agar tumne `system:serviceaccount:*:*` likha to **cluster ka koi bhi pod** us role ko assume kar sakta hai — including ek compromised sidecar ya kisi doosri team ka namespace. Multi-tenant cluster me ye poora isolation model tod deta hai.

---

**Q48: `AccessDenied` error ko systematically kaise debug karte hain?**

Modern AWS error messages kaafi acche ho gaye hain. Anatomy:

```
An error occurred (AccessDenied) when calling the GetObject operation:
User: arn:aws:sts::123456789012:assumed-role/PaymentRole/pod-abc123
is not authorized to perform: s3:GetObject
on resource: arn:aws:s3:::jmfs-reports/2026/august.csv
because no identity-based policy allows the s3:GetObject action
```

Aakhri line **sabse important** hai. Possible endings aur unka matlab:

| Message ending | Kya karna hai |
|---|---|
| `no identity-based policy allows...` | Role/user ki policy me action missing hai |
| `no resource-based policy allows...` | Cross-account hai — target resource ki policy dekho |
| `with an explicit deny in an identity-based policy` | Kahin explicit Deny hai — sab attached policies grep karo |
| `with an explicit deny in a service control policy` | **Organizations SCP** block kar rahi hai. IAM me kuch nahi milega |
| `with an explicit deny in a permissions boundary` | Boundary ceiling se bahar |
| `with an explicit deny in a VPC endpoint policy` | VPC endpoint ki apni policy hai |
| `no session policy allows...` | AssumeRole me pass ki gayi session policy restrictive hai |

**Debug checklist (is order me):**
```bash
# 1. Main kaun hoon actually?
aws sts get-caller-identity

# 2. Is identity par kya laga hai?
aws iam list-attached-role-policies --role-name PaymentRole
aws iam list-role-policies --role-name PaymentRole
aws iam get-role --role-name PaymentRole    # PermissionsBoundary field dekho

# 3. Simulate karo — asli call maare bina
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123456789012:role/PaymentRole \
  --action-names s3:GetObject \
  --resource-arns arn:aws:s3:::jmfs-reports/2026/august.csv

# 4. Resource ki policy dekho
aws s3api get-bucket-policy --bucket jmfs-reports

# 5. SCP check (org management account se)
aws organizations list-policies-for-target --target-id 123456789012 \
  --filter SERVICE_CONTROL_POLICY

# 6. CloudTrail me exact event
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=GetObject \
  --max-results 5
```

**Encoded authorization message** — kuch services (EC2, mostly) encoded failure message dete hain:
```bash
aws sts decode-authorization-message --encoded-message "<long-base64-blob>" \
  --query DecodedMessage --output text | jq .
```
Isme exact matched/unmatched statements dikhte hain. Ye debug ka nuclear option hai. Iske liye `sts:DecodeAuthorizationMessage` permission chahiye.

> 💡 **Gotcha:** `simulate-principal-policy` **SCPs ko account nahi karta** by default aur resource-based policies ko bhi incompletely handle karta hai. Agar simulate kehta hai "allowed" lekin real call fail ho rahi hai, to 90% chance SCP hai. Aur simulate kabhi-kabhi actual condition context miss karta hai (jaise `aws:SourceVpce`) kyunki wo real request context se aata hai. Simulator ek guide hai, gospel nahi.

---

**Q49: Common IAM/STS errors ki full list aur unka matlab?**

| Error | Kya galat hai | Fix |
|---|---|---|
| `AccessDenied` | Authorization fail | Q48 ka checklist |
| `UnauthorizedOperation` | EC2 ka AccessDenied version, often encoded | `decode-authorization-message` |
| `InvalidClientTokenId` | Access key ID exist nahi karti, ya session token missing/mismatched | Key deleted? Wrong partition? `AWS_SESSION_TOKEN` set hai? |
| `SignatureDoesNotMatch` | Signature calculation galat | **Sabse common: system clock skew >5 min.** NTP sync karo |
| `ExpiredToken` / `ExpiredTokenException` | Temporary credentials expire ho gayi | Refresh karo; SDK me static creds ki jagah provider function do |
| `TokenRefreshRequired` | Same, thoda alag context | Same |
| `RegionDisabledException` | Opt-in region me STS activate nahi hai | IAM console → Account settings → STS region enable |
| `MalformedPolicyDocument` | JSON valid hai lekin IAM grammar galat | Missing `Version`? `Principal` identity policy me? `Resource` missing? |
| `NoSuchEntity` | Role/user/policy exist nahi karta — **ya abhi propagate nahi hua** | Retry with backoff |
| `EntityAlreadyExists` | Naam already liya hua | IAM names case-insensitive unique hain |
| `LimitExceeded` | Quota hit | Kaunsa? Aksar 5-policy-versions ya 10-managed-policies |
| `DeleteConflict` | Role/user delete nahi ho raha | Pehle policies detach karo, instance profile se hatao, access keys delete karo |
| `Rate exceeded` / `ThrottlingException` | 600 TPS STS limit | Credentials cache karo |
| `PackedPolicyTooLarge` | Session policy + tags 2048 chars se zyada | Policy chhoti karo ya managed ARNs pass karo |
| `InvalidIdentityToken` | OIDC/SAML token invalid ya expired | Token ki `aud`, `iss`, expiry check karo |
| `IDPRejectedClaim` | SAML/OIDC claim trust policy condition se match nahi hui | `sub`/`aud` conditions dekho |

> 💡 **Gotcha:** `SignatureDoesNotMatch` par log ghanton keys check karte hain. **Pehle clock check karo.** SigV4 me timestamp signature ka part hai aur AWS ±5 minute skew tolerate karta hai. Docker containers, VMs jo suspend/resume hue hain, aur galat timezone wale systems — ye sabse common culprits hain. `date -u` chalao aur `curl -sI https://s3.amazonaws.com | grep -i date` se compare karo.

---

**Q50: Agar tum khud ko lock out kar lo to kya karoge?**

Scenarios aur recovery:

**1. Tumne apni hi IAM user/role se admin permissions hata di**
→ Root user se login karo. Root ko koi identity policy nahi rok sakti. Permissions wapas do.

**2. Tumne S3 bucket policy me galat Deny lagayi (Q34 wala gotcha)**
→ Root user bucket policy delete kar sakta hai (bucket owner account ka root). `aws s3api delete-bucket-policy` root credentials se.

**3. Tumne KMS key policy me sabko deny kar diya**
→ Ye **sabse buri** situation hai. KMS key policy me agar koi bhi principal `kms:PutKeyPolicy` nahi kar sakta, to key permanently bricked hai — root bhi nahi kar sakta. **Sirf AWS Support hi help kar sakta hai**, aur wo bhi ek manual process hai. Isliye har KMS key policy me hamesha ye statement rakhna:
```json
{
  "Sid": "EnableIAMUserPermissions",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
  "Action": "kms:*",
  "Resource": "*"
}
```

**4. SCP ne poore account ko block kar diya**
→ Organizations **management account** se SCP hatao. Management account par SCPs lagti hi nahi, isliye wo hamesha reachable hai.

**5. Root ka MFA device kho gaya**
→ AWS Support ka account recovery process — phone verification, ID documents. Din lag sakte hain.

**6. Management account ka root bhi lock out**
→ AWS Support. Ye company-level incident hai.

**Prevention — break-glass role:**
Har account me ek `BreakGlassAdmin` role banao:
- `AdministratorAccess` attached
- Trust policy me sirf ek specific hardware-MFA-protected identity
- CloudTrail alarm: is role ka koi bhi AssumeRole → PagerDuty/SNS alert
- Har SCP aur restrictive resource policy me isko `NotPrincipal`/exception list me rakho

> 💡 **Gotcha:** Break-glass role ki trust policy ko us role se hi manage mat karo. Agar tumne accidentally uski trust policy tod di to wo assume nahi ho payegi. Trust policy ko root ya management account se manage karo, aur uska backup version control me rakho.

---

**Q51: Policy size limit hit ho jaye to kya karte ho?**

Ye real production problem hai, especially jab tum least-privilege karne ki koshish karte ho — har resource ARN explicitly likhne se policy bhar jaati hai.

**Strategies:**

**1. Path-based wildcards** — resources ko naming convention do:
```json
"Resource": "arn:aws:s3:::jmfs-payments-*/*"
```
Ek line, 50 buckets covered. Isliye naming convention pehle din se design karna zaroori hai.

**2. Tag-based access control (ABAC)** — ye sabse powerful hai:
```json
{
  "Effect": "Allow",
  "Action": ["dynamodb:GetItem", "dynamodb:Query", "dynamodb:PutItem"],
  "Resource": "arn:aws:dynamodb:*:*:table/*",
  "Condition": {
    "StringEquals": {
      "aws:ResourceTag/Team": "${aws:PrincipalTag/Team}"
    }
  }
}
```
Ye ek policy hai jo **saari** teams ke liye kaam karti hai — har team apne tagged resources access kar sakti hai. Naye resources add karne par policy update nahi karni padti. Ye RBAC se ABAC ka shift hai, aur scale par ye hi survive karta hai.

**3. Policy ko todo aur multiple managed policies attach karo** — 10 (ya 25) policies × 6,144 chars = kaafi headroom.

**4. Groups ka use** (users ke liye): user 20 direct policies + 10 groups × 10 policies = 120 managed policies. Hacky but works.

**5. Whitespace hatao** — IAM whitespace count nahi karta, lekin ye sirf tab kaam aata hai jab tum minified JSON store kar rahe ho... actually IAM khud whitespace exclude karta hai calculation me, to ye no-op hai. Real jagah bachane ke liye `Sid` hatao (wo count hota hai).

> 💡 **Gotcha:** ABAC ke saath tumhe **tag governance** chahiye — kaun tags laga sakta hai. Agar koi apni resource par `Team: finance` tag laga sakta hai to wo finance ka data access kar lega. Isliye tag-setting permissions ko lock karo:
> ```json
> {
>   "Effect": "Deny",
>   "Action": ["dynamodb:TagResource", "dynamodb:UntagResource"],
>   "Resource": "*",
>   "Condition": { "ForAnyValue:StringEquals": { "aws:TagKeys": ["Team", "DataClass"] } }
> }
> ```
> ABAC bina tag governance ke security theatre hai.

---

**Q52: `aws:ViaAWSService`, `aws:CalledVia` — ye kab matter karte hain?**

Jab ek AWS service tumhare behalf par doosri service call karta hai, to request context alag hota hai.

**`aws:ViaAWSService`** (Bool) — kya request kisi AWS service ke through aayi? Example: Athena tumhare behalf par S3 padh raha hai → `true`.

**`aws:CalledVia`** (multi-valued string) — services ki **chain** jo beech me thi. Example: `["athena.amazonaws.com"]` ya `["cloudformation.amazonaws.com", "lambda.amazonaws.com"]`.

**`aws:CalledViaFirst`** / **`aws:CalledViaLast`** — chain ka pehla/aakhri element.

Use case — "DynamoDB sirf Athena ke through access ho, direct nahi":
```json
{
  "Effect": "Allow",
  "Action": "dynamodb:Query",
  "Resource": "arn:aws:dynamodb:*:*:table/SensitiveData",
  "Condition": {
    "ForAnyValue:StringEquals": { "aws:CalledVia": "athena.amazonaws.com" }
  }
}
```

Ulta use case — IP restriction lagate waqt AWS services ko exempt karna (Q33 me dekha):
```json
"Condition": {
  "NotIpAddress": { "aws:SourceIp": ["203.0.113.0/24"] },
  "Bool": { "aws:ViaAWSService": "false" }
}
```

> 💡 **Gotcha:** `aws:CalledVia` sirf **supported services** ke liye populate hota hai — har service nahi. AWS ki docs me "services that support aws:CalledVia" ki list hai (Athena, CloudFormation, DynamoDB, KMS, Lambda, aur kuch). Agar tum kisi unsupported service par condition lagaoge to wo kabhi match nahi karegi aur access silently deny hoga. Test karo, assume mat karo.

---

**Q53: KMS key policy IAM se alag kyun behave karti hai?**

Ye AWS ka sabse counter-intuitive design hai aur log iss par hamesha atakte hain.

**Baaki sab services me:** identity policy **YA** resource policy — kisi ek me Allow kaafi hai (same account).

**KMS me:** key policy **must** explicitly IAM ko delegate kare, warna identity policy kuch nahi kar sakti. Yaani key policy hi asli boss hai.

Agar key policy me ye statement nahi hai:
```json
{
  "Sid": "EnableIAMUserPermissions",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::123456789012:root" },
  "Action": "kms:*",
  "Resource": "*"
}
```
...to us account ka **koi bhi** IAM principal us key ko use nahi kar sakta, chahe uske paas `AdministratorAccess` ho. Aur agar key policy me koi aisa principal nahi jo `kms:PutKeyPolicy` kar sake, to key **permanently unusable** hai.

Kyun ye design: KMS keys cryptographic root of trust hain. AWS chahta tha ki key ka control ek hi jagah (key policy) me explicit rahe, taaki koi galti se broad IAM policy se sensitive keys access na kar le. Trade-off: safety zyada, convenience kam.

> 💡 **Gotcha:** Cross-account KMS access ke liye **teen** cheezein chahiye: (1) key policy me source account allowed, (2) source account ki identity policy me `kms:Decrypt` etc., (3) agar key kisi service ke through use ho rahi hai to `kms:ViaService` condition match karni chahiye. Aur `kms:GrantIsForAWSResource` wala grant mechanism ek chautha layer hai. KMS debugging hamesha lambi hoti hai — pehle `aws kms get-key-policy` chalao, phir IAM.

---

**Q54: Service-linked role (SLR) kya hai aur normal role se kaise alag?**

Service-linked role ek predefined role hai jo ek specific AWS service **apne liye** banata aur use karta hai. Naming: `AWSServiceRoleForElasticLoadBalancing`, `AWSServiceRoleForRDS`, `/aws-service-role/` path me.

Differences:
| | Normal role | Service-linked role |
|---|---|---|
| Trust policy edit kar sakte ho | Haan | **Nahi** |
| Permissions edit kar sakte ho | Haan | **Nahi** (AWS manage karta hai) |
| Delete kar sakte ho | Haan | Sirf tab jab service use na kar rahi ho |
| SCP lagti hai | Haan | **Nahi** — exempt |
| Access Analyzer unused-access billing | Haan | **Nahi** — exempt |
| Kaun banata hai | Tum | Service khud, ya `iam:CreateServiceLinkedRole` |

Kyun exist karte hain: pehle log service ke liye role banate the aur galti se uski permissions tod dete the, jisse service silently fail ho jaati thi. SLR AWS ko guarantee deta hai ki uske paas woh permissions hain jo usse kaam karne ke liye chahiye.

> 💡 **Gotcha:** SLRs **SCPs se exempt** hain. Ye ek blind spot hai — agar tumhari SCP kehti hai "us-west-2 me kuch mat karo" aur koi service apni SLR se wahan kuch karti hai, to SCP usko nahi rokegi. Compliance audit me ye explain karna padta hai. Aur SLRs delete karna mushkil hota hai — service pehle apne resources clean up karne kehta hai, aur error message aksar batata nahi ki kaunsa resource block kar raha hai.

---

**Q55: IAM Roles Anywhere kya hai — on-prem ke liye?**

Problem: tumhare data center me ek server hai (ya tumhara CI runner on-prem hai) jise AWS access chahiye. Traditional solution: IAM user banao, access key generate karo, server par rakho. Wahi permanent-credential problem.

**IAM Roles Anywhere** solution: server ke paas ek **X.509 certificate** hota hai (tumhari PKI se). Wo certificate se AWS ko authenticate karta hai aur temporary credentials paata hai.

Setup:
1. **Trust anchor** — AWS ko batao ki kaunsi CA ko trust karna hai (AWS Private CA, ya tumhari external CA ka root cert upload karo)
2. **Profile** — kaunse roles assume ho sakte hain, kaunsi session policies lagengi
3. Server par `aws_signing_helper` binary chalta hai jo cert se credentials exchange karta hai

Trust policy:
```json
{
  "Effect": "Allow",
  "Principal": { "Service": "rolesanywhere.amazonaws.com" },
  "Action": ["sts:AssumeRole", "sts:TagSession", "sts:SetSourceIdentity"],
  "Condition": {
    "StringEquals": { "aws:PrincipalTag/x509Subject/CN": "prod-batch-server-01" },
    "ArnEquals": { "aws:SourceArn": "arn:aws:rolesanywhere:ap-south-1:123:trust-anchor/abc" }
  }
}
```

Certificate ke fields (CN, OU, O, serial number) session tags ban jaate hain, jinpar tum conditions laga sakte ho.

Roles Anywhere **free** hai. Lekin agar tum AWS Private CA use karoge to wo **~$400/month per CA** hai ⚠️ verify — ye bahut logon ko surprise karta hai. External CA use karna sasta hai agar tumhare paas already PKI hai.

> 💡 **Gotcha:** Certificate revocation ke liye tumhe CRL upload karna padta hai — AWS automatically tumhari CA se CRL fetch nahi karta. Agar server compromise ho gaya aur tumne cert revoke kiya lekin CRL AWS me update nahi kiya, to wo cert abhi bhi credentials le sakta hai. Ye ek manual operational step hai jo log bhool jaate hain.

---

**Q56: Session tags aur `sts:SourceIdentity` kya hain?**

**Session tags** — AssumeRole ke waqt key-value pairs pass karo, jo phir conditions me available hote hain:

```typescript
await sts.send(new AssumeRoleCommand({
  RoleArn: "arn:aws:iam::123:role/TenantRole",
  RoleSessionName: "req-abc",
  Tags: [
    { Key: "Team", Value: "payments" },
    { Key: "CostCenter", Value: "CC-4471" }
  ],
  TransitiveTagKeys: ["Team"]   // ye tag aage chain me bhi carry hoga
}));
```

Phir policy me:
```json
"Condition": { "StringEquals": { "aws:ResourceTag/Team": "${aws:PrincipalTag/Team}" } }
```

Ye ABAC ka foundation hai. Limits: 50 tags, key 128 chars, value 256 chars, aur session policy + tags combined `PackedPolicySize` limit ke andar.

**`sts:SourceIdentity`** — ek special field jo **immutable** hai. Ek baar set ho gaya to role chaining me bhi wahi rehta hai aur badla nahi ja sakta. Ye "asli insaan kaun tha" track karne ke liye banaya gaya hai:

```json
{
  "Effect": "Allow",
  "Principal": { "Federated": "arn:aws:iam::123:saml-provider/Okta" },
  "Action": ["sts:AssumeRoleWithSAML", "sts:SetSourceIdentity"],
  "Condition": {
    "StringLike": { "sts:SourceIdentity": "*@jmfinancial.com" }
  }
}
```

CloudTrail me `userIdentity.sourceIdentity` field me ye dikhta hai, har hop par. Session tags badle ja sakte hain, SourceIdentity nahi.

> 💡 **Gotcha:** `sts:SetSourceIdentity` **alag permission** hai `sts:AssumeRole` se — trust policy me dono `Action` list me hone chahiye, warna SourceIdentity pass karne par `AccessDenied` milega. Aur SourceIdentity set karne ke baad downstream role chaining me tumhe har role ki trust policy me `sts:SetSourceIdentity` allow karna padega, warna chain toot jaayegi.

---
**Q57: S3 ke saath IAM ka poora interaction model kya hai?**

S3 me **paanch** alag access-control layers hain, aur sab ek saath evaluate hote hain:

1. **IAM identity policy** — principal ke paas kya hai
2. **Bucket policy** (resource-based) — bucket kise allow karta hai
3. **Bucket ACL / Object ACL** (legacy) — ab mostly disabled
4. **S3 Block Public Access** — ek override switch jo public grants ko block karta hai
5. **VPC endpoint policy** — agar VPCE se ja rahe ho

Evaluation: **Block Public Access sabse upar** hai — wo bucket policy ke public grants ko bhi override kar deta hai. Baaki normal IAM evaluation.

Key actions ka mapping (ye log galat karte hain):
| Kaam | Action | Resource ARN |
|---|---|---|
| Bucket ke objects list karo | `s3:ListBucket` | `arn:aws:s3:::bucket` (bina `/*`) |
| Object padho | `s3:GetObject` | `arn:aws:s3:::bucket/*` |
| Object likho | `s3:PutObject` | `arn:aws:s3:::bucket/*` |
| Object delete | `s3:DeleteObject` | `arn:aws:s3:::bucket/*` |
| Multipart upload | `s3:PutObject` + `s3:AbortMultipartUpload` | `arn:aws:s3:::bucket/*` |
| Bucket ki settings padho | `s3:GetBucketLocation`, `s3:GetBucketPolicy` | `arn:aws:s3:::bucket` |

Prefix-level restriction (per-tenant isolation):
```json
{
  "Effect": "Allow",
  "Action": "s3:ListBucket",
  "Resource": "arn:aws:s3:::jmfs-tenants",
  "Condition": {
    "StringLike": { "s3:prefix": ["tenant-42/*"] }
  }
}
```

> 💡 **Gotcha:** `s3:prefix` condition **sirf `ListBucket` par** kaam karti hai, `GetObject` par nahi. `GetObject` ko restrict karne ke liye Resource ARN me hi prefix likho: `arn:aws:s3:::jmfs-tenants/tenant-42/*`. Log dono jagah `s3:prefix` lagane ki koshish karte hain aur access silently zyada broad reh jaata hai.

---

**Q58: RDS aur IAM database authentication kaise judte hain?**

Do bilkul alag cheezein hain, aur ye tumhare SQL Server background ke liye important distinction hai:

**Layer 1 — Control plane (IAM):** `rds:CreateDBInstance`, `rds:DeleteDBInstance`, `rds:DescribeDBInstances`, `rds:CreateDBSnapshot`. Ye instance ko manage karne ke liye hai.

**Layer 2 — Data plane (database ka apna auth):** `SELECT * FROM Orders` chalane ke liye tumhe database ka user/password chahiye. IAM ko isse koi lena-dena nahi... **except IAM database authentication**.

**IAM DB Authentication** (MySQL, PostgreSQL, aur MariaDB — SQL Server par **nahi** hai ⚠️ verify):
```bash
# 1. Instance par enable karo
aws rds modify-db-instance --db-instance-identifier mydb \
  --enable-iam-database-authentication --apply-immediately

# 2. DB me user banao jo IAM auth use kare (Postgres)
#    CREATE USER app_user; GRANT rds_iam TO app_user;

# 3. Password ki jagah token generate karo (15 min valid)
TOKEN=$(aws rds generate-db-auth-token \
  --hostname mydb.abc123.ap-south-1.rds.amazonaws.com \
  --port 5432 --username app_user --region ap-south-1)

# 4. Us token ko password ki tarah use karo
PGPASSWORD="$TOKEN" psql -h mydb.abc... -U app_user -d appdb
```

IAM policy chahiye:
```json
{
  "Effect": "Allow",
  "Action": "rds-db:connect",
  "Resource": "arn:aws:rds-db:ap-south-1:123456789012:dbuser:db-ABCDEFGH/app_user"
}
```
Note: resource me **DbiResourceId** (`db-ABCDEFGH`) chahiye, instance identifier nahi.

Fayda vs self-managed SQL Server: tumhare Node app me koi DB password nahi hai. Token har 15 minute me regenerate hota hai. Rotation ka concept khatam.

> 💡 **Gotcha:** IAM DB auth ka **connection rate limit** hai — Postgres par typically **200 new connections per second** ⚠️ verify. Agar tumhara Node app har request par naya connection banata hai (bina pool ke) to ye limit hit hogi. Aur token 15 minute valid hai lekin **connection** uske baad bhi zinda rehta hai — token sirf handshake ke waqt check hota hai. Isliye long-lived pooled connections theek hain.

---

**Q59: Secrets Manager aur Parameter Store ke saath IAM kaise kaam karta hai?**

**Secrets Manager** resource-based policies support karta hai (cross-account secret sharing possible). Automatic rotation Lambda ke saath. Cost: **$0.40 per secret per month + $0.05 per 10,000 API calls** ⚠️ verify.

**SSM Parameter Store** — Standard parameters **free**, Advanced **$0.05 per parameter per month**. Resource policies **nahi** hain (except advanced sharing). Rotation built-in nahi.

IAM policy for Secrets Manager:
```json
{
  "Effect": "Allow",
  "Action": ["secretsmanager:GetSecretValue", "secretsmanager:DescribeSecret"],
  "Resource": "arn:aws:secretsmanager:ap-south-1:123:secret:prod/payments/db-*",
  "Condition": {
    "StringEquals": { "secretsmanager:VersionStage": "AWSCURRENT" }
  }
}
```

Secret ARN ke end me AWS ek random 6-char suffix lagata hai (`-AbCd12`), isliye policy me `*` lagana padta hai.

Agar secret KMS CMK se encrypted hai to **`kms:Decrypt` bhi chahiye** us key par — ye alag permission hai.

> 💡 **Gotcha:** SecureString parameters (Parameter Store) me bhi wahi baat: `ssm:GetParameter` ke saath `kms:Decrypt` chahiye. Aur `ssm:GetParameters` (plural) aur `ssm:GetParameter` (singular) **alag actions** hain — SDK kaunsa call karta hai wo depend karta hai. Dono deni padti hain aksar. Aur `ssm:GetParametersByPath` teesra alag action hai.

---

**Q60: CloudTrail me IAM events kaise padhte hain?**

Har API call CloudTrail me ek JSON event banati hai. IAM debugging ke liye key fields:

```json
{
  "eventTime": "2026-08-06T09:14:22Z",
  "eventSource": "s3.amazonaws.com",
  "eventName": "GetObject",
  "awsRegion": "ap-south-1",
  "sourceIPAddress": "10.0.3.44",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROAEXAMPLE123:pod-abc123",
    "arn": "arn:aws:sts::123456789012:assumed-role/PaymentRole/pod-abc123",
    "accountId": "123456789012",
    "sessionContext": {
      "sessionIssuer": {
        "type": "Role",
        "arn": "arn:aws:iam::123456789012:role/PaymentRole"
      },
      "attributes": { "mfaAuthenticated": "false", "creationDate": "..." }
    }
  },
  "errorCode": "AccessDenied",
  "errorMessage": "User: ... is not authorized to perform: ..."
}
```

- **`userIdentity.type`** — `Root`, `IAMUser`, `AssumedRole`, `FederatedUser`, `AWSService`, `AWSAccount`
- **`sessionContext.sessionIssuer.arn`** — asli role (session ARN ke bajaye). Grouping ke liye ye use karo.
- **`errorCode` + `errorMessage`** — deny hone par yahan pura reason hota hai
- **`sourceIdentity`** — agar SetSourceIdentity use hua tha

Useful Athena query (agar CloudTrail S3 me hai):
```sql
SELECT useridentity.arn, eventname, errorcode, count(*) AS cnt
FROM cloudtrail_logs
WHERE errorcode IN ('AccessDenied', 'UnauthorizedOperation')
  AND from_iso8601_timestamp(eventtime) > current_timestamp - interval '7' day
GROUP BY 1, 2, 3
ORDER BY cnt DESC;
```

> 💡 **Gotcha:** **IAM events us-east-1 me log hote hain** (global service events). Agar tumhara trail sirf ap-south-1 ka hai aur "Include global service events" off hai, to `CreateRole`, `AttachRolePolicy` jaise events tumhe kabhi nahi dikhenge. Multi-region trail banao. Aur CloudTrail me **latency hai** — event dikhne me typically 5-15 minutes lagte hain. Real-time debugging ke liye CloudTrail wrong tool hai; error message directly padho.

---

**Q61: Lambda execution role vs resource-based policy — dono kab?**

Lambda me **do** IAM concepts hain aur log inhe mix kar dete hain:

**1. Execution role** — "Lambda function **kya kar sakta hai**". Ye function ke code ko permissions deta hai. Minimum:
```json
{
  "Effect": "Allow",
  "Action": ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
  "Resource": "arn:aws:logs:ap-south-1:123456789012:*"
}
```
(Ya `AWSLambdaBasicExecutionRole` managed policy.)

Trust policy:
```json
{
  "Effect": "Allow",
  "Principal": { "Service": "lambda.amazonaws.com" },
  "Action": "sts:AssumeRole"
}
```

**2. Resource-based policy (function policy)** — "**kaun** is function ko invoke kar sakta hai". Jab API Gateway, EventBridge, S3, ya SNS tumhare function ko trigger karta hai, to ye policy chahiye:
```bash
aws lambda add-permission --function-name PaymentProcessor \
  --statement-id apigw-invoke \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:ap-south-1:123456789012:abcd1234/*/POST/pay"
```

Direction yaad rakhne ka tareeka: **execution role = outbound**, **function policy = inbound**.

> 💡 **Gotcha:** `--source-arn` dena **optional** hai lekin ise skip karna security hole hai — bina uske **duniya ka koi bhi** API Gateway tumhare function ko invoke kar sakta hai (confused deputy again). Console se trigger add karo to console automatically source-arn set karta hai; CLI/CDK me tumhe khud karna padta hai. CDK me `Function.grantInvoke()` sahi karta hai, raw `addPermission()` nahi.

---

**Q62: API Gateway me IAM auth kaise kaam karta hai?**

API Gateway teen auth modes deta hai: IAM (SigV4), Cognito, aur Lambda authorizer.

**IAM mode** me caller ko request **SigV4 se sign** karni padti hai, bilkul waise jaise wo S3 ko call kar raha ho. Phir tum resource policy ya IAM policy me `execute-api:Invoke` control karte ho:

```json
{
  "Effect": "Allow",
  "Action": "execute-api:Invoke",
  "Resource": "arn:aws:execute-api:ap-south-1:123456789012:abcd1234/prod/POST/payments/*"
}
```

ARN structure: `{api-id}/{stage}/{HTTP-method}/{resource-path}`.

Node me signed request bhejna (SDK v3):
```typescript
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { Sha256 } from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { HttpRequest } from "@aws-sdk/protocol-http";

const signer = new SignatureV4({
  credentials: defaultProvider(),
  region: "ap-south-1",
  service: "execute-api",
  sha256: Sha256,
});

const req = new HttpRequest({
  method: "POST",
  protocol: "https:",
  hostname: "abcd1234.execute-api.ap-south-1.amazonaws.com",
  path: "/prod/payments/settle",
  headers: { host: "abcd1234.execute-api.ap-south-1.amazonaws.com",
             "content-type": "application/json" },
  body: JSON.stringify({ orderId: "ORD-991" }),
});

const signed = await signer.sign(req);
await fetch(`https://${signed.hostname}${signed.path}`, {
  method: signed.method, headers: signed.headers as any, body: signed.body,
});
```

Kab IAM auth use karo: **service-to-service** calls jab dono AWS me hain. Kab **nahi**: public-facing APIs jahan browser/mobile clients hain — wahan Cognito ya JWT authorizer better hai kyunki browser SigV4 sign nahi kar sakta bina credentials expose kiye.

> 💡 **Gotcha:** IAM-authorized API Gateway me agar resource policy hai to wo **evaluation ko badal deti hai** — same-account me identity policy + resource policy ka OR nahi, balki API Gateway ke apne rules hain (resource policy me explicit allow chahiye kuch cases me). AWS ki "API Gateway resource policy evaluation" table dekh lena, wo standard IAM logic se thoda deviate karti hai.

---

**Q63: EventBridge, SQS, SNS ke saath permissions kaise set karte hain?**

Teeno resource policies support karte hain aur teeno me same confused-deputy pattern lagta hai.

**SQS queue policy** — Lambda ko queue padhne dena:
```json
{
  "Effect": "Allow",
  "Principal": { "Service": "lambda.amazonaws.com" },
  "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
  "Resource": "arn:aws:sqs:ap-south-1:123:payments-queue",
  "Condition": { "ArnEquals": { "aws:SourceArn": "arn:aws:lambda:ap-south-1:123:function:Processor" } }
}
```

**EventBridge** — target ko invoke karne ke liye EventBridge ko role chahiye (ya target par resource policy):
```json
{
  "Effect": "Allow",
  "Principal": { "Service": "events.amazonaws.com" },
  "Action": "sqs:SendMessage",
  "Resource": "arn:aws:sqs:ap-south-1:123:payments-queue",
  "Condition": { "ArnEquals": { "aws:SourceArn": "arn:aws:events:ap-south-1:123:rule/PaymentRule" } }
}
```

Comparison tumhare experience se — **RabbitMQ/Bull** me tum queue-level users banate ho aur vhost permissions dete ho. SQS me equivalent queue policy hai, lekin fark ye hai ki SQS me **network-level access bhi IAM se hi control hota hai** (VPC endpoint policies). RabbitMQ me tum firewall alag se manage karte the.

> 💡 **Gotcha:** SQS ke liye Lambda **event source mapping** use karte waqt, permissions Lambda ke **execution role** par chahiye (`sqs:ReceiveMessage` etc.), queue policy par **nahi** — kyunki Lambda service tumhare execution role se poll karta hai, apne service principal se nahi. Ye ulta hai baaki triggers se (S3, SNS jahan resource policy chahiye). Ye asymmetry bahut confusion create karti hai. Rule: **poll-based** sources (SQS, Kinesis, DynamoDB Streams) → execution role. **Push-based** sources (S3, SNS, API GW, EventBridge) → function resource policy.

---

**Q64: Elasticsearch/OpenSearch ke saath IAM — self-hosted Elastic se kya fark?**

Tumhare self-hosted Elasticsearch me tum X-Pack security ya basic auth use karte the — `elastic` user, role mappings `elasticsearch.yml` me, aur network security alag (security groups/firewall).

**Amazon OpenSearch Service** me teen overlapping layers hain:

1. **IAM policy** (`es:ESHttpGet`, `es:ESHttpPost`, `es:ESHttpPut`, `es:ESHttpDelete`) — HTTP method level
2. **Domain access policy** (resource-based) — domain par kaun aa sakta hai
3. **Fine-Grained Access Control (FGAC)** — OpenSearch ke andar index/document/field-level roles (ye actually OpenSearch Security plugin hai)

```json
{
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::123:role/SearchClientRole" },
  "Action": "es:ESHttp*",
  "Resource": "arn:aws:es:ap-south-1:123:domain/jmfs-search/client-master/_search"
}
```

Note: resource ARN me **index name aur path** aa sakta hai — ye per-index control deta hai.

Requests ko **SigV4 se sign** karna padta hai (Q62 jaise). `@opensearch-project/opensearch` client ka AWS connection helper ye handle karta hai:
```typescript
import { Client } from "@opensearch-project/opensearch";
import { AwsSigv4Signer } from "@opensearch-project/opensearch/aws";
import { defaultProvider } from "@aws-sdk/credential-provider-node";

const client = new Client({
  ...AwsSigv4Signer({ region: "ap-south-1", service: "es",
                      getCredentials: () => defaultProvider()() }),
  node: "https://search-jmfs-search-abc.ap-south-1.es.amazonaws.com",
});
```

FGAC on hai to tumhe IAM role ko OpenSearch **backend role** se map bhi karna padta hai (Dashboards → Security → Roles → Mapped users → Backend roles → role ARN).

> 💡 **Gotcha:** FGAC enable karne par **do independent authorization systems** ho jaate hain jo dono pass hone chahiye. IAM allow kar de lekin FGAC me role mapping na ho → `security_exception: no permissions for [indices:data/read/search]`. Ye error IAM jaisa nahi dikhta, isliye log IAM debug karte rehte hain jabki problem OpenSearch ke andar hai. Debug karne ke liye pehle master user credentials se test karo — agar wo kaam kare to problem role mapping me hai, IAM me nahi.

---

**Q65: CDK/CloudFormation ke saath IAM ka relationship kya hai?**

Do alag identities involve hoti hain:

**1. Deployment identity** — jo `cdk deploy` chalata hai. CDK bootstrap ke baad ye actually chaar roles use karta hai:
- `cdk-hnb659fds-deploy-role-<account>-<region>` — CloudFormation ko orchestrate karta hai
- `cdk-hnb659fds-file-publishing-role-...` — assets S3 me daalta hai
- `cdk-hnb659fds-image-publishing-role-...` — Docker images ECR me
- `cdk-hnb659fds-lookup-role-...` — context lookups (VPC IDs, AMIs)

**2. `cdk-hnb659fds-cfn-exec-role-...`** — ye wo role hai jo **CloudFormation actually resources banane ke liye use karta hai**. Default bootstrap me isko `AdministratorAccess` milta hai.

Ye important hai: tumhare developer ke paas admin nahi hai, lekin CFN exec role ke paas hai. Isliye jo bhi `cdk deploy` kar sakta hai, wo effectively admin hai (PassRole escalation, Q39).

Production me isko lock karo:
```bash
cdk bootstrap aws://123456789012/ap-south-1 \
  --cloudformation-execution-policies "arn:aws:iam::123456789012:policy/CdkDeployBoundary" \
  --trust 999988887777    # CI account jo deploy karega
```

> 💡 **Gotcha:** CDK ka `grant*()` methods (`bucket.grantRead(fn)`, `table.grantWriteData(fn)`) least-privilege policies auto-generate karte hain — ye raw `addToPolicy()` se **kaafi better** hai kyunki CDK jaanta hai ki kaunse actions actually chahiye (including KMS permissions agar resource encrypted hai). Lekin `grantFullAccess()` se bacho, wo `*` deta hai. Aur `iam.PolicyStatement` me `resources: ['*']` likhne par `cdk synth` warning nahi deta — `cdk-nag` add karo pipeline me, wo pakad lega.

---

**Q66: Kyun IAM "default deny" hai, "default allow" nahi?**

Ye security ka sabse fundamental principle hai — **fail-safe defaults** (Saltzer & Schroeder, 1975).

Agar default allow hota:
- Har naya resource jo tum banate, wo turant accessible hota jab tak tum explicitly block na karo
- Naya AWS service launch hone par (AWS har saal 50+ launch karta hai) sabko automatically access mil jaata
- Ek missing policy = data breach. Ek extra policy = inconvenience.

Default deny me asymmetry sahi direction me hai: **galti ka result "kaam nahi kar raha" hai, na ki "data leak ho gaya"**. Pehla wala tum 10 minute me theek kar loge, doosra wala tumhari company ka regulatory filing ban jaayega.

Compare karo apne SQL Server experience se: wahan bhi default deny hi hai — naye login ko kuch nahi milta jab tak `GRANT` na ho. Fark ye hai ki SQL Server me `public` role hai jo sabko kuch default permissions deta hai (aur wo ek known security anti-pattern hai). IAM me `public` jaisa kuch nahi — koi implicit grant nahi.

> 💡 **Gotcha:** Ek exception jo log miss karte hain: **root user** default-deny se exempt hai. Root ke paas implicit `*:*` hai. Aur **resource-based policies** cross-account access de sakti hain **bina** tumhare account me kuch kiye — yaani koi doosra account tumhe apne bucket par access de sakta hai aur tumhe pata bhi nahi chalega. Ye "default deny" ka ek blind spot hai, aur isiliye `aws:ResourceOrgID` condition + RCPs banaye gaye.

---

**Q67: Explicit Deny ko override kyun nahi kiya ja sakta?**

Agar Deny override ho sakta to har security control theoretical ban jaata. Socho:

```
Security team: "PII bucket par sirf 3 roles access kar sakte hain" → Deny lagayi
Developer: apni identity par ek Allow policy attach karta hai
Result: Deny bekaar. Security control = suggestion.
```

Deny-wins hone se ek **monotonic guarantee** milti hai: tum ek policy dekh ke keh sakte ho "ye access **kabhi nahi** hoga", bina baaki 400 policies padhe. Ye property compliance aur formal verification ke liye essential hai — Access Analyzer ka automated reasoning isi property par based hai.

Cost: debugging mushkil ho jaati hai. Tum 20 Allow statements dekh ke confused rehte ho ki access kyun nahi mil raha, aur asli reason ek SCP me chhupa Deny hai. Isliye error messages me AWS ab batata hai ki Deny kahan se aayi (Q48).

Trade-off summary: **debuggability sacrifice ki gayi, guarantee ke liye.** Security me ye sahi trade-off hai.

> 💡 **Gotcha:** Iska practical implication: **Deny statements ko bahut soch-samajh ke likho**, kyunki unhe undo karna sirf unhe hatane se hi hota hai. Aur agar Deny ek SCP me hai jo management account se manage hoti hai, aur tumhare paas management account access nahi hai, to tum apne hi account me phanse ho. Kai enterprises me isse "SCP exception request" ka ticket process ban jaata hai jo hafton lagta hai.

---

**Q68: IAM eventually consistent kyun hai — strongly consistent kyun nahi bana sakte?**

Trade-off CAP theorem ka classic case hai.

**Agar IAM strongly consistent hota:** har S3 request ko us-east-1 me IAM se sync check karna padta. Iska matlab:
- Mumbai se S3 call → us-east-1 round trip → ~200ms extra latency **har request par**
- us-east-1 ka outage = **poore duniya me har AWS API call fail**
- IAM ko duniya ke har API call ka load handle karna padta — trillions per day

**Eventually consistent design me:**
- Policies har region me replicate hoti hain
- Evaluation **local** hoti hai, network call nahi
- us-east-1 down → naye roles nahi ban sakte, lekin **existing access chalti rehti hai**
- Latency ~0

Ye "availability over consistency" ka choice hai, aur authorization ke liye ye sahi hai: ek naye role ka 5 second late propagate hona acceptable hai, lekin poore AWS ka down hona nahi.

Ek nuance: **revocation bhi eventually consistent hai.** Agar tum ek policy hatate ho, wo propagate hone me kuch second lagenge. Aur agar tum ek role ki permissions hata do, to **already issued temporary credentials** ki permissions turant change ho jaati hain (kyunki evaluation har request par hoti hai) — lekin propagation delay tab bhi lagta hai. Immediate revocation ke liye AWS ne special mechanism diya hai:

```bash
# Role ki sab active sessions ko turant revoke karo
aws iam put-role-policy --role-name CompromisedRole \
  --policy-name RevokeOldSessions \
  --policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Deny","Action":"*","Resource":"*",
      "Condition":{"DateLessThan":{"aws:TokenIssueTime":"2026-08-06T10:30:00Z"}}
    }]
  }'
```
Ye statement kehta hai "is timestamp se pehle issue hue sab tokens deny". Console me ye "Revoke active sessions" button hai.

> 💡 **Gotcha:** Ye revoke-policy role par **permanently reh jaati hai** jab tak tum hatao nahi. Agar tum ise bhool gaye aur 6 mahine baad koi confused ho raha hai ki purane sessions kyun fail ho rahe hain — wo yahi hai. Incident ke baad cleanup checklist me isko daalo.

---

**Q69: `PassRole` concept exist hi kyun karta hai — AWS ise implicit kyun nahi bana sakta?**

Kyunki role pass karna ek **privilege delegation** hai, na ki ek normal resource operation.

Jab tum Lambda ko role dete ho, tum keh rahe ho: "ye code, jo main likh raha hoon, is role ki saari permissions ke saath chalega". Agar ye implicit hota, to `lambda:CreateFunction` permission ka matlab automatically "account ke kisi bhi role ki permissions le lo" ban jaata — yaani `lambda:CreateFunction` = `AdministratorAccess`.

`PassRole` ko alag permission banane se tum do axes par control kar sakte ho:
1. **Kaun** role pass kar sakta hai (`iam:PassRole` kis principal ke paas hai)
2. **Kaunsa** role, **kis service** ko (`Resource` ARN + `iam:PassedToService` condition)

Ye separation hi wo cheez hai jo "developers apne Lambda roles bana sakein" aur "developers admin na ban sakein" ko ek saath possible banati hai.

Analogy tumhari duniya se: ye SQL Server ke `WITH EXECUTE AS OWNER` vs `EXECUTE AS CALLER` jaisa hai. Stored procedure me `EXECUTE AS OWNER` likhne ka right alag se control hota hai, kyunki wo privilege escalation ka rasta hai.

> 💡 **Gotcha:** `iam:PassRole` **kabhi CloudTrail me alag event nahi banata** — wo parent operation (jaise `CreateFunction`) ke andar authorize hota hai. Isliye "kisne kaun sa role pass kiya" ka audit query likhna mushkil hai; tumhe `CreateFunction` events me `requestParameters.role` field dekhna padta hai. Har service me field ka naam alag hai. Ye audit tooling ke liye pain point hai.

---

**Q70: Permissions boundary aur SCP dono kyun hain — ek kaafi nahi tha?**

Alag layers, alag owners, alag lifecycles:

| | SCP | Permissions Boundary |
|---|---|---|
| Kaun manage karta hai | **Central security/cloud team** (Organizations access chahiye) | **Account admin / platform team** |
| Scope | Poora account/OU | Individual identity |
| Delegation ke liye | Nahi — bahut coarse | **Haan** — yahi iska primary use |
| Frequency of change | Rare (governance) | Frequent (har naya role) |

Asli scenario jo dono ki zaroorat batata hai:

```
Company-wide rule (SCP):     "ap-south-1 aur us-east-1 ke bahar kuch nahi"
                              → Cloud governance team, ek baar set
                              
Platform team rule (Boundary): "app developers apne Lambda roles bana sakte hain,
                                lekin wo roles sirf apne team ke tagged resources
                                access kar sakte hain aur IAM write nahi kar sakte"
                              → Platform team, har naye team onboarding par
```

Agar sirf SCP hoti to platform team ko har delegation ke liye governance team se ticket kaatna padta. Agar sirf boundary hoti to koi bhi account admin company-wide rules bypass kar leta.

> 💡 **Gotcha:** Ye dono ke saath ek teesri chize aa gayi hai — **RCP (Resource Control Policy)**. SCP principals par ceiling lagati hai, RCP **resources** par. Yaani "koi bhi mere org ke bahar ka principal mere S3 buckets access na kar sake" — ye SCP se nahi ho sakta (kyunki external principal tumhari SCP ke under nahi hai), RCP se hota hai. Agar tumhari compliance requirement "data exfiltration prevention" hai to RCP zaroori hai, SCP kaafi nahi.

---

**Q71: 12-ghante ka session maximum kyun — 24 ya 7 din kyun nahi?**

Ye pure risk-window calculation hai. Credential ki value attacker ke liye = us credential ki remaining lifetime.

- **15 minutes** (minimum) — high-security, per-operation credentials. Leak ho gaya to attacker ke paas 15 min hain.
- **1 hour** (default) — sensible balance. Typical API session, deployment, script run.
- **12 hours** (maximum) — ek working day ya ek lambi batch job. Isse zyada = permanent credential ka behaviour.

24 ghante ya 7 din kyun nahi: us point par temporary credentials ka **poora fayda hi khatam** ho jaata hai. Automatic expiry ka value ye hai ki compromise ka blast radius bounded hai. 7-din ka token practically permanent key hai jiska rotation tumne outsource kar diya hai.

**Role chaining ka 1-hour limit** isi logic ka extension hai: har hop par identity original se dur ho rahi hai, isliye re-validation zyada frequent honi chahiye.

Aur ek practical reason: 12 hours ek shift cover karta hai. Agar SOC analyst subah 9 baje login karta hai to shaam 9 baje tak uska session valid rahega — usse zyada me wo agli shift ke banda ka session bhi ban jaayega.

> 💡 **Gotcha:** Agar tumhara ETL job 14 ghante chalta hai to 12-hour max tumhe nahi bachayega. Solutions: (a) job ko chunks me todo aur har chunk fresh credentials le, (b) SDK ka auto-refreshing credential provider use karo jo internally re-assume karta rahe, ya (c) job ko role ke saath chalao (EC2/ECS/Lambda) jahan credential refresh platform handle karta hai. Option (c) hamesha best hai.

---

**Q72: AWS ne IAM users ko deprecate kyun nahi kiya agar wo itne bure hain?**

Backward compatibility. IAM users 2010 se hain aur duniya ke lakhs applications, scripts, aur third-party tools unpar depend karte hain. AWS ka strongest product promise hi ye hai ki purani cheezein todi nahi jaatin.

Lekin AWS ne har possible tareeke se signal diya hai:
- Console me IAM user banate waqt warnings aur "consider Identity Center instead" prompts
- Security Hub / Config rules jo access keys ko flag karti hain
- Access Analyzer unused access findings
- Documentation me har jagah "we recommend..."
- Identity Center ko free rakhna

Legitimate remaining use cases:
1. **Legacy third-party tools** jo sirf static access keys support karte hain (bahut se on-prem backup/monitoring tools)
2. **Emergency break-glass** jab federation hi down ho
3. **AWS partitions** (China) jahan Identity Center available nahi ya limited hai
4. **Programmatic access from environments** jahan na OIDC hai na X.509 PKI

Aur teesre point ke liye: agar tumhe access keys use karni hi hain, to kam se kam unhe Secrets Manager me rakho with automatic rotation, aur IP-restrict karo.

> 💡 **Gotcha:** Financial services context me — jahan tum kaam karte ho — regulators aksar "no shared credentials" aur "credential rotation evidence" maangte hain. IAM users ke saath tumhe rotation ka manual proof banana padta hai. Roles/Identity Center ke saath rotation **structurally impossible-to-skip** hai, aur ye audit me bahut easier defend karna hota hai. Ye compliance argument technical argument se zyada convincing hota hai management ke saamne.

---

**Q73: Resource-based policies har service me kyun nahi hain?**

Kyunki har service ka architecture alag hai aur resource policy ko enforce karna service ke data plane me changes maangta hai.

Jinme hain: S3, KMS, SQS, SNS, Lambda, Secrets Manager, ECR, EFS, API Gateway, EventBridge, CodeArtifact, Glue, OpenSearch, IAM roles (trust policy), aur ab DynamoDB (⚠️ verify availability in your region).

Jinme nahi hain: EC2, RDS, CloudWatch, Auto Scaling, aur bahut sare.

Pattern jo emerge hota hai: **resource policies un services me hain jahan cross-account sharing ek common, natural use case hai.** S3 bucket doosre account se padhna normal hai. EC2 instance doosre account se "access" karne ka matlab hi clear nahi hai — tum kya karoge, uspar SSH? Wo IAM ke domain me hai hi nahi.

Jin services me resource policy nahi hai, wahan cross-account access ke liye **role assumption** hi ek tareeka hai. Aur wo actually cleaner hai.

> 💡 **Gotcha:** Kuch services me "resource policy jaisi" cheez hai lekin naam alag hai aur behaviour bhi thoda alag: VPC endpoint policies, Organizations SCPs, S3 Access Point policies, Lake Formation permissions, ECR registry policies. Inko IAM resource policies samajh ke same evaluation logic assume mat karna — har ek ki apni evaluation quirks hain. Documentation padho, extrapolate mat karo.

---

**Q74: `aws:PrincipalOrgID` jaisi condition keys AWS ne baad me kyun add kiye?**

Kyunki original IAM design me **account** hi trust boundary tha, aur AWS Organizations 2017 me aaya. Jab enterprises 200-500 accounts run karne lage, to har policy me account IDs ki list maintain karna unmanageable ho gaya:

```json
"Principal": { "AWS": [
  "arn:aws:iam::111111111111:root",
  "arn:aws:iam::222222222222:root",
  ... 198 more ...
]}
```

Ye policy 6,144 character limit hit kar deti thi, aur har naye account par 200 policies update karni padti thi.

`aws:PrincipalOrgID` (2018) ne ise ek line me solve kiya:
```json
"Condition": { "StringEquals": { "aws:PrincipalOrgID": "o-a1b2c3d4e5" } }
```

Ye ek broader pattern ka example hai: **IAM ki condition keys AWS ke organizational maturity ke saath evolve hui hain.** Baad me aaye: `aws:PrincipalOrgPaths` (OU-level), `aws:ResourceOrgID`, `aws:ResourceAccount`, `aws:SourceOrgID`, `aws:PrincipalIsAWSService`, `aws:ViaAWSService`, `aws:CalledVia`. Har ek kisi real customer pain se aaya hai.

Sabak: jab bhi tumhe policy me "list of things" maintain karni pad rahi ho, ruko aur check karo ki AWS ne uske liye condition key to nahi bana di.

> 💡 **Gotcha:** `aws:PrincipalOrgID` **sirf tab kaam karta hai** jab requesting principal actually us org ka member ho aur request Organizations-aware ho. Anonymous requests aur kuch service principals me ye key present nahi hoti. Aur ye **`Principal` field ko replace nahi karta** — resource policy me tumhe abhi bhi `"Principal": "*"` likhna padta hai aur phir condition se restrict karna. Wo `"Principal": "*"` dekh ke security scanners panic karte hain, isliye documentation/comments zaroori hain.

---

**Q75: IAM policies ko version control aur CI/CD me kaise treat karte ho?**

IAM policies **code** hain, config nahi. Treat them like code:

**1. Policies infrastructure-as-code me rakho** (CDK/Terraform), console me manually mat banao. Console se banayi policy ka koi review trail nahi hota.

**2. CI me validate karo:**
```bash
# Grammar + best practice checks (FREE)
aws accessanalyzer validate-policy \
  --policy-type IDENTITY_POLICY \
  --policy-document file://policy.json

# Ye ERROR, SECURITY_WARNING, WARNING, SUGGESTION findings deta hai
```

**3. Check-no-new-access** — nayi policy purani se zyada permissive to nahi (PAID, ~$0.0020/request ⚠️ verify):
```bash
aws accessanalyzer check-no-new-access \
  --new-policy-document file://new.json \
  --existing-policy-document file://old.json \
  --policy-type IDENTITY_POLICY
```
Ye **automated reasoning** use karta hai — mathematically prove karta hai, test cases nahi chalata. Ye IAM tooling me AWS ka sabse under-used feature hai.

**4. `cdk-nag` ya `checkov`** pipeline me:
```typescript
import { AwsSolutionsChecks } from "cdk-nag";
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
```
Ye `IAM4` (AWS managed policy use), `IAM5` (wildcard permissions) jaise rules flag karta hai.

**5. Policy diff ko PR review me mandatory banao** — security team ka approval CODEOWNERS se enforce karo `iam/` directory par.

> 💡 **Gotcha:** Console me kiye gaye manual changes IaC ke saath **drift** create karte hain, aur agla `cdk deploy` unko silently revert kar dega — kabhi-kabhi production incident ke beech me. AWS Config ka `cloudformation-stack-drift-detection-check` rule laga do. Aur emergency me console se change karna pade to turant PR bhi banao, warna 3 hafte baad koi deploy karega aur tumhara fix gayab ho jaayega.

---

**Q76: Least privilege actually kaise achieve karte ho — theory nahi, process?**

Realistic process, jo actually kaam karta hai:

**Phase 1 — Broad start, monitored:**
Naye service ke liye pehle thodi broad policy do (jaise `s3:*` on specific bucket) lekin **CloudTrail on** rakho. Perfect policy pehle din likhne ki koshish mat karo — tum guess karoge aur galat karoge, aur team frustrate hogi.

**Phase 2 — Observe (2-4 weeks):**
```bash
# Access Advisor — kaun se services actually use hue
aws iam generate-service-last-accessed-details \
  --arn arn:aws:iam::123:role/PaymentRole
aws iam get-service-last-accessed-details --job-id <job-id>

# Action-level detail (supported services ke liye)
aws iam generate-service-last-accessed-details \
  --arn arn:aws:iam::123:role/PaymentRole --granularity ACTION_LEVEL
```

**Phase 3 — Policy generate karo CloudTrail se:**
```bash
aws accessanalyzer start-policy-generation \
  --policy-generation-details principalArn=arn:aws:iam::123:role/PaymentRole \
  --cloud-trail-details '{
    "trails":[{"cloudTrailArn":"arn:aws:cloudtrail:ap-south-1:123:trail/main",
               "allRegions":true}],
    "accessRole":"arn:aws:iam::123:role/AccessAnalyzerPolicyGenRole",
    "startTime":"2026-07-01T00:00:00Z"
  }'
aws accessanalyzer get-generated-policy --job-id <id>
```

**Phase 4 — Narrow, validate, deploy:**
Generated policy ko manually review karo (wo sirf observed actions deti hai — rare code paths miss ho sakte hain, jaise error handling ya quarterly batch jobs). `check-no-new-access` se verify karo. Staging me deploy karo, ek full business cycle chalao.

**Phase 5 — Continuous:**
Unused access analyzer on rakho. Har quarter findings review karo.

> 💡 **Gotcha:** Generated policies ka **sabse bada blind spot** wo code paths hain jo observation window me nahi chale — quarterly reports, disaster recovery scripts, error-handling branches, aur year-end batch jobs. Financial services me ye khaas problem hai. Isliye tracking period **kam se kam ek full business cycle** rakho, aur DR roles ko unused-access analysis se explicitly exclude karo (tag-based exclusion). Warna tum apne DR ko production incident ke din pata karoge ki wo toota hua hai.

---

**Q77: Multi-account strategy me IAM kaise design karte ho?**

Standard pattern (AWS Control Tower / Landing Zone se aligned):

```
                    ┌─────────────────────────┐
                    │   Management Account    │
                    │  (Organizations root)   │
                    │  - SCPs define hoti hain│
                    │  - KOI workload NAHI    │
                    └───────────┬─────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
  ┌─────▼──────┐      ┌─────────▼────────┐    ┌────────▼────────┐
  │ Security   │      │  Infrastructure  │    │   Workloads OU  │
  │    OU      │      │       OU         │    │                 │
  ├────────────┤      ├──────────────────┤    ├─────────────────┤
  │ Log Archive│      │ Shared Services  │    │ Dev  │ Stg │Prod│
  │ (CloudTrail│      │ (Identity Center,│    │      │     │    │
  │  central)  │      │  networking)     │    │      │     │    │
  │ Audit      │      │                  │    │      │     │    │
  │ (read-only │      │                  │    │      │     │    │
  │  everywhere)│     │                  │    │      │     │    │
  └────────────┘      └──────────────────┘    └─────────────────┘

  Human access:  Okta → Identity Center → permission sets → har account
  Machine access: har account me apne roles, cross-account jahan zaroori
  Guardrails:    SCPs per OU (Prod par sabse tight)
```

Key IAM decisions:
1. **Identity Center Shared Services ya Management account me** — ek hi jagah, sab accounts me federate
2. **Permission sets = job functions**, na ki per-person (`PlatformAdmin`, `ReadOnlyAuditor`, `PaymentsDeveloper`)
3. **SCPs OU level par**, account level par nahi — naye account automatically inherit karta hai
4. **Prod OU ki SCP me** — production data ke liye specific denies, region locks, IAM user creation ban
5. **Audit account ko har account me read-only role** milta hai (cross-account trust)
6. **CI/CD account** se deployment roles har workload account me, OIDC se

> 💡 **Gotcha:** Management account ko "just another account" mat samjho. Uspar SCPs nahi lagti, aur uske paas poori org ka control hai. Wahan **koi workload mat chalao**, koi developer ko access mat do, aur uska root credential physical safe me rakho with hardware MFA. Bahut companies apna pehla AWS account management account bana leti hain aur usme production chala deti hain — phir migrate karna extremely painful hai (accounts ko org me move kar sakte ho, lekin management account badalna practically impossible hai).

---

**Q78: IAM ka koi alternative hai kya, aur "IAM ke saath kya nahi karna chahiye"?**

IAM ka koi alternative nahi hai — AWS API access ke liye ye mandatory hai. Lekin **IAM ko galat problem par mat lagao**:

| Problem | IAM sahi tool hai? | Sahi tool |
|---|---|---|
| AWS API access control | ✅ Haan | IAM |
| Application ke andar user permissions (tumhare app ke customers) | ❌ Nahi | Cognito, Auth0, ya apna RBAC in DB |
| Database row/column level access | ❌ Nahi | DB ka apna GRANT / RLS |
| Kubernetes RBAC | ❌ Nahi | K8s RBAC (IAM sirf cluster access deta hai) |
| Network access control | ❌ Nahi | Security groups, NACLs |
| Encryption key management | ⚠️ Partial | KMS (IAM sirf access control deta hai) |
| API rate limiting per customer | ❌ Nahi | API Gateway usage plans |
| Employee directory | ❌ Nahi | Okta/Entra ID → Identity Center |

**Sabse common mistake:** log apne SaaS application ke end-users ke liye IAM users banane ki koshish karte hain. 5,000 users ki hard limit hai, IAM eventually consistent hai, aur IAM API me rate limits hain. Ye scale nahi karega. Application-level users application ke database me rehne chahiye; IAM sirf tumhare **infrastructure** ke liye hai.

**Doosri common mistake:** IAM ko network security ki jagah use karna. IAM identity-based hai, network-based nahi. "Sirf hamare office se access ho" ke liye `aws:SourceIp` hai lekin wo primary control nahi hona chahiye — VPC endpoints + security groups + PrivateLink use karo, aur IAM ko defense-in-depth layer ki tarah.

> 💡 **Gotcha:** Ek grey area — **multi-tenant SaaS jahan har tenant ka apna AWS account/data hai**. Yahan tum session policies aur tag-based isolation se IAM ko tenant isolation ke liye use kar sakte ho (Q21 dekho), aur ye legitimate pattern hai. Lekin tumhare **application ke** end users ke liye nahi. Line ye hai: agar entity AWS resources directly access kar rahi hai to IAM; agar wo tumhare app ke through jaa rahi hai to app-level authz.

---

## 6. Hands-On Lab

**Scenario:** Ek Node.js service (`report-generator`) EC2 par chalti hai aur usse ek S3 bucket ke `reports/` prefix se padhna hai. Hum ek role banayenge, uspar least-privilege policy lagayenge, EC2 se attach karenge, verify karenge, aur cleanup karenge.

Resources jo banayenge:
- S3 bucket: `jmfs-lab-reports-<random>`
- IAM policy: `LabReportReadPolicy`
- IAM role: `LabReportRole`
- Instance profile: `LabReportProfile`

---

### 6.1 AWS Console (clicks ke saath)

**Step 1 — S3 bucket banao**
1. Console → S3 → **Create bucket**
2. Bucket name: `jmfs-lab-reports-8x2k` (globally unique hona chahiye)
3. Region: **Asia Pacific (Mumbai) ap-south-1**
4. Block Public Access: **sab checkboxes ON rakho** (default)
5. **Create bucket**
6. Bucket kholo → **Create folder** → naam `reports` → Create
7. Us folder me koi test file upload kar do

**Step 2 — Policy banao**
1. Console → **IAM** → left nav → **Policies** → **Create policy**
2. Upar **JSON** tab par click karo
3. Ye paste karo (bucket name apna daalna):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListOnlyReportsPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::jmfs-lab-reports-8x2k",
      "Condition": {
        "StringLike": { "s3:prefix": ["reports/*", "reports"] }
      }
    },
    {
      "Sid": "ReadReportObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::jmfs-lab-reports-8x2k/reports/*"
    }
  ]
}
```
4. **Next** → yahan Access Analyzer ke validation findings dikhenge, padh lo
5. Policy name: `LabReportReadPolicy` → **Create policy**

**Step 3 — Role banao**
1. IAM → **Roles** → **Create role**
2. Trusted entity type: **AWS service**
3. Use case: **EC2** → **Next**
4. Permissions me `LabReportReadPolicy` search karke checkbox lagao → **Next**
5. Role name: `LabReportRole`
6. **Create role**

Console ne chupchaap ek instance profile bhi bana diya same naam se. Verify:
IAM → Roles → `LabReportRole` → **Summary** me "Instance profile ARNs" dikhega.

**Step 4 — EC2 se attach karo**
1. EC2 → Instances → apna instance select karo
2. **Actions** → **Security** → **Modify IAM role**
3. Dropdown se `LabReportRole` chuno → **Update IAM role**

Instance ko restart karne ki zaroorat **nahi** hai — IMDS turant naye credentials dene lagta hai (kuch seconds lag sakte hain).

**Step 5 — Verify (instance par SSH karke)**
```bash
aws sts get-caller-identity
# → "Arn": "arn:aws:sts::123456789012:assumed-role/LabReportRole/i-0abc123"

aws s3 ls s3://jmfs-lab-reports-8x2k/reports/     # ✅ chalega
aws s3 ls s3://jmfs-lab-reports-8x2k/             # ❌ AccessDenied (prefix condition)
aws s3 cp s3://jmfs-lab-reports-8x2k/reports/test.csv .   # ✅ chalega
aws s3 cp test.csv s3://jmfs-lab-reports-8x2k/reports/    # ❌ AccessDenied (no PutObject)
```

---

### 6.2 AWS CLI (actual commands)

```bash
set -euo pipefail
export AWS_REGION=ap-south-1
BUCKET="jmfs-lab-reports-$(openssl rand -hex 3)"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "Bucket: $BUCKET  Account: $ACCOUNT"

# ── 1. Bucket banao ────────────────────────────────────────────────
aws s3api create-bucket \
  --bucket "$BUCKET" \
  --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

echo "order_id,amount" > /tmp/test.csv
aws s3 cp /tmp/test.csv "s3://$BUCKET/reports/test.csv"

# ── 2. Trust policy file ───────────────────────────────────────────
cat > /tmp/trust-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Service": "ec2.amazonaws.com" },
    "Action": "sts:AssumeRole"
  }]
}
EOF

# ── 3. Permission policy file ──────────────────────────────────────
cat > /tmp/permission-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ListOnlyReportsPrefix",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::$BUCKET",
      "Condition": { "StringLike": { "s3:prefix": ["reports/*", "reports"] } }
    },
    {
      "Sid": "ReadReportObjects",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$BUCKET/reports/*"
    }
  ]
}
EOF

# ── 4. Policy ko validate karo DEPLOY SE PEHLE (free) ──────────────
aws accessanalyzer validate-policy \
  --policy-type IDENTITY_POLICY \
  --policy-document file:///tmp/permission-policy.json \
  --query 'findings[].{Type:findingType,Issue:issueCode,Detail:findingDetails}' \
  --output table

# ── 5. Policy create ───────────────────────────────────────────────
POLICY_ARN=$(aws iam create-policy \
  --policy-name LabReportReadPolicy \
  --policy-document file:///tmp/permission-policy.json \
  --description "Read-only access to reports/ prefix" \
  --query 'Policy.Arn' --output text)
echo "Policy: $POLICY_ARN"

# ── 6. Role create + attach ────────────────────────────────────────
aws iam create-role \
  --role-name LabReportRole \
  --assume-role-policy-document file:///tmp/trust-policy.json \
  --max-session-duration 3600 \
  --description "EC2 role for report-generator service" \
  --tags Key=Project,Value=lab Key=Owner,Value=shani

aws iam attach-role-policy \
  --role-name LabReportRole \
  --policy-arn "$POLICY_ARN"

# ── 7. Instance profile (EC2 ke liye zaroori) ──────────────────────
aws iam create-instance-profile --instance-profile-name LabReportProfile
aws iam add-role-to-instance-profile \
  --instance-profile-name LabReportProfile \
  --role-name LabReportRole

echo "Waiting for IAM propagation..."
sleep 15   # eventual consistency — Q44 dekho

# ── 8. EC2 se attach ───────────────────────────────────────────────
INSTANCE_ID="i-0abc123def456"   # apna instance ID daalo
aws ec2 associate-iam-instance-profile \
  --instance-id "$INSTANCE_ID" \
  --iam-instance-profile Name=LabReportProfile

# ── 9. Verify BINA deploy kiye — simulator ─────────────────────────
aws iam simulate-principal-policy \
  --policy-source-arn "arn:aws:iam::$ACCOUNT:role/LabReportRole" \
  --action-names s3:GetObject s3:PutObject s3:DeleteObject \
  --resource-arns "arn:aws:s3:::$BUCKET/reports/test.csv" \
  --query 'EvaluationResults[].{Action:EvalActionName,Decision:EvalDecision}' \
  --output table
# GetObject → allowed, PutObject → implicitDeny, DeleteObject → implicitDeny

# ── 10. Kya-kya ban gaya, dekho ────────────────────────────────────
aws iam get-role --role-name LabReportRole
aws iam list-attached-role-policies --role-name LabReportRole
aws iam list-role-policies --role-name LabReportRole   # inline (khaali hoga)
```

---

### 6.3 AWS CDK (TypeScript)

```bash
mkdir iam-lab && cd iam-lab
npx cdk init app --language typescript
npm install aws-cdk-lib constructs
npm install --save-dev cdk-nag
```

`lib/iam-lab-stack.ts`:
```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ec2 from "aws-cdk-lib/aws-ec2";

export class IamLabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── S3 bucket ──────────────────────────────────────────────
    const bucket = new s3.Bucket(this, "ReportsBucket", {
      bucketName: `jmfs-lab-reports-${this.account}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      enforceSSL: true,                       // Deny non-TLS bucket policy add karta hai
      removalPolicy: cdk.RemovalPolicy.DESTROY,  // sirf lab ke liye!
      autoDeleteObjects: true,                   // sirf lab ke liye!
    });

    // ── Role (instance profile CDK khud bana dega) ─────────────
    const role = new iam.Role(this, "LabReportRole", {
      roleName: "LabReportRole",
      assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
      description: "EC2 role for report-generator service",
      maxSessionDuration: cdk.Duration.hours(1),
    });

    // ── Least-privilege policy, manually likhi ─────────────────
    role.addToPolicy(new iam.PolicyStatement({
      sid: "ListOnlyReportsPrefix",
      effect: iam.Effect.ALLOW,
      actions: ["s3:ListBucket"],
      resources: [bucket.bucketArn],
      conditions: {
        StringLike: { "s3:prefix": ["reports/*", "reports"] },
      },
    }));

    role.addToPolicy(new iam.PolicyStatement({
      sid: "ReadReportObjects",
      effect: iam.Effect.ALLOW,
      actions: ["s3:GetObject"],
      resources: [bucket.arnForObjects("reports/*")],
    }));

    // Alternative — CDK ka grant helper (KMS permissions bhi khud add karta hai):
    //   bucket.grantRead(role, "reports/*");
    // Production me ye prefer karo — kam galtiyaan hoti hain.

    // ── EC2 instance ───────────────────────────────────────────
    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { isDefault: true });

    new ec2.Instance(this, "ReportInstance", {
      vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      role,                                   // instance profile auto-create hoga
      requireImdsv2: true,                    // ⚠️ ZAROORI — SSRF protection (Q46)
      userData: ec2.UserData.forLinux(),
    });

    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
    new cdk.CfnOutput(this, "RoleArn", { value: role.roleArn });
  }
}
```

`bin/iam-lab.ts` me cdk-nag add karo:
```typescript
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { IamLabStack } from "../lib/iam-lab-stack";

const app = new cdk.App();
new IamLabStack(app, "IamLabStack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "ap-south-1" },
});
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
```

Deploy:
```bash
npx cdk bootstrap aws://<ACCOUNT>/ap-south-1     # ek baar per account+region
npx cdk synth        # generated CloudFormation + cdk-nag warnings dekho
npx cdk diff
npx cdk deploy
```

`cdk synth` ke output me `IamLabStack.template.json` me dekh sakte ho ki CDK ne exactly kaunsi IAM policy generate ki — ye seekhne ke liye bahut useful hai.

---

### 6.4 Cleanup (warna bill aayega)

**CDK:**
```bash
npx cdk destroy
# Bucket bhi delete hoga kyunki removalPolicy DESTROY + autoDeleteObjects hai
```

**CLI (manual — order matter karta hai):**
```bash
# 1. EC2 se instance profile detach
ASSOC=$(aws ec2 describe-iam-instance-profile-associations \
  --filters Name=instance-id,Values=$INSTANCE_ID \
  --query 'IamInstanceProfileAssociations[0].AssociationId' --output text)
aws ec2 disassociate-iam-instance-profile --association-id "$ASSOC"

# 2. Instance profile se role hatao, phir profile delete
aws iam remove-role-from-instance-profile \
  --instance-profile-name LabReportProfile --role-name LabReportRole
aws iam delete-instance-profile --instance-profile-name LabReportProfile

# 3. Role se policy detach, phir role delete
aws iam detach-role-policy --role-name LabReportRole --policy-arn "$POLICY_ARN"
aws iam delete-role --role-name LabReportRole

# 4. Policy ke sab non-default versions delete karo, phir policy
for V in $(aws iam list-policy-versions --policy-arn "$POLICY_ARN" \
    --query 'Versions[?!IsDefaultVersion].VersionId' --output text); do
  aws iam delete-policy-version --policy-arn "$POLICY_ARN" --version-id "$V"
done
aws iam delete-policy --policy-arn "$POLICY_ARN"

# 5. Bucket khaali karo, phir delete
aws s3 rm "s3://$BUCKET" --recursive
aws s3api delete-bucket --bucket "$BUCKET"
```

**Cleanup order kyun matter karta hai:** IAM `DeleteConflict` error deta hai agar entity abhi bhi kahin attached hai. Order hamesha ye hai: **detach/disassociate → delete child → delete parent**.

---

## 7. Code Integration

### 7.1 Node.js / TypeScript (AWS SDK v3)

**Install:**
```bash
npm install @aws-sdk/client-sts @aws-sdk/client-s3 @aws-sdk/client-iam \
            @aws-sdk/credential-providers
```

**Pattern 1 — Default credential chain (99% cases me yahi use karo):**
```typescript
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

// Koi credentials specify NAHI karni. SDK ye order follow karta hai:
//   1. Explicit code me pass ki gayi credentials
//   2. Environment vars (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN)
//   3. SSO token (~/.aws/sso/cache)
//   4. Shared config/credentials file (~/.aws/credentials, AWS_PROFILE)
//   5. ECS/EKS container credentials endpoint
//   6. EC2 IMDSv2
const s3 = new S3Client({ region: "ap-south-1" });

export async function readReport(bucket: string, key: string): Promise<string> {
  const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  return await res.Body!.transformToString();
}
```

Ye code laptop par (SSO profile), EC2 par (instance role), Lambda par (execution role), aur EKS par (IRSA) — **bina kisi change ke** chalta hai. Yahi credential chain ka poora point hai.

**Pattern 2 — Cross-account role assume, auto-refresh ke saath:**
```typescript
import { fromTemporaryCredentials } from "@aws-sdk/credential-providers";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

// Ye provider automatically refresh karta hai jab credentials expire hone lagti hain.
// Static credentials object pass karne se ye nahi hota — ExpiredToken milega.
const credentials = fromTemporaryCredentials({
  params: {
    RoleArn: "arn:aws:iam::999988887777:role/CrossAccountReader",
    RoleSessionName: `report-svc-${process.env.HOSTNAME ?? "local"}`,
    DurationSeconds: 3600,
    ExternalId: process.env.EXTERNAL_ID,
  },
  clientConfig: { region: "ap-south-1" },
});

const ddb = new DynamoDBClient({ region: "ap-south-1", credentials });

export async function queryOrders(customerId: string) {
  return ddb.send(new QueryCommand({
    TableName: "Orders",
    KeyConditionExpression: "customerId = :c",
    ExpressionAttributeValues: { ":c": { S: customerId } },
  }));
}
```

**Pattern 3 — Multi-tenant with session policy + caching (production-grade):**
```typescript
import { STSClient, AssumeRoleCommand } from "@aws-sdk/client-sts";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import type { AwsCredentialIdentity } from "@smithy/types";

const sts = new STSClient({ region: "ap-south-1" });
const ROLE_ARN = "arn:aws:iam::123456789012:role/TenantDataRole";
const BUCKET = "jmfs-tenant-data";
const REFRESH_SKEW_MS = 5 * 60 * 1000;

interface CacheEntry { creds: AwsCredentialIdentity; expiresAt: number; }
const credCache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<AwsCredentialIdentity>>();

async function credentialsForTenant(tenantId: string): Promise<AwsCredentialIdentity> {
  const hit = credCache.get(tenantId);
  if (hit && hit.expiresAt - REFRESH_SKEW_MS > Date.now()) return hit.creds;

  // Thundering herd se bachne ke liye — ek hi AssumeRole in-flight rahe
  const pending = inflight.get(tenantId);
  if (pending) return pending;

  const p = (async () => {
    const sessionPolicy = {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "s3:ListBucket",
          Resource: `arn:aws:s3:::${BUCKET}`,
          Condition: { StringLike: { "s3:prefix": [`${tenantId}/*`] } },
        },
        {
          Effect: "Allow",
          Action: ["s3:GetObject", "s3:PutObject"],
          Resource: `arn:aws:s3:::${BUCKET}/${tenantId}/*`,
        },
      ],
    };

    const out = await sts.send(new AssumeRoleCommand({
      RoleArn: ROLE_ARN,
      RoleSessionName: `tenant-${tenantId}`.slice(0, 64),   // 64 char limit
      DurationSeconds: 3600,
      Policy: JSON.stringify(sessionPolicy),                // 2048 char limit!
      Tags: [{ Key: "TenantId", Value: tenantId }],
    }));

    if (out.PackedPolicySize && out.PackedPolicySize > 80) {
      console.warn(`Session policy ${out.PackedPolicySize}% of limit for ${tenantId}`);
    }

    const creds: AwsCredentialIdentity = {
      accessKeyId: out.Credentials!.AccessKeyId!,
      secretAccessKey: out.Credentials!.SecretAccessKey!,
      sessionToken: out.Credentials!.SessionToken!,
      expiration: out.Credentials!.Expiration!,
    };
    credCache.set(tenantId, { creds, expiresAt: out.Credentials!.Expiration!.getTime() });
    return creds;
  })().finally(() => inflight.delete(tenantId));

  inflight.set(tenantId, p);
  return p;
}

export async function listTenantFiles(tenantId: string) {
  const credentials = await credentialsForTenant(tenantId);
  const s3 = new S3Client({ region: "ap-south-1", credentials });
  const out = await s3.send(new ListObjectsV2Command({
    Bucket: BUCKET, Prefix: `${tenantId}/`,
  }));
  return out.Contents?.map(o => o.Key) ?? [];
}
```

**Pattern 4 — Error handling jo actually kaam karta hai:**
```typescript
import { S3ServiceException } from "@aws-sdk/client-s3";

const TRANSIENT = new Set([
  "ExpiredToken", "ExpiredTokenException", "TokenRefreshRequired",
  "ThrottlingException", "RequestLimitExceeded", "InvalidClientTokenId",
  "NoSuchEntity",   // IAM eventual consistency
]);

export async function withIamRetry<T>(fn: () => Promise<T>, maxTries = 5): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < maxTries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      const name = (err as any)?.name ?? "";

      if (name === "AccessDenied" || name === "AccessDeniedException") {
        // Ye retry karne se kabhi theek nahi hoga — policy ka issue hai
        const msg = (err as S3ServiceException).message;
        console.error("IAM authorization failure — policy fix chahiye:", msg);
        throw err;
      }
      if (!TRANSIENT.has(name) || attempt === maxTries - 1) throw err;

      const delay = Math.min(2 ** attempt * 200, 5000) + Math.random() * 200;
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw lastErr;
}
```

Key insight: **`AccessDenied` ko kabhi retry mat karo.** Wo transient nahi hai (except IAM propagation ke pehle 30 seconds me). Log blindly retry logic laga dete hain aur phir 5 retries × 100 requests/sec ka noise CloudTrail me bhar jaata hai.

**Pattern 5 — Kaun hoon main? (debugging helper):**
```typescript
import { STSClient, GetCallerIdentityCommand } from "@aws-sdk/client-sts";

export async function whoAmI() {
  const sts = new STSClient({});
  const id = await sts.send(new GetCallerIdentityCommand({}));
  console.log({
    account: id.Account,
    arn: id.Arn,          // assumed-role/X/session ya user/Y
    userId: id.UserId,    // AROA...:session ya AIDA...
  });
  return id;
}
```
Ye har service ke startup par ek baar chalao aur log karo. Jab production me `AccessDenied` aayega, pehla sawal hoga "app kaun bankar chal rahi thi" — ye log usi waqt answer de dega.

---

### 7.2 .NET Core (C#)

Tumhare primary stack ke liye — same concepts, alag SDK:

```bash
dotnet add package AWSSDK.SecurityToken
dotnet add package AWSSDK.S3
dotnet add package AWSSDK.Extensions.NETCore.Setup
```

**Default credential chain (Program.cs, DI ke saath):**
```csharp
using Amazon;
using Amazon.S3;
using Amazon.SecurityToken;

var builder = WebApplication.CreateBuilder(args);

// SDK khud credential chain resolve karega — env vars, profile,
// ECS container endpoint, EC2 IMDSv2 — Node wale order jaisa hi.
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
builder.Services.AddAWSService<IAmazonSecurityTokenService>();

var app = builder.Build();
```

`appsettings.json`:
```json
{ "AWS": { "Region": "ap-south-1" } }
```

**Cross-account AssumeRole with auto-refresh:**
```csharp
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.SecurityToken;

public sealed class CrossAccountS3Service
{
    private readonly IAmazonS3 _s3;

    public CrossAccountS3Service(string roleArn, string externalId)
    {
        // AssumeRoleAWSCredentials expiry se pehle KHUD refresh karta hai.
        // Ye Node ke fromTemporaryCredentials ka equivalent hai.
        var credentials = new AssumeRoleAWSCredentials(
            new EnvironmentVariablesAWSCredentials(),   // ya FallbackCredentialsFactory
            roleArn,
            $"report-svc-{Environment.MachineName}",
            new AssumeRoleAWSCredentialsOptions
            {
                ExternalId = externalId,
                DurationSeconds = 3600
            });

        _s3 = new AmazonS3Client(credentials, RegionEndpoint.APSouth1);
    }

    public async Task<string> ReadReportAsync(string bucket, string key, CancellationToken ct = default)
    {
        using var response = await _s3.GetObjectAsync(
            new GetObjectRequest { BucketName = bucket, Key = key }, ct);
        using var reader = new StreamReader(response.ResponseStream);
        return await reader.ReadToEndAsync(ct);
    }
}
```

**Error handling:**
```csharp
using Amazon.S3;
using Amazon.SecurityToken.Model;

try
{
    var content = await service.ReadReportAsync(bucket, key);
}
catch (AmazonS3Exception ex) when (ex.ErrorCode == "AccessDenied")
{
    // Policy problem — retry se theek nahi hoga
    logger.LogError(ex, "IAM authorization failed for {Bucket}/{Key}. " +
                        "Check role policy and bucket policy.", bucket, key);
    throw;
}
catch (ExpiredTokenException ex)
{
    // Credential refresh nahi hua — ye tab hota hai jab static creds use ki hon
    logger.LogWarning(ex, "Credentials expired — refreshing provider");
    throw;
}
```

**Who am I (debugging):**
```csharp
using Amazon.SecurityToken;
using Amazon.SecurityToken.Model;

var sts = new AmazonSecurityTokenServiceClient(RegionEndpoint.APSouth1);
var identity = await sts.GetCallerIdentityAsync(new GetCallerIdentityRequest());
logger.LogInformation("Running as {Arn} in account {Account}",
                      identity.Arn, identity.Account);
```

---

### 7.3 Go (agar relevant ho)

```go
package main

import (
	"context"
	"log"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials/stscreds"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/sts"
)

func main() {
	ctx := context.Background()

	// Default chain
	cfg, err := config.LoadDefaultConfig(ctx, config.WithRegion("ap-south-1"))
	if err != nil {
		log.Fatal(err)
	}

	// Cross-account assume with caching (aws.NewCredentialsCache zaroori hai —
	// bina uske har request par AssumeRole hoga aur tum 600 TPS limit hit karoge)
	stsClient := sts.NewFromConfig(cfg)
	provider := stscreds.NewAssumeRoleProvider(stsClient,
		"arn:aws:iam::999988887777:role/CrossAccountReader",
		func(o *stscreds.AssumeRoleOptions) {
			o.RoleSessionName = "report-svc-go"
			o.ExternalID = aws.String("jmfs-vendor-a7f3d91c")
		})
	cfg.Credentials = aws.NewCredentialsCache(provider)

	s3Client := s3.NewFromConfig(cfg)
	_ = s3Client
}
```

> **Go ka critical gotcha:** `stscreds.NewAssumeRoleProvider` **khud cache nahi karta**. `aws.NewCredentialsCache()` me wrap karna **mandatory** hai, warna har API call par ek AssumeRole hoga. High-throughput service me ye instant STS throttling hai. Node aur .NET ke providers ye internally karte hain, Go nahi.

---

## 8. Production Gotchas

Ye wo galtiyaan hain jo maine (aur baaki sabne) actually production me ki hain.

**1. `iam:PassRole` ko `Resource: "*"` ke saath dena**
Ye chhupa hua admin access hai (Q39). Har CI/CD role me ye galti milti hai kyunki "deployment ko sab roles pass karne padte hain". Nahi padte — path-based scoping karo: `arn:aws:iam::123:role/app/*` + `iam:PassedToService` condition.

**2. Cross-account me sirf ek side configure karna**
Trust policy laga di lekin caller ki identity policy me `sts:AssumeRole` nahi diya (ya ulta). Cross-account me **dono** chahiye. 40 minute ka debugging session guaranteed hai. Checklist: (a) target role ki trust policy, (b) source identity ki policy, (c) target resource ki resource policy agar direct access hai.

**3. `s3:ListBucket` aur `s3:GetObject` ke ARNs mix karna**
`ListBucket` bucket ARN par, `GetObject` object ARN (`/*`) par. Sabse common IAM galti, period. Symptom: `aws s3 cp` chalta hai, `aws s3 ls` fail hota hai (ya ulta).

**4. IMDSv1 chhod dena**
Har naye instance/launch template me `HttpTokens=required` set karo. Capital One breach isi ka result tha. CDK me `requireImdsv2: true`, Terraform me `metadata_options { http_tokens = "required" }`. Aur `http_put_response_hop_limit = 1` bhi, taaki containers IMDS na pahunch sakein.

**5. AWS managed policies ko production me use karna**
`AmazonS3FullAccess` = poore account ke saare buckets. AWS ise bina bataye expand kar sakta hai. Prototype tak theek, production me customer managed policies likho.

**6. Access keys ko git me commit karna**
Abhi bhi hota hai, har hafte. Prevention: `git-secrets` ya `gitleaks` pre-commit hook, GitHub secret scanning on, aur sabse important — **access keys banao hi mat**. Agar key nahi hai to leak nahi hogi.
```bash
brew install git-secrets && git secrets --install && git secrets --register-aws
```

**7. Session policy se permission "add" karne ki koshish**
Session policy sirf restrict karti hai (Q21). Role ke paas jo nahi hai wo session policy se nahi milega. Log ghanta lagate hain ye samajhne me.

**8. IAM eventual consistency ignore karna**
CI/CD me role bana ke turant use karna → flaky pipeline. Retry with exponential backoff lagao, ya CDK/CloudFormation use karo jo ye internally handle karta hai.

**9. Policy versions ka 5-limit CI me hit karna**
Har deploy par `create-policy-version` chalane wali script 5th deploy ke baad `LimitExceeded` degi. Purani versions delete karo ya IaC use karo.

**10. `aws:SourceIp` par IP allowlist lagana bina `aws:ViaAWSService` ke**
Tumhari apni automation (CloudFormation, Athena, Lambda-triggered actions) block ho jaayegi kyunki wo AWS ke IP se aati hai. Aur VPC endpoint enable karne par `aws:SourceIp` present hi nahi hota → sab kuch deny.

**11. MFA condition me `Bool` vs `BoolIfExists` galat use karna**
`Bool: aws:MultiFactorAuthPresent = true` with Allow → service roles (jinme ye key hi nahi hoti) block ho jaayenge. `BoolIfExists: false` with Deny → sahi pattern, lekin usme bhi service exceptions add karne padte hain. Staging me test karo.

**12. KMS key policy me `EnableIAMUserPermissions` statement bhool jaana**
Key permanently bricked. Sirf AWS Support recover kar sakta hai — aur woh bhi hamesha nahi. Har KMS key policy me root delegation statement rakho (Q50, Q53).

**13. Role naam ka 64-character limit console switch-role me**
Agar tum path use kar rahe ho (`/app/payments/`), to path + role name **milakar** 64 chars se kam hona chahiye console switch-role ke liye. Warna role banta hai lekin console se switch nahi hota.

**14. Break-glass access ka plan na hona**
Federation down, SSO down, ya tumne khud ko lock kar liya — phir kya? Har account me ek hardware-MFA-protected break-glass role, alerting ke saath. Aur usko quarterly test karo, warna incident ke din pata chalega ki wo bhi toota hua hai.

**15. Multi-region CloudTrail na banana**
IAM events us-east-1 me log hote hain (global service events). Single-region trail me tum apne IAM changes kabhi nahi dekhoge. Organization trail banao, multi-region, global service events **on**.

**16. Unused Access Analyzer ko har region me enable karna**
Roles/users global hain — ek analyzer kaafi hai. 5 regions me banaoge to 5× bill. Org-level analyzer banao, ek baar.

**17. IRSA/Pod Identity me `sub` condition ko wildcard karna**
`system:serviceaccount:*:*` = cluster ka koi bhi pod. Multi-tenant cluster ka isolation model khatam. `StringEquals` with exact namespace + SA name likho.

**18. GitHub Actions OIDC me `aud` claim check na karna**
Bina `aud` condition ke duniya ki koi bhi GitHub repo tumhara role assume kar sakti hai. Aur `sub` ko branch tak pin karo — `repo:org/*` se fork PR se attack possible hai.

**19. Root user par access keys chhod dena**
Agar root ke paas access keys hain to unhe **abhi delete karo**. Root ko API access ki zaroorat kabhi nahi hoti. Ye Security Hub ka critical finding hai aur bilkul sahi hai.

**20. Terraform/CDK state se IAM changes ka drift**
Console me emergency fix kiya, PR nahi banaya. Agla deploy usko revert kar dega — aksar production incident ke beech me. AWS Config drift detection laga do.

---

## 9. Cost Example

### Scenario

Ek mid-size fintech setup — tumhare JMFS wale context ke kareeb:

| Parameter | Value |
|---|---|
| AWS accounts (Organizations) | 5 (mgmt, log-archive, audit, prod, non-prod) |
| Human users (SSO se) | 60 engineers + 15 ops/audit |
| IAM roles (total, sab accounts) | 430 (jinme ~50 service-linked) |
| IAM users (legacy, ek CI tool ke liye) | 4 |
| Application end-users | 10,000 (ye AWS ke liye invisible hain — app DB me hain) |
| AWS API requests/month (management events) | ~1,200,000 |
| S3 data-plane operations/month | ~1,000,000 |
| Secrets in Secrets Manager | 20 |
| Customer-managed KMS keys | 5 |
| VPC interface endpoint for STS | 1 endpoint × 3 AZs |
| Region | ap-south-1 (Mumbai) |

### Line-by-line monthly bill

⚠️ Prices 6 Aug 2026 ke hain aur us-east-1/ap-south-1 ke published rates par based hain. Apne region ke liye AWS Pricing Calculator se verify karo — ap-south-1 me kuch rates thode alag hote hain.

| # | Line item | Calculation | Monthly cost |
|---|---|---|---|
| 1 | **IAM** — 430 roles, 4 users, ~180 policies, 12 groups | Free | **$0.00** |
| 2 | **STS** — ~4.5M AssumeRole calls | Free | **$0.00** |
| 3 | **IAM Identity Center** — 75 users, 14 permission sets | Free | **$0.00** |
| 4 | **Access Analyzer — external access** (5 accounts, 2 regions each) | Free | **$0.00** |
| 5 | **Access Analyzer — policy validation** (CI me ~200 calls/month) | Free | **$0.00** |
| 6 | **Access Analyzer — unused access** (org-level, 1 analyzer) | (430 − 50 SLR) roles + 4 users = 384 × $0.20 | **$76.80** |
| 7 | **Access Analyzer — custom policy checks** (CI, ~400 PR checks) | 400 × $0.0020 | **$0.80** |
| 8 | **CloudTrail — org trail, management events** | Pehla copy free | **$0.00** |
| 9 | **CloudTrail — S3 data events** (audit requirement) | 1,000,000 / 100,000 × $0.10 | **$1.00** |
| 10 | **CloudTrail — S3 storage** (logs, ~18 GB, 400-day retention avg 60 GB) | 60 GB × $0.025 | **$1.50** |
| 11 | **AWS Config — IAM compliance rules** (8 rules × 5 accounts, ~9,000 evaluations) | 9,000 × $0.001 | **$9.00** |
| 12 | **AWS Config — configuration items** (IAM resources change tracking, ~6,000 CIs) | 6,000 × $0.003 | **$18.00** |
| 13 | **VPC interface endpoint — STS** | 3 ENIs × $0.01/hr × 730 hrs | **$21.90** |
| 14 | **VPC endpoint — data processed** (~40 GB) | 40 × $0.01 | **$0.40** |
| 15 | **Secrets Manager** — 20 secrets | 20 × $0.40 | **$8.00** |
| 16 | **Secrets Manager** — API calls (~500k) | 500,000 / 10,000 × $0.05 | **$2.50** |
| 17 | **KMS** — 5 customer-managed keys | 5 × $1.00 | **$5.00** |
| 18 | **KMS** — requests (~2.5M) | 2,500,000 / 10,000 × $0.03 | **$7.50** |
| 19 | **Athena** — CloudTrail queries for audit (~30 GB scanned) | 30 GB × $5.00/TB | **$0.15** |
| | **TOTAL** | | **~$152.55/month** |

### Observations

**IAM khud ka bill $0 hai.** Poora $152 IAM ke **around** ki cheezon ka hai — observability, compliance, aur secrets. Ye pattern important hai: IAM free hai, lekin "IAM ko sahi tareeke se chalane" ka cost hai.

Sabse bade contributors:
1. **Unused Access Analyzer — $76.80 (50%)** — yahi biggest line item hai
2. **AWS Config — $27.00 (18%)**
3. **VPC endpoint — $22.30 (15%)**

### Cost optimization tips

**1. Unused Access Analyzer ke roles kam karo (savings: $20-40/month)**
430 roles me se bahut sare CDK/CloudFormation ke leftover honge. Purane stacks delete karo. Har delete kiya hua role = $0.20/month bacha, aur security posture bhi behtar.
```bash
# 180+ din se unused roles dhoondho
aws iam list-roles --query 'Roles[].RoleName' --output text | tr '\t' '\n' | \
while read R; do
  LAST=$(aws iam get-role --role-name "$R" \
    --query 'Role.RoleLastUsed.LastUsedDate' --output text 2>/dev/null)
  echo "$R -> ${LAST:-NEVER}"
done
```

**2. Tag-based exclusion (savings: $10-20/month)**
DR roles, break-glass roles, aur quarterly-batch roles ko analysis se exclude karo — wo intentionally idle hain aur unpar findings noise hi hain.
```bash
aws accessanalyzer update-analyzer --analyzer-name org-unused \
  --configuration '{"unusedAccess":{"unusedAccessAge":90,
    "analysisRule":{"exclusions":[{"resourceTags":[{"AnalyzerExclude":"true"}]}]}}}'
```

**3. Ek hi org-level analyzer rakho (savings: 5× tak)**
Agar galti se har account me ek analyzer hai to tum 5× pay kar rahe ho same roles ke liye. Ye sabse common Access Analyzer billing surprise hai.
```bash
aws accessanalyzer list-analyzers --type ACCOUNT_UNUSED_ACCESS   # har account me check karo
```

**4. VPC endpoint vs NAT gateway ka math karo (savings: $0-22/month)**
STS VPC endpoint = **$21.90/month** fixed (3 AZ). NAT gateway = **$0.045/hr = $32.85/month** + data. Agar tumhare paas NAT already hai kisi aur wajah se, to STS ke liye alag endpoint ka fayda sirf security/compliance hai, cost ka nahi. Agar sirf 2 AZ me chahiye to $14.60 — production HA requirement dekh ke decide karo.

**5. CloudTrail data events ko selective karo (savings: variable, bada ho sakta hai)**
Sab buckets par data events on karna mehnga hai. Sirf sensitive buckets par advanced event selectors lagao:
```bash
aws cloudtrail put-event-selectors --trail-name main-trail \
  --advanced-event-selectors '[{
    "Name":"PII buckets only",
    "FieldSelectors":[
      {"Field":"eventCategory","Equals":["Data"]},
      {"Field":"resources.type","Equals":["AWS::S3::Object"]},
      {"Field":"resources.ARN","StartsWith":["arn:aws:s3:::jmfs-client-pii/"]}
    ]}]'
```

**6. AWS Config recording ko scope karo (savings: $10-15/month)**
Config har resource type record kar raha hai? Sirf IAM + security-relevant types record karo, ya "periodic" recording mode use karo continuous ke bajaye.

**7. CloudTrail logs ko lifecycle policy do (savings: $1-5/month, scale par zyada)**
90 din baad Glacier Instant Retrieval, 1 saal baad Deep Archive. Compliance retention 7 saal hai to ye bahut bachata hai.

**Realistic optimized total: ~$95-110/month** — yaani ~30% savings bina kisi security compromise ke.

> 💡 Ek scale check: agar tumhara account 4,000 roles tak badhta hai (bade enterprise me normal hai), to sirf Unused Access Analyzer $800/month ho jaayega. Us point par tag-based exclusions optional nahi, mandatory hain.

---

## 10. Limits Cheat Sheet

### Adjustable quotas (Service Quotas se, auto-approved)

| Resource | Default | Maximum |
|---|---|---|
| Customer managed policies per account | 1,500 | 10,000 |
| Roles per account | 1,000 | 10,000 |
| Instance profiles per account | 1,000 | 10,000 |
| Groups per account | 300 | 500 |
| Managed policies attached per **role** | 10 | 25 |
| Managed policies attached per **user** | 10 | 20 |
| Managed policies attached per **group** | 10 | 10 |
| Role trust policy length | 2,048 chars | 8,192 chars |
| OIDC providers per account | 100 | 700 |
| Server certificates per account | 20 | 20 |
| STS requests/second (per account, per region) | 600 | Support ticket se |

> Quota increase **sirf us-east-1** se request kar sakte ho.

### Hard limits (badh nahi sakte)

| Cheez | Limit |
|---|---|
| **Users per account** | **5,000** |
| Access keys per user | 2 |
| Groups per user | 10 |
| MFA devices per user / root | 8 |
| Versions per managed policy | 5 |
| Managed policy document size | 6,144 chars (whitespace excluded) |
| Inline policy aggregate — **user** | 2,048 chars |
| Inline policy aggregate — **role** | 10,240 chars |
| Inline policy aggregate — **group** | 5,120 chars |
| Session policy (JSON + managed ARNs) | 2,048 chars |
| Managed policy ARNs per session | 10 |
| Session tags | 50 (key ≤128, value ≤256 chars) |
| Session duration | 900 – 43,200 sec (15 min – 12 hrs) |
| **Role chaining** session duration | 3,600 sec (1 hr) |
| Default session duration (agar specify na karo) | 3,600 sec |
| Console switch-role session | 1 hour |
| User name | 64 chars |
| Role name | 64 chars (path + name combined for console switch-role) |
| Role session name | 64 chars |
| Policy / group / instance profile name | 128 chars |
| Path | 512 chars |
| Account alias | 3–63 chars |
| Password length | 6–128 chars (policy me set) |
| External ID | 2–1,224 chars |
| SAML response (base64) | 100,000 chars |
| Tags per IAM resource | 50 |
| SAML providers per account | 100 ⚠️ verify |

### IAM Identity Center quotas

| Resource | Default | Adjustable |
|---|---|---|
| Permission sets | 3,500 | Haan |
| Provisioned permission sets per account | 500 | Haan |
| Inline policies per permission set | 1 | Nahi |
| Managed policies per permission set | 10 | Nahi (IAM role quota se bandha hua) |
| Inline policy size per permission set | 32,768 bytes (10,240 non-whitespace) | Nahi |
| Users in Identity Center | 200,000 | Haan |
| Groups | 100,000 | Haan |
| Groups evaluated per user | 1,000 | Nahi |
| Identity Center API throttle | 20 TPS collective | — |

### Kya check karna hai apne account me

```bash
# Account-wide IAM usage summary — sabse fast tareeka
aws iam get-account-summary

# Specific quotas
aws service-quotas list-service-quotas --service-code iam --region us-east-1 \
  --query 'Quotas[].{Name:QuotaName,Value:Value,Adjustable:Adjustable}' --output table

# Applied (badhaya hua) value dekho
aws service-quotas get-service-quota --service-code iam \
  --quota-code L-FE177D64 --region us-east-1     # Roles per account
```

---

## 11. Interview Questions

### Junior level (0–3 years)

**J1. IAM user aur IAM role me kya fark hai?**
User ke paas permanent credentials hoti hain (password, access keys) jo manually rotate karni padti hain. Role ke paas koi credentials nahi hoti — koi bhi entity use assume karke temporary credentials leti hai jo default 1 ghante me expire ho jaati hain. Roles preferred hain kyunki leaked credential ki lifetime bounded hai aur rotation ka concept hi khatam ho jaata hai. EC2, Lambda, ECS — sab roles use karte hain.

**J2. Policy me `Effect`, `Action`, `Resource` ka matlab kya hai?**
`Effect` batata hai Allow ya Deny. `Action` batata hai kaunsa AWS API call (jaise `s3:GetObject`). `Resource` batata hai kis cheez par, ARN format me. Teeno milkar ek rule banate hain. `Condition` optional chautha element hai jo extra checks lagata hai (IP, MFA, tags).

**J3. Agar ek policy me Allow hai aur doosri me Deny, to kya hoga?**
**Deny jeetega.** IAM me explicit Deny hamesha Allow ko override karta hai, chahe Deny kisi bhi policy me ho — identity policy, resource policy, SCP, ya boundary. Ye rule kabhi bypass nahi hota. Aur agar na Allow hai na Deny, to default **implicit deny** hai — matlab access nahi milega.

**J4. Root user ko use kyun nahi karte?**
Root ke paas unlimited permissions hain aur usko koi IAM policy rok nahi sakti. Uska credential leak hone ka matlab poora account gaya — billing, resources, doosre users, sab. Best practice: root par hardware MFA lagao, uski access keys delete kar do, password safe me rakho, aur sirf un 5-6 kaamon ke liye use karo jo sirf root kar sakta hai (account close karna, support plan badalna).

**J5. EC2 instance ko S3 access dene ka sahi tareeka kya hai?**
Instance par access keys **kabhi mat rakho**. Ek IAM role banao jiski trust policy `ec2.amazonaws.com` ko allow kare, usme least-privilege S3 policy lagao, aur us role ko instance profile ke through EC2 se attach karo. AWS SDK apne aap IMDSv2 se credentials le lega — code me kuch bhi configure nahi karna padega. Aur IMDSv2 ko `required` par set karo.

---

### Mid level (3–7 years)

**M1. Cross-account access kaise setup karte ho, aur kya-kya chahiye?**
Do tareeke hain. **Role assumption** (preferred): Account B me role banao jiski trust policy me Account A ka principal ho; Account A ki identity policy me `sts:AssumeRole` on that role ARN do. **Dono side** chahiye — ye AND hai. **Resource-based policy**: agar service support karta hai (S3, KMS, SQS), to resource par directly Account A ko allow karo — lekin phir bhi Account A ki identity policy me permission chahiye. Third-party vendor ke case me `sts:ExternalId` condition zaroori hai confused deputy se bachne ke liye.

**M2. `iam:PassRole` kya hai aur ye khatarnaak kyun hai?**
Jab tum kisi service ko role dete ho (Lambda execution role, EC2 instance profile), tum us role ki permissions us service ko de rahe ho — iske liye `iam:PassRole` chahiye. Khatarnaak isliye ki agar kisi ke paas `lambda:CreateFunction` + `iam:PassRole` with `Resource: "*"` hai, to wo ek Lambda bana sakta hai admin role ke saath aur uske through kuch bhi kar sakta hai. Fix: PassRole ko specific role ARNs tak scope karo aur `iam:PassedToService` condition lagao.

**M3. Permissions boundary aur SCP me kya fark hai?**
Dono ceiling lagate hain, kuch grant nahi karte. **Boundary** ek individual IAM user/role par lagti hai aur account admin manage karta hai — iska main use safe delegation hai (developers ko role banane do lekin admin na ban sakein). **SCP** poore account ya OU par lagti hai, AWS Organizations se manage hoti hai, aur root user par bhi lagti hai (member accounts me). SCP central governance ke liye, boundary local delegation ke liye. Service-linked roles SCPs se exempt hain, boundaries se nahi.

**M4. `AccessDenied` aaya production me — debug kaise karoge?**
Pehle error message ka **aakhri hissa** padho — AWS ab batata hai ki Deny kahan se aayi (identity policy, SCP, boundary, ya resource policy). Phir: `aws sts get-caller-identity` se confirm karo ki app kaun bankar chal rahi hai. `list-attached-role-policies` + `get-role` (boundary ke liye) se attached policies dekho. `simulate-principal-policy` se simulate karo. Cross-account hai to target resource ki policy check karo. Agar sab theek lag raha hai to SCP dekho — simulator SCPs account nahi karta. EC2 ka encoded message ho to `sts decode-authorization-message` chalao.

**M5. Session policy kya hai aur multi-tenant SaaS me kaise use karte ho?**
Session policy AssumeRole call ke waqt pass ki jaati hai aur us session par extra ceiling lagati hai — grant nahi kar sakti, sirf restrict. Multi-tenant pattern: ek broad role banao jiske paas poore bucket ka access ho, aur har tenant request par session policy pass karo jo access ko `tenant-{id}/*` prefix tak scope kar de. Isse tumhe per-tenant IAM role banane ki zaroorat nahi padti (jo 1,000-role quota me nahi samayega). Limits: policy 2,048 chars, 10 managed policy ARNs.

---

### Senior / Architect level (7+ years)

**S1. 200 AWS accounts ke liye IAM strategy design karo.**
Organizations me OU structure banao — Security OU (log archive + audit), Infrastructure OU (shared services, networking), Workloads OU (dev/staging/prod separate). Human access sirf **IAM Identity Center** se, corporate IdP se SAML/SCIM federation, permission sets job-function-wise define karo (per-person nahi). SCPs **OU level** par lagao taaki naye accounts inherit karein — prod OU par sabse tight. Machine access ke liye har account me apne roles; CI/CD ke liye OIDC federation (koi static keys nahi). Cross-account access ke liye role assumption, resource policies sirf jahan zaroori. Har account me ek break-glass role hardware MFA ke saath, CloudTrail alerting ke saath. Sab IaC me — console me manual changes ban. Access Analyzer org-level enable, ek hi analyzer.

**Follow-up jo aksar poocha jaata hai:** "Naya account onboard karne me kitna time?" Answer: Control Tower Account Factory se ~30 min, kyunki SCPs OU se inherit hoti hain, Identity Center permission sets auto-provision hote hain, aur baseline roles CDK/StackSets se deploy hote hain. Manual kaam sirf workload-specific roles ka.

**S2. Least privilege actually kaise achieve karoge ek 200-role estate me — theoretically nahi, process batao.**
Perfect policy day-1 par likhne ki koshish mat karo — wo fail hoti hai. Process: (1) broad-but-scoped policy se start karo with CloudTrail on; (2) 2-4 weeks observe karo — ek **full business cycle** cover hona chahiye (quarterly jobs, month-end batches); (3) Access Analyzer ka `start-policy-generation` CloudTrail history se policy generate karta hai; (4) generated policy ko manually review karo — wo rare code paths (error handling, DR) miss karti hai; (5) `check-no-new-access` se prove karo ki nayi policy purani se zyada permissive nahi; (6) staging me deploy, full cycle chalao, phir prod; (7) unused access analyzer continuously on, quarterly review. Scale ke liye **ABAC** par shift karo — tag-based policies jo naye resources ke saath automatically kaam karti hain, plus strict tag governance (kaun tag laga sakta hai).

**S3. `aws:MultiFactorAuthPresent` par MFA enforce karne wali policy likhi, aur production automation toot gayi. Kyun aur kya karoge?**
Kyunki AWS service principals aur assumed-role sessions ke requests me ye key **present hi nahi hoti**. Agar tumne `Bool` (bina IfExists) with `Allow` use kiya, to jo requests me key nahi hai wo condition fail karke implicit deny me chali gayi. Fix karne ka tareeka: `BoolIfExists` use karo `Deny` ke saath (`"BoolIfExists": {"aws:MultiFactorAuthPresent": "false"}`), aur usme bhi service roles ko explicitly exclude karo — jaise `"Condition": {"StringNotLike": {"aws:PrincipalArn": "arn:aws:iam::*:role/service-*"}}`. Deeper answer: ye policy sirf **IAM users** par lagni chahiye thi, roles par nahi. MFA human authentication ka concept hai; machine identities ke liye MFA ka koi meaning nahi. Design galti ye thi ki policy ko principal type ke hisaab se scope nahi kiya.

**S4. IAM eventually consistent hai — ye distributed systems ka kaunsa trade-off hai aur iska production impact kya hai?**
Ye CAP theorem me **availability over consistency** ka choice hai. Agar IAM strongly consistent hota to har API call ko us-east-1 me control plane se sync validate karna padta — ~200ms latency har request par, aur us-east-1 outage = global AWS outage. Isliye policies har region me replicate hoti hain aur evaluation **local** hoti hai. Impact: create-then-immediately-use patterns flaky hote hain (`NoSuchEntity`, `InvalidParameterValueException`, spurious `AccessDenied`), isliye CI/CD me exponential backoff retry chahiye ya IaC use karo jo ye handle karta hai. Revocation bhi eventual hai — immediate revocation ke liye `aws:TokenIssueTime` condition wali deny policy use karni padti hai (console ka "Revoke active sessions"). Aur us-east-1 outage me existing access chalti rehti hai lekin naye roles nahi ban sakte — DR plan me ye assume karna zaroori hai.

**S5. Ek engineer ne accidentally KMS key policy se sabko deny kar diya. Kya karoge, aur ye kaise rokte?**
Agar key policy me koi bhi principal `kms:PutKeyPolicy` nahi kar sakta, to key **permanently unusable** hai — root user bhi recover nahi kar sakta. Sirf AWS Support ka manual escalation process hai, aur wo guaranteed nahi. Us key se encrypted data effectively lost hai. Prevention: (1) har key policy me `EnableIAMUserPermissions` statement mandatory rakho jo account root ko `kms:*` deta hai; (2) key policies ko IaC me rakho with mandatory review; (3) `cdk-nag`/`checkov` me custom rule jo root-delegation statement ki absence par fail kare; (4) SCP se `kms:PutKeyPolicy` ko sirf ek dedicated key-admin role tak restrict karo. Broader architectural lesson: KMS baaki services se **alag evaluation model** follow karta hai — key policy hi authoritative hai, IAM policy sirf tab kaam karti hai jab key policy explicitly delegate kare. Team ko ye specifically train karna padta hai kyunki wo IAM ka normal mental model apply karke galti karte hain.

---

## 12. Commands Cheat Sheet

### Identity aur debugging (sabse zyada use hone wale)
```bash
aws sts get-caller-identity                     # main kaun hoon? #1 command
aws sts assume-role --role-arn arn:... --role-session-name shani@jmfs
aws sts decode-authorization-message --encoded-message "<blob>" \
    --query DecodedMessage --output text | jq .
aws iam get-account-summary                     # sab quotas ka usage ek nazar me
aws iam get-account-authorization-details > iam-dump.json   # poora IAM export
```

### Roles
```bash
aws iam list-roles --query 'Roles[].RoleName' --output text
aws iam get-role --role-name X                  # trust policy + boundary + last used
aws iam list-attached-role-policies --role-name X
aws iam list-role-policies --role-name X        # inline policies
aws iam get-role-policy --role-name X --policy-name Y

aws iam create-role --role-name X --assume-role-policy-document file://trust.json
aws iam update-assume-role-policy --role-name X --policy-document file://trust.json
aws iam update-role --role-name X --max-session-duration 14400
aws iam attach-role-policy --role-name X --policy-arn arn:...
aws iam detach-role-policy --role-name X --policy-arn arn:...
aws iam put-role-policy --role-name X --policy-name Y --policy-document file://p.json
aws iam delete-role --role-name X               # pehle sab detach karo
```

### Policies
```bash
aws iam list-policies --scope Local --query 'Policies[].{N:PolicyName,A:Arn}' --output table
aws iam get-policy --policy-arn arn:...         # default version ID batata hai
aws iam get-policy-version --policy-arn arn:... --version-id v3
aws iam list-policy-versions --policy-arn arn:...

aws iam create-policy --policy-name X --policy-document file://p.json
aws iam create-policy-version --policy-arn arn:... \
    --policy-document file://p.json --set-as-default
aws iam set-policy-version --policy-arn arn:... --version-id v2    # ROLLBACK
aws iam delete-policy-version --policy-arn arn:... --version-id v1
aws iam list-entities-for-policy --policy-arn arn:...   # kaun-kaun use kar raha hai
```

### Users, groups, keys
```bash
aws iam list-users
aws iam list-groups-for-user --user-name shani
aws iam list-access-keys --user-name shani
aws iam get-access-key-last-used --access-key-id AKIA...
aws iam create-access-key --user-name shani
aws iam update-access-key --user-name shani --access-key-id AKIA... --status Inactive
aws iam delete-access-key --user-name shani --access-key-id AKIA...
aws iam list-mfa-devices --user-name shani
aws iam get-account-password-policy
```

### Simulation aur validation (deploy se pehle chalao)
```bash
# Kya ye principal ye action kar sakta hai?
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123:role/X \
  --action-names s3:GetObject s3:PutObject \
  --resource-arns arn:aws:s3:::bucket/key

# Policy grammar + best practices (FREE)
aws accessanalyzer validate-policy \
  --policy-type IDENTITY_POLICY --policy-document file://p.json

# Nayi policy purani se zyada permissive to nahi? (PAID, automated reasoning)
aws accessanalyzer check-no-new-access \
  --new-policy-document file://new.json \
  --existing-policy-document file://old.json \
  --policy-type IDENTITY_POLICY
```

### Audit aur least-privilege
```bash
# Credential report — sab users, keys, MFA, last-used (CSV)
aws iam generate-credential-report
aws iam get-credential-report --query Content --output text | base64 -d > report.csv

# Access Advisor — kaunse services actually use hue
JOB=$(aws iam generate-service-last-accessed-details \
  --arn arn:aws:iam::123:role/X --query JobId --output text)
aws iam get-service-last-accessed-details --job-id "$JOB"

# Action-level granularity
aws iam generate-service-last-accessed-details \
  --arn arn:aws:iam::123:role/X --granularity ACTION_LEVEL

# Access Analyzer findings
aws accessanalyzer list-analyzers
aws accessanalyzer list-findings --analyzer-arn arn:... \
  --filter '{"status":{"eq":["ACTIVE"]}}'

# CloudTrail se policy generate karo
aws accessanalyzer start-policy-generation \
  --policy-generation-details principalArn=arn:aws:iam::123:role/X \
  --cloud-trail-details file://trail-details.json
```

### Quotas
```bash
aws service-quotas list-service-quotas --service-code iam --region us-east-1 \
  --query 'Quotas[].{Name:QuotaName,Value:Value,Adj:Adjustable}' --output table
aws service-quotas request-service-quota-increase --service-code iam \
  --quota-code L-0DA4ABF3 --desired-value 25 --region us-east-1
```

### Emergency
```bash
# Role ki SAB active sessions turant revoke karo
aws iam put-role-policy --role-name CompromisedRole \
  --policy-name RevokeOldSessions \
  --policy-document '{"Version":"2012-10-17","Statement":[{
    "Effect":"Deny","Action":"*","Resource":"*",
    "Condition":{"DateLessThan":{"aws:TokenIssueTime":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"}}}]}'

# Ek key ko turant band karo
aws iam update-access-key --user-name X --access-key-id AKIA... --status Inactive

# Kya kisi ne kuch tod-fod ki? (CloudTrail)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=AttachRolePolicy \
  --start-time "$(date -u -d '24 hours ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --query 'Events[].{Time:EventTime,User:Username,Res:Resources[0].ResourceName}' \
  --output table
```

### Handy one-liners
```bash
# 90 din se unused roles
aws iam list-roles --query 'Roles[].RoleName' --output text | tr '\t' '\n' | \
while read R; do
  L=$(aws iam get-role --role-name "$R" --query 'Role.RoleLastUsed.LastUsedDate' --output text)
  echo "${L:-NEVER}  $R"
done | sort

# Wildcard permissions wali policies dhoondho
aws iam list-policies --scope Local --query 'Policies[].Arn' --output text | tr '\t' '\n' | \
while read A; do
  V=$(aws iam get-policy --policy-arn "$A" --query 'Policy.DefaultVersionId' --output text)
  aws iam get-policy-version --policy-arn "$A" --version-id "$V" \
    --query 'PolicyVersion.Document' | grep -q '"\*"' && echo "WILDCARD: $A"
done

# Kaun-kaun se roles ke paas iam:PassRole with * hai
aws iam get-account-authorization-details --filter Role \
  | jq -r '.RoleDetailList[] | select(
      (.AttachedManagedPolicies[]?.PolicyName == "AdministratorAccess") or
      (.RolePolicyList[]?.PolicyDocument.Statement[]? |
        select(.Action == "iam:PassRole" and .Resource == "*"))
    ) | .RoleName'
```

---

## 13. Kab NAHI Use Karna

### IAM khud "use na karne" ka option nahi hai
AWS API access ke liye IAM mandatory hai. Sawal ye nahi hai ki IAM use karna ya nahi — sawal ye hai ki **kaunsi IAM feature** kahan use karni hai, aur kahan IAM **galat layer** hai.

### ❌ IAM users — jab federation possible hai

| Kab avoid karo | Kya use karo |
|---|---|
| Human access, koi bhi scenario | **IAM Identity Center** + corporate IdP |
| CI/CD pipelines (GitHub, GitLab, CircleCI) | **OIDC federation** — zero stored credentials |
| AWS ke andar ka koi bhi workload | **IAM roles** (instance profile, execution role, IRSA/Pod Identity) |
| On-prem servers | **IAM Roles Anywhere** (X.509) |
| Mobile/web app end-users | **Cognito Identity Pools** |

IAM users ke legitimate use cases 2026 me sirf: legacy third-party tools jo sirf static keys support karte hain, break-glass jab federation down ho, aur kuch AWS partitions (China) jahan Identity Center limited hai.

**Trade-off:** Identity Center setup ka upfront cost hai (IdP integration, permission set design) — chhote setups me 2-3 din. IAM user banane me 2 minute lagte hain. Ye trade-off tumhe pehle 3 mahine me sasta lagega aur uske baad mehnga.

### ❌ IAM — application-level authorization ke liye

| Problem | IAM galat kyun | Sahi tool |
|---|---|---|
| Tumhare SaaS ke 10,000 customers ke permissions | 5,000 users ki hard limit; eventually consistent; API rate limits | App DB me RBAC, ya Cognito |
| "Ye user sirf apne orders dekh sakta hai" | IAM ko tumhare business objects ka pata nahi | App-level authz (Casbin, Oso, ya custom middleware) |
| Feature flags / entitlements | IAM permissions AWS API ke liye hain | LaunchDarkly, ya apna config |
| Multi-tenant data isolation **app ke andar** | Per-tenant IAM role scale nahi karega | Row-level security, ya session policies (agar tenant AWS resources directly access kar raha ho) |

**Line kahan hai:** agar entity **AWS API** call kar rahi hai → IAM. Agar wo tumhare app ke through jaa rahi hai → app-level authz.

### ❌ IAM — network security ki jagah

`aws:SourceIp` exists karta hai, lekin ye primary network control nahi hona chahiye:
- NAT gateway ke peeche sab instances ka same IP dikhega — koi granularity nahi
- VPC endpoint use karne par ye key present hi nahi hoti
- AWS services tumhare behalf par call karein to unka IP dikhega
- IPv6 migration par tumhari policies silently tootengi

**Sahi tool:** Security groups, NACLs, VPC endpoints + endpoint policies, PrivateLink. IAM ko **defense in depth ki ek layer** ki tarah use karo, primary control ki tarah nahi.

### ❌ Fine-grained data access ke liye

| Requirement | IAM se? | Sahi tool |
|---|---|---|
| S3 object-level ACL har object par alag | ❌ Policy size limit hit hogi | S3 Access Points, ya prefix-based design |
| Database row/column level | ❌ IAM ko DB ke andar ka pata nahi | DB RLS (Postgres), ya Lake Formation (analytics ke liye) |
| Data lake me table/column permissions | ⚠️ Sirf coarse | **AWS Lake Formation** |
| Per-document permissions search index me | ❌ | OpenSearch FGAC + document-level security |

### ✅ Alternatives ka comparison

| Need | Option A | Option B | Kab kaunsa |
|---|---|---|---|
| Human AWS access | IAM users | **Identity Center** | Identity Center hamesha, jab tak IdP na ho hi na |
| CI/CD credentials | IAM user + keys | **OIDC federation** | OIDC hamesha jab CI provider support kare |
| On-prem to AWS | IAM user + keys | **Roles Anywhere** | Roles Anywhere agar PKI hai; warna keys + Secrets Manager + IP restriction |
| Cross-account | Resource policy | **Role assumption** | Role assumption default; resource policy jab access bahut narrow ho |
| Multi-tenant isolation | Per-tenant IAM role | **Session policies** | Session policies (1,000-role quota se bachne ke liye) |
| Scaling permissions | Per-resource policies (RBAC) | **ABAC (tags)** | ABAC jab resources tezi se badh rahe hon; RBAC jab set stable ho |
| K8s workload identity | IRSA | **EKS Pod Identity** | Naye clusters me Pod Identity; IRSA jab cross-account edge cases hon |
| Secrets storage | Parameter Store | **Secrets Manager** | Secrets Manager jab rotation chahiye; Parameter Store jab free chahiye aur rotation manual theek hai |

### Ek honest trade-off jo log nahi batate

**ABAC (tag-based) vs RBAC (explicit resources):**
ABAC scale par jeetta hai — ek policy hazaaron resources cover karti hai, naye resources automatically covered. Lekin ABAC ka **debugging bahut mushkil** hai: "ye role ye resource kyun access kar sakta hai?" ka jawab dene ke liye tumhe principal ke tags, resource ke tags, aur condition logic teeno trace karne padte hain. Aur agar tag governance kamzor hai to ABAC **security theatre** hai — koi apni resource par galat tag lagayega aur access mil jaayega.

**Practical recommendation:** high-sensitivity resources (PII, financial data) par **explicit RBAC** rakho — ARNs likho, wildcards se bacho. Bulk/low-sensitivity resources par ABAC use karo. Poore estate par ek hi model force mat karo.

---

## Quick Reference — Ye 10 Cheezein Yaad Rakho

1. **Explicit Deny > Allow > implicit deny.** Hamesha. Koi exception nahi.
2. **Same account: identity policy YA resource policy. Cross account: DONO.**
3. **`s3:ListBucket` bucket ARN par, `s3:GetObject` object ARN (`/*`) par.**
4. **`iam:PassRole` with `Resource: "*"` = chhupa hua admin access.**
5. **IAM eventually consistent hai — create-then-use me retry lagao.**
6. **Session policy sirf restrict karti hai, grant nahi.**
7. **KMS key policy alag hai — usme root delegation statement hamesha rakho.**
8. **IMDSv2 required karo, hop limit 1.**
9. **IAM free hai; paisa CloudTrail, Config, Access Analyzer unused, aur VPC endpoints ka lagta hai.**
10. **`aws sts get-caller-identity` — debugging ka pehla command, hamesha.**
