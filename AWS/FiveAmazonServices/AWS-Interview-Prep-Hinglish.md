# AWS Interview Preparation — Route 53, CloudFront, S3, Lambda, SES
### Ek complete Hinglish deep-dive guide (fresher se 2 saal experience wale candidates ke liye)

---

## Is document ko kaise use karna hai

Bhai, sabse pehle ek baat clear kar leta hoon. Interviewer ko fark nahi padta ki tune AWS console me kitne buttons dabaye. Usko ye dekhna hai ki **tujhe pata hai ki tune wo button kyun dabaya**. Isliye is document me har jagah "what" ke saath "why" bhi likha hai — aur wahi cheez tujhe bolni hai.

Padhne ka order:

| Kab | Kya padho |
|-----|-----------|
| Interview se 1 hafta pehle | Poora document, section by section |
| Interview se 2 din pehle | Sirf Section I (Q&A) har service ka + Section 13 (cross-service scenarios) |
| Interview se 30 min pehle | Section 14 (Rapid-fire revision sheet) + Section 15 (Red flags) |
| Interview me | Section 11 ka pitch script |

Ek golden rule: **agar kisi cheez ka answer nahi pata, to guess mat maar.** Bol de — "Sir, isko maine apne project me use nahi kiya, but mera understanding ye hai ki..." Ye honesty interviewer ko impress karti hai. Confidently galat bolna sabse bada red flag hai.

---
---

# 1. Amazon Route 53

---

## A. Simple Explanation

### Service kya hai

Route 53 AWS ka **DNS (Domain Name System) service** hai. Iska basic kaam ye hai ki jab koi user browser me `www.myproject.com` type kare, to Route 53 usko batata hai ki "bhai iska actual IP address ye hai — `52.x.x.x`" ya "ye CloudFront distribution pe jao".

Iske teen main kaam hain:

1. **Domain registration** — domain kharidna (jaise `myproject.com`)
2. **DNS hosting / routing** — domain ko IP ya AWS resource se map karna
3. **Health checking** — endpoint zinda hai ya nahi, ye monitor karna aur us hisaab se traffic route karna

Naam "53" isliye hai kyunki **DNS port 53 pe chalta hai**. (Ye ek chhota sa trivia hai, interviewer kabhi kabhi pooch leta hai, aur isse lagta hai ki tu curious banda hai.)

### Real-world analogy (interview me ye bolna)

> "Sir, Route 53 basically internet ka **phone directory / contact list** hai. Aapko apne dost ka phone number yaad nahi rehta, aap contact list me naam dhoondte ho aur phone number nikal aata hai. Waise hi computer ko `myproject.com` samajh nahi aata — usko IP address chahiye. Route 53 wahi translation karta hai. Aur ek normal phone book se ek step aage ye hai ki Route 53 **smart** hai — wo dekh sakta hai ki aap kahan se call kar rahe ho, kaunsa server zinda hai, aur us hisaab se best number de sakta hai."

---

## B. Why It Exists / Problem It Solves

Route 53 (ya generally DNS) ke bina kya problem hoti?

**Problem 1 — Insaan IP address yaad nahi rakh sakta.**
`142.250.192.46` yaad rakhna vs `google.com` yaad rakhna. Simple.

**Problem 2 — IP address badalte rehte hain.**
Agar aapne server change kiya, EC2 restart kiya, ya load balancer naya banaya — IP change ho jayega. Agar users ne IP bookmark kiya hota to sab toot jaata. DNS ek **indirection layer** deta hai — IP badlo, DNS record update karo, user ko pata bhi nahi chalega.

**Problem 3 — Ek hi domain se multiple servers pe traffic bhejna.**
Agar aapke paas 3 servers hain to user ko 3 alag URL nahi de sakte. DNS routing policies se ek hi domain se traffic distribute ho jaata hai.

**Problem 4 — Failover.**
Agar primary server down ho gaya to traffic automatically secondary pe jaana chahiye. Ye Route 53 health checks + failover routing se hota hai.

**Ab sawaal — normal DNS (GoDaddy, BigRock) se kaam nahi chal sakta tha?**
Chal sakta tha, but Route 53 ki 3 khaas cheezein hain:
- **100% availability SLA** — AWS ka ye ekmatra service hai jispe 100% SLA hai
- **ALIAS records** — AWS resources (CloudFront, ELB, S3) ke saath native integration aur zone apex pe kaam karta hai
- **Advanced routing policies** — latency-based, geoproximity, weighted etc. jo normal registrars nahi dete

---

## C. How It Actually Works (Internal Flow)

Ye section interview me sabse zyada poocha jaata hai. **"DNS resolution kaise hota hai, step by step batao"** — ye almost guaranteed question hai.

### Complete DNS resolution flow

Maan lo user ne browser me `www.myproject.com` type kiya:

```
Step 0: Browser Cache
        Browser apni internal DNS cache check karta hai.
        Mil gaya? → Done. (Chrome: chrome://net-internals/#dns)
        Nahi mila? → Next step.

Step 1: OS Cache + /etc/hosts
        Operating system ka resolver cache check hota hai.
        Linux/Mac me /etc/hosts, Windows me hosts file bhi check hoti hai.
        Nahi mila? → Next.

Step 2: Recursive Resolver (ISP ka DNS / 8.8.8.8 / 1.1.1.1)
        Ye banda aapka "agent" hai. Ye poori khoj khud karega.
        Iski apni cache me hai? → turant return.
        Nahi hai? → ab ye neeche wale steps karega.

Step 3: Root Nameserver (.)
        Resolver root server se poochta hai: "myproject.com kahan hai?"
        Root bolta hai: "Mujhe pura nahi pata, but .com ke TLD servers
        se pooch, unka address ye hai."
        Duniya me 13 logical root server addresses hain (a.root-servers.net
        se m.root-servers.net), lekin anycast ki wajah se physically
        1500+ machines hain.

Step 4: TLD Nameserver (.com)
        Resolver .com server se poochta hai.
        .com bolta hai: "myproject.com ke authoritative nameservers ye hain:
        ns-123.awsdns-01.com, ns-456.awsdns-02.net, ..."
        (Ye wahi 4 NS records hain jo aapko Route 53 hosted zone banate hi milte hain)

Step 5: Authoritative Nameserver (Route 53)
        Ab resolver Route 53 se poochta hai: "www.myproject.com ka record?"
        Route 53 apne hosted zone me dekhta hai, routing policy evaluate
        karta hai (latency? weighted? health check pass?),
        aur final answer deta hai: A record → 13.35.x.x

Step 6: Resolver → Browser
        Resolver answer ko TTL ke hisaab se cache karta hai aur browser ko
        de deta hai. Browser ab us IP pe TCP connection banata hai.
```

Interview me isko 30 second me summarize karna ho to:

> "Browser cache → OS cache → recursive resolver → root → TLD → authoritative nameserver (Route 53) → answer wapas, aur har layer TTL ke hisaab se cache karti hai."

### Key components aur unke roles

| Component | Role |
|-----------|------|
| **Registrar** | Domain kharidne wala (Route 53 Domains, GoDaddy). Ye ICANN registry me aapka naam register karta hai. |
| **Hosted Zone** | Ek container jisme aapke domain ke saare DNS records rehte hain. Ek domain = ek hosted zone (usually). |
| **Record Set** | Actual mapping — `www` → `1.2.3.4`. |
| **Nameservers (NS)** | 4 AWS servers jo aapke hosted zone ka data serve karte hain. Ye registrar ke paas set karne padte hain. |
| **Resolver** | Query karne wala (ISP ka DNS). Route 53 Resolver naam ka alag service bhi hai VPC ke andar DNS ke liye. |
| **Health Checker** | AWS ke global checkers jo aapke endpoint ko har 10/30 sec ping karte hain. |

---

## D. Key Concepts & Terminology

### D.1 Hosted Zone

Hosted zone = ek "folder" jisme ek domain ke saare records rehte hain.

Do type ke hote hain:

| Type | Kahan resolve hota hai | Use case |
|------|------------------------|----------|
| **Public Hosted Zone** | Poore internet pe | Aapki public website |
| **Private Hosted Zone** | Sirf associated VPCs ke andar | Internal microservices, `db.internal.local` type naam |

**Important gotcha:** Jaise hi tu public hosted zone banata hai, **charge start ho jaata hai** ($0.50/month) — chahe usme ek bhi record na ho. Log test ke liye zone banate hain aur delete karna bhool jaate hain.

Har hosted zone ke saath 2 records automatically bante hain:
- **NS record** — 4 AWS nameservers ka naam
- **SOA record** — Start of Authority, zone ka metadata (primary NS, admin email, refresh/retry/expire values)

### D.2 Record Types (must-know)

| Record | Kya karta hai | Example |
|--------|---------------|---------|
| **A** | Domain → IPv4 address | `myproject.com → 52.1.2.3` |
| **AAAA** | Domain → IPv6 address | `myproject.com → 2600:1f18::1` |
| **CNAME** | Domain → doosra domain naam | `www.myproject.com → myproject.com` |
| **ALIAS** | Domain → AWS resource (Route 53 specific) | `myproject.com → d123.cloudfront.net` |
| **MX** | Mail server batata hai | `10 mail.myproject.com` |
| **TXT** | Free-form text — SPF, DKIM, DMARC, domain verification | `"v=spf1 include:amazonses.com ~all"` |
| **NS** | Zone ke authoritative nameservers | `ns-123.awsdns-01.com` |
| **SOA** | Zone metadata | auto-created |
| **SRV** | Service + port batata hai | SIP, XMPP jaise protocols me |
| **CAA** | Kaunsa CA cert issue kar sakta hai | `0 issue "amazon.com"` |
| **PTR** | Reverse DNS — IP → naam | mail servers me |

### D.3 ALIAS vs CNAME — ye 100% poocha jaayega

Ye Route 53 ka **sabse zyada poocha jaane wala** question hai. Ratta mat maaro, samjho.

| Point | CNAME | ALIAS |
|-------|-------|-------|
| **Standard DNS?** | Haan, RFC standard | Nahi, Route 53 ka proprietary extension |
| **Zone apex (naked domain) pe?** | ❌ Nahi chalta | ✅ Chalta hai |
| **Target** | Koi bhi DNS naam | Sirf AWS resources (CloudFront, ELB, S3 website, API Gateway, another Route 53 record) |
| **Query ka charge** | Lagta hai | ❌ AWS resource pe point karne wale alias queries **free** hain |
| **Resolution** | Client ko dobara query karni padti hai (extra round trip) | Route 53 khud IP resolve karke A record return karta hai |
| **TTL** | Aap set karte ho | Aap set nahi kar sakte — AWS target ka TTL use hota hai |
| **Health check integration** | Manual | Native, `EvaluateTargetHealth` flag se |

**Zone apex pe CNAME kyun nahi chal sakta?**
Ye deep question hai, iska answer bolne se tu alag dikhega:

> "Sir, RFC 1034 ke hisaab se agar kisi naam pe CNAME record hai, to us naam pe **koi aur record exist nahi kar sakta**. Ab problem ye hai ki zone apex (`myproject.com`) pe SOA aur NS records mandatory hote hain — wo hamesha rehte hain. To agar wahan CNAME daal denge to conflict ho jaayega. Isliye AWS ne ALIAS banaya — ALIAS actually DNS protocol level pe A record hi return karta hai, resolution Route 53 apne andar kar leta hai. Isliye conflict nahi hota."

### D.4 Routing Policies (saare 7 yaad rakhne hain)

| Policy | Kaam | Real use case |
|--------|------|---------------|
| **Simple** | Ek record, ek ya multiple values, client random pick karta hai | Basic single-server setup. Health check support **nahi** karta. |
| **Weighted** | Traffic ko percentage me baanto (0–255 weight) | A/B testing, blue-green deployment, gradual rollout (5% naye version pe) |
| **Latency-based** | User ko sabse kam network latency wale region pe bhejo | Multi-region app. Note: latency ≠ geography — ye actual measured latency use karta hai |
| **Failover** | Primary down → secondary pe bhejo | Active-passive DR setup, static maintenance page |
| **Geolocation** | User ke **country/continent/state** ke hisaab se | Compliance (EU data EU me), language-specific site, content licensing |
| **Geoproximity** | User aur resource ke **physical distance** ke hisaab se, aur "bias" se area expand/shrink kar sakte ho | Traffic ko dheere-dheere ek region se doosre pe shift karna. **Traffic Flow** feature chahiye (extra cost) |
| **Multivalue Answer** | 8 tak healthy IPs return karo, client choose karega | Poor-man's load balancing, but ye **load balancer ka replacement nahi hai** |
| **IP-based** | Client ke CIDR block ke hisaab se route | ISP-specific optimization (advanced, kam use hota hai) |

**Geolocation vs Latency confusion (classic trap):**
> "Geolocation user ke location pe decide karta hai — Germany ka user hamesha EU server pe jaayega, chahe wo slow ho. Latency-based **actual network latency** pe decide karta hai — ho sakta hai kisi Germany user ke liye us-east-1 hi tez ho, to wo wahin jaayega. Compliance ke liye geolocation, performance ke liye latency."

**Geolocation vs Geoproximity:**
> "Geolocation country/continent boundaries pe kaam karta hai — discrete buckets. Geoproximity actual coordinates aur distance pe kaam karta hai, aur usme **bias** hota hai jisse aap ek region ka 'gravitational pull' badha ya ghata sakte ho — jaise 'Mumbai region ka bias +50 karo' to aas paas ka zyada traffic Mumbai pe aa jaayega."

### D.5 Health Checks

Teen type ke hote hain:

1. **Endpoint health check** — IP/domain + port + path monitor karo (HTTP/HTTPS/TCP)
2. **Calculated health check** — doosre health checks ko combine karo (AND/OR logic). Jaise "agar 3 me se 2 healthy hain to overall healthy"
3. **CloudWatch alarm based** — kisi CloudWatch alarm ki state pe depend karo (jaise DynamoDB throttling, ya private resource jo publicly reachable nahi)

**Kaam kaise karta hai (internals):**
- AWS ke **global health checkers** (~15+ locations worldwide) aapke endpoint ko request bhejte hain
- Default interval: **30 seconds** (Fast: 10 seconds, ye mehnga hai)
- **Failure threshold**: default 3 — matlab 3 consecutive fail ke baad hi unhealthy mark hoga
- Agar **18%+ checkers** healthy report karein to endpoint healthy mana jaata hai
- **String matching** kar sakte ho — response body ke first 5120 bytes me koi string dhoondo (jaise `"status":"ok"`)

**Sabse important gotcha:** Health checkers **public internet** se aate hain. Agar aapka security group unko block kar raha hai to endpoint hamesha unhealthy dikhega. AWS IP ranges whitelist karni padti hain.

**Failover ka time nikaalna (favourite interview math):**
```
Detection time = interval × failure threshold
               = 30 sec × 3 = 90 seconds

Total failover time = detection time + DNS TTL
                    = 90 + 60 (agar TTL 60 hai) = ~150 seconds
```
Isliye failover setups me **TTL kam rakhte hain (60 ya usse kam)**.

### D.6 TTL (Time To Live)

TTL = kitni der tak resolver is answer ko cache kare (seconds me).

| TTL value | Fayda | Nuksaan |
|-----------|-------|---------|
| **Low (60s)** | Change turant propagate hota hai, failover fast | Zyada DNS queries → zyada cost, thoda latency |
| **High (86400s / 1 day)** | Kam queries, kam cost, kam latency | Change karne me 1 din lag sakta hai |

**Practical tip jo interview me bolna hai:**
> "Sir, migration ya cutover se pehle main TTL ko **48 ghante pehle** 60 seconds pe la deta hoon. Isse purani high TTL wali entries expire ho jaati hain. Migration ke baad, jab sab stable ho jaaye, TTL wapas 300 ya 3600 pe badha deta hoon. Ye ek standard practice hai."

**Note:** ALIAS record ka TTL aap set nahi kar sakte — wo target resource ka TTL inherit karta hai (CloudFront/ELB ke liye typically 60 seconds).

### D.7 Domain Registration vs DNS Hosting — ye alag cheezein hain

Bahut log ye confuse karte hain. Interview me clarity dikhao:

| | Domain Registration | DNS Hosting |
|-|--------------------|-----------|
| **Kya hai** | Domain naam ka ownership kharidna | Us domain ke records serve karna |
| **Kaun deta hai** | Registrar (Route 53 Domains, GoDaddy, Namecheap) | DNS provider (Route 53, Cloudflare) |
| **Cost** | Annual (~$14/yr for .com) | Monthly + per-query |
| **Kya ye same hona zaroori hai?** | **Nahi!** | |

Aap GoDaddy se domain kharid sakte ho aur Route 53 pe DNS host kar sakte ho. Bas GoDaddy ke panel me **nameservers** ko Route 53 ke 4 NS values pe point karna hoga. Ye bahut common real-world setup hai.

---

## E. Real-World Configuration (mere project me maine kya kiya)

### Setup jo maine kiya

1. **Domain register kiya** Route 53 Domains se (ya external registrar se lekar NS point kiye)
2. **Public hosted zone** automatically ban gaya
3. **ACM certificate** request kiya **us-east-1** me (CloudFront ke liye mandatory) — DNS validation choose kiya, jisse Route 53 me automatically CNAME validation record add ho gaya
4. **ALIAS A record** banaya apex domain (`myproject.com`) ke liye → CloudFront distribution
5. **ALIAS AAAA record** bhi banaya (IPv6 users ke liye) → same CloudFront distribution
6. **ALIAS A record** banaya `www.myproject.com` ke liye → same CloudFront distribution
7. **SES ke liye TXT + CNAME records** — domain verification, DKIM (3 CNAMEs), custom MAIL FROM (MX + SPF TXT), aur DMARC TXT

### Records ka final structure

| Name | Type | Value | TTL | Purpose |
|------|------|-------|-----|---------|
| `myproject.com` | A (Alias) | `d1234abcd.cloudfront.net` | — | Apex → CloudFront |
| `myproject.com` | AAAA (Alias) | `d1234abcd.cloudfront.net` | — | IPv6 support |
| `www.myproject.com` | A (Alias) | `d1234abcd.cloudfront.net` | — | www subdomain |
| `_abc123.myproject.com` | CNAME | `_xyz.acm-validations.aws` | 300 | ACM validation |
| `abc._domainkey.myproject.com` | CNAME | `abc.dkim.amazonses.com` | 1800 | DKIM key 1 |
| `mail.myproject.com` | MX | `10 feedback-smtp.ap-south-1.amazonses.com` | 1800 | Custom MAIL FROM |
| `mail.myproject.com` | TXT | `"v=spf1 include:amazonses.com ~all"` | 1800 | SPF |
| `_dmarc.myproject.com` | TXT | `"v=DMARC1; p=quarantine; rua=mailto:dmarc@myproject.com"` | 1800 | DMARC |

### CLI snippet — record create karna

```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "myproject.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "d1234abcd.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }]
  }'
```

**Note karne layak:** `Z2FDTNDATAQYW2` — ye CloudFront ka **global fixed hosted zone ID** hai, har CloudFront distribution ke liye same. Agar ye interview me bol diya to banda impress ho jaayega. (S3 website endpoints ka har region ka alag hota hai.)

### Failover setup ka example

```
Primary record:
  Name: api.myproject.com
  Type: A (Alias → ALB)
  Routing: Failover → PRIMARY
  Health check: hc-api-primary
  Set ID: primary-mumbai

Secondary record:
  Name: api.myproject.com
  Type: A (Alias → S3 static maintenance page)
  Routing: Failover → SECONDARY
  Set ID: secondary-maintenance
```

---

## F. Common Mistakes & Gotchas

**1. Nameservers update karna bhool jaana**
Sabse common galti. Hosted zone bana liya, records daal diye, but registrar ke paas purane nameservers hain. Result: kuch kaam nahi karta. **Fix:** registrar ke panel me Route 53 ke 4 NS values daalo.

**2. Ek hi domain ke liye do hosted zones bana dena**
Delete karke dobara banaya? Naye NS values milenge, purane records dead ho jaayenge. Har hosted zone ka NS set **unique** hota hai.

**3. Zone apex pe CNAME daalne ki koshish**
Route 53 rok dega. ALIAS use karo.

**4. High TTL ke saath migration**
TTL 86400 hai aur aapne record change kiya — kuch users ko 24 ghante tak purana IP milega. Pehle TTL kam karo, phir change karo.

**5. Health check ka security group block**
Health checkers public IPs se aate hain. Agar SG me sirf CloudFront/office IP allow hai to health check hamesha fail hoga.

**6. "DNS propagation" ka misconception**
Log bolte hain "DNS propagate ho raha hai, 24-48 ghante lagenge". Technically **Route 53 me change 60 seconds me global ho jaata hai**. Delay sirf **downstream resolvers ki cached entries** ki wajah se hota hai — yaani TTL ka effect. Ye distinction interview me bolna bahut acha lagta hai.

**7. Simple routing ke saath health check ki umeed karna**
Simple routing policy health checks **support nahi karti**. Failover chahiye to failover ya multivalue policy use karo.

**8. Private hosted zone ke liye VPC settings**
Private hosted zone kaam karne ke liye VPC me `enableDnsHostnames` aur `enableDnsSupport` dono **true** hone chahiye. Warna resolve nahi hoga.

**9. Multivalue ko load balancer samajh lena**
Multivalue sirf healthy IPs ki list deta hai — usme koi health-based weighting, connection draining, ya SSL termination nahi hai. Ye ALB ka replacement nahi hai.

**10. Test ke liye hosted zone bana ke bhool jaana**
$0.50/month per zone. 10 zone bhool gaye = $5/month for nothing.

---

## G. Cost Model

| Cheez | Approx cost (us-east-1, badal sakta hai) |
|-------|------------------------------------------|
| **Hosted zone** | $0.50/month per zone (first 25), $0.10 after |
| **Standard queries** | $0.40 per million (first 1 billion), phir $0.20 per million |
| **Latency/Geo/Geoproximity queries** | $0.60–$0.70 per million (mehnge) |
| **ALIAS query → AWS resource** | **FREE** ✅ |
| **Health check (AWS endpoint)** | $0.50/month |
| **Health check (non-AWS endpoint)** | $0.75/month |
| **Optional health check features** (HTTPS, string matching, fast interval) | +$1–2/month each |
| **Domain registration** | $12–$15/year for .com (TLD ke hisaab se alag) |
| **Traffic Flow policy record** | $50/month per policy record — **ye mehnga hai, dhyaan rakho** |

**Cost optimization tips (interview me bolne layak):**
- Jahan possible ho **ALIAS use karo, CNAME nahi** — alias queries free hain
- **TTL badhao** — high TTL = kam queries = kam bill
- Unused hosted zones **delete karo**
- Traffic Flow tab use karo jab genuinely zaroorat ho — $50/month per record chhota amount nahi hai
- Health check features selectively enable karo

**Mere project ka realistic monthly cost:** ~$0.50–$1.00 (ek hosted zone + minimal queries, sab alias records). Ye number bolne se lagta hai ki tune actually bill dekha hai.

---

## H. Security Best Practices

**1. Domain Lock (Transfer Lock)** — enable karo. Isse koi aapka domain unauthorized transfer nahi kar sakta.

**2. Privacy Protection** — WHOIS me aapka naam/email/phone public na ho. Route 53 me by default on hota hai (jo TLDs support karte hain).

**3. DNSSEC** — DNS responses ko cryptographically sign karo. Isse **DNS spoofing / cache poisoning** attack se bachaav hota hai. Route 53 DNSSEC signing support karta hai (KMS asymmetric key chahiye, us-east-1 me).

**4. IAM least privilege** — CI/CD pipeline ko poora `route53:*` mat do. Sirf specific hosted zone pe specific actions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowRecordChangesInOneZoneOnly",
      "Effect": "Allow",
      "Action": [
        "route53:ChangeResourceRecordSets",
        "route53:ListResourceRecordSets",
        "route53:GetChange"
      ],
      "Resource": "arn:aws:route53:::hostedzone/Z1234567890ABC"
    },
    {
      "Sid": "AllowListingZones",
      "Effect": "Allow",
      "Action": "route53:ListHostedZones",
      "Resource": "*"
    }
  ]
}
```

**5. CAA records** — specify karo ki sirf kaunsa Certificate Authority aapke domain ke liye cert issue kar sakta hai:
```
myproject.com. CAA 0 issue "amazon.com"
```
Isse koi aur CA se fraudulent certificate nahi bana sakta.

**6. CloudTrail logging** — Route 53 API calls CloudTrail me record hote hain. Koi record change kare to audit trail rahega.

**7. Query logging** — public hosted zone ke liye query logs CloudWatch Logs me bhej sakte ho. Debugging aur security analysis (jaise data exfiltration via DNS detect karna) me kaam aata hai.

**8. Subdomain takeover se bachna** — agar aapne kisi S3 bucket ya CloudFront distribution ko delete kar diya but DNS record chhod diya (dangling record), to koi attacker wahi bucket naam claim karke aapke subdomain pe apna content serve kar sakta hai. **Resource delete karo to DNS record bhi delete karo.**

---

## I. Interview Q&A — Route 53

---

**Q1. Route 53 kya hai aur aapne isko apne project me kyun use kiya?**

> Route 53 AWS ka highly available DNS aur domain registration service hai. Maine isko teen wajah se choose kiya. Pehla, mera poora stack AWS pe tha — CloudFront, S3, Lambda — to native integration ka fayda mila, khaas kar ALIAS records ka. Doosra, ALIAS record se main apna apex domain directly CloudFront pe point kar paya, jo plain CNAME se possible nahi tha kyunki zone apex pe CNAME allowed nahi hai. Teesra, ALIAS queries jo AWS resources pe jaati hain wo free hain, to cost bhi kam raha. Aur Route 53 AWS ka ekmatra service hai jispe 100% availability SLA hai, jo DNS jaise critical layer ke liye important hai.

---

**Q2. DNS resolution step by step kaise hota hai?**

> Sir, jab user browser me domain type karta hai to sabse pehle browser apni local cache check karta hai, phir OS ka resolver cache aur hosts file. Agar wahan nahi mila to request recursive resolver ko jaati hai — jaise ISP ka DNS ya 8.8.8.8. Resolver ke paas cache nahi hai to wo root nameserver se poochta hai, root usko `.com` TLD servers ka address deta hai. TLD server batata hai ki us domain ke authoritative nameservers kaun hain — mere case me Route 53 ke 4 NS. Phir resolver Route 53 se final answer leta hai, Route 53 routing policy evaluate karke IP return karta hai. Resolver us answer ko TTL tak cache karta hai aur browser ko de deta hai. Uske baad browser us IP pe TCP connection banata hai.

---

**Q3. ALIAS aur CNAME me kya difference hai? Kab kya use karoge?**

> Teen main differences hain. Pehla, CNAME zone apex pe kaam nahi karta kyunki RFC ke hisaab se jis naam pe CNAME hai us naam pe koi aur record nahi ho sakta — aur apex pe SOA aur NS records mandatory hain. ALIAS Route 53 ka proprietary extension hai jo apex pe kaam karta hai. Doosra, ALIAS sirf AWS resources ko point kar sakta hai — CloudFront, ELB, S3 website endpoint, API Gateway — jabki CNAME kisi bhi DNS naam ko. Teesra, ALIAS queries free hain aur ek round trip bachati hain kyunki Route 53 khud target resolve karke A record return karta hai. Mere project me maine apex aur www dono ke liye ALIAS use kiya CloudFront pe.

---

**Q4. Aapne kaun si routing policy use ki aur kyun?**

> Maine **simple routing with ALIAS** use kiya, kyunki mera architecture single CloudFront distribution pe based hai. CloudFront khud global hai — wo apne aap user ko nearest edge location pe route kar deta hai anycast se. To DNS level pe latency-based ya geolocation routing add karna redundant hota, aur uski cost bhi zyada hoti — latency queries $0.60 per million hain vs simple $0.40, aur alias to free hi hai. Agar mera architecture multi-region hota — jaise Mumbai aur Virginia dono me ALB — tab main latency-based routing use karta health checks ke saath.

---

**Q5. Weighted routing ka real use case batao.**

> Sabse common use case **blue-green ya canary deployment** hai. Maan lo mera naya version deploy hua hai. Main weighted routing me old version ko weight 95 aur new version ko 5 de doonga — matlab 5% traffic naye version pe jaayega. Agar CloudWatch me error rate normal rehta hai to main dheere dheere weight badhata hoon — 5, 20, 50, 100. Agar problem aayi to turant weight 0 kar deta hoon, rollback ho gaya. Dhyaan rakhne wali baat ye hai ki DNS caching ki wajah se shift instant nahi hota, isliye TTL kam rakhna padta hai — 60 seconds ya usse kam.

---

**Q6. Health check kaise kaam karta hai aur failover me kitna time lagta hai?**

> AWS ke duniya bhar me distributed health checkers mere endpoint pe periodically request bhejte hain — default 30 second interval, ya fast mode me 10 second. Failure threshold default 3 hai, matlab 3 consecutive failures ke baad endpoint unhealthy mark hota hai. Ek checker ki opinion se decision nahi hota — agar 18% se zyada checkers healthy bolein to endpoint healthy mana jaata hai, isse false positives kam hote hain. Failover ka total time do cheezon ka sum hai: detection time yaani interval × threshold, plus DNS TTL. To 30×3 + 60 TTL = lagbhag 150 seconds. Isliye failover setups me TTL kam rakhte hain.

---

**Q7. Production issue: Aapne DNS record change kiya but users ko abhi bhi purana site dikh raha hai. Kaise debug karoge?**

> Main systematically check karoonga. Pehle `dig myproject.com @ns-123.awsdns-01.com` chalake **directly Route 53 nameserver se** poochunga — agar wahan naya value dikh raha hai to Route 53 ka kaam sahi hai, problem downstream caching me hai. Phir `dig myproject.com @8.8.8.8` se public resolver check karoonga aur response me TTL dekhunga — wo batayega ki cache kab expire hoga. Client side pe browser DNS cache aur OS cache flush karwaunga — Windows me `ipconfig /flushdns`. Agar Route 53 me hi purana value hai to check karoonga ki change actually apply hua ya nahi, aur `GetChange` API se status dekhunga. Aur ek important cheez — main verify karoonga ki registrar ke NS records Route 53 wale hi hain, kyunki agar domain kisi aur DNS provider pe point kar raha hai to Route 53 me change karne se kuch nahi hoga.

---

**Q8. "DNS propagation me 24-48 ghante lagte hain" — ye sach hai?**

> Technically ye statement thoda misleading hai. Route 53 me jab main record change karta hoon to wo AWS ke saare nameservers pe **60 seconds ke andar** propagate ho jaata hai — API ka status INSYNC ho jaata hai. Jo 24-48 ghante wali baat hai wo actually **downstream resolvers ki cached entries** ki wajah se hai. Agar purana record 86400 second TTL ke saath cache hua tha to wo resolver 24 ghante tak purana answer dega. Isliye main migration se pehle TTL kam kar deta hoon. Ek aur case hai jab **nameservers hi change** ho rahe hon — wo TLD registry level pa change hai aur wahan zyada time lag sakta hai.

---

**Q9. Zone apex pe CNAME kyun nahi daal sakte?**

> RFC 1034 ke hisaab se jis DNS name pe CNAME record hai, us name pe koi doosra record co-exist nahi kar sakta — CNAME "exclusive" hota hai. Ab zone apex pe SOA aur NS records mandatory hain, wo hamesha wahan rehte hain. To agar apex pe CNAME daal denge to direct conflict ho jaayega aur resolution ambiguous ho jaayegi. Isi problem ko solve karne ke liye AWS ne ALIAS banaya — ALIAS internally target resolve karke wire pe normal A record hi return karta hai, to protocol level pe koi CNAME hai hi nahi, isliye conflict nahi hota. Cloudflare me isko CNAME flattening bolte hain, concept same hai.

---

**Q10. Public aur private hosted zone me kya difference hai?**

> Public hosted zone poore internet se resolvable hota hai — koi bhi resolver query kar sakta hai. Private hosted zone sirf un VPCs ke andar resolve hota hai jinse wo explicitly associated hai — bahar se query karoge to NXDOMAIN milega. Private zone ka use case internal service discovery hai, jaise `db.internal.myapp.com` ya `cache.internal.myapp.com` — isse main IP hardcode karne se bach jaata hoon. Ek gotcha ye hai ki private zone kaam karne ke liye VPC me `enableDnsSupport` aur `enableDnsHostnames` dono true hone chahiye, warna resolution silently fail hoti hai.

---

**Q11. Multivalue answer routing aur load balancer me kya difference hai?**

> Multivalue routing Route 53 ko allow karta hai ki wo ek query ke response me 8 tak healthy records return kare, aur client unme se koi ek pick kar le. Ye ek **client-side, DNS-level** distribution hai. Load balancer isse fundamentally alag hai — wo actual traffic ke beech me baithta hai, real-time health monitor karta hai, connection draining karta hai, SSL terminate karta hai, aur request-level routing kar sakta hai. Multivalue ka sabse bada limitation ye hai ki DNS caching ki wajah se distribution uneven ho sakti hai aur ek server down hone pe cached clients usi pe jaate rahenge TTL khatam hone tak. To ye lightweight scenarios ke liye theek hai, real load balancing ke liye ALB/NLB chahiye.

---

**Q12. Aapko multi-region active-active setup karna hai. Route 53 se kaise karoge?**

> Main **latency-based routing with health checks** use karoonga. Har region ke ALB ke liye ek alias record banaunga same domain name pe, har ek ka apna health check hoga aur `EvaluateTargetHealth` true rakhunga. Route 53 har user ko us region pe bhejega jahan uski measured latency sabse kam hai. Agar ek region down ho jaata hai to health check fail hoga aur Route 53 automatically usko rotation se hata dega — traffic doosre region pe chala jaayega. TTL 60 second rakhunga taaki failover fast ho. Agar compliance requirement hoti — jaise EU users ka data EU me hi rahe — tab main latency ki jagah geolocation routing use karta, kyunki latency-based routing geography guarantee nahi karta.

---

**Q13. Route 53 ke cost drivers kya hain aur aap cost kaise kam karoge?**

> Main cost drivers hain: hosted zone charge, jo $0.50 per zone per month hai, aur DNS queries, jo standard ke liye $0.40 per million hain lekin latency ya geolocation routing ke liye lagbhag $0.60-0.70 per million ho jaate hain. Health checks bhi $0.50-0.75 per month lagte hain, aur Traffic Flow policy records sabse mehnge hain — $50 per month per record. Optimization ke liye main teen cheezein karta hoon: jahan possible ho ALIAS use karta hoon kyunki AWS resources pe alias queries free hain, TTL ko unnecessarily kam nahi rakhta kyunki low TTL matlab zyada queries, aur unused test hosted zones delete kar deta hoon. Mere project me monthly cost lagbhag $0.50-1 hai kyunki saare records alias hain.

---

**Q14. Subdomain takeover kya hota hai aur DNS level pe kaise rokoge?**

> Subdomain takeover tab hota hai jab DNS record ek aise resource ko point kar raha ho jo ab exist nahi karta — isko dangling record bolte hain. Maan lo mera record `blog.myproject.com` ek S3 bucket ko point kar raha tha aur maine bucket delete kar diya but record nahi hataya. Ab koi attacker wahi bucket naam apne account me claim kar sakta hai aur mere subdomain pe apna content serve kar sakta hai — jo phishing ya cookie theft ke liye use ho sakta hai. Rokne ke liye main ek simple discipline follow karta hoon: resource delete karne se pehle DNS record delete karo, not after. Aur periodically automated scanning kar sakte hain jo dangling records detect kare.

---

**Q15. Aapko poore domain ko GoDaddy se Route 53 pe migrate karna hai, zero downtime ke saath. Kya steps honge?**

> Main pehle Route 53 me hosted zone banaunga aur GoDaddy ke saare existing records exactly waise ke waise usme copy karunga — A, MX, TXT sab kuch. Phir main `dig @<route53-nameserver>` se directly Route 53 se query karke verify karunga ki saare records sahi resolve ho rahe hain, without touching GoDaddy. Ye step critical hai — nameserver switch se pehle Route 53 ready hona chahiye. Uske baad GoDaddy me records ka TTL kam karunga aur usko purana TTL expire hone ka time dunga. Phir GoDaddy ke registrar panel me nameservers ko Route 53 ke 4 NS values pe point kar dunga. Kuch ghante tak dono taraf same data hoga isliye downtime nahi aayega. Aakhir me main 48-72 ghante monitor karunga aur tab jaake purana zone delete karunga.

---
---

# 2. Amazon CloudFront

---

## A. Simple Explanation

### Service kya hai

CloudFront AWS ka **CDN (Content Delivery Network)** hai. Iska kaam simple hai — aapka content (HTML, CSS, JS, images, videos, even API responses) duniya bhar ke **edge locations** pe cache karke rakhna, taaki user ki request aapke origin server tak baar baar na jaaye.

Do fayde milte hain:
1. **Latency kam** — user ko content 50ms me mil jaata hai instead of 300ms
2. **Origin ka load kam** — 90% requests edge se hi serve ho jaati hain, origin ko sirf 10% dekhna padta hai

Aur ek third fayda jo log bhool jaate hain — **security**. CloudFront ke saamne AWS Shield Standard free me lagta hai (DDoS protection), aur WAF attach kar sakte ho.

### Real-world analogy (interview me bolna)

> "Sir, CloudFront ko aise samjhiye — maan lo Amazon ka ek hi warehouse Bangalore me hai. Ab Srinagar ka customer order kare to 5 din lagenge. Isliye Amazon ne har city me chhote **local warehouses** bana diye, jahan popular products pehle se rakhe rehte hain. Ab Srinagar wale ko same-day delivery mil jaati hai. CloudFront edge locations wahi local warehouses hain — aapka origin (S3) main warehouse hai. Jo cheez local warehouse me nahi hai, wo main warehouse se mangwayi jaati hai aur agli baar ke liye local me rakh li jaati hai."

---

## B. Why It Exists / Problem It Solves

**Problem 1 — Speed of light ki limit.**
Ye physics ka problem hai, code se solve nahi hota. Mumbai se Virginia (us-east-1) tak signal ko jaane aur aane me hi ~200-250ms lag jaata hai. Agar aapke page pe 30 assets hain to compounding effect se page 3-4 second me load hoga. **Data ko user ke paas laana hi ekmatra solution hai.**

**Problem 2 — Origin server pe load.**
Agar aapki site viral ho gayi aur 1 lakh log ek saath aa gaye, to origin server crash ho jaayega. CDN 90%+ traffic absorb kar leta hai.

**Problem 3 — Bandwidth cost.**
S3 se directly data transfer out mehnga hai (~$0.09/GB). CloudFront se transfer sasta hai, aur **CloudFront → S3 origin fetch free hai**. To CDN actually paisa bachata hai.

**Problem 4 — S3 static website hosting HTTPS support nahi karta.**
Ye bahut important point hai. S3 ka website endpoint (`bucket.s3-website-region.amazonaws.com`) **sirf HTTP pe kaam karta hai**. Custom domain pe HTTPS chahiye? CloudFront lagana hi padega.

**Problem 5 — DDoS attacks.**
Origin directly expose ho to attacker seedhe usko target kar sakta hai. CloudFront ke peeche origin chhup jaata hai.

---

## C. How It Actually Works (Internal Flow)

### Request lifecycle — complete

```
1. USER REQUEST
   Browser: GET https://myproject.com/images/logo.png

2. DNS RESOLUTION
   Route 53 alias → d123abc.cloudfront.net
   CloudFront ANYCAST IP return karta hai.
   Anycast ka matlab: duniya bhar ke edge locations ek hi IP advertise
   karte hain, aur BGP routing user ko topologically nearest edge pe
   le jaata hai. Ye DNS-based nahi, network-level routing hai.

3. TLS HANDSHAKE AT EDGE
   TLS terminate hota hai EDGE pe, origin pe nahi.
   Isliye handshake ka RTT bhi kam ho jaata hai — bada performance win.

4. VIEWER REQUEST TRIGGER (agar configured hai)
   CloudFront Function ya Lambda@Edge chalta hai.
   Yahan URL rewrite, header manipulation, auth check kar sakte ho.

5. EDGE CACHE LOOKUP
   CloudFront CACHE KEY banata hai (URL path + configured headers +
   cookies + query strings) aur cache me dhoondhta hai.

   ✅ CACHE HIT → turant response, X-Cache: Hit from cloudfront
   ❌ CACHE MISS → step 6

6. REGIONAL EDGE CACHE (mid-tier cache)
   Miss hone pe request seedhe origin nahi jaati.
   Pehle Regional Edge Cache check hota hai — ye bade caches hain
   jo multiple edge locations ko serve karte hain aur zyada content
   zyada der tak rakh sakte hain.

   ✅ Hit → content edge pe aata hai, cache hota hai, user ko jaata hai
   ❌ Miss → step 7

   NOTE: Regional edge cache dynamic/uncacheable content aur
   proxy methods (PUT/POST/DELETE) ke liye bypass ho jaata hai.

7. ORIGIN SHIELD (optional, extra layer)
   Agar enable kiya hai to ek dedicated caching layer origin ke
   region me. Isse origin pe requests aur kam ho jaati hain.

8. ORIGIN REQUEST TRIGGER (agar configured hai)
   Lambda@Edge chal sakta hai — origin change karna, headers add karna.

9. ORIGIN FETCH
   S3 / ALB / custom HTTP server se content fetch.
   OAC ke case me CloudFront request ko SigV4 se sign karta hai.

10. ORIGIN RESPONSE TRIGGER (optional)
    Response modify kar sakte ho before caching.

11. CACHE STORE
    Cache-Control / Expires headers dekh ke ya CloudFront TTL settings
    ke hisaab se content edge pe store hota hai.

12. VIEWER RESPONSE TRIGGER (optional)
    Security headers add karna, etc.

13. RESPONSE TO USER
    X-Cache: Miss from cloudfront (pehli baar)
    Agli baar: Hit from cloudfront
```

### Key components

| Component | Role |
|-----------|------|
| **Distribution** | CloudFront ka main configuration unit. Ek distribution = ek `d123.cloudfront.net` domain |
| **Origin** | Content ka source — S3 bucket, ALB, API Gateway, ya koi bhi HTTP server |
| **Origin Group** | Do origins ka pair primary/failover ke liye |
| **Edge Location (PoP)** | Actual cache servers, duniya bhar me 700+ (number badhta rehta hai) |
| **Regional Edge Cache** | Mid-tier cache, ~13 worldwide, edge locations ke beech me |
| **Behavior** | Path pattern ke hisaab se alag rules — `/api/*` ke liye alag, `/images/*` ke liye alag |
| **Cache Policy** | Cache key kaise banega aur TTLs kya honge |
| **Origin Request Policy** | Origin ko kya kya bhejna hai (jo cache key me nahi hai) |
| **Response Headers Policy** | Response me kaunse headers add karne hain (CORS, security headers) |
| **OAC** | Origin Access Control — S3 ko private rakhne ka mechanism |

---

## D. Key Concepts & Terminology

### D.1 Edge Location vs Regional Edge Cache

| | Edge Location | Regional Edge Cache |
|-|---------------|---------------------|
| **Kitne** | 700+ globally | ~13 |
| **Size** | Chhoti cache | Badi cache |
| **Kya rakhte hain** | Popular/hot content | Less popular content bhi, zyada der tak |
| **User ke kitne paas** | Sabse paas | Beech me |
| **Purpose** | Latency kam karna | Origin pe load aur kam karna (cache hit ratio badhana) |

**Ye layer kyun add ki gayi?** Kyunki edge locations chhoti hain, unme se kam popular content jaldi evict ho jaata hai (LRU). Agar har eviction pe request origin tak jaaye to origin pe load rahega. Regional edge cache ek buffer hai — wo content ko zyada der rakh leta hai.

**Gotcha:** Regional edge cache **bypass ho jaata hai** in cases me:
- Dynamic content (PUT, POST, PATCH, DELETE, OPTIONS)
- Custom origins jinke liye specifically bypass configured hai

### D.2 Distribution, Origin, Behavior

**Distribution** — top level object. Isme aap define karte ho:
- Origins (ek ya zyada)
- Behaviors (path-based rules)
- Alternate domain names (CNAMEs) + SSL cert
- Price class, logging, WAF association

**Cache Behavior** — ye path pattern pe match karta hai aur rules apply karta hai. **Order matters** — CloudFront upar se neeche match karta hai, pehla match jeet jaata hai. Default behavior (`*`) hamesha last me rehta hai.

Example multi-behavior setup:

| Precedence | Path Pattern | Origin | Cache Policy | Allowed Methods |
|-----------|--------------|--------|--------------|-----------------|
| 0 | `/api/*` | API Gateway / ALB | CachingDisabled | GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE |
| 1 | `/static/*` | S3 | CachingOptimized (1 year) | GET, HEAD |
| 2 | `/images/*` | S3 | CachingOptimized | GET, HEAD |
| 3 (Default) | `*` | S3 | CachingOptimized (short TTL for index.html) | GET, HEAD |

### D.3 Cache Key — ye concept bahut important hai

**Cache key** wo unique identifier hai jisse CloudFront decide karta hai ki "ye request pehle wali request jaisi hi hai ya nahi".

Default me cache key sirf **hostname + URL path** hota hai. Aap isme add kar sakte ho:
- Specific query strings (`?version=2`)
- Specific headers (`Accept-Language`, `CloudFront-Viewer-Country`)
- Specific cookies (`sessionId`)

**Golden rule:** *Cache key jitna specific, cache hit ratio utna kam.*

Example samjho:
```
Agar cache key me sab kuch include kar diya:
/logo.png?utm_source=facebook&fbclid=abc123  → ek cache entry
/logo.png?utm_source=twitter&t=xyz789        → doosri cache entry
/logo.png                                     → teesri cache entry

Same file ki 3 copies! Cache hit ratio tabah ho gaya.
```

Isliye marketing query params (utm_*, fbclid, gclid) ko cache key se **exclude** karo.

**Cache Policy vs Origin Request Policy — sabse tricky distinction:**

| | Cache Policy | Origin Request Policy |
|-|--------------|----------------------|
| **Kya decide karta hai** | Cache key me kya jaayega | Origin ko kya forward hoga |
| **Cache pe asar** | Haan, seedha | Nahi |
| **Example** | `Accept-Encoding` cache key me → gzip aur brotli ki alag entries | `User-Agent` origin ko bhejo but cache key me mat daalo |

Rule: **Cache policy me jo bhi hai wo automatically origin ko bhi jaata hai.** Origin request policy usme extra add karti hai.

Practical example: mujhe origin pe analytics ke liye `User-Agent` chahiye, but agar main usko cache key me daaloonga to har browser version ki alag cache entry ban jaayegi — hit ratio zero ho jaayega. Solution: `User-Agent` ko **origin request policy** me daalo, cache policy me nahi.

AWS ke managed policies (yaad rakhne layak):
- `Managed-CachingOptimized` — cache key sirf URL, compression on
- `Managed-CachingDisabled` — kuch cache nahi hoga, APIs ke liye
- `Managed-CachingOptimizedForUncompressedObjects`
- `Managed-AllViewer` (origin request) — sab kuch forward karo
- `Managed-CORS-S3Origin` (origin request) — CORS headers forward karo

### D.4 TTL — Min, Max, Default

| Setting | Matlab | Default value |
|---------|--------|---------------|
| **Minimum TTL** | Object kam se kam itne der cache rahega, chahe origin kuch bhi bole | 0 |
| **Maximum TTL** | Object zyada se zyada itne der cache rahega | 31536000 (1 saal) |
| **Default TTL** | Agar origin ne koi `Cache-Control` header nahi bheja to ye use hoga | 86400 (1 din) |

**Logic ka flow:**
```
Origin ne Cache-Control bheja?
  ├─ NAHI → Default TTL use hoga
  └─ HAAN → us value ko Min aur Max ke beech clamp kar do
             final_ttl = max(MinTTL, min(origin_ttl, MaxTTL))
```

Ye samajh lo interview ke liye — bahut log MinTTL ka matlab galat samajhte hain. MinTTL **floor** hai, matlab wo origin ki `Cache-Control: max-age=0` ko bhi override kar dega.

### D.5 Invalidation vs Versioning

Cache me purana content pada hai, naya deploy kiya hai — kaise refresh karein?

| | Invalidation | Versioning (file naming) |
|-|--------------|--------------------------|
| **Kaise** | `/index.html` ya `/*` invalidate karo | File ka naam badlo: `app.a3f2b1.js` |
| **Cost** | Pehle 1000 paths/month free, phir $0.005 per path | **Free** |
| **Speed** | 60 sec – kuch minutes | Instant (naya URL = naya object) |
| **Rollback** | Mushkil | Aasan — purana file abhi bhi exist karta hai |
| **Best practice** | Emergency ke liye | ✅ **Ye default hona chahiye** |

**Interview me kya bolna:**
> "Sir, main invalidation ko last resort maanta hoon. Mera build process (Webpack/Vite) automatically content hash lagata hai — `main.a3f2b1c.js`. Ye files 1 saal ke `Cache-Control: max-age=31536000, immutable` ke saath jaati hain kyunki content badlega to naam badal jaayega. Sirf `index.html` ko main short TTL — jaise `max-age=0, must-revalidate` — pe rakhta hoon, kyunki wahi entry point hai jo naye hashed files ko reference karta hai. Is approach me deploy ke baad mujhe invalidation ki zaroorat hi nahi padti, sirf `/index.html` ki. Aur cost bhi zero rehti hai."

**Important gotcha:** `/*` wildcard invalidation ko AWS **ek hi path** count karta hai, 1000 nahi. But ye poori cache uda deta hai — agla har request origin pe jaayegi, jo traffic spike aur cost cause kar sakta hai.

### D.6 OAC vs OAI (Origin Access Control vs Identity)

Problem: S3 bucket ko public karke CloudFront se serve karenge to log CloudFront ko bypass karke directly S3 URL hit kar sakte hain. Isse cache bypass hoga, cost badhega, aur WAF/Shield ka protection nahi milega.

Solution: bucket ko **private** rakho aur sirf CloudFront ko access do.

| | OAI (purana) | OAC (naya, recommended) |
|-|--------------|-------------------------|
| **Status** | Legacy, ab naye setups ke liye recommend nahi | ✅ Current recommendation |
| **SSE-KMS support** | ❌ Nahi | ✅ Haan |
| **HTTP methods** | Sirf GET, HEAD | Sab — GET, PUT, POST, DELETE |
| **Auth mechanism** | Special CloudFront identity | **SigV4 signing** har request pe |
| **Kitne regions** | Limited | Saare, opt-in regions bhi |
| **Granular control** | Kam | Zyada (signing behavior configure kar sakte ho) |

**Bucket policy OAC ke saath:**

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-project-frontend/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/E1ABCDEFGHIJKL"
        }
      }
    }
  ]
}
```

Dhyaan do: Principal **service** hai (`cloudfront.amazonaws.com`), aur condition me **specific distribution ARN** hai. Ye condition critical hai — iske bina koi bhi CloudFront distribution aapke bucket se padh sakta hai (confused deputy problem).

### D.7 Signed URLs vs Signed Cookies

Private content serve karna hai (paid videos, user documents) — CloudFront do tarike deta hai:

| | Signed URL | Signed Cookies |
|-|-----------|----------------|
| **Kya sign hota hai** | Ek specific file ka URL | Ek policy jo multiple files cover karti hai |
| **Use case** | Ek file download link, ek video | Poora subscription content, HLS video (jisme 100s of segments hain) |
| **RTMP / legacy** | Support tha | Nahi |
| **Client requirement** | Kuch nahi | Client ko cookies support karni chahiye |
| **URL dikhta hai?** | Haan, URL me signature dikhta hai | URL clean rehta hai |

Dono me aap specify kar sakte ho:
- **Expiry time** (mandatory)
- **Start time** (optional)
- **IP address range** (optional — but mobile users ke liye risky, IP badal jaata hai)

**Signed URL vs S3 Presigned URL — ye confusion clear karo:**
> "S3 presigned URL directly S3 se sign hota hai IAM credentials se, aur usme CDN ka koi role nahi hota. CloudFront signed URL CloudFront key pair se sign hota hai aur CDN ke through serve hota hai — matlab caching, edge latency aur WAF protection ka fayda milta hai. Agar file ek baar download honi hai to presigned URL theek hai. Agar wahi file bahut saare users ko serve karni hai — jaise ek paid video — to CloudFront signed URL better hai kyunki cache hit milega."

### D.8 Lambda@Edge vs CloudFront Functions

| | CloudFront Functions | Lambda@Edge |
|-|---------------------|-------------|
| **Runtime** | JavaScript (ECMAScript 5.1-ish) | Node.js, Python |
| **Kahan chalta hai** | Edge location pe (700+) | Regional Edge Cache pe (~13) |
| **Triggers** | Viewer Request, Viewer Response | Viewer Req/Res, **Origin Req/Res** |
| **Execution time** | < 1 millisecond | 5 sec (viewer), 30 sec (origin) |
| **Memory** | 2 MB | 128 MB – 10 GB |
| **Code size** | 10 KB | 1 MB (viewer), 50 MB (origin) |
| **Network access** | ❌ Nahi | ✅ Haan |
| **File system / body access** | ❌ Nahi | ✅ Haan |
| **Cost** | ~1/6th of Lambda@Edge | Zyada |
| **Deploy region** | — | **us-east-1 se deploy karna padta hai** |

**Kab kya use karein:**

CloudFront Functions ke liye (lightweight, har request pe):
- URL rewrite/redirect (`/blog` → `/blog/index.html`)
- Simple header manipulation (security headers add karna)
- Cache key normalization
- Simple token validation (JWT signature check nahi, bas presence)
- A/B testing ke liye cookie set karna

Lambda@Edge ke liye (heavy):
- Origin selection logic (kis origin pe bhejna hai, dynamically)
- External API call karna (auth service se validate karna)
- Image resizing on-the-fly (origin response pe)
- Body manipulation
- Complex authentication/authorization

**Mere project me maine kya kiya (bolne layak example):**
> "Mera React app SPA hai, to client-side routing hai. Agar user directly `/dashboard/settings` pe aata hai to S3 me wo path exist nahi karta — 403 aata hai. Maine ek **CloudFront Function** likha jo viewer request pe check karta hai ki URI me file extension nahi hai, to usko `/index.html` pe rewrite kar deta hai. Isse React Router apna kaam kar leta hai. Maine Lambda@Edge nahi choose kiya kyunki ye logic sirf 5 lines ka hai, sub-millisecond me chal jaata hai aur cost 6 guna kam hai."

```javascript
// CloudFront Function — SPA routing
function handler(event) {
    var request = event.request;
    var uri = request.uri;

    // Agar directory hai to index.html append karo
    if (uri.endsWith('/')) {
        request.uri += 'index.html';
    }
    // Agar file extension nahi hai to SPA route hai
    else if (!uri.includes('.')) {
        request.uri = '/index.html';
    }

    return request;
}
```

### D.9 HTTPS / SSL Certificate

**Sabse important rule jo interview me pooch liya jaata hai:**

> **CloudFront ke liye ACM certificate MUST be in `us-east-1` (N. Virginia)** — chahe aapka origin Mumbai me ho, chahe aap Australia me baithe ho.

**Kyun?** Kyunki CloudFront ek **global service** hai aur AWS ne uska control plane us-east-1 me rakha hai. Global services (IAM, CloudFront, WAF for CloudFront) ka metadata us-east-1 se manage hota hai.

Compare karo: **ALB ke liye certificate ALB ke apne region me hona chahiye.** Ye ek classic gotcha hai.

Baaki SSL settings:
- **Viewer protocol policy**: `Redirect HTTP to HTTPS` (recommended) ya `HTTPS Only`
- **Origin protocol policy**: `HTTPS Only` (agar origin support karta hai) ya `Match Viewer`
- **SSL/TLS version**: Minimum `TLSv1.2_2021` recommended
- **SNI vs Dedicated IP**: SNI free hai aur 99.9% clients support karte hain. Dedicated IP **$600/month** hai — sirf tab jab bahut purane clients support karne hon (Windows XP jaise). Ye number bolne se pata chalta hai ki aapne actually pricing padhi hai.

**Alternate domain names (CNAMEs):** Distribution me `myproject.com` aur `www.myproject.com` add karo, aur certificate me dono covered hone chahiye. Wildcard cert (`*.myproject.com`) apex domain ko **cover nahi karta** — usko alag se SAN me add karna padta hai.

### D.10 Price Classes

| Price Class | Kaunse edge locations | Cost |
|-------------|----------------------|------|
| **All** | Saare (including South America, Australia, India) | Sabse zyada |
| **200** | All minus sabse mehnge (South America, Australia, NZ) | Medium |
| **100** | Sirf US, Canada, Europe, Israel | Sabse kam |

**Important gotcha:** Agar aap Price Class 100 choose karte ho, to India ka user **fail nahi hoga** — usko bas Europe ya US ke edge se serve kiya jaayega, jo slow hoga. Ye availability ka issue nahi, **performance ka trade-off** hai.

**Mere project ke liye:** Agar audience mainly India me hai to Price Class 100 use karna galat hoga, kyunki India ke edges usme nahi hain. Price Class All ya 200 chahiye.

### D.11 Compression

CloudFront automatically **Gzip aur Brotli** compression kar sakta hai. Conditions:
- Request me `Accept-Encoding: gzip` ya `br` header ho
- Cache policy me `Compress objects automatically` = Yes ho
- Aur cache policy me `Accept-Encoding` header cache key me include ho
- File size **1,000 bytes se 10,000,000 bytes** ke beech ho
- Content-Type compressible ho (text/html, application/json, text/css, application/javascript etc.)

**Kitna fayda?** Text-based files pe 60-80% size reduction. Matlab bandwidth cost 60-80% kam aur transfer fast.

**Gotcha:** Agar origin already compressed content bhej raha hai (`Content-Encoding: gzip` set karke) to CloudFront dobara compress nahi karega — jo theek hai. But agar aap S3 me pre-compressed files rakh rahe ho aur metadata me `Content-Encoding` set nahi kiya, to browser garbage dikhayega.

### D.12 Custom Error Pages

CloudFront origin ke error responses ko intercept karke apna page dikha sakta hai.

Do bade use cases:

**1. SPA routing (React/Vue/Angular)**
```
Error code: 403 (S3 private bucket se access denied)
Response page path: /index.html
HTTP response code: 200
Error caching TTL: 10 seconds
```
Ye kyun? S3 private bucket me missing object ke liye **404 nahi, 403 aata hai** (kyunki `s3:ListBucket` permission nahi hai to S3 batayega hi nahi ki file exist karti hai ya nahi — ye security feature hai). To SPA ke liye 403 aur 404 dono ko `/index.html` pe map karna padta hai with 200 status.

**2. Branded error page**
```
Error code: 500, 502, 503, 504
Response page path: /error.html
Error caching TTL: 5 seconds (kam rakhna, warna recovery ke baad bhi error dikhega)
```

**Gotcha:** Error caching TTL zyada mat rakho. Agar origin 2 minute ke liye down tha aur aapne error 5 minute cache kar liya, to origin recover hone ke baad bhi users ko error dikhega.

---

## E. Real-World Configuration (mere project me)

### Distribution settings

| Setting | Value | Kyun |
|---------|-------|------|
| Origin domain | `my-project-frontend.s3.ap-south-1.amazonaws.com` | **REST endpoint use kiya, website endpoint nahi** — kyunki OAC sirf REST endpoint ke saath kaam karta hai |
| Origin access | Origin Access Control (OAC), signing enabled | Bucket private rahega |
| Viewer protocol policy | Redirect HTTP to HTTPS | Security |
| Allowed methods | GET, HEAD, OPTIONS | Static site, write nahi chahiye |
| Cache policy (default) | CachingOptimized | Static assets |
| Compress objects | Yes | Bandwidth bachat |
| Alternate domain names | `myproject.com`, `www.myproject.com` | Custom domain |
| SSL certificate | ACM cert in **us-east-1** | CloudFront requirement |
| Security policy | TLSv1.2_2021 | Modern TLS only |
| Default root object | `index.html` | Apex URL pe index serve ho |
| Price class | All (India audience) | Performance |
| Standard logging | Enabled → separate S3 bucket | Debugging + analytics |
| WAF | Optional (cost consideration) | Bot/attack protection |

### Cache-Control strategy (deployment script me set karta hoon)

```bash
# Hashed static assets — 1 saal cache, kabhi change nahi honge
aws s3 sync ./dist/assets s3://my-project-frontend/assets \
  --cache-control "public, max-age=31536000, immutable" \
  --delete

# index.html — kabhi cache mat karo browser me, CloudFront me short
aws s3 cp ./dist/index.html s3://my-project-frontend/index.html \
  --cache-control "public, max-age=0, must-revalidate" \
  --content-type "text/html"

# Deploy ke baad sirf index.html invalidate karo — cost efficient
aws cloudfront create-invalidation \
  --distribution-id E1ABCDEFGHIJKL \
  --paths "/index.html" "/"
```

**Ye script interview me bolna bahut strong signal hai** — isse pata chalta hai ki aapne actually deployment pipeline socha hai, sirf console me click nahi kiya.

### Custom error responses

| HTTP Error Code | Response Page | Response Code | Error Caching TTL |
|-----------------|---------------|---------------|-------------------|
| 403 | `/index.html` | 200 | 10 |
| 404 | `/index.html` | 200 | 10 |

### Response Headers Policy (security headers)

```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; ...
```

Ye AWS ke managed `SecurityHeadersPolicy` se mil jaate hain — manually CloudFront Function likhne ki zaroorat nahi.

---

## F. Common Mistakes & Gotchas

**1. S3 website endpoint vs REST endpoint confusion — ye sabse bada gotcha hai**

| | REST endpoint | Website endpoint |
|-|---------------|------------------|
| **URL** | `bucket.s3.region.amazonaws.com` | `bucket.s3-website-region.amazonaws.com` |
| **HTTPS** | ✅ | ❌ Sirf HTTP |
| **OAC/OAI** | ✅ Kaam karta hai | ❌ Nahi |
| **`index.html` auto-serve for `/folder/`** | ❌ Nahi | ✅ Haan |
| **Custom error document** | ❌ | ✅ |
| **Redirect rules** | ❌ | ✅ |
| **Missing object pe** | 403 (if private) | 404 |

To agar aapko private bucket chahiye to REST endpoint + OAC use karo, aur index-document behaviour CloudFront Function se handle karo. Agar website endpoint use karoge to bucket public karna padega.

**2. ACM certificate galat region me banana**
Mumbai me cert banaya, CloudFront me dikh hi nahi raha. **us-east-1 me banao.**

**3. `Cache-Control` set hi nahi karna**
Origin se koi header nahi aaya to CloudFront Default TTL (24 ghante) use karega. Aapne bug fix deploy kiya, users ko 24 ghante purana JS milta rahega.

**4. Har deploy pe `/*` invalidate karna**
Cache poori khali ho gayi, agla har request origin pe. Traffic spike, origin load, aur invalidation cost. Versioning use karo.

**5. Cache key me sab kuch daal dena**
Saare query strings, saare headers, saare cookies forward kar diye. Cache hit ratio ~0% ho gaya. CDN ka koi fayda nahi mila but bill aa gaya.

**6. Origin ko public chhod dena**
CloudFront laga liya but S3 bucket abhi bhi public hai. Log directly S3 URL hit kar rahe hain, CloudFront bypass ho raha hai, WAF ka protection nahi mil raha, aur S3 se direct data transfer mehnga hai.

**7. CORS ke liye `Origin` header forward na karna**
S3 CORS configure kiya but CloudFront `Origin` header forward nahi kar raha to S3 CORS headers return hi nahi karega. `Managed-CORS-S3Origin` origin request policy use karo.

**8. `Accept-Encoding` cache key me nahi hai**
Compression enable kiya but cache key me `Accept-Encoding` nahi hai to compressed aur uncompressed versions mix ho sakti hain. AWS ki `CachingOptimized` policy isko sahi handle karti hai.

**9. Price Class 100 with Indian audience**
Cost bachane ke chakkar me India ke users ko Europe se serve kar rahe ho. Latency badh gayi, CDN ka point hi khatam.

**10. Lambda@Edge ko galat region me deploy karna**
Lambda@Edge **hamesha us-east-1** me create hota hai, phir replicate hota hai. Aur usko delete karne ke liye pehle distribution se detach karna padta hai aur replicas delete hone ka wait karna padta hai (kuch ghante lag sakte hain).

**11. Error caching TTL zyada rakhna**
Origin 30 second down tha, error 5 minute cache ho gaya. Users ko 5 minute error dikha.

**12. Distribution deploy hone ka time**
Changes propagate hone me typically kuch minutes lagte hain. Log turant test karke bolte hain "kaam nahi kar raha". Thoda wait karo aur `X-Cache` header dekho.

---

## G. Cost Model

CloudFront ke charge 4 main cheezon pe hain:

| Charge | Detail | Approx (India/Asia edges — region ke hisaab se alag) |
|--------|--------|--------------------------------------|
| **Data transfer out to internet** | Edge se user tak | ~$0.085–$0.17/GB (India mehnga hai) |
| **HTTP/HTTPS requests** | Per 10,000 requests | ~$0.0075–$0.0090 |
| **Data transfer to origin** | Uploads (POST/PUT body) | ~$0.02/GB |
| **CloudFront → S3/EC2 origin fetch** | **FREE** ✅ | AWS ka bada fayda |
| **Invalidation** | First 1000 paths/month free, phir | $0.005 per path |
| **Field-level encryption** | Per 10,000 requests | $0.02 |
| **Dedicated IP SSL** | Per month | **$600** |
| **Origin Shield** | Per 10,000 requests | ~$0.0075–$0.02 |
| **CloudFront Functions** | Per 1M invocations | ~$0.10 |
| **Lambda@Edge** | Per 1M requests + GB-seconds | ~$0.60 + compute |

**Free Tier (perpetual, na ki 12-month):** 1 TB data transfer out + 10 million HTTP/HTTPS requests + 2 million CloudFront Functions invocations per month.

**Ye bolna interview me acha lagta hai:**
> "Mere project me CloudFront ka cost practically zero raha kyunki AWS ka CloudFront free tier perpetual hai — 1 TB data transfer aur 10 million requests per month. Aur ek interesting baat ye hai ki CloudFront actually **paisa bachata hai**, badhata nahi — kyunki CloudFront se S3 origin tak ka fetch free hai, aur agar main directly S3 se serve karta to har GB pe ~$0.09 lagta. CloudFront ke saath sirf edge se user tak ka transfer chargeable hai aur wo bhi high cache hit ratio ki wajah se kam data transfer karta hai."

**Cost optimization checklist:**
1. **Cache hit ratio badhao** — ye sabse bada lever hai. CloudWatch me `CacheHitRate` metric monitor karo, target 85%+
2. **Compression on karo** — 60-80% kam bytes
3. **Versioning use karo, invalidation nahi**
4. **Price class evaluate karo** — agar audience sirf India+US hai to Class 200 sufficient ho sakta hai
5. **Marketing query params exclude karo** cache key se
6. **TTL badhao** static assets ke liye
7. **Origin Shield** tab use karo jab multiple regions se traffic aa raha ho aur origin load kam karna ho — warna extra cost hai

---

## H. Security Best Practices

**1. Origin ko lock karo**
- S3 → OAC use karo, Block Public Access ON rakho
- ALB/EC2 origin → custom secret header add karo (`X-Origin-Verify: <random>`) aur ALB pe rule lagao ki bina us header ke request drop ho jaaye. Ya security group me sirf CloudFront ke prefix list (`com.amazonaws.global.cloudfront.origin-facing`) allow karo

**2. HTTPS enforce karo**
- Viewer protocol policy: Redirect HTTP to HTTPS
- Origin protocol policy: HTTPS Only
- Minimum TLS: TLSv1.2_2021

**3. AWS WAF attach karo**
- Managed rule groups: Core Rule Set, Known Bad Inputs, IP Reputation List
- Rate-based rule: ek IP se 5 minute me 2000+ requests → block

**4. AWS Shield**
- Standard **free aur automatically on** hai — L3/L4 DDoS protection
- Advanced ($3000/month) sirf enterprise ke liye

**5. Security headers via Response Headers Policy**
HSTS, X-Content-Type-Options, X-Frame-Options, CSP, Referrer-Policy

**6. Geo restriction**
Agar aapka service sirf India me chahiye to baaki countries block kar sakte ho — attack surface kam hota hai

**7. Signed URLs/Cookies** private content ke liye

**8. Field-level encryption**
Sensitive form fields (credit card, SSN) ko edge pe hi public key se encrypt karo, taaki wo aapke application layer me bhi plaintext me na aaye — sirf wo service jiske paas private key hai decrypt kar sake

**9. Logging**
- Standard logs → S3 (sasta, batch)
- Real-time logs → Kinesis Data Streams (mehnga, live monitoring ke liye)
- CloudTrail for API calls

---

## I. Interview Q&A — CloudFront

---

**Q1. CloudFront kya hai aur aapne apne project me kyun lagaya?**

> CloudFront AWS ka CDN hai jo content ko duniya bhar ke edge locations pe cache karta hai. Maine isko chaar wajah se lagaya. Pehla, latency — mera S3 bucket ek hi region me hai, to door ke users ko slow response milta. CloudFront se content unke nearest edge se serve hota hai. Doosra, aur ye practically sabse important tha — **S3 static website hosting HTTPS support nahi karta custom domain ke saath**. Custom domain pe SSL ke liye CloudFront lagana zaroori tha. Teesra, security — CloudFront ke peeche main apne S3 bucket ko completely private rakh paya OAC se, aur free Shield Standard DDoS protection mil gaya. Chautha, cost — CloudFront se S3 origin fetch free hai aur edge se transfer S3 direct transfer se sasta hai.

---

**Q2. Edge location aur regional edge cache me kya farq hai?**

> Edge locations 700 se zyada hain aur user ke sabse paas hoti hain — inka kaam latency kam karna hai. Lekin ye cache size me chhoti hoti hain, to kam popular content jaldi evict ho jaata hai. Isliye AWS ne beech me regional edge caches banaye — ye lagbhag 13 hain aur bahut badi cache size rakhte hain. Jab edge pe miss hota hai to request seedhe origin nahi jaati, pehle regional edge cache check hota hai. Isse origin ka load kaafi kam ho jaata hai aur overall cache hit ratio badhta hai. Ek gotcha ye hai ki dynamic content aur proxy methods jaise POST/PUT ke liye regional edge cache bypass ho jaata hai.

---

**Q3. Cache key kya hai? Cache hit ratio kaise improve karoge?**

> Cache key wo unique identifier hai jisse CloudFront decide karta hai ki request ka response cache me hai ya nahi. By default ye sirf hostname aur URL path hota hai, lekin main isme headers, cookies aur query strings add kar sakta hoon cache policy ke through. Golden rule ye hai ki cache key jitna specific hoga, hit ratio utna kam hoga — kyunki har variation ki alag copy banegi. Hit ratio improve karne ke liye main teen cheezein karta hoon: marketing query parameters jaise utm_source aur fbclid ko cache key se exclude karta hoon, jo headers sirf origin ko chahiye unko origin request policy me daalta hoon cache policy me nahi, aur static assets ke liye long TTL set karta hoon. CloudWatch me CacheHitRate metric monitor karta hoon, target 85 percent se upar rakhta hoon.

---

**Q4. Cache policy aur origin request policy me kya difference hai? Ek example do.**

> Cache policy define karti hai ki cache key me kya jaayega, matlab caching pe seedha asar. Origin request policy define karti hai ki origin ko kya forward hoga, lekin usse cache key affect nahi hoti. Ek important rule ye hai ki jo bhi cache policy me hai wo automatically origin ko bhi jaata hai — origin request policy usme extra add karti hai. Example lete hain: maan lo mere origin ko analytics ke liye User-Agent header chahiye. Agar main usko cache policy me daaloonga to har browser aur har version ki alag cache entry banegi, hit ratio tabah ho jaayega. Isliye main User-Agent ko origin request policy me daalta hoon — origin ko mil jaayega, but cache ek hi entry rakhega.

---

**Q5. Aapne naya code deploy kiya but users ko purana version dikh raha hai. Debug kaise karoge?**

> Sabse pehle main response headers dekhunga — `X-Cache` header batayega Hit hai ya Miss, aur `Age` header batayega ki object kitne der se cache me hai. Agar Hit aa raha hai aur Age zyada hai to CloudFront cache ka issue hai. Phir main check karunga ki S3 pe naya file actually gaya ya nahi — ho sakta hai deploy hi fail ho gaya ho. Agar S3 pe naya hai to main object ke `Cache-Control` header dekhunga — agar wo missing hai to CloudFront default TTL 24 ghante use kar raha hoga. Immediate fix ke liye main affected paths invalidate karunga. Lekin long term fix ye hai ki build me content hashing lagayi jaaye taaki file ka naam hi badal jaaye aur invalidation ki zaroorat na pade. Aur ye bhi check karunga ki browser cache to nahi hai — hard reload ya incognito me test karunga.

---

**Q6. OAC kya hai aur OAI se kaise better hai?**

> OAC, yaani Origin Access Control, wo mechanism hai jisse main apne S3 bucket ko poori tarah private rakh sakta hoon aur sirf CloudFront ko access de sakta hoon. Bucket policy me main CloudFront service principal ko allow karta hoon, saath me condition lagata hoon ki source ARN meri specific distribution ka ho — ye condition important hai warna koi bhi doosra CloudFront distribution mere bucket se padh sakta hai. OAC purane OAI se teen tarah se better hai: OAC SSE-KMS encrypted objects support karta hai jo OAI nahi karta tha, OAC saare HTTP methods support karta hai na ki sirf GET aur HEAD, aur OAC har request ko SigV4 se sign karta hai jo zyada secure hai. AWS ab OAI ko legacy maanta hai aur naye setups ke liye OAC recommend karta hai.

---

**Q7. Invalidation aur versioning me kya difference hai, aap kaunsa use karte ho?**

> Invalidation matlab CloudFront ko bolna ki ye path ka cached object hata do. Versioning matlab file ka naam hi badal dena, jaise `main.js` ki jagah `main.a3f2b1.js`. Main versioning prefer karta hoon teen wajah se. Pehla, cost — invalidation ke pehle 1000 paths free hain, uske baad har path ka paisa lagta hai, jabki versioning free hai. Doosra, speed — versioned file ka naya URL matlab naya object, instantly available, jabki invalidation propagate hone me time lagta hai. Teesra, rollback — versioning me purana file abhi bhi cache me hai to rollback instant ho jaata hai. Mera build tool automatically content hash lagata hai. Sirf `index.html` ko main short TTL pe rakhta hoon aur deploy ke baad sirf usi ko invalidate karta hoon.

---

**Q8. CloudFront Functions aur Lambda@Edge me kya farq hai? Aapne kaunsa use kiya?**

> CloudFront Functions bahut lightweight hai — JavaScript me likha jaata hai, edge location pe hi chalta hai, sub-millisecond me execute hota hai, 2 MB memory aur 10 KB code limit hai, aur sirf viewer request aur viewer response triggers support karta hai. Isme network access ya request body access nahi milta. Lambda@Edge zyada powerful hai — Node ya Python, 128 MB se 10 GB memory, network calls kar sakta hai, aur origin request aur origin response triggers bhi support karta hai, lekin ye regional edge cache pe chalta hai aur mehnga hai. Maine apne SPA ke routing ke liye CloudFront Function use kiya — jo URI me extension nahi hai usko `/index.html` pe rewrite kar deta hai. Ye logic sirf 5 lines ka hai, to Lambda@Edge overkill hota aur 6 guna mehnga padta.

---

**Q9. Aapka React SPA hai. User `/dashboard` pe directly refresh karta hai aur 403 aata hai. Kya problem hai aur kaise fix karoge?**

> Problem ye hai ki `/dashboard` ek client-side route hai — S3 me aisa koi object exist nahi karta. Aur kyunki mera bucket private hai aur mere paas `s3:ListBucket` permission nahi di gayi, S3 404 ki jagah **403 Access Denied** return karta hai — ye jaanbujh ke aisa hai taaki koi bucket ke contents enumerate na kar sake. Iske do fix hain. Simple fix: CloudFront me custom error response configure karo — 403 aur 404 dono ke liye response page `/index.html` aur response code 200, error caching TTL kam rakho jaise 10 second. Better fix: ek CloudFront Function likho jo viewer request pe check kare ki URI me file extension hai ya nahi — agar nahi hai to usko `/index.html` pe rewrite kar do. Main function wala approach prefer karta hoon kyunki usme actual 404s abhi bhi proper 404 return kar sakte hain.

---

**Q10. CloudFront ke liye SSL certificate kis region me hona chahiye aur kyun?**

> CloudFront ke liye ACM certificate **us-east-1 yaani N. Virginia** me hona mandatory hai, chahe origin kisi bhi region me ho. Iski wajah ye hai ki CloudFront ek global service hai — wo kisi ek region se bound nahi hai — aur AWS ne global services ka control plane us-east-1 me rakha hai, jaise IAM aur CloudFront ke liye WAF bhi. Agar main Mumbai region me cert banaunga to wo CloudFront ke dropdown me dikhega hi nahi. Iske ulta, ALB ke liye certificate ALB ke apne region me hona chahiye — ye ek common confusion hai. Ek aur point — ACM se banaya hua public certificate free hai aur auto-renew hota hai agar DNS validation use kiya ho.

---

**Q11. Price class kya hai? Agar main Price Class 100 choose karoon to India ke users ko site kaam karegi?**

> Price class decide karta hai ki aapki content kaunse edge locations pe distribute hogi. Class All me saare edges shamil hain, Class 200 me sabse mehnge region jaise South America, Australia aur New Zealand nikal jaate hain, aur Class 100 me sirf US, Canada, Europe aur Israel bachte hain. India ke users ke liye site **kaam karegi** — wo fail nahi hogi. Lekin unki requests Europe ya US ke edge tak jaayengi, matlab latency 250 millisecond ke aas paas ho jaayegi. To ye availability ka issue nahi, performance ka trade-off hai. Mere project ki audience India me hai, isliye maine Price Class All rakha — cost thoda zyada hai but CDN lagane ka poora point hi latency kam karna tha.

---

**Q12. Aapke CloudFront ka cache hit ratio sirf 20% hai. Ise kaise improve karoge?**

> Main pehle CloudWatch me CacheHitRate metric aur CloudFront access logs analyze karunga taaki pata chale ki kaunse paths miss ho rahe hain. Sabse common wajah cache key ka bahut specific hona hoti hai. Main check karunga ki kya main saare query strings forward kar raha hoon — agar haan, to marketing params jaise utm_source, fbclid, gclid ko exclude karunga kyunki wo same content ki alag alag copies bana rahe hain. Phir headers dekhunga — agar User-Agent ya Accept-Language cache key me hain to wo hataake origin request policy me daalunga. Cookies bhi same tarah check karunga. Uske baad TTL settings — agar origin `Cache-Control: no-cache` bhej raha hai to static assets ke liye usko fix karunga ya CloudFront me Min TTL set karunga. Aur agar traffic multiple regions se aa raha hai to Origin Shield enable karne pe consider karunga.

---

**Q13. Signed URL aur signed cookie me kya difference hai? Kab kaunsa use karoge?**

> Dono ka purpose private content ko controlled access dena hai. Signed URL ek specific file ke liye hota hai — us URL me expiry time aur signature embed hota hai. Signed cookies ek policy sign karti hain jo multiple files ya ek path pattern cover kar sakti hai, aur wo browser me cookie ki tarah store hoti hain to URL clean rehta hai. Use case ke hisaab se: agar mujhe ek single file ka download link email me bhejna hai to signed URL. Agar mera subscription-based video platform hai jahan ek HLS video 500 segments me toota hua hai, to har segment ke liye alag URL sign karna practical nahi — wahan signed cookies use karunga, ek baar login pe cookie set kar dunga jo poore content path ko cover karti hai. Dono me main expiry time, start time aur optionally IP range specify kar sakta hoon, halanki IP restriction mobile users ke liye risky hai kyunki network switch pe IP badal jaata hai.

---

**Q14. Aapka origin S3 hai. Log CloudFront bypass karke directly S3 URL hit kar rahe hain. Kaise rokoge?**

> Ye tab hota hai jab bucket public ho. Main teen steps lunga. Pehle, S3 pe **Block Public Access** ke saare chaar options ON kar dunga aur koi bhi public bucket policy ya ACL hata dunga. Doosra, CloudFront distribution me **Origin Access Control** enable karunga signing behavior ke saath. Teesra, bucket policy me sirf CloudFront service principal ko `s3:GetObject` allow karunga, condition ke saath ki `AWS:SourceArn` meri specific distribution ka ARN ho. Ye condition critical hai — iske bina koi bhi doosra CloudFront distribution mera bucket read kar sakta hai, jise confused deputy problem bolte hain. Ek aur cheez dhyaan rakhni hai — origin me S3 ka REST endpoint use karna hai, website endpoint nahi, kyunki OAC website endpoint ke saath kaam nahi karta.

---

**Q15. Production me CloudFront se 502 Bad Gateway aa raha hai. Kaise debug karoge?**

> 502 ka matlab hai CloudFront origin tak pahuncha to sahi, lekin origin ka response invalid tha. Main ye order me check karunga. Pehle **SSL/TLS issue** — agar origin protocol policy HTTPS Only hai to origin ka certificate valid, non-expired aur CloudFront ke trusted CAs se signed hona chahiye. Self-signed cert 502 deta hai. Cert ka domain name bhi origin domain se match karna chahiye. Doosra, **cipher/protocol mismatch** — agar origin sirf purane TLS versions support karta hai jo CloudFront nahi karta. Teesra, **origin ka response malformed** — invalid headers, ya header size CloudFront ki limit se zyada. Chautha, agar Lambda@Edge attached hai to uska error bhi 502 de sakta hai — CloudWatch Logs me us function ke logs dekhunga, but yaad rakhna hoga ki Lambda@Edge ke logs us region me jaate hain jahan execution hua, na ki us-east-1 me. Debugging ke liye main CloudFront standard logs enable karunga aur `x-edge-result-type` aur `x-edge-detailed-result-type` fields dekhunga, jo exact reason batate hain.

---

**Q16. CloudFront cost kaise kam karoge?**

> Sabse bada lever cache hit ratio hai — jitna zyada content edge se serve hoga, utna kam origin fetch aur utna kam overall data movement. Main cache key optimize karta hoon, unnecessary query params aur headers hataata hoon, aur static assets pe long TTL rakhta hoon. Doosra, compression enable karta hoon — Gzip ya Brotli se text assets 60 se 80 percent chhote ho jaate hain, aur data transfer out hi CloudFront ka sabse bada charge hai. Teesra, invalidation ki jagah file versioning use karta hoon, jisse invalidation charges zero rehte hain. Chautha, price class evaluate karta hoon — agar meri audience sirf specific geographies me hai to sasti class choose kar sakta hoon. Aur ek structural point ye hai ki CloudFront use karna khud ek cost optimization hai, kyunki CloudFront se S3 origin tak ka data transfer free hai jabki S3 se direct internet transfer per GB charge hota hai.

---
---

# 3. Amazon S3 (Simple Storage Service)

---

## A. Simple Explanation

### Service kya hai

S3 AWS ka **object storage** service hai. Isme aap koi bhi file — image, video, PDF, JSON, backup, log — daal sakte ho, aur wo virtually unlimited scale pe store hoti hai with **99.999999999% (11 nines) durability**.

Sabse important cheez samajhne wali: **S3 ek file system nahi hai, ye ek key-value store hai.** Isme actually koi folder nahi hote — jo aapko console me folders dikhte hain wo bas key naam me `/` hai, jise UI folder ki tarah render karta hai.

### Real-world analogy (interview me bolna)

> "Sir, S3 ko main aise samjhata hoon — ye ek **infinite-size cloakroom** hai. Aap koi bhi bag (object) jama karte ho aur aapko ek **token (key)** milta hai. Jab chahiye, token dikhao, bag mil jaayega. Cloakroom wale ko fark nahi padta ki bag me kya hai — 1 KB ka ho ya 5 TB ka. Aur unhone aapke bag ki 3 copies alag-alag buildings (Availability Zones) me rakh di hain, taaki ek building gir bhi jaaye to aapka saamaan safe rahe. Ek aur baat — is cloakroom me **shelves nahi hain, sirf tokens hain**. Jo aapko 'folder' dikhta hai wo actually token naam ka hissa hai, jaise `photos/2024/goa.jpg`."

---

## B. Why It Exists / Problem It Solves

**Problem 1 — Server ki disk limited hai.**
EC2 pe EBS volume attach karoge to wo fixed size ka hai, aur badhane ke liye manual kaam karna padega. S3 me limit hai hi nahi.

**Problem 2 — Disk fail ho jaati hai.**
Ek server ki hard disk ka annual failure rate ~2% hai. S3 automatically data ko **kam se kam 3 Availability Zones** me replicate karta hai. 11 nines durability ka practical matlab: agar aapke paas 10 million objects hain to statistically ek object khone me **10,000 saal** lagenge.

**Problem 3 — Scaling ka jhanjhat.**
Traffic badha to disk badhao, RAID setup karo, backup lo. S3 me kuch nahi karna, wo automatically scale hota hai.

**Problem 4 — Static files serve karne ke liye poora server chalana.**
Sirf HTML/CSS/JS serve karne ke liye EC2 instance 24×7 chalana waste hai. S3 static website hosting se server hi nahi chahiye.

**Problem 5 — Storage cost.**
Server disk mehngi hai aur idle bhi paisa leti hai. S3 me aap sirf **jitna store kiya utna** dete ho, aur purana data automatically sasti class me shift ho sakta hai.

---

## C. How It Actually Works (Internal Flow)

### Object PUT ka flow

```
1. Client → PUT https://my-bucket.s3.ap-south-1.amazonaws.com/photos/goa.jpg
   Authorization header me SigV4 signature (access key se signed)

2. DNS: bucket-specific endpoint resolve hota hai
   (virtual-hosted style: bucket naam subdomain me)

3. S3 FRONT-END (web servers)
   - Signature verify (kya ye request genuine hai?)
   - Request routing

4. AUTHORIZATION EVALUATION
   S3 poora policy evaluation karta hai:
   - Explicit DENY kahin bhi? → REJECT (deny hamesha jeetta hai)
   - Organization SCP allow karta hai?
   - Bucket policy?
   - IAM identity policy?
   - ACL?
   - Block Public Access settings?
   - VPC endpoint policy?
   Koi bhi ALLOW nahi mila → implicit DENY

5. INDEX/METADATA LAYER
   Key → physical location ka mapping store hota hai.
   Ye ek massively distributed key-value index hai.

6. STORAGE LAYER (partitioning + replication)
   - Data ko chunks me toda jaata hai
   - Erasure coding / replication ke through kam se kam 3 AZs me likha jaata hai
   - Har AZ ek alag physical data center hai

7. DURABLE COMMIT
   Jab tak sab AZs me durably write nahi ho jaata, success return nahi hota

8. SUCCESS RESPONSE
   200 OK + ETag (usually content ka MD5, but multipart me alag)
   + VersionId (agar versioning on hai)
```

### Object GET ka flow

```
1. GET request with SigV4 signature (ya presigned URL, ya public)
2. Authorization evaluation (same as above)
3. Index lookup: key → storage location
4. Versioning ON hai to latest version fetch (unless versionId specified)
5. Encryption: SSE hai to transparently decrypt (KMS ho to KMS call)
6. Storage class check — agar Glacier Flexible/Deep Archive hai to
   direct GET fail hoga, pehle RESTORE karna padega
7. Data stream back to client
```

### Key components

| Component | Role |
|-----------|------|
| **Bucket** | Top-level container, **globally unique naam**, ek region me rehta hai |
| **Object** | Actual data + metadata. Max **5 TB** |
| **Key** | Object ka full path/naam — `photos/2024/goa.jpg` |
| **Prefix** | Key ka shuruaati hissa — `photos/2024/`. Performance partitioning isi pe hoti hai |
| **Metadata** | System metadata (Content-Type, Content-Length) + user metadata (`x-amz-meta-*`) |
| **ETag** | Object ka identifier — single-part upload me MD5, multipart me alag format |
| **Version ID** | Agar versioning on hai to har version ka unique ID |
| **Region** | Bucket ka physical location — data wahin rehta hai (data residency) |

---

## D. Key Concepts & Terminology

### D.1 Bucket vs Object — aur flat namespace

**Bucket rules:**
- Naam **globally unique** hona chahiye — poore AWS me, saare accounts me
- 3–63 characters, lowercase, numbers, hyphens, dots
- Naam banane ke baad **change nahi kar sakte**
- Ek region me create hota hai, data wahin rehta hai
- Default limit: 100 buckets per account (10,000 tak badhaya ja sakta hai)

**Object:**
- Max size **5 TB**
- Single PUT operation me max **5 GB** — usse zyada ke liye multipart mandatory
- Object immutable hai — "edit" ka matlab hai poora replace

**Flat namespace ka matlab:**
```
Aapko console me ye dikhta hai:
  photos/
    2024/
      goa.jpg

Actual me S3 me sirf ek object hai jiski key hai:
  "photos/2024/goa.jpg"

Koi "photos" folder object exist nahi karta.
Isliye "folder rename" ka operation S3 me hai hi nahi —
aapko har object copy karke purana delete karna padta hai.
```

### D.2 Storage Classes — poori comparison

| Class | Durability | Availability | AZs | Min storage duration | Min billable size | Retrieval fee | Cost/GB/month (us-east-1, approx) | Use case |
|-------|-----------|--------------|-----|---------------------|-------------------|---------------|--------------|----------|
| **S3 Standard** | 11 nines | 99.99% | ≥3 | — | — | Nahi | ~$0.023 | Frequently accessed, active website assets |
| **S3 Intelligent-Tiering** | 11 nines | 99.9% | ≥3 | — | 128 KB (for auto-tiering) | Nahi | ~$0.023 + monitoring fee | Unknown/changing access patterns |
| **S3 Standard-IA** | 11 nines | 99.9% | ≥3 | **30 din** | 128 KB | ✅ Per GB | ~$0.0125 | Backups, monthly reports |
| **S3 One Zone-IA** | 11 nines (within 1 AZ) | 99.5% | **1** | **30 din** | 128 KB | ✅ Per GB | ~$0.01 | Re-creatable data, secondary backup, thumbnails |
| **S3 Glacier Instant Retrieval** | 11 nines | 99.9% | ≥3 | **90 din** | 128 KB | ✅ Higher | ~$0.004 | Medical images, news archives — quarterly access but instant chahiye |
| **S3 Glacier Flexible Retrieval** | 11 nines | 99.99% (after restore) | ≥3 | **90 din** | 40 KB | ✅ | ~$0.0036 | Archives — minutes (expedited) to hours (bulk) |
| **S3 Glacier Deep Archive** | 11 nines | 99.99% (after restore) | ≥3 | **180 din** | 40 KB | ✅ Highest | ~$0.00099 | Compliance archives, 7-10 saal ke records. Retrieval 12-48 ghante |
| **S3 Express One Zone** | — | 99.95% | 1 (single AZ, directory bucket) | — | — | Nahi | Zyada storage cost, kam request cost | Single-digit millisecond latency, ML training, high-frequency small objects |

*Prices region aur time ke saath badalte hain — interview me approximate bolna theek hai, exact number pe adamant mat raho.*

**Key insight jo interview me bolna:**
> "Storage class choose karte waqt sirf per-GB price mat dekho. Standard-IA ka storage 45% sasta hai, but usme **retrieval charge** hai aur **30 din ka minimum duration** hai. Agar mera data har hafte access hota hai to IA actually Standard se **mehnga** pad jaayega. Isliye main frequently accessed data pe Standard rakhta hoon aur sirf 30 din se purane, kam access hone wale data ko IA me bhejta hoon."

**One Zone-IA ka trade-off:**
> "One Zone-IA 20% sasta hai IA se, but ye sirf ek AZ me rehta hai. Iska matlab ye nahi ki data corrupt ho jaayega — durability abhi bhi 11 nines hai. Matlab ye hai ki agar poora AZ hi destroy ho jaaye to data gaya. Isliye ye sirf **re-creatable data** ke liye use karo — jaise image thumbnails jo original se dobara ban sakte hain, ya transcoded videos."

### D.3 Lifecycle Policies

Automatic rules jo objects ko age ke hisaab se transition ya expire karti hain.

Do type ke actions:
1. **Transition** — doosri storage class me bhejo
2. **Expiration** — delete kar do

```json
{
  "Rules": [
    {
      "ID": "ArchiveOldUserUploads",
      "Status": "Enabled",
      "Filter": {
        "And": {
          "Prefix": "uploads/",
          "Tags": [{ "Key": "archive", "Value": "true" }]
        }
      },
      "Transitions": [
        { "Days": 30,  "StorageClass": "STANDARD_IA" },
        { "Days": 90,  "StorageClass": "GLACIER_IR" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "Expiration": { "Days": 2555 },
      "NoncurrentVersionTransitions": [
        { "NoncurrentDays": 30, "StorageClass": "STANDARD_IA" }
      ],
      "NoncurrentVersionExpiration": { "NoncurrentDays": 90 },
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}
```

**`AbortIncompleteMultipartUpload` — ye rule har bucket me hona chahiye.** Agar multipart upload beech me fail ho jaaye to uploaded parts S3 me pade rehte hain, **aur unka storage charge lagta rehta hai**, but wo console me object list me dikhte bhi nahi. Log mahino tak "ghost storage" ka bill bharte rehte hain. Ye ek bahut acha interview point hai.

**Lifecycle gotchas:**
- Transitions **sirf ek direction me** ja sakti hain (Standard → IA → Glacier), reverse nahi. Glacier se wapas laane ke liye restore + copy karna padta hai
- Standard → Standard-IA transition ke liye object kam se kam **30 din** purana hona chahiye
- 128 KB se chhote objects IA/Glacier me transition nahi hote (transition ka fayda nahi hota)
- Har transition pe **per-object request charge** lagta hai — millions of tiny objects transition karna mehnga pad sakta hai

### D.4 Versioning

Versioning on karne se S3 har object ke saare versions rakhta hai.

| State | Description |
|-------|-------------|
| **Unversioned** | Default state |
| **Enabled** | Saare versions rakhe jaayenge |
| **Suspended** | Naye versions nahi banenge, but purane rahenge. **Wapas Unversioned nahi ho sakta** |

**Delete ka behaviour — ye poocha jaata hai:**
```
DELETE object (bina version ID ke)
  → Object actually delete NAHI hota
  → Ek "delete marker" naam ka special version create hota hai
  → GET karne pe 404 aayega (kyunki latest version delete marker hai)
  → Delete marker ko delete karo → object wapas aa jaayega ✅

DELETE object WITH version ID
  → Wo specific version permanently delete
  → Ye irreversible hai ❌
```

**MFA Delete** — extra protection. Version permanently delete karne ya versioning suspend karne ke liye MFA token chahiye. Sirf **root user** enable kar sakta hai, aur sirf **CLI/API se** (console se nahi).

**Cost warning:** Versioning me har version ka **poora storage** charge hota hai — S3 diffs store nahi karta. Agar aap ek 100 MB file ko 50 baar update karte ho to 5 GB storage lagega. Isliye `NoncurrentVersionExpiration` lifecycle rule lagana zaroori hai.

**Ye ransomware protection bhi hai** — agar koi attacker files overwrite kar de to purane versions se recover kar sakte ho.

### D.5 Static Website Hosting

S3 me static website hosting enable karne pe alag endpoint milta hai.

| | REST Endpoint | Website Endpoint |
|-|---------------|------------------|
| **Format** | `bucket.s3.region.amazonaws.com` | `bucket.s3-website-region.amazonaws.com` (kabhi `.` kabhi `-` region se pehle) |
| **HTTPS** | ✅ | ❌ **Sirf HTTP** |
| **Index document (`/` → `index.html`)** | ❌ | ✅ |
| **Custom error document** | ❌ | ✅ |
| **Redirect rules** | ❌ | ✅ |
| **OAC/OAI support** | ✅ | ❌ |
| **Bucket must be public** | Nahi | **Haan** |
| **Missing object** | 403 (agar ListBucket nahi) | 404 |

**Interview me ye clarity dikhao:**
> "Maine website endpoint use **nahi** kiya, REST endpoint use kiya CloudFront ke saath OAC ke through. Wajah ye hai ki website endpoint HTTPS support nahi karta aur usme bucket public karna padta. REST endpoint ke saath main bucket ko poori tarah private rakh paya, HTTPS CloudFront handle karta hai, aur index-document wala behaviour maine CloudFront Function se implement kiya."

### D.6 Bucket Policy vs IAM Policy vs ACL

| | IAM Policy | Bucket Policy | ACL |
|-|-----------|---------------|-----|
| **Attach kahan** | User/Group/Role pe | Bucket pe | Bucket ya object pe |
| **Type** | Identity-based | Resource-based | Legacy |
| **"Kaun" specify karta hai?** | Nahi (implicit — jispe attach hai) | ✅ Haan (`Principal` field) | Haan (grantee) |
| **Cross-account** | Role assume karke | ✅ Directly | Limited |
| **Anonymous/public access** | ❌ | ✅ (`Principal: "*"`) | ✅ |
| **Size limit** | 6 KB (user), 10 KB (role), 20 KB (managed) | 20 KB | — |
| **Granularity** | Multiple services | Ek bucket | Ek object/bucket |
| **AWS recommendation** | ✅ Use | ✅ Use | ❌ **Disable karo** |

**Kab kya use karein:**
- **IAM policy** — jab aapko control karna hai ki *aapke account ka ek user/role* kya kar sakta hai (multiple services pe)
- **Bucket policy** — jab aapko control karna hai ki *is bucket pe* kaun kya kar sakta hai (including cross-account aur anonymous)
- **ACL** — mat use karo. AWS ab **Object Ownership: Bucket owner enforced** recommend karta hai jo ACLs ko poori tarah disable kar deta hai

**Evaluation logic (ye interview ka favourite hai):**
```
1. Kya kahin bhi EXPLICIT DENY hai?
   (SCP, IAM policy, bucket policy, VPC endpoint policy, ACL)
   → HAAN: ACCESS DENIED. Ye final hai, koi allow isko override nahi kar sakta.

2. Block Public Access settings check karo
   → Agar block hai aur request public/anonymous hai: DENIED

3. Kya kahin bhi EXPLICIT ALLOW hai?
   → Same account me: IAM policy YA bucket policy me se koi ek allow kaafi hai
   → Cross-account: DONO taraf allow chahiye (resource policy + caller ki IAM policy)

4. Kuch nahi mila?
   → IMPLICIT DENY (default me sab kuch deny hai)
```

Ek line me: **"Explicit Deny > Explicit Allow > Implicit Deny."**

### D.7 Block Public Access

Chaar independent settings (bucket level aur account level dono pe available):

| Setting | Kya rokta hai |
|---------|--------------|
| `BlockPublicAcls` | **Naye** public ACLs banane se rokta hai |
| `IgnorePublicAcls` | **Existing** public ACLs ko ignore karta hai |
| `BlockPublicPolicy` | **Naye** public bucket policies banane se rokta hai |
| `RestrictPublicBuckets` | Existing public policies ko sirf AWS service principals aur authorized users tak limit karta hai |

Account level pe on karne se saare buckets pe apply hota hai — ye **guardrail** ki tarah kaam karta hai.

**Ye kyun banaya gaya?** Kyunki duniya bhar me itne data breaches hue sirf "accidentally public S3 bucket" ki wajah se — Verizon, Accenture, Dow Jones, sab ke saath ho chuka hai. AWS ne ab **naye buckets me by default ye ON** kar diya hai.

### D.8 Encryption

**In transit:** HTTPS/TLS. Enforce karne ke liye bucket policy me condition:
```json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"],
  "Condition": { "Bool": { "aws:SecureTransport": "false" } }
}
```

**At rest — chaar options:**

| Type | Key kaun manage karta hai | Key kahan | Audit trail | Extra cost | Use case |
|------|--------------------------|-----------|-------------|------------|----------|
| **SSE-S3** (AES-256) | AWS | AWS ke paas | ❌ Nahi | Free | Default. Ab **automatically enabled** hai naye objects pe (Jan 2023 se) |
| **SSE-KMS** | AWS KMS (aap policy control karte ho) | KMS | ✅ CloudTrail me har decrypt call | KMS request charges | Compliance, granular access control |
| **DSSE-KMS** | KMS, **do layer** encryption | KMS | ✅ | Zyada | Ultra-high compliance (defense, healthcare) |
| **SSE-C** | **Aap** | Aap khud, har request me bhejte ho | ❌ | Free | Aapko key AWS ko nahi deni |
| **Client-side** | Aap, upload se pehle | Aapke paas | — | — | Zero trust in cloud provider |

**SSE-KMS ka gotcha — ye interview me acha lagta hai:**
> "SSE-KMS use karte waqt dhyaan rakhna padta hai ki har GET aur PUT pe ek KMS API call hoti hai, aur KMS pe request quota hai — region ke hisaab se lagbhag 5,500 se 30,000 requests per second. High-throughput workload me ye bottleneck ban jaata hai aur throttling errors aate hain. Iska solution **S3 Bucket Keys** hai — isse S3 KMS se ek bucket-level key leta hai aur usse individual data keys derive karta hai, jisse KMS calls **99% tak kam** ho jaati hain aur cost bhi kaafi kam ho jaati hai."

### D.9 Presigned URLs

Ek temporary URL jo bina AWS credentials ke object access dene deta hai.

```python
import boto3

s3 = boto3.client('s3', region_name='ap-south-1')

# Download link (GET)
download_url = s3.generate_presigned_url(
    'get_object',
    Params={'Bucket': 'my-project-uploads', 'Key': 'invoices/inv-123.pdf'},
    ExpiresIn=900  # 15 minutes
)

# Upload link (PUT) — client browser se directly S3 pe upload
upload_url = s3.generate_presigned_url(
    'put_object',
    Params={
        'Bucket': 'my-project-uploads',
        'Key': f'uploads/{user_id}/{filename}',
        'ContentType': 'image/jpeg'
    },
    ExpiresIn=300
)
```

**Kaise kaam karta hai:** URL me SigV4 signature embed hoti hai jo aapke credentials, bucket, key, HTTP method, aur expiry ko cover karti hai. S3 signature verify karke access de deta hai.

**Important limits:**
- Max expiry **7 din** — agar IAM user ke long-term credentials se sign kiya ho
- Agar **IAM role** (temporary credentials) se sign kiya to URL **role session ke expire hone pe hi expire ho jaayega**, chahe aapne 7 din specify kiya ho. Lambda me ye common gotcha hai — Lambda ka role session usually 1 ghante ka hota hai
- URL ke permissions signer ke permissions se zyada nahi ho sakte

**Sabse bada use case (ye bolna):**
> "Mere project me users profile pictures upload karte hain. Agar main file ko Lambda ke through bhejta to do problems hoti — Lambda ka payload limit 6 MB hai, aur main compute pe paisa deta jab ki kaam sirf file transfer ka hai. Isliye maine **presigned PUT URL** approach use ki: frontend Lambda se ek short-lived presigned URL maangta hai, phir browser **directly S3 pe** upload karta hai. Backend ka kaam sirf URL generate karna hai. Isse scalability, cost aur latency teeno better ho gaye. Aur main URL generate karte waqt key prefix me user ID force karta hoon taaki koi doosre user ke folder me upload na kar sake."

### D.10 CORS

Browser ki same-origin policy ki wajah se agar aapka JS `myproject.com` pe hai aur wo `my-bucket.s3.amazonaws.com` se fetch karta hai, to browser block kar dega — jab tak S3 sahi CORS headers na bheje.

```json
[
  {
    "AllowedHeaders": ["Content-Type", "x-amz-*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": ["https://myproject.com", "https://www.myproject.com"],
    "ExposeHeaders": ["ETag", "x-amz-request-id"],
    "MaxAgeSeconds": 3000
  }
]
```

**Gotchas:**
- `AllowedOrigins` me `*` mat daalo production me
- Agar CloudFront ke through ja rahe ho to CloudFront ko `Origin` header **forward** karna padega, warna S3 CORS headers return nahi karega. Iske liye `Managed-CORS-S3Origin` origin request policy use karo
- `ExposeHeaders` me `ETag` daalna zaroori hai agar frontend multipart upload kar raha hai, kyunki har part ka ETag chahiye hota hai
- **CORS error ≠ permission error.** Agar aapko browser me CORS error dikh raha hai to ho sakta hai actual response 403 ho aur CORS error sirf uska side effect ho

### D.11 Consistency Model

**Ye ek updated fact hai jo bahut logon ko nahi pata — bolne se aap alag dikhoge:**

> "Sir, **December 2020** se S3 ne **strong read-after-write consistency** de di hai, saare regions me, sabhi operations pe — PUT, DELETE, aur LIST bhi. Aur ye **bina kisi extra cost ya performance penalty** ke hai. Pehle sirf naye objects ke PUT pe read-after-write consistency thi, aur overwrite PUT aur DELETE **eventually consistent** the — matlab file update karne ke turant baad read karo to purana version mil sakta tha. Ab wo problem nahi hai. Bahut saari purani tutorials aur books abhi bhi eventual consistency batati hain, isliye ye distinction main specifically yaad rakhta hoon."

**Note:** Bucket configurations (bucket policy, CORS, lifecycle) abhi bhi **eventually consistent** hain. Policy change karke turant test karoge to ho sakta hai purana behaviour mile.

### D.12 Event Notifications

S3 me kuch hone pe automatically kisi service ko trigger karna.

**Events:**
- `s3:ObjectCreated:*` (Put, Post, Copy, CompleteMultipartUpload)
- `s3:ObjectRemoved:*` (Delete, DeleteMarkerCreated)
- `s3:ObjectRestore:*` (Glacier restore)
- `s3:ReducedRedundancyLostObject`
- `s3:LifecycleTransition`, `s3:LifecycleExpiration`
- `s3:Replication:*`

**Destinations:**

| Destination | Kab use karein |
|-------------|----------------|
| **Lambda** | Direct processing — image resize, thumbnail, virus scan |
| **SQS** | Buffering chahiye, ya slow consumer, ya retry control chahiye |
| **SNS** | Fan-out — ek event, multiple subscribers |
| **EventBridge** | Advanced filtering, cross-account, 20+ targets, replay |

**Gotchas:**
- Notifications **at-least-once** delivery hain — matlab **duplicate aa sakte hain**. Aapka consumer **idempotent** hona chahiye
- Delivery typically seconds me hoti hai but **guaranteed order nahi hai**
- Ek hi event type + prefix + suffix combination ke liye ek se zyada destination configure nahi kar sakte (classic S3 notifications me). Iske liye SNS fan-out ya EventBridge use karo
- **Infinite loop ka khatra:** Agar Lambda same bucket me output likhta hai jis bucket ke ObjectCreated pe wo trigger hota hai, to infinite loop ban jaayega aur bill phat jaayega. **Fix:** alag output bucket use karo ya prefix/suffix filter lagao

### D.13 Multipart Upload

Bade files ko parts me todke upload karna.

| Parameter | Value |
|-----------|-------|
| **Kab mandatory** | Object > 5 GB |
| **Kab recommended** | Object > 100 MB |
| **Min part size** | 5 MB (last part chhota ho sakta hai) |
| **Max part size** | 5 GB |
| **Max parts** | 10,000 |
| **Max object size** | 5 TB |

**Flow:**
```
1. CreateMultipartUpload → uploadId milta hai
2. UploadPart (parallel me, har part ka ETag milta hai)
3. CompleteMultipartUpload (saare part numbers + ETags bhejo)
   → S3 parts ko assemble karke ek object banata hai
```

**Fayde:** parallel upload (fast), failed part sirf wahi retry (poora nahi), pause/resume possible, bade files possible.

**Sabse important gotcha (already mention kiya but repeat worth it):**
Agar upload complete nahi hua to parts S3 me pade rehte hain, storage charge lagta rehta hai, aur wo object listing me **dikhte nahi**. Har bucket me `AbortIncompleteMultipartUpload` lifecycle rule lagao (7 days).

### D.14 Replication (CRR / SRR)

| | CRR (Cross-Region) | SRR (Same-Region) |
|-|-------------------|-------------------|
| **Kahan** | Doosre region me | Usi region me, doosre bucket me |
| **Use case** | DR, compliance (data multiple geographies me), latency (users ke paas) | Log aggregation, prod→test data copy, alag account me backup |
| **Cost** | Storage + **cross-region data transfer** | Storage + request charges |

**Requirements:**
- **Source aur destination dono pe versioning ON hona MANDATORY hai**
- IAM role chahiye jo source se read aur destination pe write kar sake
- Cross-account ke liye destination bucket policy bhi chahiye

**Kya replicate hota hai aur kya nahi:**

| Replicate hota hai ✅ | Nahi hota ❌ |
|---------------------|-------------|
| Rule enable karne ke **baad** ke naye objects | Rule se **pehle** ke existing objects (S3 Batch Replication chahiye) |
| Object metadata, tags, ACLs | Lifecycle actions se hue deletions |
| SSE-S3 aur SSE-KMS encrypted objects (KMS config karna padega) | SSE-C encrypted objects |
| Delete markers (agar explicitly enable karo) | Version ID ke saath specific version deletions |

**S3 RTC (Replication Time Control):** SLA deta hai ki 99.99% objects **15 minute** me replicate ho jaayenge, plus replication metrics. Extra cost hai.

### D.15 Durability vs Availability — ye distinction poocha jaata hai

| | Durability | Availability |
|-|-----------|--------------|
| **Matlab** | Data **kho nahi jaayega** | Data **abhi access ho sakta hai** |
| **S3 Standard** | 99.999999999% (11 nines) | 99.99% (SLA 99.9%) |
| **Failure ka matlab** | Data permanently gaya | Data hai but abhi 500 error aa raha hai |

**Ek line me samjhao:**
> "Durability ka matlab hai data survive karega. Availability ka matlab hai data abhi milega. 11 nines durability ka practical matlab ye hai ki agar mere paas 10 million objects hain to statistically ek object khone me 10,000 saal lagenge. Availability 99.99% ka matlab hai saal me lagbhag 52 minute downtime ho sakti hai — us time data safe hai, bas temporarily reachable nahi."

### D.16 Performance

- **Request rate:** Per **prefix** per second — 3,500 PUT/COPY/POST/DELETE aur 5,500 GET/HEAD. Ye per bucket nahi, **per prefix** hai — to prefixes badhake throughput linearly scale kar sakte ho
- **Pehle** random hash prefix recommend hota tha (`a3f2/file.jpg`), **ab zaroorat nahi** — S3 automatically partition karta hai. Lekin agar aapko bahut high throughput chahiye to logical prefixes (`2024/01/`, `2024/02/`) se help milti hai
- **S3 Transfer Acceleration** — CloudFront edge locations ke through upload, long-distance uploads ke liye 50-500% faster. Extra cost hai
- **Byte-range fetches** — bade file ka sirf ek hissa fetch karo, parallel me
- **S3 Select** — server-side SQL query CSV/JSON/Parquet pe, taaki poora file download na karna pade (Note: AWS ab isse legacy maan raha hai aur Athena recommend karta hai naye use cases ke liye)

---

## E. Real-World Configuration (mere project me)

### Do buckets ka design

**Bucket 1: `my-project-frontend`** (static website)
```
Region:                 ap-south-1
Block Public Access:    ALL ON ✅
Bucket policy:          Sirf CloudFront OAC ko s3:GetObject
Versioning:             Enabled (rollback ke liye)
Encryption:             SSE-S3 (default)
Object Ownership:       Bucket owner enforced (ACLs disabled)
Static website hosting: DISABLED (REST endpoint use kar raha hoon)
Lifecycle:              NoncurrentVersionExpiration 30 days
```

**Bucket 2: `my-project-user-uploads`** (user files)
```
Region:                 ap-south-1
Block Public Access:    ALL ON ✅
Access:                 Presigned URLs only
Versioning:             Enabled
Encryption:             SSE-S3 (ya SSE-KMS agar sensitive)
CORS:                   Sirf myproject.com origins
Event notification:     s3:ObjectCreated:* → Lambda (thumbnail generation)
Lifecycle:              30d → Standard-IA, 90d → Glacier IR
                        AbortIncompleteMultipartUpload: 7 days
                        NoncurrentVersionExpiration: 90 days
```

### Bucket policy — CloudFront OAC + HTTPS enforcement

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontOAC",
      "Effect": "Allow",
      "Principal": { "Service": "cloudfront.amazonaws.com" },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-project-frontend/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::111122223333:distribution/E1ABCDEFGHIJKL"
        }
      }
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-project-frontend",
        "arn:aws:s3:::my-project-frontend/*"
      ],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}
```

### Lambda ka execution role — least privilege

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadOriginals",
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::my-project-user-uploads/originals/*"
    },
    {
      "Sid": "WriteThumbnailsOnly",
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::my-project-user-uploads/thumbnails/*"
    }
  ]
}
```

Dhyaan do: `s3:*` nahi diya, `Resource: "*"` nahi diya, aur read/write ke liye **alag prefixes** hain. Ye infinite-loop se bhi bachata hai kyunki Lambda `originals/` me nahi likh sakta.

---

## F. Common Mistakes & Gotchas

**1. Bucket ko public karke website host karna**
CloudFront + OAC use karo. Public bucket = data breach ka invitation + cost bypass.

**2. `s3:*` permission dena**
Ye Lambda ko poore account ke saare buckets pe sab kuch karne deta hai — including delete. Specific actions aur specific ARNs use karo.

**3. Bucket naam ko rename karne ki koshish**
Possible hi nahi. Naya bucket banao, data copy karo, purana delete karo.

**4. Incomplete multipart uploads ka bill**
Ghost storage. Lifecycle rule lagao.

**5. Versioning on karke lifecycle rule na lagana**
Har update pe poora naya version store hota hai. Storage bill exponentially badhta hai.

**6. Versioning me DELETE ke baad "data kahan gaya" ka confusion**
Delete marker create hua hai, object gaya nahi. `List versions` me dikhega.

**7. S3 event notification se infinite loop**
Lambda same bucket me likh raha hai jis bucket ne usko trigger kiya. Alag bucket ya prefix filter use karo.

**8. Bucket delete karne ki koshish jab wo empty nahi**
S3 non-empty bucket delete nahi karne deta. Versioning on hai to **saare versions aur delete markers** bhi hataane padte hain — ye console se painful hai, lifecycle rule ya CLI se karo.

**9. Static website endpoint pe HTTPS ki umeed**
Kaam nahi karega. CloudFront chahiye.

**10. Object ko "edit" karne ki soch**
S3 me partial update nahi hota. Object immutable hai — poora replace karna padta hai.

**11. Cross-region me object copy karke sochna ki wo automatically sync rahega**
Copy ek one-time operation hai. Continuous sync ke liye Replication chahiye.

**12. Storage class ka minimum duration ignore karna**
Object 5 din baad delete kiya but wo Standard-IA me tha? Aapse **poore 30 din** ka charge liya jaayega.

**13. Glacier se direct GET karne ki koshish**
Glacier Flexible Retrieval aur Deep Archive se pehle **restore** karna padta hai. Glacier **Instant** Retrieval se direct GET kaam karta hai — ye distinction important hai.

**14. Presigned URL ki expiry ka role-session gotcha**
Lambda me 7 din ka presigned URL banaya but wo 1 ghante me expire ho gaya, kyunki Lambda ke role ka session 1 ghante ka tha.

**15. CORS aur permission error ko confuse karna**
Browser CORS error dikha raha hai but actual issue 403 permission ka hai. Network tab me actual status code dekho.

---

## G. Cost Model

| Charge type | Detail | Approx (us-east-1) |
|-------------|--------|-------------------|
| **Storage** | Per GB per month, class ke hisaab se | $0.00099 (Deep Archive) – $0.023 (Standard) |
| **PUT/COPY/POST/LIST requests** | Per 1,000 | ~$0.005 |
| **GET/SELECT requests** | Per 1,000 | ~$0.0004 |
| **Data transfer OUT to internet** | Per GB (first 100 GB/month free) | ~$0.09 |
| **Data transfer OUT to CloudFront** | | **FREE** ✅ |
| **Data transfer IN** | | **FREE** ✅ |
| **Same-region transfer to EC2** | | FREE (same AZ) |
| **Cross-region replication transfer** | Per GB | ~$0.02 |
| **Retrieval (IA/Glacier)** | Per GB | $0.01 (IA) – $0.02+ (Glacier) |
| **Intelligent-Tiering monitoring** | Per 1,000 objects/month | ~$0.0025 |
| **Lifecycle transition requests** | Per 1,000 | ~$0.01 |

**Free tier (12 months):** 5 GB Standard storage, 20,000 GET, 2,000 PUT, 100 GB data transfer out.

**Cost optimization strategy (interview me structured bolna):**

1. **Lifecycle policies** — sabse bada lever. Purana data automatically sasti class me
2. **S3 Intelligent-Tiering** — agar access pattern unpredictable hai to ye automatic optimization karta hai bina retrieval fee ke. Monitoring fee ke badle
3. **CloudFront ke through serve karo** — S3→CloudFront transfer free hai, aur cache hit se S3 requests bhi kam hoti hain
4. **`AbortIncompleteMultipartUpload` rule** — ghost storage hatao
5. **`NoncurrentVersionExpiration`** — purane versions clean karo
6. **Compression** — files ko gzip karke store karo (JSON/CSV logs pe 80% bachat)
7. **S3 Storage Lens** — free dashboard jo batata hai kahan paisa ja raha hai
8. **S3 Bucket Keys** — SSE-KMS use kar rahe ho to KMS cost 99% kam

**Ek nuance jo interview me acha lagta hai:**
> "Bahut chhote objects ke liye storage class optimization ulta pad sakta hai. Standard-IA me **128 KB ka minimum billable size** hai — matlab 10 KB ka object bhi 128 KB ke hisaab se charge hoga. Aur har transition pe request charge lagta hai. To agar mere paas 10 million tiny files hain to unko IA me bhejne me transition ka cost hi savings se zyada ho sakta hai. Aise case me main chhote files ko aggregate karke bade objects bana deta hoon."

---

## H. Security Best Practices

**1. Block Public Access — account level pe ON**
Ye pehla step hai. Guardrail ki tarah kaam karta hai.

**2. Encryption**
- At rest: SSE-S3 minimum (ab default hai). Sensitive data ke liye SSE-KMS with customer-managed key
- In transit: bucket policy me `aws:SecureTransport: false` pe explicit Deny

**3. Least privilege IAM**
- `s3:*` kabhi nahi
- Resource ARNs specific karo, prefix level tak
- Condition keys use karo — `aws:SourceIp`, `aws:SourceVpce`, `s3:prefix`

**4. ACLs disable karo**
Object Ownership: **Bucket owner enforced**. Isse ownership confusion aur accidental public ACLs dono khatam.

**5. Versioning + MFA Delete**
Accidental delete aur ransomware se protection.

**6. S3 Object Lock (WORM)**
Compliance mode me object ko **koi bhi delete nahi kar sakta**, root user bhi nahi, retention period tak. Governance mode me special permission wale kar sakte hain. Financial records, legal hold ke liye.

**7. Access logging**
- **S3 Server Access Logs** — detailed, free (bas storage ka cost), but delivery best-effort aur delayed
- **CloudTrail Data Events** — real-time-ish, structured, paid

**8. VPC Endpoints (Gateway Endpoint)**
S3 traffic ko VPC ke andar hi rakho, internet pe na jaaye. Free hai (Gateway type). Phir bucket policy me condition:
```json
"Condition": { "StringEquals": { "aws:SourceVpce": "vpce-1a2b3c4d" } }
```

**9. S3 Access Points**
Bade shared buckets ke liye — har application ka apna access point apni policy ke saath, ek giant unmanageable bucket policy ki jagah.

**10. Macie**
ML-based service jo automatically detect karta hai ki kahin aapke bucket me PII, credit card numbers, ya credentials to nahi pade hain.

**11. IAM Access Analyzer**
Batata hai ki kaunse buckets external accounts ya public ke liye accessible hain.

---

## I. Interview Q&A — S3

---

**Q1. S3 kya hai aur ye traditional file storage se kaise alag hai?**

> S3 object storage hai, file storage nahi. Iska matlab ye hai ki S3 me actual folder hierarchy exist hi nahi karti — ye ek flat key-value store hai jahan key poora path hota hai jaise `photos/2024/goa.jpg`. Console me jo folders dikhte hain wo sirf UI ka rendering hai key me slash ke basis pe. Isliye S3 me folder rename jaisa operation exist nahi karta — aapko har object copy karke purana delete karna padta hai. Doosra bada difference ye hai ki objects immutable hain — aap file ka ek hissa update nahi kar sakte, poora object replace karna padta hai. Iske badle me aapko unlimited scale, 11 nines durability aur automatic multi-AZ replication milti hai bina kuch manage kiye.

---

**Q2. Aapne apne project me S3 kyun use kiya, EC2 pe files kyun nahi rakhi?**

> Teen main wajah thi. Pehla, durability aur availability — EC2 pe EBS volume ek AZ me hota hai, agar wo AZ down hui to mera site down. S3 automatically kam se kam teen AZs me data replicate karta hai aur mujhe kuch karna nahi padta. Doosra, cost aur operations — sirf static HTML, CSS aur JS serve karne ke liye ek EC2 instance 24 ghante chalana waste hai, aur uska OS patching, monitoring, scaling sab mera headache hota. S3 me main sirf storage ka paisa deta hoon, koi server manage nahi karta. Teesra, scalability — agar traffic achanak spike kare to EC2 me mujhe auto-scaling group aur load balancer setup karna padta, S3 me wo automatically handle ho jaata hai.

---

**Q3. S3 ki durability aur availability me kya farq hai?**

> Durability ka matlab hai data kho nahi jaayega, aur availability ka matlab hai data abhi is waqt access ho sakta hai. S3 Standard 11 nines durability deta hai aur 99.99% availability. Practically 11 nines ka matlab ye hai ki agar mere paas 10 million objects hain to statistically ek object khone me 10,000 saal lagenge — ye isliye possible hai kyunki S3 data ko kam se kam teen physically separate Availability Zones me replicate karta hai. Availability 99.99% ka matlab hai saal me lagbhag 52 minute tak service temporarily unreachable ho sakti hai — us time data bilkul safe hai, bas API call fail ho sakti hai. One Zone-IA is baat ka acha example hai — uski durability abhi bhi 11 nines hai lekin availability 99.5% hai aur AZ loss pe data ja sakta hai, kyunki wo sirf ek AZ me hai.

---

**Q4. Storage classes kaun kaun si hain aur aap kaise choose karoge?**

> Main choose karne ke liye do questions poochta hoon: data kitni baar access hoga, aur kitni jaldi chahiye. Frequently accessed data ke liye Standard. Agar access pattern predictable hai aur monthly ya usse kam access hai to Standard-IA — 45 percent sasta hai lekin retrieval charge lagta hai aur 30 din ka minimum duration hai. Agar data re-creatable hai jaise thumbnails, to One Zone-IA aur sasta hai kyunki wo sirf ek AZ me rehta hai. Archives ke liye Glacier family — Instant Retrieval agar millisecond me chahiye, Flexible Retrieval agar minutes se hours theek hai, aur Deep Archive agar 12 ghante wait kar sakte hain — wo sabse sasta hai, lagbhag 1 paisa per GB. Aur agar access pattern hi pata nahi hai to Intelligent-Tiering, jo automatically tiers ke beech move karta hai bina retrieval fee ke, sirf ek chhota monitoring charge leta hai. Important baat ye hai ki sirf per-GB price nahi dekhna — minimum duration, minimum billable size aur retrieval charges milaake total cost of ownership dekhna chahiye.

---

**Q5. Lifecycle policy kya hai? Aapne kya configure kiya?**

> Lifecycle policy automatic rules hain jo objects ko unki age ke hisaab se doosri storage class me transition ya delete karti hain. Mere user uploads bucket me maine ye rules lagaye: 30 din baad Standard-IA me transition, 90 din baad Glacier Instant Retrieval me, aur noncurrent versions ko 90 din baad expire kar do taaki versioning ka storage cost control me rahe. Aur ek rule jo main har bucket me lagata hoon wo hai `AbortIncompleteMultipartUpload` 7 din pe — kyunki agar koi multipart upload beech me fail ho jaaye to uske parts S3 me pade rehte hain, unka storage charge lagta rehta hai, lekin wo object listing me dikhte hi nahi. Bahut log mahino tak is ghost storage ka bill bharte rehte hain. Ek aur cheez dhyaan rakhta hoon ki transitions sirf ek direction me ja sakti hain — Glacier se wapas Standard automatically nahi aata, restore karna padta hai.

---

**Q6. Versioning ke saath object delete karoge to kya hota hai?**

> Agar versioning enabled hai aur main bina version ID ke DELETE karta hoon, to object actually delete nahi hota — S3 ek delete marker naam ka special version create kar deta hai jo latest ban jaata hai. Ab agar koi GET kare to 404 aayega kyunki latest version delete marker hai. Lekin agar main us delete marker ko delete kar doon to object wapas aa jaayega — ye accidental deletion se bahut acha protection hai. Agar main specifically version ID ke saath DELETE karoon to wo version permanently chala jaayega aur wo irreversible hai. Isliye critical buckets pe MFA Delete enable kiya ja sakta hai, jisme permanent version deletion ke liye MFA token chahiye — halanki ye sirf root user enable kar sakta hai aur sirf CLI se. Ek cost point bhi hai — S3 versions ke beech diff store nahi karta, har version ka poora storage charge hota hai, isliye NoncurrentVersionExpiration lifecycle rule lagana zaroori hai.

---

**Q7. Bucket policy, IAM policy aur ACL me kya difference hai?**

> IAM policy identity-based hai — wo user, group ya role pe attach hoti hai aur batati hai ki wo identity kya kar sakti hai. Usme Principal field nahi hoti kyunki principal implicit hai. Bucket policy resource-based hai — bucket pe attach hoti hai aur usme Principal field hoti hai, isliye wo cross-account access aur even anonymous public access de sakti hai. ACL legacy mechanism hai jo object aur bucket level pe basic grants deta hai, aur AWS ab isse recommend nahi karta — best practice hai Object Ownership ko "Bucket owner enforced" set karna jisse ACLs poori tarah disable ho jaati hain. Evaluation ka rule ye hai: explicit deny sabse upar hai aur usko koi override nahi kar sakta, phir explicit allow, aur agar kuch nahi mila to implicit deny. Same account me IAM ya bucket policy me se koi ek allow kaafi hai, lekin cross-account me dono taraf allow chahiye.

---

**Q8. Aapka bucket private hai. User ko file download karwani hai. Kaise karoge?**

> Do options hain aur choice use case pe depend karti hai. Agar file ek specific user ke liye hai aur short-lived access chahiye, to main **presigned URL** generate karunga Lambda se. Wo URL me SigV4 signature embed hoti hai jo bucket, key, method aur expiry ko cover karti hai, aur main expiry 15 minute rakhunga. Ek gotcha ye hai ki Lambda ka execution role temporary credentials use karta hai, to presigned URL role session expire hone pe hi expire ho jaayega chahe maine 7 din likha ho. Doosra option hai **CloudFront signed URL** — ye tab better hai jab wahi file bahut saare users ko serve karni ho, kyunki phir CDN caching ka fayda milta hai, latency kam hoti hai aur WAF ka protection bhi rehta hai. Mere project me user-specific documents ke liye presigned URL use kiya kyunki har user ka file alag hai to caching ka koi fayda nahi tha.

---

**Q9. Presigned URL kaise kaam karta hai internally?**

> Jab main presigned URL generate karta hoon to SDK mere credentials, bucket name, object key, HTTP method aur expiry time ko milaake ek canonical request banata hai aur usko SigV4 algorithm se sign karta hai. Ye signature URL ke query parameters me embed ho jaati hai, saath me algorithm, credential scope, date aur expiry bhi. Jab koi us URL ko hit karta hai to S3 wahi canonical request dobara construct karke signature verify karta hai — agar match hui aur expiry nahi hui hai to access mil jaata hai. Important baat ye hai ki URL ke permissions signer ke permissions se zyada nahi ho sakte — agar meri Lambda ke role ke paas GetObject nahi hai to presigned URL bhi kaam nahi karega. Aur security ke liye main upload wale presigned URLs generate karte waqt key prefix me user ka ID force karta hoon, taaki koi user doosre user ke folder me upload na kar sake.

---

**Q10. User se bade files upload karwane hain. Architecture kya hoga?**

> Main file ko apne backend ke through nahi bhejunga. Do reasons hain — Lambda ka synchronous payload limit sirf 6 MB hai, aur file transfer pe compute ka paisa dena waste hai. Mera flow ye hoga: frontend Lambda ko batata hai ki wo kaun si file upload karna chahta hai, Lambda authorization check karta hai aur ek **presigned PUT URL** return karta hai jiski expiry 5 minute hai aur key prefix me user ID hardcoded hai. Phir browser directly S3 pe upload karta hai — mera backend beech me hai hi nahi. Agar file 100 MB se badi hai to main multipart upload use karunga, jisme har part ke liye alag presigned URL generate hoga aur parallel upload ho sakta hai — isse speed badhti hai aur agar ek part fail ho to sirf wahi retry hota hai. Upload complete hone pe S3 event notification Lambda ko trigger karti hai jo thumbnail generate karti hai aur database update karti hai. Aur bucket me `AbortIncompleteMultipartUpload` lifecycle rule lagaunga taaki failed uploads ka storage waste na ho.

---

**Q11. S3 ka consistency model kya hai?**

> December 2020 se S3 **strong read-after-write consistency** deta hai — saare regions me, sabhi operations pe, matlab PUT, overwrite PUT, DELETE aur LIST bhi. Aur ye bina kisi extra cost ya performance penalty ke hai. Iska practical matlab ye hai ki agar main koi object likhta hoon aur turant read karta hoon to mujhe hamesha latest data milega. Pehle aisa nahi tha — overwrite PUT aur DELETE eventually consistent the, matlab file update karke turant read karo to purana version mil sakta tha, aur developers ko application me retry logic likhna padta tha. Bahut saari purani tutorials abhi bhi eventual consistency batati hain isliye ye main specifically yaad rakhta hoon. Ek exception hai — bucket-level configurations jaise bucket policy, CORS aur lifecycle rules abhi bhi eventually consistent hain, to policy change karke turant test karoge to purana behaviour mil sakta hai.

---

**Q12. S3 event notification se Lambda trigger kiya, aur bill bahut zyada aa gaya. Kya problem ho sakti hai?**

> Sabse likely problem **infinite loop** hai. Agar Lambda usi bucket me output likh raha hai jis bucket ke ObjectCreated event se wo trigger hota hai, to har output ek naya event generate karta hai jo Lambda ko dobara trigger karta hai — ye exponentially chalta rehta hai. Mere case me agar Lambda thumbnail generate karke same bucket me daal raha hai to ye definitely hoga. Iske teen fixes hain. Sabse safe hai output ko **alag bucket** me likhna. Doosra, agar same bucket use karna hai to event notification pe **prefix filter** lagao — trigger sirf `originals/` prefix pe ho aur output `thumbnails/` me jaaye. Teesra, Lambda ke IAM role ko input prefix pe write permission hi mat do, taaki agar bug aa bhi jaaye to loop physically possible na ho. Aur ek guardrail ke liye main Lambda pe **reserved concurrency** set karta hoon aur CloudWatch billing alarm lagata hoon taaki aisa kuch ho to turant pata chale.

---

**Q13. S3 me high throughput chahiye. Performance kaise optimize karoge?**

> S3 ka request limit **per prefix** hai, per bucket nahi — 3,500 write requests aur 5,500 read requests per second per prefix. To sabse pehla optimization hai keys ko multiple prefixes me distribute karna, jaise date-based ya category-based prefixes, jisse throughput linearly scale ho jaata hai. Pehle random hash prefix recommend hota tha taaki partitioning acchi ho, lekin ab S3 automatically partition karta hai to wo zaroori nahi raha. Bade files ke liye main multipart upload aur byte-range fetches use karunga taaki parallel transfer ho sake. Agar users duniya bhar se bade files upload kar rahe hain aur bucket ek hi region me hai to Transfer Acceleration consider karunga, jo CloudFront ke edge network ke through upload route karta hai. Read-heavy static content ke liye sabse bada win CloudFront lagana hai, jo S3 pe requests hi 90 percent kam kar deta hai.

---

**Q14. SSE-S3 aur SSE-KMS me kya farq hai? Aap kaunsa use karoge?**

> SSE-S3 me AWS khud AES-256 keys manage karta hai — mujhe kuch karna nahi padta, cost zero hai, aur ab ye naye objects pe by default enabled bhi hai. Lekin usme key access ka koi audit trail nahi milta aur na hi main key pe granular policy laga sakta hoon. SSE-KMS me key AWS KMS me hoti hai jispe main apni key policy laga sakta hoon, aur har encrypt-decrypt call CloudTrail me log hoti hai — matlab main dekh sakta hoon kisne kab data decrypt kiya. Ye compliance requirements ke liye bahut important hai. Trade-off ye hai ki har GET aur PUT pe ek KMS API call hoti hai jiska charge lagta hai, aur KMS pe per-second request quota hai jo high throughput me throttling cause kar sakta hai. Iska solution **S3 Bucket Keys** hai jo KMS calls 99 percent tak kam kar deta hai. Mere project me frontend assets ke liye SSE-S3 kaafi tha kyunki wo public content hai, lekin user documents wale bucket ke liye SSE-KMS zyada appropriate hai.

---

**Q15. Aapko production bucket ka data test environment me chahiye, aur wo continuously sync rehna chahiye. Kaise karoge?**

> Ek baar ka copy chahiye to `aws s3 sync` ya S3 Batch Operations kaafi hai. Lekin continuous sync ke liye main **S3 Replication** use karunga — agar test environment usi region me hai to Same-Region Replication, agar doosre region me hai to Cross-Region Replication. Iske liye do cheezein mandatory hain: source aur destination dono buckets pe **versioning enabled** honi chahiye, aur ek IAM role chahiye jo source se read aur destination pe write kar sake. Cross-account case me destination bucket policy me bhi permission deni padegi. Ek important gotcha ye hai ki replication rule **sirf naye objects** pe apply hoti hai — jo objects rule banane se pehle se the wo automatically copy nahi honge, unke liye alag se S3 Batch Replication chalani padegi. Aur agar mujhe SLA chahiye to Replication Time Control enable kar sakta hoon jo 99.99% objects 15 minute me replicate karne ki guarantee deta hai, extra cost pe.

---

**Q16. Aapke S3 ka bill achanak double ho gaya. Debug kaise karoge?**

> Main structured tarike se dekhunga. Sabse pehle **Cost Explorer** me usage type ke hisaab se breakdown karunga taaki pata chale ki storage badha hai, requests badhi hain, ya data transfer. Agar storage badha hai to main **S3 Storage Lens** dekhunga jo free hai aur batata hai kitna storage incomplete multipart uploads me hai aur kitna noncurrent versions me — ye do sabse common silent cost drivers hain. Agar noncurrent versions bade hain to iska matlab versioning on hai but expiration lifecycle rule nahi hai. Agar requests badhi hain to main check karunga ki CloudFront ka cache hit ratio to nahi gir gaya, kyunki har cache miss ek S3 GET hai. Aur agar data transfer out badha hai to dekhunga ki kahin log CloudFront bypass karke directly S3 URLs to hit nahi kar rahe. Ek aur possibility jo maine mention ki thi wo hai S3 event notification se Lambda ka infinite loop, jo requests aur storage dono explode kar deta hai. Long term ke liye main cost allocation tags aur budget alarms set karta hoon taaki ye pehle hi pata chal jaaye.

---
---

# 4. AWS Lambda

---

## A. Simple Explanation

### Service kya hai

Lambda AWS ka **serverless compute** service hai. Aap sirf apna function ka code likhte ho, aur AWS usko run karta hai jab bhi koi event trigger hota hai. Aapko server provision karna, patch karna, scale karna — kuch nahi karna padta.

**"Serverless" ka matlab ye nahi ki server hai hi nahi.** Server hai — bas wo aapki responsibility nahi hai. Aapko us server ke bare me sochna hi nahi hai.

Sabse important business point: **aap sirf execution time ka paisa dete ho.** Code nahi chal raha? Zero cost. EC2 me instance idle bhi paisa leta hai.

### Real-world analogy (interview me bolna)

> "Sir, EC2 aur Lambda ka farq main aise batata hoon — EC2 ek **rented flat** hai. Aap wahan rehte ho ya nahi, mahine ka kiraya dena hai. Aapko safai, maintenance, bijli sab dekhna hai. Lambda ek **Ola/Uber ride** hai. Jab zaroorat ho tab book karo, sirf jitni doori chali utna paisa do, ride khatam to kharcha khatam. Gaadi ki servicing, insurance, driver — sab kuch driver ki responsibility hai, aapki nahi. Aur agar aapko ek saath 100 log bhejne hain to 100 cabs turant aa jaayengi — automatic scaling. Bas ek trade-off hai — cab ko aane me thoda time lagta hai, aur wahi **cold start** hai."

---

## B. Why It Exists / Problem It Solves

**Problem 1 — Idle server ka paisa.**
Aapka contact form API din me 50 baar hit hota hai, har call 200ms leti hai. Total compute time = 10 seconds/day. Lekin EC2 me aap 86,400 seconds ka paisa dete ho. **99.99% waste.**

**Problem 2 — Server management ka bojh.**
OS patching, security updates, runtime upgrades, monitoring agent, log rotation, disk full alerts. Ye sab business logic nahi hai, but time isi me jaata hai.

**Problem 3 — Scaling ka jhanjhat.**
Traffic spike aaya to Auto Scaling Group configure karo, launch template banao, warm-up time jhelo (2-5 minute), scale-in policies tune karo. Lambda me AWS automatically thousands of concurrent executions handle kar leta hai, seconds me.

**Problem 4 — Event-driven kaam ke liye poora server.**
"Jab S3 me file aaye to thumbnail banao" — iske liye ek server 24×7 polling kare? Waste. Lambda directly event pe trigger hota hai.

**Problem 5 — High availability by default.**
Lambda automatically multiple AZs me chalta hai. EC2 me aapko multi-AZ ASG + load balancer khud setup karna padta hai.

---

## C. How It Actually Works (Internal Flow)

### Execution model — jab invocation aati hai

```
1. INVOCATION AATI HAI
   Trigger: API Gateway / S3 event / EventBridge schedule / SDK call

2. LAMBDA SERVICE: IS THERE A WARM EXECUTION ENVIRONMENT?

   ┌── HAAN (WARM START) ──────────────────────────────┐
   │  Seedha handler function call ho jaata hai        │
   │  Latency: 1-10 milliseconds                       │
   │  Init code (handler ke bahar ka) SKIP ho jaata hai│
   └───────────────────────────────────────────────────┘

   ┌── NAHI (COLD START) ──────────────────────────────┐
   │  a) Firecracker microVM boot                      │
   │     - AWS ka lightweight VMM, ~125ms me boot      │
   │     - Har execution environment isolated hai       │
   │  b) Runtime bootstrap (Node/Python/Java load)     │
   │  c) Deployment package download + extract          │
   │     - S3 se package fetch, layers merge           │
   │  d) INIT PHASE: handler ke BAHAR ka code chalta hai│
   │     - imports, DB connection pool, SDK clients     │
   │     - Ye phase 10 seconds tak chal sakta hai       │
   │  e) Handler invoke                                 │
   │  Latency: 100ms - 2 seconds (runtime pe depend)   │
   └───────────────────────────────────────────────────┘

3. HANDLER EXECUTION
   - event object + context object milte hain
   - Aapka business logic chalta hai
   - Timeout hit hua? Force kill.

4. RESPONSE
   - Sync: caller ko wapas
   - Async: caller ko pehle hi 202 mil chuka tha

5. FREEZE (destroy NAHI)
   - Environment freeze ho jaata hai, memory state preserved
   - Kuch minutes tak (AWS exact time publish nahi karta,
     typically 5-15 min, traffic pattern pe depend)
   - Agli invocation aayi to UNFREEZE → warm start ✅
   - Nahi aayi to eventually destroy
```

### Ek critical implication samjho

**Ek execution environment ek waqt me sirf EK request handle karta hai.** Ye Lambda ka fundamental design hai.

Iska matlab:
- 100 concurrent requests = 100 execution environments
- Environments ke beech memory share **nahi** hoti
- Isliye in-memory caching sirf **usi** environment ke liye kaam karti hai
- Global variables ek environment me persist hote hain (warm invocations ke beech), lekin aap ye **assume nahi kar sakte** ki next request usi environment pe aayegi

### Init phase ka smart use — ye interview me golden point hai

```javascript
// ✅ SAHI — INIT phase me, cold start pe ek baar chalta hai
const AWS = require('aws-sdk');
const s3 = new AWS.S3();           // SDK client reuse hoga
const ses = new AWS.SESV2();
let dbConnection = null;            // connection reuse

exports.handler = async (event) => {
    // ✅ Handler ke andar sirf per-request logic
    if (!dbConnection) {
        dbConnection = await createConnection();  // sirf pehli baar
    }
    const result = await dbConnection.query(...);
    return { statusCode: 200, body: JSON.stringify(result) };
};
```

```javascript
// ❌ GALAT — har invocation pe naya client aur naya connection
exports.handler = async (event) => {
    const AWS = require('aws-sdk');
    const s3 = new AWS.S3();
    const dbConnection = await createConnection();  // har baar! slow + expensive
    ...
};
```

Ek aur bonus: **INIT phase ke pehle 10 seconds AWS charge nahi karta** (init duration billing me include nahi hoti standard on-demand ke liye). To init me heavy setup karna sasta hai.

---

## D. Key Concepts & Terminology

### D.1 Cold Start vs Warm Start

| | Cold Start | Warm Start |
|-|-----------|------------|
| **Kab** | Naya execution environment | Existing environment reuse |
| **Latency** | 100ms – 2s+ | 1–10ms |
| **Init code chalta hai?** | ✅ Haan | ❌ Nahi (skip) |
| **Kab hota hai** | Pehli invocation, scale-out, code/config update ke baad, environment expire hone pe | Recent invocation ke baad |

**Cold start kis se badhta hai:**

| Factor | Impact |
|--------|--------|
| **Runtime** | Java/.NET sabse slow (JVM/CLR startup), Python/Node fast, Go/Rust sabse fast |
| **Package size** | Bada zip = zyada download time |
| **Dependencies** | 200 npm packages import karna = slow |
| **VPC attachment** | Pehle 10+ seconds lagte the. **Ab (2019 Hyperplane ENI ke baad) ye penalty lagbhag khatam hai** — ye important updated fact hai |
| **Memory setting** | Kam memory = kam CPU = slow init |

**Cold start kam karne ke tareeke:**

1. **Provisioned Concurrency** — pre-warmed environments ready rakho. Cold start practically zero. Extra cost, lekin predictable latency
2. **Lambda SnapStart** — Java, Python aur .NET ke liye. Init ke baad ka snapshot le liya jaata hai aur usse restore karta hai. **Free** hai (Java ke liye) aur Java me 10x tak improvement deta hai
3. **Package size kam karo** — tree shaking, bundling, sirf zaroori dependencies. AWS SDK v3 me modular imports use karo (`@aws-sdk/client-s3` na ki poora SDK)
4. **Memory badhao** — zyada memory = zyada CPU = fast init. Kabhi kabhi zyada memory se cost **kam** ho jaata hai kyunki duration kaafi kam ho jaata hai
5. **Init me heavy kaam karo** — pehle 10 sec free hai
6. **Lightweight runtime** — agar latency critical hai to Go ya Node
7. **Warming (ping) — ye ab anti-pattern hai.** Isse concurrency scale-out solve nahi hota. Provisioned Concurrency proper solution hai

### D.2 Memory ↔ CPU Relationship — ye definitely poocha jaayega

**Lambda me aap CPU directly set nahi kar sakte. Aap sirf memory set karte ho, aur CPU proportionally allocate hoti hai.**

| Memory | Approx vCPU |
|--------|-------------|
| 128 MB | ~0.08 vCPU |
| 1,769 MB | **exactly 1 vCPU** |
| 3,538 MB | ~2 vCPU |
| 10,240 MB (max) | ~6 vCPU |

Range: **128 MB se 10,240 MB**, 1 MB increments me.

**Counter-intuitive insight jo interview me bahut acha lagta hai:**

> "Sir, Lambda me zyada memory dena kabhi kabhi **saste** pad jaata hai. Kyunki cost = memory × duration hai. Maan lo 128 MB pe function 10 second leta hai — cost proportional to 128×10 = 1280 units. Agar main 1024 MB doon aur CPU 8 guna badhne se duration 1 second ho jaaye — cost 1024×1 = 1024 units. Matlab 8 guna zyada memory dene ke baad bhi cost kam ho gaya, aur latency 10x behtar. Isliye main memory ko guess nahi karta — main **AWS Lambda Power Tuning** tool use karta hoon jo different memory settings pe function chalake cost vs performance ka graph banata hai aur optimal point batata hai."

**Note:** Ye tabhi kaam karta hai jab function **CPU-bound** ho. Agar function zyadatar network wait kar raha hai (I/O bound — jaise API call ka wait) to memory badhane se duration kam nahi hoga, sirf cost badhega.

### D.3 Timeouts aur Limits (numbers yaad rakho)

| Limit | Value |
|-------|-------|
| **Max timeout** | **900 seconds (15 minutes)** |
| **Default timeout** | 3 seconds |
| **Memory** | 128 MB – 10,240 MB |
| **/tmp storage** | 512 MB default, **10,240 MB tak configurable** |
| **Deployment package (zipped, direct upload)** | 50 MB |
| **Deployment package (unzipped, including layers)** | **250 MB** |
| **Container image** | 10 GB |
| **Layers** | Max **5** per function (250 MB limit me count hote hain) |
| **Environment variables** | 4 KB total |
| **Synchronous payload (request + response)** | **6 MB** |
| **Asynchronous payload (request)** | **256 KB** |
| **Response streaming payload** | 20 MB (soft limit) |
| **Default concurrency per region** | **1,000** (soft limit, badhaya ja sakta hai) |
| **Burst concurrency** | 1,000 per 10 seconds per function (2023 se) |
| **Max execution environments per function** | Concurrency limit ke barabar |

**6 MB payload limit ka practical implication:**
> "Ye limit ki wajah se main bade files ko kabhi Lambda ke through nahi bhejta. Uske liye main presigned URL pattern use karta hoon — client directly S3 pe upload karta hai. Agar mujhe bada response bhejna hai to main object S3 me daal ke uska presigned URL return karta hoon, ya response streaming use karta hoon."

### D.4 Concurrency — Reserved vs Provisioned

**Concurrency ka basic formula:**
```
Concurrency = Requests per second × Average duration (seconds)

Example: 100 req/s × 0.5 sec = 50 concurrent executions
```

| | Reserved Concurrency | Provisioned Concurrency |
|-|---------------------|------------------------|
| **Kya karta hai** | Ek function ke liye concurrency **reserve** karta hai (aur **cap** bhi karta hai) | Environments **pre-warm** karke ready rakhta hai |
| **Cold start pe asar** | ❌ Koi nahi | ✅ Practically khatam |
| **Cost** | **Free** | ✅ Paid — idle rehne pe bhi charge |
| **Purpose** | Guarantee + throttling | Latency guarantee |
| **Set to 0 karne se** | Function poori tarah **disable** ho jaata hai — ye emergency kill switch hai |

**Reserved concurrency ka dual nature — ye samajhna zaroori hai:**
> "Reserved concurrency do kaam ek saath karta hai. Ek taraf ye guarantee deta hai ki us function ko utni concurrency milegi — koi doosra function usko starve nahi kar sakta. Doosri taraf ye ek **hard cap** bhi hai — us function se zyada concurrent executions nahi honge, extra requests throttle ho jaayengi with 429. Ye downstream protection ke liye bahut useful hai. Jaise mera Lambda RDS se connect karta hai jiske paas sirf 100 connections hain — agar main reserved concurrency 50 set kar doon to Lambda kabhi RDS ko connection exhaustion me nahi daalega."

**Provisioned concurrency ka practical use:**
> "Maine ise apne project me use nahi kiya kyunki cost justify nahi hoti thi — mera traffic kam hai aur 200-300ms cold start acceptable hai. Lekin agar mera Lambda user-facing checkout API hota jahan p99 latency 100ms ke andar chahiye, to main provisioned concurrency use karta, aur uske saath Application Auto Scaling laga deta taaki peak hours me automatically badh jaaye aur raat me kam ho jaaye."

**Unreserved concurrency pool:** Agar region ka limit 1000 hai aur aapne ek function ko 400 reserve kar diya, to baaki saare functions ko sirf 600 share karna padega. Aur AWS 100 concurrency hamesha unreserved rakhta hai — aap poora 1000 reserve nahi kar sakte.

### D.5 Triggers / Event Sources

**Do fundamental categories hain — ye samajhna zaroori hai:**

**A) Push-based (service Lambda ko invoke karti hai):**

| Source | Invocation type |
|--------|----------------|
| API Gateway | Synchronous |
| Application Load Balancer | Synchronous |
| Function URL | Synchronous |
| SDK/CLI direct invoke | Sync ya Async |
| S3 events | **Asynchronous** |
| SNS | **Asynchronous** |
| EventBridge (schedule/rules) | **Asynchronous** |
| CloudFront (Lambda@Edge) | Synchronous |

**B) Poll-based (Lambda service khud poll karti hai — "Event Source Mapping"):**

| Source | Detail |
|--------|--------|
| SQS (Standard & FIFO) | Lambda service queue poll karti hai, batches me messages deti hai |
| Kinesis Data Streams | Shard-based, ordered per shard |
| DynamoDB Streams | Table changes, ordered per shard |
| Amazon MSK / self-managed Kafka | Partition-based |
| Amazon MQ | ActiveMQ/RabbitMQ |

**Poll-based me ek important difference:** Yahan Lambda ka apna retry behaviour nahi hai — retry source ke semantics pe depend karta hai. SQS me message visibility timeout ke baad wapas queue me aa jaata hai aur `maxReceiveCount` ke baad DLQ me jaata hai. Kinesis/DynamoDB streams me by default record **block** kar deta hai jab tak succeed na ho ya expire na ho jaaye — isliye `BisectBatchOnFunctionError` aur `MaximumRetryAttempts` configure karna zaroori hai warna ek poison-pill record poora shard atka deta hai.

### D.6 Handler & Event Object

```python
import json
import os
import boto3

# INIT — cold start pe ek baar
ses = boto3.client('sesv2')
SENDER = os.environ['SENDER_EMAIL']

def lambda_handler(event, context):
    """
    event   → trigger ka data (dict). Structure source pe depend karta hai.
    context → runtime information
    """
    # Context object se kya milta hai:
    print(context.function_name)
    print(context.memory_limit_in_mb)
    print(context.aws_request_id)              # correlation ID — logging me daalo
    print(context.get_remaining_time_in_millis())  # kitna time bacha hai
    print(context.log_group_name)

    body = json.loads(event.get('body', '{}'))

    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': 'ok'})
    }
```

**`get_remaining_time_in_millis()` ka smart use (ye bolne se banda impress hota hai):**
> "Main long-running loops me ye check karta hoon. Agar remaining time 5 second se kam hai to main gracefully exit karta hoon aur bache hue kaam ko SQS me daal deta hoon, taaki agla invocation usko pick kar le. Isse mujhe timeout pe hard kill nahi hota aur partial work lost nahi hota."

**Event structure har source ka alag hota hai:**
- API Gateway: `event['body']`, `event['pathParameters']`, `event['queryStringParameters']`, `event['requestContext']`
- S3: `event['Records'][0]['s3']['bucket']['name']`, `event['Records'][0]['s3']['object']['key']`
- SQS: `event['Records']` — batch of messages, har ek me `body` aur `receiptHandle`

**S3 event ka classic gotcha:** Object key **URL-encoded** hoti hai. `my photo.jpg` → `my+photo.jpg`. Isko decode karna padta hai (`urllib.parse.unquote_plus`), warna `NoSuchKey` error aayega.

### D.7 Environment Variables

```python
DB_HOST = os.environ['DB_HOST']
SENDER  = os.environ['SENDER_EMAIL']
```

- Total size limit: **4 KB**
- At rest **encrypted** hoti hain (default AWS-managed KMS key se, ya apni CMK se)
- **Secrets yahan mat rakho.** Console me plaintext dikhta hai jiske paas `lambda:GetFunctionConfiguration` hai. Secrets ke liye **AWS Secrets Manager** ya **SSM Parameter Store (SecureString)** use karo, aur value ko INIT phase me fetch karke cache karo taaki har invocation pe API call na ho

### D.8 Layers

Layer = ek zip jisme shared code ya dependencies hoti hain, jo multiple functions use kar sakte hain.

- Max **5 layers** per function
- Layers ka size 250 MB unzipped limit me count hota hai
- Runtime me `/opt` pe mount hote hain
- Versioned hote hain — ek version publish hone ke baad immutable

**Use cases:**
- Common dependencies (numpy, pandas, sharp)
- Shared utility code (logging, error handling)
- Binaries (ffmpeg, ImageMagick)
- AWS ke ready-made layers (Lambda Insights, Parameters and Secrets Extension)

**Fayde:** deployment package chhota (fast upload, fast cold start), dependencies alag se update ho sakti hain, code duplication nahi.

**Gotcha:** Layer update automatically functions ko nahi milta — aapko function ki layer ARN version update karni padti hai.

**Kab layer se better container image hai?** Agar dependencies 250 MB se badi hain (jaise ML models, PyTorch), to **container image** use karo — 10 GB tak jaa sakta hai.

### D.9 /tmp Storage

- Default **512 MB**, ab **10,240 MB tak** configure kar sakte ho (extra charge)
- Ephemeral hai — lekin **warm invocations ke beech persist karta hai** kyunki same environment hai
- **Ye ek security risk hai:** agar aapne user A ka sensitive file `/tmp` me likha aur clean nahi kiya, to same warm environment pe aane wale user B ka invocation usko padh sakta hai. **Hamesha `/tmp` clean karo** ya unique filenames use karo
- Use cases: bade file download karke process karna, image manipulation ka temp space, ML model cache karna

### D.10 IAM Execution Role

Har Lambda ke paas ek **execution role** hota hai jo batata hai ki wo function kya kar sakta hai.

Minimum policy — CloudWatch Logs (warna logs hi nahi dikhenge):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:ap-south-1:111122223333:log-group:/aws/lambda/my-function:*"
    }
  ]
}
```

**Do alag concepts confuse mat karo:**

| | Execution Role | Resource-based Policy |
|-|---------------|----------------------|
| **Kya define karta hai** | Lambda **kya kar sakta hai** (outbound) | **Kaun Lambda ko invoke kar sakta hai** (inbound) |
| **Example** | S3 se read, SES se email bhej | S3 service ko is function ko trigger karne ki permission |

Jab aap console me S3 trigger add karte ho, AWS automatically resource-based policy add kar deta hai. IaC (Terraform/CDK) me ye manually add karna padta hai — `AWS::Lambda::Permission`. Ye ek bahut common bug hai.

### D.11 VPC-attached Lambda

**Default me Lambda VPC me nahi hota** — wo AWS-managed VPC me chalta hai aur usko internet access milta hai.

Agar aap usko apne VPC me daalte ho:
- ✅ Ab wo private resources access kar sakta hai — RDS, ElastiCache, internal ALB
- ❌ Ab usko **internet access nahi milta** by default. Public subnet me daalne se bhi nahi (Lambda ke paas public IP nahi hota)
- Internet chahiye? **NAT Gateway** lagao private subnet me — jo ~$32/month + data processing charge leta hai
- AWS services chahiye bina NAT ke? **VPC Endpoints** use karo (S3/DynamoDB ke liye Gateway endpoint free hai, baaki ke liye Interface endpoint paid)

**Cold start ka updated fact (ye bolna important hai):**
> "Pehle VPC-attached Lambda ka cold start 10 second se zyada ho jaata tha kyunki har execution environment ke liye alag ENI create hoti thi. **2019 me AWS ne Hyperplane ENI introduce ki** — ab ENIs shared aur pre-created hoti hain per subnet-security group combination, isliye VPC ka cold start penalty ab practically negligible hai. Bahut saari purani blogs abhi bhi kehti hain ki VPC Lambda slow hai — wo outdated hai."

**Ek aur classic problem:** VPC Lambda ke liye subnets me **available IP addresses** hone chahiye. Agar concurrency 500 tak jaati hai aur subnet me sirf /28 hai (11 usable IPs) to ENI creation fail hogi. **Multiple AZs me bade subnets** use karo.

**RDS + Lambda ka connection pooling problem:**
> "Lambda ka ek execution environment ek connection banata hai. Agar concurrency 500 tak jaaye to 500 connections RDS pe khul jaayengi, aur RDS ka max_connections limited hai. Iske do solutions hain — ya to **reserved concurrency** se cap lagao, ya **RDS Proxy** use karo jo connection pooling aur multiplexing karta hai. RDS Proxy ke saath thousands of Lambda executions bhi kuch dozen actual DB connections use karti hain."

### D.12 Synchronous vs Asynchronous Invocation — deep dive

| | Synchronous | Asynchronous |
|-|-------------|--------------|
| **Caller wait karta hai?** | ✅ Haan, response ke liye | ❌ Nahi, 202 Accepted turant |
| **Sources** | API Gateway, ALB, Function URL, direct invoke | S3, SNS, EventBridge, direct invoke with `InvocationType: Event` |
| **Retry by Lambda** | ❌ **Nahi** (caller ki zimmedari) | ✅ **2 automatic retries** |
| **Payload limit** | 6 MB | 256 KB |
| **Failure handling** | Caller ko error | DLQ / On-failure destination |
| **Internal queue** | Nahi | ✅ Lambda ek internal queue maintain karta hai |
| **Max event age** | — | 6 hours (configurable) |

**Async ka internal flow:**
```
Caller → Lambda API → 202 Accepted (turant wapas)
                   ↓
         Lambda's internal queue
                   ↓
         Function invoke
                   ↓
    Fail? → retry #1 (~1 min baad)
            retry #2 (~2 min baad)
                   ↓
    Abhi bhi fail? → DLQ / On-failure destination
```

**Idempotency — ye interview me bolna zaroori hai:**
> "Kyunki async invocations me automatic retries hain aur event sources at-least-once delivery dete hain, mera function **idempotent** hona chahiye — matlab same event do baar process ho to result same rahe. Mere project me maine event me se ek unique ID nikaal ke usko DynamoDB me conditional put ke saath store kiya. Agar wo ID pehle se hai to main duplicate detect karke skip kar deta hoon. Ye khaas kar email bhejne wale function me critical tha, warna user ko same email do baar jaata."

### D.13 DLQ vs Lambda Destinations

| | DLQ (purana) | Destinations (naya, recommended) |
|-|-------------|----------------------------------|
| **Kab trigger** | Sirf **failure** pe | **Success aur failure dono** pe |
| **Targets** | SQS, SNS | SQS, SNS, Lambda, **EventBridge** |
| **Content** | Sirf original event payload | Original event + **response/error details + context** |
| **Chaining** | ❌ | ✅ Success destination se next function chain kar sakte ho |

**Interview me kya bolna:**
> "Main naye projects me Destinations prefer karta hoon kyunki DLQ me sirf original payload milta hai — mujhe pata hi nahi chalta ki fail kyun hua. Destinations me response context bhi aata hai jisme error message aur stack trace hoti hai, jo debugging me bahut faayda deta hai. Aur success destination se main functions chain kar sakta hoon bina Step Functions ke."

### D.14 Retries — poora picture

| Invocation type | Retry behaviour |
|----------------|----------------|
| **Synchronous** | Lambda retry **nahi** karta. AWS SDK apne client-side retries kar sakta hai |
| **Asynchronous** | 2 retries (total 3 attempts), exponential-ish backoff, max event age 6 hours |
| **SQS event source** | Message visibility timeout ke baad wapas visible, `maxReceiveCount` ke baad SQS DLQ me |
| **Kinesis/DynamoDB Streams** | Default: record expire hone tak retry (**poison pill problem**). `MaximumRetryAttempts`, `MaximumRecordAgeInSeconds`, `BisectBatchOnFunctionError`, aur `OnFailure` destination configure karo |

**Poison pill problem (acha bolne wala point):**
> "Kinesis ya DynamoDB Streams ke saath ek classic problem hai. Ye shard-based hain aur ordering guarantee karte hain, isliye agar ek record fail ho jaaye to Lambda usko baar baar retry karta hai aur poora shard block ho jaata hai — data 24 ghante tak atka rehta hai. Isko poison pill kehte hain. Solution ye hai ki `MaximumRetryAttempts` set karo, `BisectBatchOnFunctionError` enable karo taaki batch ko aadha karke problem record isolate ho jaaye, aur `OnFailure` destination configure karo taaki failed records SQS me chale jaayein aur stream aage badh sake."

### D.15 Monitoring — CloudWatch

**Key metrics:**

| Metric | Kya batata hai | Alarm kab lagaao |
|--------|---------------|------------------|
| `Invocations` | Kitni baar chala | Unexpected spike (loop detection) |
| `Errors` | Function errors | Error rate > 1% |
| `Duration` | Execution time | p99 timeout ke 80% se zyada |
| `Throttles` | Concurrency limit hit | > 0 |
| `ConcurrentExecutions` | Abhi kitne chal rahe | Limit ke 80% pe |
| `IteratorAge` | Stream processing me kitna peeche hain | Badh raha hai = consumer slow |
| `DeadLetterErrors` | DLQ me bhejne me fail | > 0 |
| `ProvisionedConcurrencySpilloverInvocations` | Provisioned se zyada traffic | > 0 |

**Logs:** Automatically CloudWatch Logs me jaate hain (`/aws/lambda/<function-name>`). **Retention default "Never Expire" hai** — ye ek silent cost hai, isko 7 ya 30 days set karo.

**Structured logging (ye bolna acha lagta hai):**
> "Main plain text logging nahi karta, JSON structured logging karta hoon aur usme `context.aws_request_id` ko correlation ID ki tarah include karta hoon. Isse CloudWatch Logs Insights me main query kar sakta hoon — jaise `filter level='ERROR' | stats count() by errorType` — aur ek specific request ka poora journey trace kar sakta hoon."

**X-Ray:** Distributed tracing. Batata hai ki 800ms me se kitna time DynamoDB me gaya, kitna SES me, kitna cold start me. Bottleneck dhoondhne ke liye best tool.

**Lambda Powertools:** AWS ki open-source library (Python/Node/Java/.NET) jo structured logging, tracing, metrics, idempotency aur batch processing ready-made deti hai. Iska naam lena bhi acha signal hai.

### D.16 Pricing Model

**Do components:**

1. **Requests:** $0.20 per 1 million requests
2. **Duration:** GB-seconds ke hisaab se
   - x86: ~$0.0000166667 per GB-second
   - **arm64 (Graviton2): ~20% sasta** aur aksar tez bhi

**Formula:**
```
GB-seconds = (Memory in MB / 1024) × (Duration in seconds)
Cost = (Requests × $0.20/1M) + (GB-seconds × $0.0000166667)
```

**Free tier (perpetual, na ki sirf 12 months):**
- 1 million requests/month
- 400,000 GB-seconds/month

**Ek concrete calculation (interview me karke dikhao):**
```
Function: 512 MB memory, 200ms average duration
Traffic: 1,000,000 invocations/month

GB-seconds = (512/1024) × 0.2 × 1,000,000
           = 0.5 × 0.2 × 1,000,000
           = 100,000 GB-seconds

Free tier: 400,000 GB-seconds → poora cover ho gaya ✅
Requests:  1M → free tier me ✅

Total cost: $0
```

**Extra charges:**
- **Provisioned Concurrency:** ~$0.0000041667 per GB-second (idle time bhi charge)
- **Ephemeral storage** 512 MB se zyada: extra per GB-second
- **Data transfer out**
- Related services: CloudWatch Logs ingestion + storage, NAT Gateway agar VPC me hai

**Billing granularity: 1 millisecond.** Pehle 100ms blocks the — matlab 30ms ka function bhi 100ms charge hota tha. Ab actual duration pe charge hai.

---

## E. Real-World Configuration (mere project me)

### Function 1: Contact form handler

```
Runtime:              Python 3.12
Architecture:         arm64 (20% sasta)
Memory:               256 MB
Timeout:              10 seconds
Trigger:              API Gateway (HTTP API) — synchronous
Reserved concurrency: 10 (abuse protection)
Environment vars:     SENDER_EMAIL, RECIPIENT_EMAIL, CONFIG_SET
Execution role:       ses:SendEmail (specific identity ARN pe)
                    + logs:* (specific log group pe)
DLQ/Destination:      N/A (sync invocation)
Log retention:        14 days
Tracing:              X-Ray active
```

```python
import json, os, boto3, re
from botocore.exceptions import ClientError

# INIT — cold start pe ek baar
ses = boto3.client('sesv2')
SENDER    = os.environ['SENDER_EMAIL']
RECIPIENT = os.environ['RECIPIENT_EMAIL']
CONFIG_SET = os.environ['CONFIG_SET']
EMAIL_RE  = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')

def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body') or '{}')
    except json.JSONDecodeError:
        return _resp(400, {'error': 'Invalid JSON'})

    name    = (body.get('name')    or '').strip()[:100]
    email   = (body.get('email')   or '').strip()
    message = (body.get('message') or '').strip()[:5000]

    if not name or not message or not EMAIL_RE.match(email):
        return _resp(400, {'error': 'Invalid input'})

    try:
        ses.send_email(
            FromEmailAddress=SENDER,
            ReplyToAddresses=[email],          # reply seedha user ko jaayega
            Destination={'ToAddresses': [RECIPIENT]},
            ConfigurationSetName=CONFIG_SET,   # bounce/complaint tracking
            Content={'Simple': {
                'Subject': {'Data': f'Contact form: {name}'},
                'Body': {'Text': {'Data': f'From: {name} <{email}>\n\n{message}'}}
            }}
        )
        return _resp(200, {'message': 'Sent'})

    except ClientError as e:
        code = e.response['Error']['Code']
        print(json.dumps({
            'level': 'ERROR', 'requestId': context.aws_request_id,
            'errorCode': code, 'message': str(e)
        }))
        return _resp(500, {'error': 'Could not send message'})

def _resp(status, body):
    return {
        'statusCode': status,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'https://myproject.com'
        },
        'body': json.dumps(body)
    }
```

**Is code me kya kya deliberate hai (interview me point out karo):**
- SES client INIT me — har invocation pe naya client nahi
- `ReplyToAddresses` me user ka email — `From` me nahi, kyunki `From` verified identity hona chahiye. **Ye ek bahut common mistake hai**
- Input validation aur length capping — abuse prevention
- Structured JSON logging with request ID
- User ko generic error message, actual error sirf logs me (information disclosure se bachaav)
- CORS origin specific, `*` nahi
- Reserved concurrency 10 — koi form spam kare to bill nahi phatega

### Function 2: Image thumbnail generator

```
Runtime:              Python 3.12
Memory:               1024 MB (Power Tuning se optimal nikala)
Timeout:              60 seconds
Trigger:              S3 ObjectCreated on prefix "originals/" — asynchronous
Layer:                Pillow
Ephemeral storage:    512 MB
Destination (failure): SQS DLQ
Reserved concurrency:  20
Execution role:       s3:GetObject on originals/*, s3:PutObject on thumbnails/*
```

Dhyaan do: **input prefix aur output prefix alag hain, aur IAM role me `originals/` pe write permission nahi hai** — isse infinite loop physically impossible ho jaata hai.

### SAM template snippet

```yaml
Resources:
  ContactFormFunction:
    Type: AWS::Serverless::Function
    Properties:
      Runtime: python3.12
      Architectures: [arm64]
      MemorySize: 256
      Timeout: 10
      ReservedConcurrentExecutions: 10
      Tracing: Active
      Environment:
        Variables:
          SENDER_EMAIL: !Ref SenderEmail
          CONFIG_SET: !Ref ConfigSet
      Policies:
        - Statement:
            - Effect: Allow
              Action: ['ses:SendEmail']
              Resource: !Sub 'arn:aws:ses:${AWS::Region}:${AWS::AccountId}:identity/myproject.com'
      Events:
        Api:
          Type: HttpApi
          Properties:
            Path: /contact
            Method: POST

  ContactFormLogGroup:
    Type: AWS::Logs::LogGroup
    Properties:
      LogGroupName: !Sub '/aws/lambda/${ContactFormFunction}'
      RetentionInDays: 14
```

---

## F. Common Mistakes & Gotchas

**1. Handler ke andar SDK clients aur DB connections banana**
Har invocation pe naya client = slow + expensive. INIT me banao.

**2. Default 3 second timeout chhod dena**
Function 4 second leta hai to random failures aayenge jo debug karna mushkil hai.

**3. Timeout bahut zyada rakhna (15 min "just in case")**
Agar function hang ho gaya to aap 15 minute ka paisa denge, har invocation pe. Timeout ko realistic p99 duration ka ~1.5x rakho.

**4. Secrets environment variables me rakhna**
Console me plaintext dikhta hai. Secrets Manager ya SSM SecureString use karo.

**5. IAM role me `*` permissions**
`s3:*` on `*` — poora account compromise ho sakta hai agar function me injection bug ho.

**6. Idempotency ignore karna**
Async retries aur at-least-once delivery ki wajah se duplicates aayenge. Ready raho.

**7. S3 ObjectCreated pe same bucket me likhna → infinite loop**
Bill phat jaayega. Alag bucket ya prefix filter.

**8. Log retention set na karna**
Default "Never Expire". Saal bhar me logs ka bill Lambda ke bill se zyada ho sakta hai.

**9. VPC me daalke internet ki umeed karna**
NAT Gateway ya VPC endpoint chahiye. Aur NAT Gateway ~$32/month hai — chhote projects me ye Lambda cost se kai guna zyada ho jaata hai.

**10. S3 event me object key decode na karna**
Key URL-encoded aati hai. Space `+` ban jaata hai. `unquote_plus` use karo.

**11. RDS ke saath connection pooling na sochna**
500 concurrent Lambdas = 500 DB connections = RDS down. Reserved concurrency ya RDS Proxy.

**12. Memory ko blindly 128 MB rakhna "cost bachane ke liye"**
Ulta pad sakta hai. Power Tuning se optimal nikalo.

**13. `/tmp` clean na karna**
Warm environment reuse hota hai. Ek user ka data doosre ko leak ho sakta hai.

**14. Resource-based policy bhool jaana (IaC me)**
Trigger configure kiya but Lambda ko invoke karne ki permission nahi di. Console automatically karta hai, Terraform/CDK me manually karna padta hai.

**15. Lambda ko long-running / stateful kaam ke liye use karna**
15 minute ki hard limit hai. Video encoding, bade batch jobs ke liye ECS/Fargate/Batch better hai.

**16. Poison pill handle na karna (streams)**
Ek bad record poora shard block kar deta hai. `BisectBatchOnFunctionError` + `MaximumRetryAttempts` set karo.

---

## G. Cost Model — optimization checklist

1. **arm64 (Graviton2) use karo** — 20% sasta, aksar tez bhi. Migration usually sirf architecture flag change hai
2. **Memory tune karo** Power Tuning tool se — guess mat karo
3. **Duration kam karo** — SDK clients reuse, unnecessary dependencies hatao, efficient algorithms
4. **Log retention set karo** — 7/14/30 days. Ye sabse ignore kiya jaane wala cost hai
5. **Provisioned concurrency sirf jahan zaroori** — aur uspe auto-scaling lagao
6. **VPC se bacho agar zaroorat nahi** — NAT Gateway ka $32/month + data charge chhota nahi hai
7. **Batch processing** — SQS trigger me batch size badhao, per-invocation overhead kam hoga
8. **Reserved concurrency** se runaway cost roko
9. **Compute Savings Plans** — agar predictable heavy usage hai to 17% tak discount
10. **CloudWatch billing alarm** — hamesha lagao

---

## H. Security Best Practices

**1. Least privilege execution role** — har function ka apna role, specific actions, specific resource ARNs. Ek "shared lambda role" anti-pattern hai.

**2. Secrets Manager / SSM Parameter Store** — environment variables me secrets nahi. Value INIT me fetch karke cache karo. AWS Parameters and Secrets Lambda Extension use kar sakte ho jo caching built-in deta hai.

**3. Environment variable encryption** — customer-managed KMS key use karo, aur "encryption helpers" enable karo taaki console me bhi plaintext na dikhe.

**4. Input validation** — Lambda internet-facing ho sakta hai. Injection, oversized payload, malformed JSON — sab handle karo.

**5. Function URL pe auth** — agar Function URL use kar rahe ho to `AuthType: AWS_IAM` rakho, `NONE` sirf tab jab public API intentional ho.

**6. Resource-based policy me `SourceArn` condition** — taaki koi bhi random S3 bucket ya SNS topic aapke function ko invoke na kar sake.

**7. Dependency scanning** — `npm audit`, `pip-audit`, ya Amazon Inspector se vulnerable packages detect karo. Lambda me aapki dependencies hi sabse bada attack surface hain.

**8. `/tmp` clean karo** — cross-invocation data leakage se bachaav.

**9. Code signing** — AWS Signer se code sign karo taaki sirf verified code deploy ho.

**10. VPC + Security Groups** — agar private resources access karne hain to VPC me daalo, aur SG me outbound bhi restrict karo.

**11. Never log secrets** — event object me PII ya tokens ho sakte hain. Blindly `print(event)` mat karo.

**12. X-Ray + CloudTrail** — audit trail aur anomaly detection.

---

## I. Interview Q&A — Lambda

---

**Q1. Lambda kya hai aur "serverless" ka matlab kya hai?**

> Lambda AWS ka event-driven serverless compute service hai. Main sirf function ka code aur uski configuration deta hoon, aur AWS provisioning, scaling, patching aur availability sab handle karta hai. Serverless ka matlab ye nahi ki server exist hi nahi karta — server hai, bas wo meri responsibility nahi hai. Practically iske teen main implications hain: pehla, mujhe capacity planning nahi karni padti kyunki Lambda automatically thousands of concurrent executions tak scale kar jaata hai; doosra, main sirf actual execution time ka paisa deta hoon millisecond granularity pe, idle time ka zero; teesra, high availability by default milti hai kyunki Lambda multiple AZs me chalta hai. Mere project me maine contact form ke liye Lambda use kiya — wo din me 50 baar chalta hai, uske liye EC2 24 ghante chalana bilkul waste hota.

---

**Q2. Cold start kya hai aur usko kaise kam karoge?**

> Cold start tab hota hai jab Lambda ko naya execution environment banana padta hai. Us process me Firecracker microVM boot hota hai, runtime initialize hoti hai, deployment package download aur extract hota hai, aur mera INIT code chalta hai — matlab handler ke bahar ka code. Ye typically 100 millisecond se 2 second tak le sakta hai, runtime aur package size pe depend karta hai. Warm start me ye sab skip ho jaata hai aur latency 1 se 10 millisecond hoti hai. Kam karne ke liye main package size chhota rakhta hoon aur AWS SDK v3 ke modular imports use karta hoon, memory ko Power Tuning se optimize karta hoon kyunki zyada memory matlab zyada CPU matlab fast init, aur SDK clients ko INIT phase me banata hoon. Agar latency-critical API hai to Provisioned Concurrency use karunga jo environments pre-warm rakhta hai. Java ke liye SnapStart ek accha option hai jo free hai aur 10 guna tak improvement deta hai. Ek baat jo main avoid karta hoon wo hai scheduled ping se warming — ye ab anti-pattern maana jaata hai kyunki ye scale-out ke cold starts solve nahi karta.

---

**Q3. Lambda me CPU kaise allocate karte ho?**

> Lambda me CPU directly set nahi hoti — main sirf memory set karta hoon aur CPU proportionally allocate hoti hai. 1,769 MB pe exactly ek vCPU milti hai, aur maximum 10,240 MB pe lagbhag 6 vCPUs. Iska ek counter-intuitive implication hai jo bahut log miss karte hain — zyada memory dena kabhi kabhi saste padta hai. Cost memory into duration hai, to agar 128 MB pe function 10 second leta hai aur 1024 MB pe 1 second, to total cost kam ho jaata hai aur latency 10 guna better. Lekin ye sirf CPU-bound workloads pe kaam karta hai — agar function zyadatar network I/O ka wait kar raha hai to memory badhane se duration kam nahi hoga, sirf cost badhega. Isliye main guess nahi karta, AWS Lambda Power Tuning tool chalata hoon jo different memory settings pe function run karke cost aur performance ka graph deta hai.

---

**Q4. Reserved aur Provisioned concurrency me kya farq hai?**

> Reserved concurrency ek function ke liye concurrency ka hissa reserve karti hai aur saath me use cap bhi karti hai. Ye free hai aur cold start pe koi asar nahi karti. Iska dual purpose hai — ek taraf guarantee ki koi doosra function is function ko starve nahi karega, doosri taraf ek hard limit jo downstream resources ko protect karti hai. Jaise agar mera Lambda RDS se connect karta hai jiske paas 100 connections hain to main reserved concurrency 50 rakhunga. Provisioned concurrency bilkul alag cheez hai — ye execution environments ko pehle se initialize karke ready rakhti hai, jisse cold start practically khatam ho jaata hai. Ye paid hai aur idle rehne pe bhi charge hoti hai. Main isko sirf latency-critical user-facing APIs pe use karunga, aur uspe Application Auto Scaling laga dunga taaki peak hours me badhe aur off-hours me kam ho. Ek useful trick ye hai ki reserved concurrency zero set karne se function poori tarah disable ho jaata hai — ye emergency kill switch ki tarah kaam karta hai.

---

**Q5. Synchronous aur asynchronous invocation me kya farq hai?**

> Synchronous invocation me caller response ka wait karta hai — jaise API Gateway ya ALB se aane wali requests. Yahan Lambda khud koi retry nahi karta, error caller ko wapas jaata hai aur retry karna caller ki zimmedari hai. Payload limit 6 MB hai. Asynchronous invocation me caller ko turant 202 Accepted mil jaata hai aur event Lambda ki internal queue me chala jaata hai — jaise S3 events, SNS, ya EventBridge. Yahan Lambda automatically do retries karta hai, matlab total teen attempts, aur agar phir bhi fail ho to event DLQ ya on-failure destination pe jaata hai. Async ka payload limit 256 KB hai aur max event age 6 ghante. Iska ek important implication ye hai ki async me mera function **idempotent** hona chahiye, kyunki retries aur at-least-once delivery ki wajah se same event do baar process ho sakta hai.

---

**Q6. Aapka Lambda idempotent kaise hai?**

> Idempotency ka matlab hai same event kitni bhi baar process ho, result same rahe. Ye zaroori hai kyunki async invocations me automatic retries hain aur S3 ya SQS jaisi services at-least-once delivery deti hain. Mere email wale function me ye critical tha — warna user ko same email do baar jaata. Maine ye approach use ki: event me se ek deterministic unique ID nikaali — S3 events me object key plus version ID, ya API requests me client se aaya idempotency key — aur usko DynamoDB me conditional put ke saath store kiya `attribute_not_exists` condition ke saath. Agar wo key pehle se exist karti hai to main duplicate detect karke silently success return kar deta hoon. Us record pe TTL bhi lagata hoon taaki table infinitely na badhe. AWS Lambda Powertools me isi pattern ka ready-made idempotency decorator bhi hai jo main use kar sakta hoon.

---

**Q7. Lambda me error aa raha hai production me. Debug kaise karoge?**

> Main systematically jaaunga. Sabse pehle CloudWatch Logs me us function ka log group dekhunga — `/aws/lambda/` ke andar — aur Logs Insights se error pattern query karunga, jaise error type ke hisaab se count. Main structured JSON logging karta hoon request ID ke saath, to ek specific failing request ka poora trace nikaal sakta hoon. Phir CloudWatch metrics dekhunga — Errors, Throttles, Duration aur ConcurrentExecutions. Agar Throttles zero se zyada hai to concurrency limit hit ho rahi hai, agar Duration timeout ke paas hai to function timeout ho raha hai. Agar X-Ray enabled hai to trace map se pata chalega ki time kahan ja raha hai — DynamoDB call me, SES me, ya cold start me. Agar async invocation hai to main DLQ ya failure destination check karunga jahan failed events ka payload aur error context hota hai. Common root causes jo main pehle check karta hoon: IAM permission missing, timeout too low, downstream service throttling, aur VPC me hone pe internet ya endpoint access missing.

---

**Q8. Lambda VPC me daalne se kya hota hai? Cold start pe kya asar?**

> By default Lambda AWS-managed VPC me chalta hai aur usko internet access milta hai. Jab main use apne VPC me daalta hoon to wo private resources jaise RDS aur ElastiCache access kar sakta hai, lekin usko internet access khatam ho jaata hai — aur public subnet me daalne se bhi nahi milta kyunki Lambda ke paas public IP nahi hota. Internet chahiye to private subnet me daalke NAT Gateway lagana padta hai, jo lagbhag 32 dollar per month plus data processing charge leta hai. Sirf AWS services chahiye to VPC Endpoints better hain — S3 aur DynamoDB ke Gateway endpoints free hain. Cold start ke bare me ek updated fact hai jo important hai: pehle VPC Lambda ka cold start 10 second se zyada ho jaata tha kyunki har environment ke liye alag ENI banti thi, lekin 2019 me AWS ne Hyperplane ENI introduce ki jisme ENIs shared aur pre-created hoti hain, aur ab VPC ka cold start penalty practically negligible hai. Purani blogs abhi bhi VPC Lambda ko slow batati hain, wo outdated hai. Ek cheez jo abhi bhi dhyaan rakhni padti hai wo hai subnet me available IP addresses — high concurrency me subnet chhota hua to ENI creation fail ho sakti hai.

---

**Q9. Lambda se RDS connect kar rahe ho aur "too many connections" error aa raha hai. Kya karoge?**

> Ye Lambda ka classic problem hai. Har execution environment apna alag database connection banata hai, aur environments ke beech connection share nahi hota. Agar concurrency 500 tak jaaye to 500 connections RDS pe khul jaayengi, jabki ek chhote RDS instance ka max_connections shayad 100 ho. Iske teen solutions hain. Sabse proper solution **RDS Proxy** hai — ye connection pooling aur multiplexing karta hai, matlab hazaaron Lambda executions bhi kuch dozen actual DB connections use karti hain, aur ye failover time bhi kam karta hai. Doosra solution **reserved concurrency** se cap lagana hai — main Lambda ki concurrency ko itna set karta hoon ki wo RDS ke connection limit se kam rahe. Teesra, application level pe main connection ko INIT phase me banata hoon taaki wo warm invocations me reuse ho, aur har invocation pe naya connection na bane. Ek architectural option ye bhi hai ki agar workload fit kare to DynamoDB use karein, jo connectionless HTTP API hai aur is problem se poori tarah bachati hai.

---

**Q10. Lambda ke limits kya hain? Numbers batao.**

> Maximum timeout 900 second yaani 15 minute hai, default 3 second. Memory 128 MB se 10,240 MB tak, aur 1,769 MB pe exactly ek vCPU milti hai. Ephemeral `/tmp` storage default 512 MB hai aur 10 GB tak configure ho sakti hai. Deployment package direct upload me 50 MB zipped, aur unzipped 250 MB — usme layers bhi count hote hain — aur container image ke saath 10 GB tak ja sakte hain. Layers maximum 5 per function. Synchronous invocation ka payload limit 6 MB hai request aur response dono milaake, asynchronous ka 256 KB. Environment variables total 4 KB. Default concurrency per region 1,000 hai jo soft limit hai aur support se badhaya ja sakta hai, aur burst concurrency 1,000 per 10 second per function hai. In numbers ka practical asar bhi hai — jaise 6 MB payload limit ki wajah se main file uploads Lambda ke through nahi bhejta, presigned URL pattern use karta hoon.

---

**Q11. Lambda kab use nahi karna chahiye?**

> Chaar situations me main Lambda avoid karunga. Pehla, jab kaam 15 minute se zyada ka ho — jaise bade video encoding ya heavy batch ETL. Uske liye ECS Fargate, AWS Batch ya Step Functions with distributed map better hain. Doosra, jab traffic consistently high aur steady ho — jaise ek API jo 24 ghante constant 5,000 requests per second handle karti hai. Us scale pe EC2 with Savings Plans ya Fargate aksar saste pad jaate hain, kyunki Lambda ka per-request pricing steady load pe advantage nahi deta. Teesra, jab latency requirement bahut strict ho aur cold start acceptable na ho — Provisioned Concurrency isse solve karta hai but us case me aap effectively hamesha-on capacity ka paisa de rahe ho, to ye evaluate karna padta hai ki serverless ka fayda bacha bhi hai ya nahi. Chautha, jab application stateful ho ya persistent connections chahiye — jaise WebSocket server ya lambe TCP connections; wahan container-based approach better fit hai.

---

**Q12. Lambda ka pricing model samjhao aur ek example do.**

> Lambda ka charge do cheezon pe hai — requests aur duration. Requests $0.20 per million hain, aur duration GB-seconds me measure hoti hai, lagbhag $0.0000166667 per GB-second x86 ke liye, aur arm64 Graviton pe 20 percent sasta. Billing granularity 1 millisecond hai — pehle 100 millisecond blocks the, matlab 30 millisecond ka function bhi 100 ka charge hota tha, ab actual duration pe charge hai. Free tier perpetual hai, sirf 12 month ka nahi — 1 million requests aur 400,000 GB-seconds har month. Ek example leta hoon: 512 MB memory, 200 millisecond average duration aur 1 million invocations per month. GB-seconds hoga 0.5 into 0.2 into 1 million, yaani 100,000 GB-seconds — jo free tier ke 400,000 ke andar hai, aur 1 million requests bhi free tier me hain. To mera cost zero rahega. Mere project me actual Lambda cost practically zero hi hai. Cost optimize karne ke liye main arm64 use karta hoon, memory Power Tuning se set karta hoon, aur CloudWatch log retention set karta hoon — kyunki log storage aksar Lambda se zyada mehnga ho jaata hai agar retention never-expire chhod diya jaaye.

---

**Q13. DLQ aur Lambda Destinations me kya farq hai?**

> DLQ purana mechanism hai — ye sirf failure pe trigger hota hai, sirf SQS ya SNS ko target kar sakta hai, aur usme sirf original event payload jaata hai. Iska bada limitation ye hai ki mujhe pata hi nahi chalta ki failure kyun hua — sirf event dikhta hai, error nahi. Destinations naya aur better mechanism hai. Ye success aur failure dono pe trigger ho sakta hai, SQS, SNS, EventBridge aur doosre Lambda functions ko target kar sakta hai, aur sabse important — usme original event ke saath response context bhi jaata hai jisme error message aur stack trace hoti hai. Isse debugging bahut aasan ho jaati hai. Aur success destination se main functions chain kar sakta hoon simple workflows ke liye bina Step Functions ka overhead liye. Isliye main naye projects me Destinations prefer karta hoon, halanki dono ek saath bhi configure ho sakte hain.

---

**Q14. Aapka Lambda throttle ho raha hai. Kya karoge?**

> Throttling ka matlab hai concurrency limit hit ho rahi hai. Main pehle CloudWatch me `Throttles` aur `ConcurrentExecutions` metrics dekhunga taaki confirm ho aur pata chale ki peak kitna hai. Phir main ye check karunga ki limit account-level hai ya function-level. Agar kisi doosre function ne reserved concurrency le rakhi hai to unreserved pool chhota ho gaya hoga. Agar account ka default 1,000 limit hit ho raha hai to main AWS Support se limit increase request karunga — ye soft limit hai. Function level pe main reserved concurrency badha sakta hoon. Lekin sirf limit badhana hamesha sahi answer nahi hai — main ye bhi dekhunga ki concurrency zyada kyun hai. Concurrency requests per second into duration hoti hai, to agar main duration kam kar doon — code optimize karke ya memory badhake — to concurrency automatically kam ho jaayegi. Aur architecture level pe, agar workload async hai to main API Gateway se seedha Lambda ki jagah beech me **SQS** laga sakta hoon, jo buffer ka kaam karega — traffic spike absorb ho jaayega aur Lambda apni speed se process karta rahega bina requests drop kiye.

---

**Q15. Lambda ka execution role aur resource-based policy me kya difference hai?**

> Execution role batata hai ki **Lambda kya kar sakta hai** — matlab outbound permissions. Jaise mera thumbnail function S3 se read kar sakta hai aur thumbnails prefix pe write kar sakta hai, aur CloudWatch Logs likh sakta hai. Ye IAM role hai jo Lambda assume karta hai. Resource-based policy iska ulta hai — wo batati hai ki **kaun Lambda ko invoke kar sakta hai**, matlab inbound permissions. Jaise S3 service ko permission chahiye mere function ko trigger karne ke liye, ya doosre AWS account ko permission chahiye mere function ko call karne ke liye. Jab main console se trigger add karta hoon to AWS automatically resource-based policy add kar deta hai, isliye ye visible nahi hota. Lekin Terraform ya CDK me ye manually add karna padta hai — `AWS::Lambda::Permission` resource se — aur ise bhool jaana ek bahut common bug hai jisme trigger configure to dikhta hai but function invoke hi nahi hota. Security ke liye main resource-based policy me `SourceArn` condition zaroor lagata hoon taaki koi random bucket ya topic mere function ko invoke na kar sake.

---

**Q16. Lambda me secrets kaise manage karoge?**

> Environment variables me secrets nahi rakhta, kyunki jisko bhi `lambda:GetFunctionConfiguration` permission hai wo unhe plaintext me console me dekh sakta hai. Main **AWS Secrets Manager** use karta hoon jab automatic rotation chahiye — jaise database credentials — aur **SSM Parameter Store SecureString** jab rotation ki zaroorat nahi aur cost kam rakhni hai, kyunki standard parameters free hain jabki Secrets Manager per secret per month charge karta hai. Implementation me ek important detail hai — main secret ko **INIT phase me fetch karke module-level variable me cache** karta hoon, taaki har invocation pe API call na ho. Agar har invocation pe fetch karunga to latency badhegi aur Secrets Manager ka bill bhi. AWS ka **Parameters and Secrets Lambda Extension** bhi hai jo ye caching layer built-in deta hai. Aur ek discipline main follow karta hoon — event object ko blindly log nahi karta, kyunki usme tokens ya PII ho sakti hai.

---
---

# 5. Amazon SES (Simple Email Service)

---

## A. Simple Explanation

### Service kya hai

SES AWS ka **email sending aur receiving** service hai. Isse aap apni application se transactional emails (OTP, password reset, order confirmation, contact form) aur bulk emails (newsletters) bhej sakte ho — bina apna mail server chalaye.

Do tarike se use kar sakte ho:
1. **SES API** (SDK se — recommended)
2. **SMTP interface** (existing apps jo SMTP bolte hain, unke liye — ports 587, 465, 25, 2587)

### Real-world analogy (interview me bolna)

> "Sir, SES ko main aise samjhata hoon — apna khud ka mail server chalana matlab **apni khud ki courier company** kholna. Aapko gaadiyan chahiye, drivers chahiye, aur sabse mushkil — aapko har city me **reputation** banani padegi taaki log aapke parcels accept karein. Naya courier hai to log shak karenge. SES ek **established courier company** hai jiski reputation Gmail, Outlook, Yahoo — sabke saath already bani hui hai. Aap bas parcel do, wo deliver kar denge. Lekin ek shart hai — agar aap bar bar galat address pe parcel bhejoge ya log shikayat karenge ki aap spam bhej rahe ho, to courier company aapko blacklist kar degi. Wahi bounce rate aur complaint rate hai."

**Ye analogy isliye acha hai kyunki ye ek core truth capture karti hai:** email delivery ka asli challenge **technical nahi, reputation ka** hai.

---

## B. Why It Exists / Problem It Solves

**Problem 1 — Apna SMTP server chalana bahut painful hai.**
Postfix setup karo, TLS configure karo, DKIM signing setup karo, DNS records maintain karo, blacklists monitor karo, IP reputation banao. Ye ek full-time job hai.

**Problem 2 — Cloud providers port 25 block karte hain.**
AWS EC2 pe outbound port 25 **by default blocked** hai (spam prevention ke liye). Unblock karne ke liye support request daalni padti hai. Ye jaanbujh ke hai.

**Problem 3 — IP reputation zero se banani padti hai.**
Naya IP se email bhejoge to Gmail/Outlook usko spam folder me daal denge. Reputation banane me hafte lagte hain aur "IP warming" ka poora process hota hai. SES ke shared IP pool ki reputation already established hai.

**Problem 4 — Deliverability engineering.**
SPF, DKIM, DMARC, feedback loops, bounce handling, list hygiene — ye sab domain expertise chahiye. SES ye sab infrastructure de deta hai.

**Problem 5 — Cost.**
SendGrid/Mailgun ke free tiers ke baad price tez badhta hai. SES **$0.10 per 1,000 emails** hai — market me sabse sasta.

---

## C. How It Actually Works (Internal Flow)

### Sending flow

```
1. APPLICATION → SES
   SendEmail API call (SigV4 signed) ya SMTP with SES credentials

2. SES: IDENTITY VERIFICATION CHECK
   - "From" address ka domain ya email verified hai?
   - Nahi → MessageRejected: Email address not verified

3. SANDBOX CHECK (agar account sandbox me hai)
   - Recipient bhi verified hai? Nahi → reject
   - 24 ghante me 200 se zyada bheje? → reject
   - 1 email/second se zyada? → throttle

4. SENDING QUOTA CHECK
   - Daily sending quota exceeded? → Throttling error
   - Max send rate exceeded? → Throttling error

5. CONTENT PROCESSING
   - MIME message construct
   - DKIM SIGNING: SES private key se message ko sign karta hai
     (DKIM-Signature header add hota hai)
   - Configuration set ke rules apply

6. REPUTATION / SUPPRESSION CHECK
   - Account-level suppression list me recipient hai? → silently skip
   - (Ye purane hard bounces aur complaints se auto-populate hoti hai)

7. SMTP DELIVERY
   - SES apne IP pool (shared ya dedicated) se recipient ke
     mail server (Gmail, Outlook) ko SMTP connection banata hai

8. RECIPIENT MAIL SERVER VALIDATION
   - SPF check: kya sending IP is domain ke liye authorized hai?
     (Return-Path/MAIL FROM domain ka SPF record dekha jaata hai)
   - DKIM check: signature valid hai? DNS se public key nikaal ke verify
   - DMARC check: SPF ya DKIM me se koi ek pass hua AUR aligned hai
     (From domain ke saath match karta hai)?
   - Reputation check: is IP/domain ki history kaisi hai?

9. OUTCOME
   ✅ Inbox     — sab pass, reputation acchi
   ⚠️ Spam      — technically valid but reputation ya content suspicious
   ❌ Bounce    — hard (address exist nahi) ya soft (mailbox full, temporary)
   ⚠️ Complaint — user ne "Report Spam" dabaya

10. FEEDBACK LOOP
    Bounce/Complaint/Delivery events → Configuration Set →
    Event Destination (SNS / EventBridge / Kinesis Firehose / CloudWatch)
    → Aapka Lambda → Database update, suppression list
```

### Key components

| Component | Role |
|-----------|------|
| **Identity** | Verified email address ya domain jisse aap bhej sakte ho |
| **Configuration Set** | Ek group of rules — event publishing, IP pool, TLS policy, suppression override |
| **Event Destination** | Kahan events bhejne hain (SNS, EventBridge, Firehose, CloudWatch) |
| **Suppression List** | Addresses jinpe SES bhejna hi nahi chahega (account-level ya global) |
| **Dedicated IP Pool** | Aapke apne IPs ka group, alag alag traffic types ke liye |
| **Reputation Dashboard** | Bounce aur complaint rates ka live view |
| **Virtual Deliverability Manager** | Advanced deliverability insights aur recommendations (paid) |

---

## D. Key Concepts & Terminology

### D.1 Sandbox vs Production Mode

**Har naya SES account sandbox me hota hai.** Ye poocha jaata hai.

| | Sandbox | Production |
|-|---------|-----------|
| **Recipient verified hona chahiye?** | ✅ **Haan** | ❌ Nahi, kisi ko bhi bhejo |
| **Daily quota** | 200 emails / 24 hours | 50,000+ (grow karta hai) |
| **Send rate** | 1 email/second | 14+ emails/second |
| **Kaise nikle** | AWS Support me request | — |

**Production access ke liye request me kya likhna hota hai (ye jaanna practical knowledge dikhata hai):**
- Aap kis type ke emails bhejenge (transactional ya marketing)
- Aap recipients kaise collect karte ho (opt-in process)
- Aap **bounces aur complaints kaise handle** karenge — ye sabse important point hai
- Aap unsubscribe kaise handle karenge
- Expected volume

> "Maine production access request me specifically likha ki maine configuration set banaya hai jiska event destination SNS pe hai, aur ek Lambda subscriber hai jo bounces aur complaints ko database me record karta hai aur us address ko suppression list me daal deta hai. Ye batane se approval jaldi mila, kyunki AWS ki main concern yahi hoti hai ki aap unhealthy sending se unke IP pool ki reputation kharab na karo."

**Ek important gotcha:** Sandbox aur production status **per-region** hai. Agar aapne us-east-1 me production access liya to ap-south-1 me aap abhi bhi sandbox me hoge.

### D.2 Verified Identity — Email vs Domain

| | Email Identity | Domain Identity |
|-|---------------|-----------------|
| **Verify kaise** | Us address pe verification link aata hai | DNS me TXT/CNAME records daalne padte hain |
| **Kya bhej sakte ho** | Sirf usi exact address se | Us domain ke **kisi bhi** address se — `noreply@`, `support@`, `hello@` |
| **DKIM** | Limited | ✅ Full domain-level DKIM |
| **Production ke liye** | ❌ Nahi (scale nahi karta) | ✅ **Recommended** |

**Interview me kya bolna:**
> "Maine **domain identity** verify ki, email identity nahi. Wajah ye hai ki domain verify karne se main us domain ke kisi bhi address se bhej sakta hoon bina har ek ko individually verify kiye — `noreply@`, `support@`, `alerts@` sab kaam karte hain. Aur zyada important, domain-level verification hi DKIM signing ko properly enable karti hai, jo deliverability ke liye zaroori hai."

### D.3 SPF, DKIM, DMARC — teeno ko clearly samjho

**Ye SES ka sabse zyada poocha jaane wala area hai.** Har ek alag problem solve karta hai.

---

#### SPF (Sender Policy Framework)

**Kya karta hai:** Batata hai ki **kaun se IP addresses / servers** aapke domain ki taraf se email bhej sakte hain.

**DNS record (TXT):**
```
mail.myproject.com.  TXT  "v=spf1 include:amazonses.com ~all"
```

**Kaise kaam karta hai:**
1. Recipient server dekhta hai email kis IP se aayi
2. Wo **Return-Path (MAIL FROM / envelope sender)** domain ka SPF record DNS se fetch karta hai
3. Check karta hai ki wo IP us list me hai ya nahi
4. Pass / Fail / SoftFail

**Qualifiers:**
- `~all` = SoftFail — "ye authorized nahi hai but reject mat karo, mark kar do" (recommended shuruaat me)
- `-all` = HardFail — "reject kar do" (strict, tab use karo jab confident ho)
- `?all` = Neutral (useless)

**SPF ki do badi limitations (ye bolna deep knowledge dikhata hai):**
1. **SPF forwarding pe toot jaata hai.** Agar user ne apna email forward kiya to forwarding server ka IP alag hoga, aur SPF fail ho jaayega. Isliye akela SPF kaafi nahi hai — DKIM chahiye.
2. **10 DNS lookup limit.** SPF record me `include:` mechanisms 10 se zyada DNS lookups trigger nahi kar sakte, warna `PermError` aata hai aur SPF fail ho jaata hai. Bahut saare services add karte jaao to ye limit hit ho jaati hai.
3. **SPF `From` header ko check nahi karta**, sirf envelope sender ko. Isliye spoofing abhi bhi possible hai — DMARC alignment isko fix karta hai.

---

#### DKIM (DomainKeys Identified Mail)

**Kya karta hai:** Email pe **cryptographic signature** lagata hai jo prove karti hai ki (a) email genuinely us domain se aayi, aur (b) transit me **tamper nahi hui**.

**DNS records (CNAME — SES ka Easy DKIM):**
```
abc123._domainkey.myproject.com  CNAME  abc123.dkim.amazonses.com
def456._domainkey.myproject.com  CNAME  def456.dkim.amazonses.com
ghi789._domainkey.myproject.com  CNAME  ghi789.dkim.amazonses.com
```

**Kaise kaam karta hai:**
1. SES ke paas **private key** hai, wo message ke headers aur body ka hash banake sign karta hai
2. Signature `DKIM-Signature` header me jaati hai, saath me selector ka naam
3. Recipient server selector se DNS query karta hai aur **public key** fetch karta hai
4. Public key se signature verify karta hai
5. Match hua = email authentic aur untampered

**SES teen CNAMEs kyun deta hai?** Kyunki SES **key rotation** support karta hai — wo automatically keys rotate kar sakta hai bina aapke DNS touch kiye. Isliye teen selectors pre-provisioned hote hain.

**DKIM ka bada fayda:** Ye **forwarding survive karta hai**, kyunki signature message ke saath travel karti hai, IP se koi lena dena nahi. Isliye DKIM SPF se zyada reliable hai.

**Easy DKIM vs BYODKIM:**
- **Easy DKIM** — SES keys manage karta hai, aap CNAMEs daalte ho. RSA 2048-bit (ya 1024). Automatic rotation. **Ye default choose karo**
- **BYODKIM** (Bring Your Own DKIM) — aap apni key pair banate ho, private key SES ko dete ho, public key TXT record me daalte ho. Tab use karo jab aapko key pe apna control chahiye ho

---

#### DMARC (Domain-based Message Authentication, Reporting & Conformance)

**Kya karta hai:** Teen kaam —
1. Batata hai ki agar SPF/DKIM **fail** ho jaayein to email ka kya karo
2. **Alignment** enforce karta hai — ye asli value add hai
3. **Reports** bhejta hai ki kaun aapke domain se email bhej raha hai

**DNS record (TXT):**
```
_dmarc.myproject.com  TXT  "v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@myproject.com; ruf=mailto:dmarc-forensic@myproject.com; pct=100; adkim=r; aspf=r"
```

**Tags:**

| Tag | Matlab |
|-----|--------|
| `p=none` | Kuch mat karo, sirf report bhejo (monitoring phase — yahi se shuru karo) |
| `p=quarantine` | Spam folder me daal do |
| `p=reject` | Poori tarah reject kar do (strictest) |
| `rua=` | Aggregate reports kahan bhejni (daily XML summary) |
| `ruf=` | Forensic/failure reports (per-message, privacy concerns ki wajah se kam providers bhejte hain) |
| `pct=` | Kitne percent messages pe policy apply ho (rollout ke liye) |
| `adkim=r/s` | DKIM alignment relaxed/strict |
| `aspf=r/s` | SPF alignment relaxed/strict |

**ALIGNMENT — ye DMARC ka core concept hai aur ye poocha jaata hai:**

> "Sir, DMARC ki asli value **alignment** hai, aur ye samajhna zaroori hai ki SPF aur DKIM akele kyun kaafi nahi. Problem ye hai ki SPF **envelope sender** ko check karta hai, jabki user ko jo dikhta hai wo **From header** hai — ye do alag cheezein hain. Ek attacker apna khud ka domain use karke SPF pass kar sakta hai, aur `From` header me aapka domain daal sakta hai. Technically SPF pass, but user ko lagega email aapse aayi hai. DMARC ye enforce karta hai ki **SPF ya DKIM ka domain, `From` header ke domain se match kare** — usko alignment kehte hain. Relaxed alignment me organizational domain match karna kaafi hai, strict me exact subdomain match chahiye. Isliye DMARC ke bina SPF aur DKIM se spoofing poori tarah nahi rukti."

**DMARC rollout strategy (practical knowledge dikhane ke liye):**
```
Phase 1 (2-4 hafte): p=none        → sirf monitor karo, reports padho
Phase 2 (2-4 hafte): p=quarantine; pct=10 → thode traffic pe test
Phase 3:             p=quarantine; pct=100
Phase 4:             p=reject       → jab confident ho ki saare legitimate
                                       senders properly aligned hain
```
Seedhe `p=reject` lagana khatarnaak hai — aapke apne legitimate emails (jaise CRM, HR tool, marketing platform) block ho sakte hain.

---

#### Teeno ka comparison — ek table me

| | SPF | DKIM | DMARC |
|-|-----|------|-------|
| **Kya verify karta hai** | Sending IP authorized hai? | Message tamper nahi hua aur domain se hai? | SPF/DKIM aligned hain aur fail pe kya karein? |
| **DNS record type** | TXT | CNAME (Easy DKIM) ya TXT | TXT |
| **Kis header ko dekhta hai** | Return-Path (envelope) | DKIM-Signature | **From header** (alignment ke liye) |
| **Forwarding survive?** | ❌ Nahi | ✅ Haan | Depends |
| **Reporting deta hai?** | ❌ | ❌ | ✅ Haan |
| **Bina iske kya hota hai** | Koi bhi aapke domain se bhej sakta hai | Message tamper ho sakta hai | Spoofing pe koi policy nahi, koi visibility nahi |

**Ek line me:** *"SPF batata hai kaun bhej sakta hai, DKIM prove karta hai ki message authentic hai, aur DMARC batata hai ki dono me se koi fail ho to kya karna hai — plus alignment enforce karta hai."*

### D.4 Custom MAIL FROM Domain

By default SES ka MAIL FROM domain `amazonses.com` hota hai. Iska matlab SPF check `amazonses.com` ke against hota hai, aapke domain ke against nahi — matlab **SPF alignment fail** ho jaata hai DMARC ke liye.

**Fix:** Custom MAIL FROM domain configure karo, jaise `mail.myproject.com`:

```
mail.myproject.com  MX   10 feedback-smtp.ap-south-1.amazonses.com
mail.myproject.com  TXT  "v=spf1 include:amazonses.com ~all"
```

Ab SPF `mail.myproject.com` ke against check hoga, jo `myproject.com` ka subdomain hai — relaxed alignment me ye pass ho jaayega.

**Ye ek advanced point hai jo bolne se banda seriously impress hota hai**, kyunki 90% log domain verify karke DKIM laga dete hain aur MAIL FROM ka concept jaante hi nahi.

### D.5 Bounce & Complaint Handling

**Ye SES ka sabse important operational topic hai.**

**Bounce types:**

| Type | Matlab | Kya karna hai |
|------|--------|--------------|
| **Hard bounce** | Address permanently invalid — exist nahi karta, domain nahi hai | **Turant list se hatao, dobara mat bhejo** |
| **Soft bounce** | Temporary — mailbox full, server down, message too large | Limited retries theek hai, but repeated soft bounces ke baad hatao |
| **Transient** | SES ka classification for soft | Same |

**Complaint:** User ne apne email client me "Report Spam" ya "Junk" dabaya. Ye sabse serious signal hai.

**AWS ke thresholds — ye numbers yaad rakho:**

| Metric | Healthy | Review (warning) | Pause (account suspend) |
|--------|---------|------------------|------------------------|
| **Bounce rate** | < 2% | **≥ 5%** | **≥ 10%** |
| **Complaint rate** | < 0.1% | **≥ 0.1%** | **≥ 0.5%** |

Agar ye limits cross hui to AWS pehle "under review" me daalta hai, aur phir aapka **sending pause** kar sakta hai. Ye account-level action hai.

**Handling architecture (mere project me):**
```
SES → Configuration Set → Event Destination (SNS Topic)
                                 ↓
                          Lambda subscriber
                                 ↓
        ┌────────────────────────┼──────────────────────┐
        ↓                        ↓                      ↓
  Hard bounce            Complaint               Delivery/Open/Click
  → DB me mark           → DB me mark            → Analytics
  → Suppression list     → Suppression list
                         → Marketing se remove
```

**SES Suppression List — do levels:**

| Level | Scope | Control |
|-------|-------|---------|
| **Global suppression list** | Poore SES ke liye, AWS manage karta hai | Aap dekh nahi sakte, but addresses remove karne ka API hai |
| **Account-level suppression list** | Sirf aapka account | ✅ Aap manage karte ho — add/remove/list. Bounce, complaint, ya dono pe auto-add configure kar sakte ho |

**Account-level suppression list enable karna best practice hai** — isse SES khud automatically hard bounces aur complaints ko suppress kar deta hai, aur aapki reputation protected rehti hai even agar aapke application logic me bug ho.

### D.6 Reputation Dashboard

SES console me available. Batata hai:
- **Bounce rate** (last ~10,000 emails ka rolling)
- **Complaint rate**
- **Account status** — Healthy / Under Review / Pending End of Review / Shutdown
- **Reputation metrics** per configuration set (agar enabled ho)

CloudWatch me `Reputation.BounceRate` aur `Reputation.ComplaintRate` metrics milte hain — inpe **alarm lagana chahiye** (bounce > 3%, complaint > 0.08%) taaki threshold hit hone se pehle pata chal jaaye.

### D.7 Configuration Sets

Configuration set = ek set of rules jo emails ke group pe apply hote hain.

Isme kya configure hota hai:
- **Event destinations** — kaunse events kahan bhejne hain
- **IP pool** — kaunsa dedicated IP pool use karna hai
- **TLS policy** — `Require` (TLS mandatory) ya `Opportunistic`
- **Suppression list override** — is config set ke liye suppression skip karo
- **Reputation metrics** — is set ke liye alag se track karo
- **Sending enabled/disabled** — is set ke liye sending band kar do (kill switch)

**Best practice jo interview me bolna:**
> "Main alag alag email types ke liye **alag configuration sets** banata hoon — ek transactional emails ke liye jaise OTP aur password reset, aur ek marketing emails ke liye. Iske do bade fayde hain. Pehla, main dono ki reputation **alag se track** kar sakta hoon — agar marketing ka complaint rate badh raha hai to mujhe pata chal jaayega ki problem marketing me hai, transactional me nahi. Doosra, agar marketing emails problem create karein to main sirf us configuration set ka sending disable kar sakta hoon, aur mere critical transactional emails — jaise password reset — chalte rahenge. Ye blast radius ko contain karta hai."

### D.8 Event Destinations

| Destination | Kab use karein |
|-------------|----------------|
| **SNS** | Real-time processing, Lambda ko fan-out |
| **EventBridge** | Advanced filtering, routing, cross-account |
| **Kinesis Data Firehose** | High volume events ko S3/Redshift/OpenSearch me bulk dump |
| **CloudWatch** | Metrics aur dashboards, alarms |

**Trackable events:**
`Send`, `RenderingFailure`, `Reject`, `Delivery`, `Bounce`, `Complaint`, `DeliveryDelay`, `Subscription`, `Open`, `Click`

**Open aur Click tracking ka gotcha:**
> "Open tracking ek invisible 1×1 pixel image se hota hai, aur agar user ka email client images block karta hai — jo Gmail aur Apple Mail privacy features me common hai — to open track nahi hoga. Click tracking me SES aapke links ko apne redirect URL se wrap karta hai, jo kabhi kabhi link preview ya spam filters me issue create karta hai. Isliye main transactional emails jaise OTP me open/click tracking **disable** rakhta hoon — wahan iska koi business value nahi hai aur ye sirf deliverability risk add karta hai."

### D.9 Sending Limits / Quota

| Limit | Sandbox | Production (starting) |
|-------|---------|----------------------|
| **Daily sending quota** | 200 / 24 hours | 50,000+ |
| **Max send rate** | 1 email/second | 14+ emails/second |
| **Max recipients per message** | 50 | 50 |
| **Max message size** | 40 MB (v2 API, includes attachments) | 40 MB |

Quotas **automatically badhte hain** jaise jaise aap consistently healthy sending karte ho. Manually bhi request kar sakte ho.

**Throttling handle karna:**
> "Agar main rate limit se zyada bhejta hoon to SES `Throttling` error deta hai — 454 SMTP error ya API me `TooManyRequestsException`. Isko handle karne ke liye main **exponential backoff with jitter** implement karta hoon. Lekin better architecture ye hai ki bulk sending ke liye main **SQS** beech me lagata hoon — emails queue me jaate hain aur Lambda unko controlled rate pe consume karta hai. Isse main SES ke rate limit ko respect karta hoon aur koi email lost bhi nahi hota."

### D.10 SES vs SNS — ye confusion clear karo

| | SES | SNS |
|-|-----|-----|
| **Purpose** | **Email** bhejna — humans ko | **Pub/sub messaging** — systems ke beech |
| **Recipients** | End users (customers) | Subscribers (Lambda, SQS, HTTP endpoints, email, SMS) |
| **Content** | Rich HTML emails, attachments, templates | Simple text/JSON notifications |
| **Email quality** | Full deliverability engineering — DKIM, SPF, reputation | Plain text, basic, **marketing ke liye nahi** |
| **Use case** | Order confirmation, OTP, newsletter, password reset | Alerts, event fan-out, microservice decoupling |
| **Unsubscribe** | Aap manage karte ho | Built-in (but wo SNS subscription ka hai) |

**Ek line me:**
> "SES customers ko professional emails bhejne ke liye hai — usme templates, tracking, aur deliverability engineering hai. SNS systems ke beech notifications ke liye hai — wo email bhi bhej sakta hai but wo plain text hota hai aur usme har email ke neeche SNS ka unsubscribe link aata hai, jo customer-facing email ke liye bilkul appropriate nahi. Mere project me maine dono use kiye but alag purpose ke liye — SES se user ko contact form ka email jaata hai, aur SNS ka use maine SES ke bounce/complaint events ko Lambda tak pahunchane ke liye kiya."

### D.11 Dedicated vs Shared IP

| | Shared IP (default) | Dedicated IP |
|-|--------------------|--------------|
| **Reputation** | AWS ke saare customers ke saath share | Sirf aapki |
| **Warm-up** | ❌ Zaroorat nahi | ✅ Karna padta hai (hafte lagte hain) |
| **Cost** | Free | **~$24.95/month per IP** |
| **Doosre ka asar** | Doosra customer spam bheje to thoda asar pad sakta hai (AWS actively manage karta hai) | ❌ Koi asar nahi |
| **Control** | Kam | Poora |
| **Kab use karein** | Low/medium volume, ya volume inconsistent | High volume (~lakhs/month), consistent sending |

**Interview me kya bolna:**
> "Mere project ke liye **shared IP** hi sahi choice hai. Dedicated IP ka fayda tabhi milta hai jab volume high aur **consistent** ho. Agar mera volume kam hai to dedicated IP pe reputation build hi nahi hogi — mailbox providers ko us IP se enough signal nahi milega aur wo default me suspicious treat karenge. Aur dedicated IP me **warming ka process** karna padta hai — pehle din 50 emails, phir 100, phir 500, dheere dheere badhana — jo hafton chalta hai. Shared IP pool ki reputation AWS actively manage karta hai aur wo already established hai. Main dedicated IP tab consider karta jab volume lakhs per month me consistently ho, ya compliance requirement ho ki mera IP kisi aur ke saath share na ho. Aur ab AWS ne **Dedicated IPs (managed)** bhi launch kiya hai jisme warming automatically handle hoti hai."

### D.12 SES v1 vs v2 API

- **SES v1** (`ses`) — purana, `SendEmail`, `SendRawEmail`
- **SES v2** (`sesv2`) — naya, better structured, account-level suppression list management, contact lists, `SendEmail` with `Simple`/`Raw`/`Template` content

Naye projects me **v2** use karo. Interview me ye mention karna chhota sa detail hai jo current knowledge dikhata hai.

### D.13 Email Receiving (bonus)

SES emails **receive** bhi kar sakta hai (limited regions me — us-east-1, us-west-2, eu-west-1 aur kuch aur; ye region-specific hai to check kar lena).

Flow: Domain ke MX record ko SES pe point karo → receipt rules banao → actions: S3 me save karo, Lambda trigger karo, SNS notify karo, bounce karo, WorkMail ko forward karo.

Use case: support inbox automation, email-to-ticket system.

---

## E. Real-World Configuration (mere project me)

### DNS records

| Name | Type | Value | Purpose |
|------|------|-------|---------|
| `abc._domainkey.myproject.com` | CNAME | `abc.dkim.amazonses.com` | DKIM key 1 |
| `def._domainkey.myproject.com` | CNAME | `def.dkim.amazonses.com` | DKIM key 2 |
| `ghi._domainkey.myproject.com` | CNAME | `ghi.dkim.amazonses.com` | DKIM key 3 |
| `mail.myproject.com` | MX | `10 feedback-smtp.ap-south-1.amazonses.com` | Custom MAIL FROM |
| `mail.myproject.com` | TXT | `"v=spf1 include:amazonses.com ~all"` | SPF |
| `_dmarc.myproject.com` | TXT | `"v=DMARC1; p=quarantine; rua=mailto:dmarc@myproject.com"` | DMARC |

### SES setup

```
Identity:                    myproject.com (domain identity)
DKIM:                        Easy DKIM, RSA 2048-bit, enabled
Custom MAIL FROM:            mail.myproject.com
Account-level suppression:   Enabled for BOUNCE and COMPLAINT
Configuration set:           "transactional-emails"
  - Event destination:       SNS topic "ses-events"
  - Events tracked:          Bounce, Complaint, Delivery, Reject, DeliveryDelay
  - TLS policy:              Require
  - Open/Click tracking:     Disabled (transactional ke liye)
Production access:           Requested and approved
Region:                      ap-south-1 (users ke paas)
```

### Bounce/complaint handler Lambda

```python
import json, os, boto3

dynamodb = boto3.resource('dynamodb')
table    = dynamodb.Table(os.environ['SUPPRESSION_TABLE'])
sesv2    = boto3.client('sesv2')

def lambda_handler(event, context):
    for record in event['Records']:
        msg = json.loads(record['Sns']['Message'])
        event_type = msg.get('eventType') or msg.get('notificationType')

        if event_type == 'Bounce':
            bounce = msg['bounce']
            # Sirf PERMANENT bounces suppress karo — Transient nahi
            if bounce['bounceType'] == 'Permanent':
                for r in bounce['bouncedRecipients']:
                    _suppress(r['emailAddress'], 'HARD_BOUNCE',
                              bounce.get('bounceSubType'))

        elif event_type == 'Complaint':
            for r in msg['complaint']['complainedRecipients']:
                _suppress(r['emailAddress'], 'COMPLAINT',
                          msg['complaint'].get('complaintFeedbackType'))

    return {'statusCode': 200}

def _suppress(email, reason, subtype):
    # Apne DB me record karo (audit + application logic ke liye)
    table.put_item(Item={
        'email': email.lower(),
        'reason': reason,
        'subType': subtype or 'unknown'
    })
    # SES ki account-level suppression list me bhi daalo
    sesv2.put_suppressed_destination(
        EmailAddress=email,
        Reason='BOUNCE' if reason == 'HARD_BOUNCE' else 'COMPLAINT'
    )
    print(json.dumps({'level':'INFO','action':'suppressed',
                      'email': email, 'reason': reason}))
```

**Is code me deliberate decisions:**
- Sirf `Permanent` bounces suppress — `Transient` (mailbox full) pe user ko permanently block karna galat hoga
- Dono jagah record — apne DB me (application logic ke liye) aur SES suppression list me (defence in depth)
- Email lowercase — case-insensitive matching
- Structured logging

### IAM policy — SES send

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "SendFromVerifiedIdentityOnly",
      "Effect": "Allow",
      "Action": ["ses:SendEmail"],
      "Resource": "arn:aws:ses:ap-south-1:111122223333:identity/myproject.com",
      "Condition": {
        "StringEquals": {
          "ses:FromAddress": "noreply@myproject.com"
        }
      }
    }
  ]
}
```

Dhyaan do: resource specific identity ARN hai (`ses:*` on `*` nahi), aur condition se `From` address bhi lock kiya hai.

---

## F. Common Mistakes & Gotchas

**1. Sandbox me test karke sochna ki production ready hai**
Sandbox me sirf verified recipients ko bhej sakte ho. Production access alag se lena padta hai, aur **per-region** hai.

**2. `From` me user ka email daal dena**
Contact form me sabse common galti. `From` **verified identity** hona chahiye. User ka email `Reply-To` me daalo. Warna `MessageRejected` aayega.

**3. Bounce/complaint handling na karna**
Sabse serious galti. Bounce rate 10% ya complaint rate 0.5% cross hua to **AWS aapka sending pause kar dega**.

**4. DKIM verify hone ka wait na karna**
CNAME records daalne ke baad DNS propagate hone me time lagta hai. SES console me status "Pending" se "Successful" hone tak wait karo.

**5. Custom MAIL FROM configure na karna**
Bina iske SPF `amazonses.com` ke against check hota hai, aapke domain ke against nahi — DMARC SPF alignment fail ho jaayega.

**6. Seedhe `p=reject` DMARC lagana**
Aapke apne legitimate emails (HR tool, CRM, marketing platform) block ho sakte hain. `p=none` se shuru karo, reports padho, phir badhao.

**7. Soft bounces ko permanently suppress karna**
Mailbox full temporary issue hai. Sirf `Permanent` bounces suppress karo.

**8. Rate limit handle na karna**
Loop me 10,000 emails bhejoge to throttling errors aayenge. SQS + controlled consumption ya exponential backoff use karo.

**9. Transactional aur marketing emails ek hi configuration set se bhejna**
Marketing ka complaint rate transactional ki reputation kharab kar dega. Alag config sets banao.

**10. Region confusion**
SES identity, production access, quota — sab **per-region** hain. us-east-1 me verify kiya to ap-south-1 me kaam nahi karega.

**11. OTP/password reset me open aur click tracking on rakhna**
Business value zero, but deliverability risk aur privacy concerns.

**12. Unsubscribe link na dena marketing emails me**
CAN-SPAM aur GDPR ka violation, aur complaint rate badhega kyunki log unsubscribe nahi kar paayenge to "Report Spam" dabayenge. `List-Unsubscribe` header bhi add karo.

**13. Contact form me rate limiting na lagana**
Koi bot form spam karega, aapka sending quota khatam ho jaayega aur bill badhega. Lambda pe reserved concurrency + CAPTCHA + API Gateway throttling lagao.

**14. Attachment size ignore karna**
40 MB limit hai (base64 encoding ke baad, jo actual file size ~30 MB kar deta hai). Bade files ke liye S3 presigned link bhejo, attachment nahi.

---

## G. Cost Model

| Charge | Rate |
|--------|------|
| **Outbound emails** | **$0.10 per 1,000 emails** |
| **Attachments / data** | ~$0.12 per GB |
| **Inbound emails (receiving)** | $0.10 per 1,000 emails received |
| **Inbound chunks** | $0.09 per 1,000 chunks (256 KB each) |
| **Dedicated IP** | ~$24.95/month per IP |
| **Dedicated IP (managed)** | Higher, includes auto warm-up |
| **Virtual Deliverability Manager** | Per-message subscription pricing |
| **Related** | SNS notifications, Lambda invocations, CloudWatch |

**Free tier:** AWS ka SES free tier time ke saath badla hai — historically EC2/Lambda se bheje gaye emails pe 62,000/month free the, aur ab ek naya model hai. Interview me main isko honestly handle karunga:

> "Sir, SES ka core pricing $0.10 per 1,000 emails hai jo market me sabse sasta hai. Free tier ka structure AWS ne change kiya hai to main exact number claim nahi karunga bina check kiye, but mere project ka volume itna kam hai ki cost practically negligible hai — mahine ke kuch sau emails."

**Cost comparison (interview me strong point):**
```
100,000 emails/month:
  SES:      $10
  SendGrid: ~$90 (Pro plan)
  Mailgun:  ~$75

Matlab SES lagbhag 8-9 guna sasta hai.
```

**Cost optimization:**
- **List hygiene** — invalid addresses pe bhejna paisa waste hai + reputation kharab
- **Suppression list** actively maintain karo
- **Attachments avoid karo** — S3 presigned link bhejo, ye data charge bachata hai aur deliverability bhi better hoti hai
- **Templates use karo** — repeated content bar bar mat bhejo
- Dedicated IP tabhi lo jab volume justify kare

---

## H. Security Best Practices

**1. Least privilege IAM** — `ses:SendEmail` sirf specific identity ARN pe, aur `ses:FromAddress` condition ke saath.

**2. Domain authentication complete karo** — SPF + DKIM + DMARC + custom MAIL FROM. Ye teeno mil ke hi spoofing rokte hain.

**3. TLS enforce karo** — configuration set me `TlsPolicy: Require`. Isse email plaintext me transit nahi karegi (agar recipient server TLS support na kare to email deliver hi nahi hogi — ye conscious trade-off hai).

**4. Input validation** — contact form me email format validate karo, message length cap karo, HTML sanitize karo. Warna **email header injection** ho sakti hai (newline characters daal ke extra headers add karna).

**5. Rate limiting** — API Gateway throttling + Lambda reserved concurrency + CAPTCHA. Abuse se bachaav.

**6. Suppression list** enable karo — automatic protection.

**7. CloudWatch alarms** — `Reputation.BounceRate` > 3% aur `Reputation.ComplaintRate` > 0.08% pe alarm. Threshold hit hone se **pehle** pata chalna chahiye.

**8. Secrets** — SMTP credentials Secrets Manager me. Ya better, SMTP ki jagah SDK + IAM role use karo (koi credential store hi na karna pade).

**9. Configuration set separation** — blast radius contain karo.

**10. Sensitive data emails me mat bhejo** — email inherently insecure channel hai. Password, full card numbers, medical data — nahi. Uski jagah secure link bhejo.

**11. CloudTrail** — SES API calls audit karo, koi unauthorized sending detect karne ke liye.

---

## I. Interview Q&A — SES

---

**Q1. SES kya hai aur aapne use kyun kiya?**

> SES AWS ka managed email sending aur receiving service hai. Maine isko apne project me contact form aur transactional emails ke liye use kiya. Alternative ye tha ki main apna SMTP server chalata, lekin uska matlab hota Postfix configure karna, TLS aur DKIM setup karna, aur sabse mushkil — IP reputation zero se banani. Aur EC2 pe outbound port 25 by default blocked bhi hai. SES me ye sab infrastructure ready mila. Doosra alternative SendGrid ya Mailgun tha, lekin SES lagbhag 8 se 9 guna sasta hai — $0.10 per 1,000 emails — aur mera baaki stack already AWS pe tha to IAM roles se authentication mil gaya, koi API key store nahi karni padi, aur CloudWatch aur SNS ke saath native integration mil gaya.

---

**Q2. SES sandbox kya hai aur usse kaise nikalte hain?**

> Har naya SES account sandbox mode me hota hai, jo AWS ka abuse prevention mechanism hai. Sandbox me teen restrictions hain — main sirf **verified recipients** ko email bhej sakta hoon, 24 ghante me sirf 200 emails, aur maximum 1 email per second. Production access ke liye AWS Support me request daalni padti hai jisme batana hota hai ki main kis type ke emails bhejunga, recipients kaise collect karta hoon, aur sabse important — bounces aur complaints kaise handle karunga. Maine apni request me specifically likha ki maine configuration set banaya hai jiske events SNS pe jaate hain aur ek Lambda bounces aur complaints ko suppression list me daalta hai — ye batane se approval jaldi mila kyunki AWS ki asli concern yahi hai ki unke shared IP pool ki reputation kharab na ho. Ek gotcha ye hai ki sandbox status **per-region** hota hai, to ek region me production access lene se doosre region me automatically nahi milta.

---

**Q3. SPF, DKIM aur DMARC kya hain? Teeno kyun chahiye?**

> Teeno alag problem solve karte hain. **SPF** ek TXT record hai jo batata hai ki kaun se IP addresses mere domain ki taraf se email bhej sakte hain — recipient server sending IP ko us list se match karta hai. Iski limitation ye hai ki email forwarding pe SPF toot jaata hai, kyunki forwarding server ka IP alag hoga. **DKIM** cryptographic signature hai — SES private key se message sign karta hai aur recipient DNS se public key nikaal ke verify karta hai. Ye prove karta hai ki message authentic hai aur transit me tamper nahi hua, aur ye forwarding survive karta hai. **DMARC** in dono ke upar policy layer hai — ye batata hai ki fail hone pe kya karna hai aur reports bhejta hai. Lekin DMARC ki asli value **alignment** hai: SPF envelope sender ko check karta hai, jabki user ko `From` header dikhta hai — ye do alag cheezein hain, to ek attacker apne domain se SPF pass karke `From` me mera domain daal sakta hai. DMARC enforce karta hai ki SPF ya DKIM ka domain `From` header se match kare. Isliye teeno milke hi spoofing rokte hain, koi ek akela kaafi nahi.

---

**Q4. Bounce aur complaint handle na karo to kya hota hai?**

> AWS bounce aur complaint rates actively monitor karta hai kyunki ye unke shared IP pool ki reputation affect karte hain. Bounce rate 5 percent cross hone pe account "under review" me chala jaata hai, aur 10 percent pe AWS sending **pause** kar sakta hai. Complaint rate ke liye thresholds bahut kam hain — 0.1 percent pe review aur 0.5 percent pe pause. Iska matlab hai 1,000 emails me sirf 5 log spam report karein to problem ho jaayegi. Isliye maine ek proper handling pipeline banayi: configuration set ka event destination ek SNS topic hai, uspe ek Lambda subscribe hai jo bounce aur complaint events process karta hai. Main sirf **Permanent** bounces suppress karta hoon, Transient nahi — kyunki mailbox full ek temporary issue hai aur us user ko permanently block karna galat hoga. Complaints ko main hamesha suppress karta hoon. Aur maine SES ki **account-level suppression list** bhi enable ki hai jo automatic protection deti hai even agar mere application code me bug aa jaaye.

---

**Q5. Contact form me user ka email `From` me daal sakte ho?**

> Nahi, aur ye ek bahut common galti hai. SES sirf **verified identities** se hi bhejne deta hai — agar main user ka arbitrary email `From` me daaloonga to SES `MessageRejected: Email address is not verified` error dega. Aur agar kisi tarah ho bhi jaaye to wo technically spoofing hai — main us user ke domain ki taraf se bhej raha hoonga, jiska SPF aur DKIM fail hoga aur email spam me chali jaayegi ya reject ho jaayegi. Sahi approach ye hai ki `From` me meri verified identity ho — jaise `noreply@myproject.com` — aur user ka email **`Reply-To` header** me daala jaaye. Isse do fayde hain: authentication clean rehti hai aur mera domain reputation safe rehta hai, aur jab main reply dabaunga to reply seedha user ke paas chala jaayega. Mere code me maine yahi kiya hai.

---

**Q6. Aapke emails spam folder me ja rahe hain. Debug kaise karoge?**

> Main teen layers me dekhunga. Pehle **authentication** — SES console me check karunga ki DKIM status "Successful" hai, aur ek test email bhej ke uske raw headers dekhunga ki `Authentication-Results` me SPF, DKIM aur DMARC teeno pass dikha rahe hain ya nahi. Agar SPF pass nahi ho raha to shayad maine **custom MAIL FROM domain** configure nahi kiya, jiski wajah se SPF `amazonses.com` ke against check ho raha hai aur DMARC alignment fail ho rahi hai. Doosra, **reputation** — SES reputation dashboard me bounce aur complaint rates dekhunga, aur ye bhi check karunga ki main IP kisi public blacklist pe to nahi hoon. Teesra, **content** — spam trigger words, image-to-text ratio bahut zyada, shortened URLs, missing plain-text version, aur missing unsubscribe link ya `List-Unsubscribe` header. Debugging ke liye main Mail-Tester jaise tool pe test email bhejta hoon jo ek score aur detailed breakdown deta hai. Aur structurally, main transactional aur marketing emails ko alag configuration sets se bhejta hoon taaki ek dusre ki reputation na kharab kare.

---

**Q7. SES aur SNS me kya farq hai?**

> Dono alag purpose ke liye hain. SES ek email service hai jo customers ko professional emails bhejne ke liye bana hai — usme HTML templates, attachments, open aur click tracking, aur poori deliverability engineering hai jaise DKIM signing aur reputation management. SNS ek pub-sub messaging service hai jo systems ke beech notifications ke liye hai — uske subscribers Lambda, SQS, HTTP endpoints, SMS aur email ho sakte hain. SNS email bhi bhej sakta hai lekin wo plain text hota hai aur har email ke neeche SNS ka apna unsubscribe link aata hai, jo customer-facing email ke liye bilkul appropriate nahi hai. Mere project me maine dono use kiye lekin alag roles me — SES se user-facing emails jaate hain, aur SNS ka use maine SES ke bounce aur complaint events ko Lambda tak pahunchane ke liye kiya, matlab SNS yahan internal event plumbing hai.

---

**Q8. Configuration set kya hai aur aapne kyun use kiya?**

> Configuration set rules ka ek group hai jo emails ke ek category pe apply hota hai. Usme main event destinations define karta hoon, IP pool choose karta hoon, TLS policy set karta hoon, aur reputation metrics alag se track kar sakta hoon. Maine ise do wajah se use kiya. Pehla, **event tracking** — mere configuration set ka event destination ek SNS topic hai jahan bounce, complaint, delivery aur reject events jaate hain, jisse main Lambda se automated handling kar paata hoon. Doosra, aur ye zyada strategic hai — main transactional aur marketing emails ke liye **alag configuration sets** rakhta hoon. Isse main dono ki reputation alag se monitor kar sakta hoon, aur agar marketing emails problem create karein to main sirf us configuration set ka sending disable kar sakta hoon jabki mere critical transactional emails jaise password reset chalte rahenge. Ye blast radius contain karna hai.

---

**Q9. Dedicated IP kab lena chahiye?**

> Dedicated IP tabhi lena chahiye jab volume **high aur consistent** dono ho. Iska logic ye hai ki reputation build hone ke liye mailbox providers ko us IP se regular signal chahiye — agar main mahine me sirf kuch hazaar emails bhejta hoon to dedicated IP pe reputation build hi nahi hogi, aur mailbox providers naye ya kam-activity wale IP ko suspicious treat karte hain. Matlab shared IP se **kharab** result milega. Aur dedicated IP me **warming** ka process karna padta hai — pehle din 50 emails, phir dheere dheere badhana — jo hafton chal sakta hai. Shared IP pool ki reputation AWS actively manage karta hai aur wo already established hai. Mere project ke liye shared IP bilkul sahi hai. Main dedicated IP tab consider karta jab volume consistently lakhs per month ho, ya compliance requirement ho, ya mujhe apni sending reputation pe poora control chahiye ho. Cost lagbhag 25 dollar per month per IP hai, aur AWS ab "Dedicated IPs managed" bhi deta hai jisme warming automatic hoti hai.

---

**Q10. Aapko 1 lakh emails bhejne hain. Architecture kya hoga?**

> Main seedhe loop me SES call nahi karunga, kyunki SES ka send rate limit hai — production me shuruaat me 14 emails per second — aur loop me bhejne se throttling errors aayenge aur emails lost ho jaayengi. Mera architecture ye hoga: pehle recipient list ko SQS queue me daal dunga, chhote batches me. Phir ek Lambda SQS se trigger hoga jiski **reserved concurrency** main is tarah set karunga ki total throughput SES ke rate limit ke andar rahe. SQS ka fayda ye hai ki wo natural buffer hai, retry built-in hai, aur agar koi message repeatedly fail ho to wo DLQ me chala jaayega instead of lost hone ke. Lambda me main exponential backoff with jitter bhi implement karunga throttling errors ke liye. Bhejne se pehle main har address ko apni suppression list ke against check karunga taaki bounce rate control me rahe. Aur poore batch ke liye main ek dedicated configuration set use karunga taaki iski reputation metrics alag track ho aur zaroorat padne pe main sirf isko band kar sakoon. Agar ye recurring bulk sending hai to main SES quota increase bhi request karunga.

---

**Q11. Hard bounce aur soft bounce me kya farq hai? Dono ko kaise handle karoge?**

> Hard bounce ka matlab hai address **permanently invalid** hai — ya to wo exist nahi karta, ya domain hi galat hai. Soft bounce, jise SES **Transient** kehta hai, temporary issue hai — mailbox full, recipient server temporarily down, ya message size limit. Handling bilkul alag honi chahiye. Hard bounce pe main us address ko **turant suppress** kar deta hoon aur dobara kabhi nahi bhejta, kyunki repeated hard bounces mera bounce rate badhate hain jo 10 percent pe account suspension tak le ja sakta hai. Soft bounce pe main limited retries karta hoon, kyunki issue temporary hai aur user genuine ho sakta hai — lekin main track karta hoon, aur agar same address se lagataar soft bounces aayein — jaise 5 baar — to usko bhi suppress kar deta hoon kyunki us point pe wo effectively dead address hai. Mere Lambda handler me maine specifically `bounceType == 'Permanent'` check kiya hai, sabhi bounces ko blindly suppress nahi karta.

---

**Q12. Email header injection kya hai aur kaise rokoge?**

> Email header injection tab hoti hai jab main user ka input directly email headers me daal deta hoon bina sanitize kiye. Agar user apne naam wale field me newline character aur uske baad `Bcc: attacker@evil.com` daal de, to wo mere email me ek extra header inject kar dega aur mera server unauthorized recipients ko email bhejne lagega — matlab mera application spam relay ban jaayega. Isse rokne ke liye main teen cheezein karta hoon. Pehla, main user input ko kabhi headers me directly nahi daalta — subject, from, reply-to me jo bhi user ka data jaata hai usme se newline aur carriage return characters strip kar deta hoon. Doosra, main SDK ka structured API use karta hoon jaise `SendEmail` with `Simple` content, na ki `SendRawEmail` jahan main khud raw MIME banata — structured API me SDK khud escaping handle karta hai. Teesra, main email format ko regex se validate karta hoon aur field lengths cap karta hoon. Aur defence in depth ke liye IAM policy me `ses:FromAddress` condition bhi lagayi hai.

---

**Q13. Custom MAIL FROM domain kya hai aur kyun configure kiya?**

> By default SES ka MAIL FROM domain, jise envelope sender ya Return-Path bhi kehte hain, `amazonses.com` hota hai. Iska problem ye hai ki SPF check **MAIL FROM domain** ke against hota hai, matlab SPF `amazonses.com` ke liye pass hoga, mere domain ke liye nahi. Ab DMARC alignment ke liye zaroori hai ki SPF ya DKIM ka domain mere `From` header ke domain se match kare — to is case me SPF alignment fail ho jaayegi. DKIM se DMARC pass ho jaayega, lekin main dono chahta hoon kyunki ye deliverability strengthen karta hai. Isliye maine custom MAIL FROM configure kiya — `mail.myproject.com` — jiske liye do DNS records chahiye: ek MX record jo SES ke feedback endpoint pe point karta hai bounces receive karne ke liye, aur ek TXT record SPF ke liye. Ab SPF `mail.myproject.com` ke against check hota hai jo mere organizational domain ka subdomain hai, aur relaxed alignment me ye pass ho jaata hai.

---

**Q14. SES ka pricing kya hai aur SendGrid se compare karo.**

> SES ka core pricing $0.10 per 1,000 outbound emails hai, plus attachments ke liye lagbhag $0.12 per GB. Dedicated IP chahiye to lagbhag 25 dollar per month per IP. Free tier ka structure AWS ne recently change kiya hai to main exact number bina verify kiye claim nahi karunga. Comparison me, 1 lakh emails per month ka SES pe kharcha lagbhag 10 dollar hoga, jabki SendGrid ke equivalent plan pe wo 90 dollar ke aas paas jaata hai — matlab lagbhag 9 guna difference. Lekin cost hi ekmatra factor nahi hai. SendGrid ready-made template editor, campaign management aur analytics dashboard deta hai jo SES me nahi hai — SES zyada raw infrastructure hai aur uske upar aapko khud build karna padta hai. Mere case me SES sahi choice tha kyunki mera use case simple transactional emails ka hai, mera baaki stack AWS pe hai to IAM se authentication mil gaya bina koi API key store kiye, aur SNS aur CloudWatch ke saath native integration mil gaya. Agar meri team ke marketing log khud campaigns manage kar rahe hote non-technical UI se, to main SendGrid ya SES ke upar ek layer consider karta.

---

**Q15. Aapke SES account ka sending pause ho gaya. Ab kya karoge?**

> Sabse pehle main SES reputation dashboard dekhunga taaki pata chale ki wajah bounce rate hai ya complaint rate. Phir main CloudWatch aur apne event logs se **root cause** identify karunga — kya kisi ek campaign ya ek particular code path se problem aayi, kya list purani thi jisme bahut saare invalid addresses the, ya kya koi bug tha jisse ek hi address pe baar baar bhej raha tha. Uske baad main **immediate remediation** karunga: sending band karunga, invalid addresses ko suppression list me daalunga, aur list ko clean karunga. Phir AWS Support me appeal karunga jisme main teen cheezein clearly likhunga — root cause kya tha, maine kya fix kiya hai, aur future me kaise rokunga. Us appeal me main specific technical measures batata hoon: account-level suppression list enable ki hai, bounce aur complaint events ka automated Lambda handler lagaya hai, CloudWatch alarms lagaye hain jo bounce rate 3 percent aur complaint rate 0.08 percent pe alert karte hain — matlab threshold hit hone se pehle, aur transactional aur marketing ko alag configuration sets me separate kiya hai. AWS ko concrete process changes dekhne hote hain, sirf "sorry, hum theek kar denge" se kaam nahi chalta.

---
---

# 10. END-TO-END ARCHITECTURE — Sab kaise judta hai

---

## 10.1 High-level picture

Paanchon services ka role ek line me:

| Service | Role in architecture |
|---------|---------------------|
| **Route 53** | Naam ko address me badalta hai — entry point |
| **CloudFront** | Global cache + HTTPS termination + security shield |
| **S3** | Frontend files ka origin + user uploads ka storage |
| **Lambda** | Business logic — API backend aur event processing |
| **SES** | Emails bhejna — user aur admin dono ko |

---

## 10.2 ASCII Architecture Diagram

```
                          ┌──────────────┐
                          │     USER     │
                          │   (Browser)  │
                          └──────┬───────┘
                                 │ 1. https://myproject.com
                                 ▼
                    ┌────────────────────────┐
                    │      ROUTE 53          │
                    │  Public Hosted Zone    │
                    │  ALIAS A + AAAA        │
                    │  → CloudFront          │
                    │  (queries FREE)        │
                    └────────────┬───────────┘
                                 │ 2. Anycast IP
                                 ▼
   ┌─────────────────────────────────────────────────────────────┐
   │                     CLOUDFRONT                              │
   │  ┌────────────────┐   ┌──────────────────────────────────┐  │
   │  │ Edge Location  │   │  ACM cert (us-east-1)            │  │
   │  │ (700+ PoPs)    │   │  TLS termination at edge         │  │
   │  │ TLS + Cache    │   │  WAF + Shield Standard           │  │
   │  └───────┬────────┘   │  CloudFront Function (SPA route) │  │
   │          │ MISS       └──────────────────────────────────┘  │
   │          ▼                                                  │
   │  ┌────────────────┐                                         │
   │  │ Regional Edge  │                                         │
   │  │ Cache (~13)    │                                         │
   │  └───────┬────────┘                                         │
   └──────────┼───────────────────────────┬─────────────────────┘
              │ MISS                      │
    Behavior: │ Default "*"     Behavior: │ "/api/*"
              │ (cached)                  │ (CachingDisabled)
              ▼                           ▼
   ┌──────────────────────┐    ┌───────────────────────────┐
   │        S3            │    │     API GATEWAY           │
   │  my-project-frontend │    │     (HTTP API)            │
   │  ─────────────────── │    └────────────┬──────────────┘
   │  Block Public: ALL ✅ │                 │ 3. Synchronous
   │  Bucket policy:      │                 ▼
   │   CloudFront OAC only│    ┌───────────────────────────┐
   │  SSE-S3, Versioning  │    │        LAMBDA             │
   │  index.html, JS, CSS │    │  contact-form-handler     │
   └──────────────────────┘    │  Python 3.12 / arm64      │
                               │  256 MB, 10s timeout      │
                               │  Reserved concurrency: 10 │
                               └────────────┬──────────────┘
                                            │ 4. ses:SendEmail
                                            ▼
                               ┌───────────────────────────┐
                               │           SES             │
                               │  Domain identity verified │
                               │  DKIM + SPF + DMARC       │
                               │  Custom MAIL FROM         │
                               │  Config set: transactional│
                               └────────────┬──────────────┘
                                            │
                        ┌───────────────────┼───────────────────┐
                        │ 5a. Email         │ 5b. Events        │
                        ▼                   ▼                   │
                 ┌─────────────┐    ┌──────────────┐            │
                 │  Recipient  │    │  SNS Topic   │            │
                 │  Inbox      │    │ "ses-events" │            │
                 └─────────────┘    └──────┬───────┘            │
                                           │                    │
                                           ▼                    │
                                  ┌──────────────────┐          │
                                  │  LAMBDA          │          │
                                  │ bounce-handler   │          │
                                  │ → DynamoDB       │          │
                                  │ → Suppression    │◄─────────┘
                                  └──────────────────┘

  ═══════════════ SIDE FLOW: User file upload ═══════════════

   Browser ──(1) request presigned URL──► API GW ──► Lambda
      │                                                 │
      │◄────────(2) presigned PUT URL───────────────────┘
      │
      └──(3) PUT file DIRECTLY to S3 (backend bypass, no 6MB limit)
                       │
                       ▼
            ┌──────────────────────┐
            │  S3 user-uploads     │
            │  prefix: originals/  │
            └──────────┬───────────┘
                       │ (4) s3:ObjectCreated event (ASYNC)
                       ▼
            ┌──────────────────────┐
            │  LAMBDA              │
            │  thumbnail-generator │      Failure → SQS DLQ
            │  1024 MB, 60s        │
            └──────────┬───────────┘
                       │ (5) PutObject
                       ▼
            ┌──────────────────────┐
            │  S3 prefix:          │  ← alag prefix = no infinite loop
            │  thumbnails/         │
            └──────────────────────┘
```

---

## 10.3 Complete request lifecycle — user URL type karta hai se render tak

Ye woh answer hai jo interview me 3-4 minute me poora bolna hai. Isko practice karo.

### Phase 1 — DNS Resolution (0–50 ms)

```
1. User types: https://myproject.com

2. Browser HSTS preload list check karta hai
   → agar domain preloaded hai to HTTP request banega hi nahi, seedha HTTPS

3. Browser cache → OS cache → /etc/hosts
   Miss hua to →

4. Recursive resolver (ISP / 8.8.8.8)
   Uski cache me? Nahi to →

5. Root nameserver → ".com ke TLD servers ye rahe"

6. .com TLD nameserver → "myproject.com ke NS: ns-123.awsdns-01.com ..."

7. ROUTE 53 (authoritative)
   ALIAS A record → CloudFront ka anycast IP resolve karke A record return
   → 13.x.x.x
   Ye query FREE hai kyunki alias AWS resource pe point kar raha hai.

8. Resolver TTL ke hisaab se cache karta hai, browser ko IP deta hai
```

### Phase 2 — Connection + TLS (50–150 ms)

```
9. BGP anycast routing user ko topologically nearest CloudFront edge pe
   le jaata hai — Mumbai ka user Mumbai edge pe, Delhi wala Delhi edge pe

10. TCP handshake — edge ke saath, S3 ke saath nahi (isliye fast)

11. TLS handshake — ACM certificate (us-east-1 wala) present hota hai
    SNI se CloudFront pata karta hai ki kaunsi distribution hai
    TLS 1.3 me ye 1 round trip me ho jaata hai
    Session resumption ho to 0-RTT bhi possible

    ★ KEY POINT: TLS EDGE pe terminate hoti hai, origin pe nahi.
      Isliye handshake ka RTT origin ka nahi, edge ka hai — bada win.
```

### Phase 3 — Edge processing + cache lookup (150–200 ms)

```
12. VIEWER REQUEST trigger: CloudFront Function chalti hai
    → URI "/" hai to "/index.html" bana do
    → SPA route hai (no extension) to "/index.html" pe rewrite

13. Behavior matching: path "/" default behavior "*" pe match hua
    → Origin: S3, Cache policy: CachingOptimized

14. Cache key banta hai: hostname + path (+ Accept-Encoding)

15. Edge cache lookup:

    ✅ HIT  → step 20 pe jump. Response 20-50ms me. X-Cache: Hit
    ❌ MISS → aage
```

### Phase 4 — Origin fetch (agar miss hua)

```
16. Regional Edge Cache check
    Hit → content edge pe cache hoke user ko

17. Miss → S3 origin fetch
    CloudFront request ko OAC ke through SigV4 se sign karta hai
    S3 bucket policy verify karti hai:
      - Principal cloudfront.amazonaws.com? ✅
      - AWS:SourceArn meri distribution ka? ✅
      → GetObject allowed

18. S3 object return karta hai + uske Cache-Control metadata

19. CloudFront TTL calculate karta hai:
    origin ka Cache-Control hai? → Min/Max ke beech clamp
    nahi hai? → Default TTL (24h)
    → object edge + regional cache dono me store
```

### Phase 5 — Response + render

```
20. VIEWER RESPONSE trigger: security headers add
    (HSTS, X-Content-Type-Options, CSP)

21. Compression: Accept-Encoding: br hai to Brotli me bheja jaata hai
    → text assets 60-80% chhote

22. Browser ko index.html milta hai
    Header: X-Cache: Hit from cloudfront, Age: 1200

23. Browser HTML parse karta hai, milta hai:
       <script src="/assets/main.a3f2b1c.js">
       <link href="/assets/main.9d8e7f6.css">

24. Ye assets ke liye steps 12-22 dobara — but ab:
    - DNS cached ✅
    - TCP + TLS connection reused (HTTP/2 multiplexing) ✅
    - Ye files 1 saal ke max-age ke saath cached hain → almost always HIT ✅
    → ye sab 10-30 ms me

25. React app hydrate hota hai, page render ho jaata hai
```

### Phase 6 — User action (contact form submit)

```
26. User form bharke submit karta hai
    → POST https://myproject.com/api/contact

27. CloudFront: behavior "/api/*" match hua (precedence 0)
    → Cache policy: CachingDisabled
    → Allowed methods: POST included
    → Origin: API Gateway

28. API Gateway → Lambda (SYNCHRONOUS invocation)

29. Lambda:
    - Cold start? INIT phase: boto3 client banta hai (~200ms)
    - Warm? Seedha handler (~2ms)
    - Input validate: email regex, length caps
    - ses.send_email():
        From: noreply@myproject.com  (verified identity)
        Reply-To: user@example.com   (user ka email YAHAN, From me NAHI)
        ConfigurationSet: transactional-emails

30. SES:
    - Identity verified? ✅
    - Sandbox nahi, production ✅
    - Quota available? ✅
    - Suppression list me recipient? Nahi ✅
    - DKIM signature add karta hai (private key se)
    - MAIL FROM: mail.myproject.com (SPF alignment ke liye)
    - Shared IP pool se SMTP delivery

31. Recipient mail server (Gmail):
    - SPF check → mail.myproject.com ka TXT → IP authorized ✅
    - DKIM check → DNS se public key → signature valid ✅
    - DMARC check → alignment ✅ → policy satisfied
    - Reputation check → SES pool healthy ✅
    → INBOX

32. Parallel me: SES → Configuration Set → SNS topic → Lambda
    Delivery event DynamoDB me log ho jaata hai

33. Lambda 200 return karta hai → API Gateway → CloudFront → Browser
    → "Message sent!" toast dikhta hai
```

**Total: cache hit pe 50-100 ms page load, cold start wale API call pe ~400 ms.**

---

## 10.4 Ye architecture acha kyun hai

### Scalability

| Layer | Kaise scale karta hai |
|-------|----------------------|
| Route 53 | AWS-managed, 100% SLA, anycast |
| CloudFront | 700+ edges, automatic, traffic spike absorb karta hai |
| S3 | Virtually unlimited, per-prefix 5,500 GET/s |
| Lambda | 1,000 concurrent default, request-limit tak automatic |
| SES | Quota auto-grow with healthy sending |

**Koi bhi layer me maine capacity plan nahi ki.** Agar mera site kal Hacker News pe viral ho jaaye to 10 lakh users bhi handle ho jaayenge bina kuch change kiye — static content edge se serve hoga aur Lambda automatically scale hoga.

### Cost

```
Route 53:    ~$0.50/month  (ek hosted zone, alias queries free)
CloudFront:  ~$0           (free tier: 1 TB + 10M requests, perpetual)
S3:          ~$0.10        (chhota site, kuch MB)
Lambda:      ~$0           (free tier: 1M requests + 400k GB-s, perpetual)
SES:         ~$0.05        (kuch sau emails)
────────────────────────────────────────
TOTAL:       ~$1/month
```

Wahi cheez EC2 pe: t3.small (~$15) + ALB (~$16) + EBS (~$3) + NAT agar chahiye (~$32) = **$35-65/month minimum, chahe zero traffic ho.**

### Availability

- **No single point of failure** — sab managed, multi-AZ
- S3 automatically ≥3 AZs
- Lambda automatically multi-AZ
- CloudFront me ek edge down ho to anycast agla edge pe route kar deta hai
- Route 53 pe 100% SLA

### Security

- S3 bucket **poori tarah private** (OAC), Block Public Access ON
- HTTPS end-to-end, TLS 1.2+ minimum
- Shield Standard free DDoS protection, WAF attachable
- IAM least privilege har layer pe
- Encryption at rest + in transit
- No servers to patch — attack surface hi kam hai

### Operational simplicity

Koi OS patching, koi SSH keys, koi capacity planning, koi load balancer tuning, koi log rotation. Ek fresher ke project ke liye ye **realistic** hai aur production-grade bhi.

### Is architecture ki honest limitations (ye bolna maturity dikhata hai)

> "Sir, is architecture ki kuch limitations bhi hain jo main aware hoon. Pehla, Lambda ka 15 minute timeout hai — agar mujhe long-running processing chahiye hoti to Step Functions ya Fargate lagana padta. Doosra, cold start latency — abhi mere use case me 200-300 ms acceptable hai, but agar strict p99 SLA hota to Provisioned Concurrency ka extra cost aata. Teesra, agar mujhe relational database chahiye hota to Lambda ke connection pooling ka issue aata aur RDS Proxy ya DynamoDB pe move karna padta. Chautha, vendor lock-in — ye architecture kaafi AWS-specific hai, portable nahi hai. Mere project ke scale aur requirements ke liye ye trade-offs sahi the, but main ye nahi kahunga ki ye har situation ka answer hai."

---
---

# 11. "TELL ME ABOUT YOUR PROJECT" — Pitch Script

---

## 11.1 The 30-second version (elevator pitch)

Ye tab bolna hai jab interviewer bole "quickly walk me through your project" ya conversation ki shuruaat me.

> "Maine ek fully serverless web application banayi hai jo AWS pe deploy hai. Frontend React ka hai jo S3 pe host hai aur CloudFront ke through globally serve hota hai — HTTPS aur caching ke saath. Domain Route 53 pe manage hota hai aur ALIAS record se CloudFront pe point karta hai. Backend me API Gateway aur Lambda hai jo business logic handle karta hai, aur emails ke liye SES use kiya hai proper DKIM, SPF aur DMARC setup ke saath. Poora architecture serverless hai to koi server manage nahi karna padta, automatically scale ho jaata hai, aur monthly cost lagbhag ek dollar hai. Do decisions jo main highlight karna chahunga — maine S3 bucket ko poori tarah private rakha hai aur sirf CloudFront ko OAC se access diya hai, aur file uploads ke liye presigned URL pattern use kiya hai taaki files backend se hoke na jaayein."

**Timing:** ~30 seconds. Practice karo jab tak natural na lage.

---

## 11.2 The 2-minute version (detailed pitch)

Ye tab bolna hai jab wo "tell me about your project in detail" bolein.

**Structure: Problem → Architecture → Key decisions → Results → Learnings**

---

**[Problem — 15 sec]**

> "Sir, maine ek web application banayi hai jisme users content browse kar sakte hain, files upload kar sakte hain, aur contact form ke through reach out kar sakte hain. Mera goal sirf feature banana nahi tha — main specifically ek aisi architecture banana chahta tha jo production-grade ho, scale kare, aur cost-efficient ho, kyunki personal project me budget constraint real hoti hai."

**[Architecture walkthrough — 45 sec]**

> "Request flow aise hai. User domain hit karta hai, Route 53 ALIAS record se CloudFront pe resolve hota hai — maine ALIAS use kiya CNAME nahi, kyunki zone apex pe CNAME allowed nahi hai aur alias queries AWS resources ke liye free hain.
>
> CloudFront edge pe TLS terminate hoti hai ACM certificate se, jo us-east-1 me hona mandatory tha kyunki CloudFront global service hai. Static content S3 se aata hai, lekin S3 bucket bilkul private hai — Block Public Access poora ON hai, aur bucket policy me sirf CloudFront ko access hai Origin Access Control ke through, saath me SourceArn condition jo specific distribution ko lock karti hai.
>
> API calls ke liye maine alag cache behavior banaya — `/api/*` pe CachingDisabled policy hai aur wo API Gateway se Lambda pe jaata hai. Lambda me business logic hai, aur emails ke liye SES use kiya hai."

**[Key technical decisions — 45 sec]**

> "Char decisions jo main highlight karna chahunga.
>
> Pehla — **caching strategy**. Mera build content hashing karta hai, to static assets ek saal ke immutable cache-control ke saath jaate hain, aur sirf index.html short TTL pe hai. Isse mujhe har deploy pe wildcard invalidation nahi karni padti — sirf index.html invalidate karta hoon, jo cost bhi bachata hai aur cache hit ratio bhi high rakhta hai.
>
> Doosra — **SPA routing**. React ka client-side routing hai, to `/dashboard` jaise path pe S3 403 return karta hai, kyunki private bucket me ListBucket permission nahi hai. Maine ek CloudFront Function likha jo extension-less URIs ko index.html pe rewrite kar deta hai. Lambda@Edge nahi liya kyunki logic 5 lines ka hai aur CloudFront Functions 6 guna sasta hai.
>
> Teesra — **file uploads**. Maine files ko Lambda ke through nahi bheja, kyunki synchronous payload limit 6 MB hai aur file transfer pe compute ka paisa dena waste hai. Lambda sirf presigned PUT URL generate karta hai jisme key prefix me user ID force hota hai, aur browser directly S3 pe upload karta hai. Upload complete hone pe S3 event ek doosra Lambda trigger karta hai thumbnail ke liye — aur maine input aur output prefixes alag rakhe hain aur IAM role me input prefix pe write permission hi nahi di, taaki infinite loop physically possible na ho.
>
> Chautha — **email deliverability**. Maine sirf domain verify nahi kiya, poora authentication stack lagaya — DKIM, SPF, custom MAIL FROM domain SPF alignment ke liye, aur DMARC. Aur bounce-complaint handling pipeline banayi: SES configuration set se events SNS pe jaate hain, ek Lambda permanent bounces aur complaints ko suppression list me daalta hai. Ye isliye zaroori hai kyunki AWS bounce rate 10 percent ya complaint rate 0.5 percent pe sending pause kar deta hai."

**[Results + learnings — 15 sec]**

> "Result ye hai ki poora stack lagbhag ek dollar per month me chalta hai, koi server manage nahi karna padta, aur traffic spike automatically handle ho jaata hai. Sabse bada learning mera ye tha ki serverless me infrastructure ki complexity kam hoti hai but **operational thinking** kam nahi hoti — idempotency, cold starts, concurrency limits, aur cost guardrails ke bare me sochna padta hai, bas wo sochna alag layer pe shift ho jaata hai."

---

## 11.3 Kaunse decisions highlight karne hain (aur kyun)

Ye woh points hain jo tutorial-follower ke paas nahi hote:

| Decision | Kyun ye impressive hai |
|----------|----------------------|
| **ALIAS vs CNAME with reason** | DNS ki depth dikhata hai |
| **OAC + SourceArn condition** | Security thinking, confused deputy problem ka awareness |
| **Content hashing vs invalidation** | Cost + operations thinking |
| **CloudFront Function vs Lambda@Edge with cost reason** | Trade-off analysis, sirf "use kar liya" nahi |
| **Presigned URL for uploads with 6 MB reason** | Limits pata hain aur unke around design kiya |
| **Alag prefixes + IAM to prevent loop** | Failure modes ke bare me socha |
| **Custom MAIL FROM for SPF alignment** | 90% log ye nahi jaante |
| **Bounce handling with Permanent-only filter** | Nuance — sab bounces same nahi hote |
| **Reserved concurrency as cost guardrail** | Production mindset |
| **arm64 for 20% cost saving** | Detail orientation |

**Ek meta-tip:** Har decision ke saath **"maine X nahi liya kyunki Y"** bolo. Jo cheez tumne reject ki, wo batati hai ki tumne actually socha, sirf tutorial follow nahi kiya.

---
---

# 12. COMPARISON / "WHY NOT X" QUESTIONS

Interviewer ka favourite pattern: "Aapne X use kiya, Y kyun nahi?" Ye section usi ke liye hai.

---

## 12.1 S3 Static Hosting vs EC2 vs Amplify

| | S3 + CloudFront | EC2 (nginx/apache) | AWS Amplify |
|-|----------------|--------------------|-------------|
| **Server manage karna** | ❌ Kuch nahi | ✅ OS, patching, nginx config, monitoring | ❌ Kuch nahi |
| **Scaling** | Automatic, unlimited | Manual — ASG + ALB setup karo | Automatic |
| **Cost (chhota site)** | ~$0.10–1/month | $15–35/month minimum | Free tier ke baad build minutes + hosting |
| **Server-side rendering** | ❌ Nahi | ✅ Haan | ✅ Haan (SSR support) |
| **HTTPS** | CloudFront + ACM (free) | Manual cert ya ALB | Built-in |
| **CI/CD** | Khud setup karo (GitHub Actions) | Khud setup karo | ✅ Built-in, git push = deploy |
| **Custom backend logic** | Lambda alag se | ✅ Same server pe | Lambda alag se |
| **Control** | Kam | ✅ Poora | Kam (abstraction) |
| **Cold start** | Nahi | Nahi | Nahi (static part) |

**Interview me kya bolna:**
> "EC2 nahi liya kyunki sirf static files serve karne ke liye ek instance 24 ghante chalana waste hai — mujhe OS patching, nginx tuning, monitoring aur auto-scaling setup sab manage karna padta, aur cost 15 se 35 dollar per month se shuru hota chahe traffic zero ho. Amplify actually ek acha option tha aur wo internally S3 aur CloudFront hi use karta hai — usme CI/CD built-in milti. Maine deliberately S3 plus CloudFront directly choose kiya kyunki main **underlying components khud samajhna** chahta tha — cache policies, OAC, TTL strategy, invalidation. Amplify ye sab abstract kar deta hai, jo production me faayda hai lekin seekhne ke liye main ek layer neeche jaana chahta tha. Agar mujhe SSR chahiye hota ya team ke liye fast CI/CD chahiye hoti to Amplify ya Next.js on Vercel/Amplify better choice hoti."

---

## 12.2 CloudFront vs Direct S3 Access

| | S3 + CloudFront | Direct S3 |
|-|----------------|-----------|
| **HTTPS on custom domain** | ✅ Haan (ACM free) | ❌ **Website endpoint pe nahi** |
| **Latency (door ke users)** | 20–80 ms (edge) | 200–400 ms (single region) |
| **Bucket private rakh sakte ho?** | ✅ OAC se | ❌ Public karna padega |
| **DDoS protection** | ✅ Shield Standard free | ❌ |
| **WAF** | ✅ Attach kar sakte ho | ❌ |
| **Data transfer cost** | Edge→user chargeable, **S3→CloudFront free** | S3→internet ~$0.09/GB |
| **Cache** | ✅ 85%+ requests origin tak jaati hi nahi | ❌ Har request S3 hit |
| **Compression** | ✅ Automatic Gzip/Brotli | ❌ Manual |
| **Custom error pages** | ✅ | Sirf website endpoint pe |
| **Edge compute** | ✅ CF Functions / Lambda@Edge | ❌ |

**Interview me kya bolna:**
> "Direct S3 access mere case me kaam hi nahi karta, kyunki **S3 ka static website endpoint HTTPS support nahi karta** — custom domain pe SSL ke liye CloudFront lagana mandatory tha. Lekin isse alag bhi CloudFront lena hi sahi tha: latency 200 ms se 50 ms pe aa gayi, bucket poori tarah private reh paya OAC ke saath, free Shield Standard DDoS protection mil gaya, aur ek counter-intuitive baat — CloudFront ne cost **badhaya nahi, kam kiya**, kyunki S3 se CloudFront tak ka data transfer free hai jabki S3 se seedha internet pe transfer per GB charge hota hai, aur cache hit ki wajah se S3 pe requests bhi 85 percent kam ho gayi."

---

## 12.3 Route 53 vs GoDaddy / Cloudflare DNS

| | Route 53 | GoDaddy DNS | Cloudflare DNS |
|-|----------|-------------|----------------|
| **AWS integration (ALIAS)** | ✅ Native, apex pe kaam karta hai | ❌ | ✅ CNAME flattening |
| **SLA** | **100%** | Kuch nahi | 100% (paid tiers) |
| **Routing policies** | 7+ (weighted, latency, geo, geoproximity, failover, multivalue, IP-based) | Basic | Load balancing (paid add-on) |
| **Health checks** | ✅ Built-in, global checkers | ❌ | ✅ (paid) |
| **Cost** | $0.50/zone/month + queries | Domain ke saath free | **Free tier bahut generous** |
| **Free DDoS/CDN** | Nahi (CloudFront alag) | ❌ | ✅ Built-in |
| **API / IaC** | ✅ Excellent (Terraform, CDK) | Limited | ✅ Good |
| **Private DNS for VPC** | ✅ | ❌ | ❌ |

**Interview me kya bolna:**
> "Cloudflare actually ek strong option hai — uska free tier bahut generous hai aur usme free CDN aur DDoS protection built-in hai. Maine Route 53 teen specific reasons se choose kiya. Pehla, **ALIAS records** — ye Route 53 ka native AWS integration hai jo zone apex pe kaam karta hai aur AWS resources pe queries free hain; Cloudflare me CNAME flattening se similar effect milta hai but AWS resources ke saath health-check integration nahi milta. Doosra, **health checks aur routing policies** — agar main multi-region jaata to latency-based routing with automatic failover natively mil jaata. Teesra, **operational consistency** — mera poora stack AWS pe hai, to IAM, CloudTrail audit trail, aur Terraform se ek hi provider me sab manage karna simpler hai. Cost bhi negligible tha, lagbhag ek dollar per month. Agar mera stack multi-cloud hota ya mujhe free CDN chahiye hota to Cloudflare zyada sensible hota."

---

## 12.4 Lambda vs EC2 vs ECS/Fargate

| | Lambda | EC2 | ECS/Fargate |
|-|--------|-----|-------------|
| **Billing** | Per ms of execution | Per second/hour, running rehne pe | Per second, task running rehne pe |
| **Idle cost** | **$0** | Full | Full (jab tak task chal raha hai) |
| **Max runtime** | **15 minutes** | Unlimited | Unlimited |
| **Scaling speed** | Seconds, automatic | Minutes (ASG warm-up) | ~1 minute |
| **Cold start** | ✅ Haan (100ms–2s) | ❌ | ❌ (once running) |
| **Server management** | ❌ Kuch nahi | ✅ Poora | Fargate: kam, EC2 launch type: zyada |
| **Long-lived connections (WebSocket)** | ❌ Awkward | ✅ | ✅ |
| **Stateful workload** | ❌ | ✅ | ✅ |
| **Package size** | 250 MB / 10 GB container | Unlimited | Unlimited |
| **Best for** | Event-driven, spiky, short tasks | Steady heavy load, legacy, full control | Containerized services, steady microservices |
| **Cost at scale** | High traffic pe mehnga ho sakta hai | Reserved/Savings Plans se sasta | Beech me |

**Break-even ka mental model (ye bolna acha lagta hai):**
> "Lambda ka economics traffic pattern pe depend karta hai. Spiky ya low traffic pe Lambda clearly sasta hai kyunki idle cost zero hai. Lekin agar traffic constantly high aur steady hai — jaise 24 ghante 5,000 requests per second — to Lambda ka per-request pricing add up ho jaata hai aur EC2 with Savings Plans ya Fargate aksar saste pad jaate hain. Mere project me traffic bahut low aur unpredictable tha, to Lambda obvious choice thi — mera bill practically free tier me hi reh gaya."

**Interview me kya bolna:**
> "Mera workload event-driven aur bursty hai — contact form din me 50 baar hit hota hai, thumbnail generation upload pe. Iske liye EC2 ya Fargate chalana matlab 24 ghante compute ka paisa dena jabki actual compute kuch second ka hai. Lambda me main sirf execution ka paisa deta hoon aur idle cost zero hai. Lekin main Lambda ki limits bhi aware hoon — 15 minute timeout, cold start, aur stateful ya long-lived connection workloads ke liye ye fit nahi hai. Agar mujhe video encoding karna hota ya WebSocket server chalana hota to main Fargate use karta, aur agar steady high throughput hota to EC2 with Savings Plans evaluate karta."

---

## 12.5 SES vs SendGrid / SMTP / Mailgun

| | SES | SendGrid / Mailgun | Self-hosted SMTP |
|-|-----|-------------------|------------------|
| **Cost (100k emails/mo)** | **~$10** | ~$75–90 | Server cost + huge time cost |
| **Setup effort** | Medium (DNS records) | Low | **Very high** |
| **Template editor UI** | ❌ Basic (API templates) | ✅ Rich WYSIWYG | ❌ |
| **Campaign management** | ❌ | ✅ | ❌ |
| **Analytics dashboard** | Basic (CloudWatch + events) | ✅ Rich built-in | ❌ Build karo |
| **Deliverability infra** | ✅ Managed IP pools | ✅ Managed | ❌ Aapki zimmedari |
| **AWS integration** | ✅ IAM, SNS, CloudWatch, Lambda native | API key | — |
| **API key management** | ❌ Zaroorat nahi (IAM role) | ✅ Store karni padti hai | — |
| **Port 25 issue** | N/A | N/A | ❌ EC2 pe blocked |

**Interview me kya bolna:**
> "Self-hosted SMTP to option hi nahi tha — EC2 pe outbound port 25 by default blocked hai, aur IP reputation zero se banana hafton ka kaam hai jisme mailbox providers naye IP ko by default suspicious treat karte hain. SendGrid ek genuine option tha aur uska template editor aur campaign management SES se kaafi better hai. Maine SES teen reasons se choose kiya. Pehla, cost — lagbhag 9 guna sasta. Doosra, **IAM integration** — mujhe koi API key store nahi karni padi, Lambda ka execution role hi authentication hai, jo ek pura class of secret-management problems eliminate kar deta hai. Teesra, native event integration — SES ke bounce aur complaint events seedha SNS pe jaate hain aur Lambda process kar leta hai, bina webhook endpoint banaye. Agar mere project me non-technical marketing team hoti jo khud campaigns banati, to SendGrid clearly better fit hota."

---

## 12.6 Quick reference — "why not X" one-liners

| Question | Ek line ka answer |
|----------|-------------------|
| **EC2 kyun nahi?** | "Static content ke liye 24×7 server waste hai — cost, patching aur scaling ka overhead bina koi fayda ke." |
| **Amplify kyun nahi?** | "Amplify internally yahi stack use karta hai; maine underlying components khud samajhne ke liye direct choose kiya." |
| **Direct S3 kyun nahi?** | "S3 website endpoint HTTPS support hi nahi karta custom domain pe — CloudFront mandatory tha." |
| **Cloudflare kyun nahi?** | "ALIAS records aur AWS-native health check integration, plus poora stack ek provider me." |
| **Fargate kyun nahi?** | "Mera workload event-driven aur bursty hai; Fargate me idle time ka paisa lagta." |
| **SendGrid kyun nahi?** | "9 guna mehnga, aur SES me IAM role se auth mil gaya — koi API key store nahi karni padi." |
| **API Gateway kyun, Function URL kyun nahi?** | "Function URL simpler hai, but mujhe throttling, request validation aur custom domain routing chahiye tha." |
| **DynamoDB kyun, RDS kyun nahi?** | "Lambda ke saath connection pooling ka problem nahi aata — DynamoDB connectionless HTTP API hai." |

---
---

# 13. CROSS-SERVICE SCENARIO QUESTIONS

Ye sabse tough round hota hai — multiple services ko jodke sochna padta hai. 15 scenarios, detailed answers ke saath.

---

**S1. S3 bucket private hai lekin CloudFront se serve karna hai. Kaise karoge?**

> Main **Origin Access Control** use karunga. Steps ye honge. Pehle S3 pe Block Public Access ke chaaron settings ON karunga aur koi bhi public bucket policy ya ACL hata dunga. Phir CloudFront distribution me origin ke taur pe S3 ka **REST endpoint** dunga — website endpoint nahi, kyunki OAC website endpoint ke saath kaam nahi karta. Origin access me OAC create karunga signing behavior enabled ke saath. Uske baad bucket policy me CloudFront service principal ko `s3:GetObject` allow karunga, aur condition me `AWS:SourceArn` daalunga jo meri specific distribution ka ARN ho — ye condition critical hai, kyunki iske bina duniya ka koi bhi CloudFront distribution mere bucket se padh sakta hai, jise confused deputy problem kehte hain. Ek side effect handle karna padega: REST endpoint `/folder/` pe automatically index.html serve nahi karta aur missing objects pe 403 deta hai 404 nahi. Iske liye main CloudFront me default root object set karunga aur ek CloudFront Function likhunga jo directory-style URIs ko index.html pe rewrite kare.

---

**S2. User ko 5 GB ka file upload karwana hai. Lambda ka payload limit 6 MB hai. Kaise karoge?**

> File Lambda ke through jaayegi hi nahi. Mera flow ye hoga: frontend Lambda ko batata hai ki wo kaun si file upload karna chahta hai, Lambda authorization check karta hai aur **multipart upload initiate** karta hai `CreateMultipartUpload` se, phir har part ke liye **presigned URL** generate karke frontend ko de deta hai. Browser directly S3 pe parts parallel me upload karta hai aur har part ka ETag collect karta hai. Sab parts ho jaane pe frontend Lambda ko ETags bhejta hai aur Lambda `CompleteMultipartUpload` call karta hai. Is design me file kabhi mere backend se hoke nahi jaati — matlab 6 MB limit relevant hi nahi, compute cost nahi lagta, aur upload parallel hone se fast bhi hota hai. Security ke liye main presigned URL generate karte waqt key prefix me user ID force karta hoon taaki koi doosre user ke folder me na likh sake, aur expiry short rakhta hoon. Aur bucket me `AbortIncompleteMultipartUpload` lifecycle rule 7 din pe lagata hoon, kyunki agar upload beech me fail ho jaaye to parts pade rehte hain aur unka storage charge lagta rehta hai jabki wo listing me dikhte bhi nahi.

---

**S3. Deploy kiya lekin users ko purana version dikh raha hai. End-to-end debug karo.**

> Main layer by layer neeche jaaunga. Pehle **browser** — hard reload aur incognito me test karunga, kyunki ho sakta hai browser cache ho. Phir **CloudFront** — response me `X-Cache` aur `Age` headers dekhunga; agar Hit hai aur Age zyada hai to CloudFront cache stale hai. Phir **S3** — object ka LastModified aur ETag dekhunga taaki confirm ho ki naya file actually upload hua, kyunki ho sakta hai deploy pipeline hi fail ho gayi ho. Agar S3 pe naya hai lekin CloudFront purana de raha hai to main object ka `Cache-Control` metadata check karunga — agar wo missing hai to CloudFront Default TTL yaani 24 ghante use kar raha hoga. Aur **DNS layer** bhi check karunga — `dig` se verify karunga ki domain sahi distribution pe point kar raha hai, kahin purani distribution to nahi. Immediate fix ke liye affected paths invalidate karunga. Permanent fix ye hai ki build me content hashing lagayi jaaye — hashed assets ek saal ke immutable cache-control ke saath jaayein aur index.html short TTL pe rahe — phir har deploy pe sirf index.html invalidate karna padta hai.

---

**S4. Contact form pe koi bot spam kar raha hai. Aapka SES quota khatam ho raha hai aur bill badh raha hai. Kya karoge?**

> Main defence in depth lagaunga, kyunki ek hi layer kaafi nahi hoti. **Edge layer** pe AWS WAF attach karunga CloudFront pe, jisme rate-based rule hoga — ek IP se 5 minute me 100 se zyada requests to block — aur bot control managed rule group. **API layer** pe API Gateway me throttling set karunga, per-client rate aur burst limits. **Application layer** pe frontend me CAPTCHA jaise reCAPTCHA ya AWS WAF CAPTCHA add karunga, aur Lambda me server-side validation karunga — email format, message length caps, aur honeypot field jo real users ko dikhta hi nahi. **Guardrail layer** pe Lambda pe reserved concurrency set karunga taaki chahe kuch bhi ho jaaye, invocations ek limit se upar na jaayein, aur CloudWatch billing alarm plus SES `Send` metric pe alarm lagaunga. Aur SES side pe main ek alag configuration set use karunga contact form ke liye, taaki agar spam se reputation kharab ho to main sirf usko disable kar sakoon aur baaki transactional emails chalte rahein.

---

**S5. `myproject.com` chalta hai lekin `www.myproject.com` nahi. Kya problem hai?**

> Main teen jagah check karunga. Pehle **Route 53** — kya `www` ke liye koi record exist karta hai? Bahut baar log sirf apex ka ALIAS banate hain aur `www` bhool jaate hain. Doosra, **CloudFront ke alternate domain names** — distribution me `www.myproject.com` CNAME ke taur pe add hona chahiye; agar nahi hai to CloudFront request ko reject karke `CNAMEAlreadyExists` ya SSL mismatch error dega. Teesra, **ACM certificate** — certificate me `www.myproject.com` cover hona chahiye. Yahan ek classic gotcha hai: wildcard certificate `*.myproject.com` **apex domain ko cover nahi karta**, aur ulta bhi — sirf apex ka cert `www` ko cover nahi karta. Isliye certificate me dono naam SAN me hone chahiye. Fix ye hai ki `www` ke liye ALIAS A aur AAAA records banao usi distribution pe, distribution me alternate domain name add karo, aur certificate me dono naam ho. Aur canonical URL decide karke ek se doosre pe redirect karna chahiye — ye main CloudFront Function se karta hoon, SEO ke liye.

---

**S6. Lambda S3 se file read kar raha hai aur "Access Denied" aa raha hai, jabki bucket policy me allow hai. Kya check karoge?**

> Access Denied ke kaafi possible causes hain, main order me jaaunga. Pehle **Lambda ka execution role** — kya usme `s3:GetObject` hai aur kya resource ARN sahi hai? Ek bahut common galti hai `arn:aws:s3:::my-bucket` likhna jabki objects ke liye `arn:aws:s3:::my-bucket/*` chahiye — bucket ARN aur object ARN alag hote hain. Doosra, **explicit deny** — kahin bucket policy, SCP, ya permission boundary me explicit deny to nahi, kyunki deny hamesha allow ko override karta hai. Teesra, **encryption** — agar object SSE-KMS se encrypted hai to Lambda role ko `kms:Decrypt` bhi chahiye us key pe, aur key policy me bhi role allowed hona chahiye; ye sabse commonly missed cause hai. Chautha, **cross-account** — agar bucket doosre account me hai to dono taraf permission chahiye, aur object ka owner bhi matter karta hai. Paanchva, **VPC endpoint policy** — agar Lambda VPC me hai aur S3 gateway endpoint use kar raha hai to us endpoint ki policy bhi allow karni chahiye. Aur ek practical baat — S3 event se aane wali object key **URL-encoded** hoti hai, to agar filename me space hai to decode na karne pe key hi galat banti hai aur NoSuchKey ya Access Denied aa sakta hai. Debug ke liye main CloudTrail me us specific `GetObject` call ka error code dekhunga aur IAM Policy Simulator chalaunga.

---

**S7. Poora site down hai. Kahan se debugging start karoge?**

> Main **outside-in** jaaunga, matlab user ke perspective se shuru karke andar. Pehle **DNS** — `dig myproject.com` se check karunga ki resolve ho raha hai ya nahi, aur `dig @ns-xxx.awsdns-01.com` se directly Route 53 se poochunga taaki pata chale ki problem Route 53 me hai ya downstream resolver caching me. Registrar ke NS records bhi verify karunga. Agar DNS theek hai to **CloudFront** — distribution ka status Deployed hai? Certificate expire to nahi hua? CloudWatch me 5xx error rate dekhunga aur `x-edge-result-type` field se pata karunga ki error edge pe hai ya origin pe. Phir **origin** — S3 bucket exist karta hai, bucket policy accidentally change to nahi hui, OAC intact hai? Agar API bhi down hai to **Lambda** — CloudWatch me Errors, Throttles aur Duration metrics dekhunga, aur logs me exception dhoondhunga. Saath me main **AWS Health Dashboard** bhi check karunga ki koi regional service issue to nahi hai. Aur ek important step — main recent changes dekhunga: kya koi deploy hua, kya koi IAM policy badli, kya certificate expire hua. Zyadatar outages kisi recent change se hi hote hain, isliye CloudTrail me last 24 ghante ke config changes dekhna sabse fast route hota hai.

---

**S8. Ek user ke S3 file ko sirf 15 minute ke liye accessible banana hai. Kaise?**

> Do options hain aur choice access pattern pe depend karti hai. Agar ye file sirf ek user ke liye hai to main **S3 presigned URL** generate karunga Lambda se, `ExpiresIn` 900 second set karke. URL me SigV4 signature embed hoti hai jo bucket, key, method aur expiry cover karti hai. Ek gotcha jo main dhyaan rakhta hoon — Lambda temporary credentials use karta hai, to presigned URL role session expire hone pe hi expire ho jaayega chahe maine 15 minute likha ho; agar mujhe lambi expiry chahiye ho to alag mechanism chahiye. Agar wahi file bahut saare users ko serve karni hai to main **CloudFront signed URL** use karunga, kyunki tab CDN caching ka fayda milega, latency kam hogi aur WAF ka protection bhi rahega. Aur agar ek poora content set protect karna hai — jaise ek video jiske 500 HLS segments hain — to har segment ka URL sign karna practical nahi, wahan **signed cookies** use karunga jo ek path pattern ko cover karti hain.

---

**S9. Emails spam me ja rahi hain. Route 53 aur SES dono ke perspective se debug karo.**

> Ye do services milke kaam karti hain, isliye main dono taraf dekhunga. **Route 53 side** pe main verify karunga ki teen DKIM CNAME records sahi values ke saath maujood hain — `dig CNAME abc._domainkey.myproject.com` se, kyunki typo ya missing record se DKIM verification fail hoti hai. Phir SPF TXT record check karunga aur ye bhi ki wo **custom MAIL FROM subdomain** pe hai, kyunki agar custom MAIL FROM configure nahi kiya to SPF `amazonses.com` ke against check hoga aur DMARC ki SPF alignment fail ho jaayegi. Custom MAIL FROM ke liye MX record bhi hona chahiye. Aur DMARC TXT record `_dmarc` pe hona chahiye. Ek common galti ye bhi hai ki ek se zyada SPF TXT records ban jaate hain — SPF spec ke hisaab se ek hi hona chahiye, warna PermError aata hai. **SES side** pe main console me DKIM status "Successful" hai ya nahi dekhunga, reputation dashboard me bounce aur complaint rates dekhunga, aur ek test email bhej ke uske raw headers me `Authentication-Results` check karunga ki SPF, DKIM aur DMARC teeno pass dikha rahe hain. Content side pe spam trigger words, missing plain-text version, aur missing `List-Unsubscribe` header check karunga. Mail-Tester jaisa tool ek quick end-to-end score de deta hai.

---

**S10. Aapke architecture me DR (disaster recovery) kaise add karoge?**

> Main layer by layer sochunga. **S3** pe Cross-Region Replication enable karunga ek doosre region ke bucket pe — iske liye dono taraf versioning mandatory hai, aur agar RTO strict hai to Replication Time Control bhi laga sakta hoon jo 15 minute ka SLA deta hai. **CloudFront** me main **origin group** configure karunga primary aur secondary S3 bucket ke saath, taaki primary origin 5xx de to CloudFront automatically failover kar de — ye application level pe transparent hota hai. **Lambda** ko main dono regions me deploy karunga Infrastructure as Code se, taaki code drift na ho. **Route 53** pe agar mera API regional hai to failover routing policy health checks ke saath lagaunga, TTL 60 second rakhunga taaki failover fast ho — detection time interval into threshold plus TTL hota hai, to 30 into 3 plus 60 lagbhag 150 second. **SES** ke liye main dono regions me identity verify karunga aur dono me production access lunga, kyunki SES ka production status per-region hota hai — ye ek cheez hai jo log DR planning me bhool jaate hain aur disaster ke time pata chalta hai ki secondary region sandbox me hai. Aur main is poore setup ko periodically **test** karunga, kyunki untested DR effectively no DR hai.

---

**S11. Har deploy pe CloudFront invalidation ka bill badh raha hai. Kya karoge?**

> Ye problem tab aati hai jab har deploy pe wildcard ya bahut saare paths invalidate kiye jaate hain. Pehla 1000 paths per month free hain, uske baad har path ka charge lagta hai, aur wildcard invalidation poori cache khali kar deta hai jisse origin pe traffic spike bhi aata hai. Mera fix **versioning strategy** hai. Build tool — Webpack ya Vite — automatically content hash lagata hai, to file ka naam `main.a3f2b1c.js` ban jaata hai. Ye files 1 saal ke `max-age=31536000, immutable` ke saath deploy hoti hain, kyunki content badlega to naam hi badal jaayega, matlab invalidation ki zaroorat hi nahi. Sirf `index.html` ko main `max-age=0, must-revalidate` pe rakhta hoon kyunki wahi entry point hai jo naye hashed files ko reference karta hai. Deploy ke baad main sirf `/index.html` invalidate karta hoon — matlab ek path per deploy, jo free tier me hamesha reh jaata hai. Isse teen fayde ek saath milte hain: invalidation cost practically zero, cache hit ratio high rehta hai kyunki assets purge nahi hote, aur rollback instant hai kyunki purane hashed files abhi bhi cache aur S3 dono me maujood hain.

---

**S12. Ek Lambda dusre Lambda ko call kar raha hai aur latency bahut zyada hai. Kya karoge?**

> Pehle main **X-Ray** enable karke trace dekhunga taaki pata chale ki time exactly kahan ja raha hai — cold start me, network me, ya downstream service me. Agar problem cold start hai to main package size kam karunga, SDK ke modular imports use karunga, memory tune karunga Power Tuning se, aur latency-critical function pe Provisioned Concurrency consider karunga. Lekin architectural level pe main ye question poochunga ki **synchronous chaining zaroori hai kya**. Lambda se Lambda ka direct synchronous call ek anti-pattern hai — aap dono functions ka execution time pay karte ho, latency add hoti hai, aur error handling coupled ho jaati hai. Agar caller ko result ki turant zaroorat nahi hai to main asynchronous invocation ya SQS/EventBridge use karunga taaki decoupling ho jaaye. Agar multi-step workflow hai jisme orchestration, retries aur error handling chahiye to **Step Functions** sahi tool hai — usme har step ka state visible hota hai aur retry logic declarative hoti hai. Aur agar dono functions ka kaam chhota hai to main consider karunga ki kya unko ek hi function me merge karna better hai.

---

**S13. Contact form ka email kabhi kabhi nahi jaata, lekin API 200 return karta hai. Kya ho raha hoga?**

> API 200 de raha hai matlab Lambda successfully execute ho gaya, to problem SES ke aage hai — matlab email accept ho gaya but deliver nahi hua, ya Lambda ne error swallow kar liya. Main pehle **Lambda code** check karunga ki kahin `try-except` me exception silently pass to nahi ho raha, aur SES ka response — `MessageId` — actually log ho raha hai ya nahi. Phir **SES events** dekhunga configuration set ke through: agar `Send` event hua but `Delivery` nahi, to email SES se nikal to gaya but recipient server ne accept nahi kiya. Bounce event hai to bounce type aur subtype se exact reason milta hai. Agar `Reject` event hai to SES ne khud reject kiya — usually content ya virus scan ki wajah se. Ek aur strong possibility ye hai ki recipient **suppression list** me hai — us case me SES silently skip kar deta hai aur error nahi deta, jo exactly is symptom se match karta hai. Main account-level suppression list check karunga. Aur ek aur cause — recipient ke spam folder me ja rahi ho, jise wo "nahi aayi" samajh raha ho. Long term fix ye hai ki main har send ka `MessageId` database me store karoon aur SES events ke saath correlate karoon, taaki mujhe har email ka actual outcome pata rahe, sirf API response nahi.

---

**S14. Aapke S3 bill me achanak storage double ho gaya, lekin naye users nahi aaye. Kya wajah ho sakti hai?**

> Teen sabse likely causes hain aur main teeno check karunga. Pehla, **versioning without lifecycle** — agar versioning on hai aur `NoncurrentVersionExpiration` rule nahi hai to har overwrite ek poora naya version banata hai. S3 versions ke beech diff store nahi karta, poora object store karta hai. Agar koi automated process files ko baar baar overwrite kar raha hai to storage silently explode ho jaata hai. Doosra, **incomplete multipart uploads** — failed uploads ke parts S3 me pade rehte hain, unka storage charge lagta hai, lekin wo object listing me dikhte hi nahi. Ye classic ghost storage hai. Fix hai `AbortIncompleteMultipartUpload` lifecycle rule. Teesra, **infinite loop** — agar koi Lambda S3 event se trigger hota hai aur usi bucket me likhta hai to wo apne aap ko trigger karta rehta hai. Ye storage aur requests dono explode karta hai. In teeno ko diagnose karne ke liye main **S3 Storage Lens** use karunga, jo free hai aur specifically batata hai ki kitna storage noncurrent versions me hai aur kitna incomplete multipart uploads me — ye do numbers hi usually answer de dete hain. Cost Explorer me usage type breakdown se bhi confirm ho jaata hai.

---

**S15. Aapko is architecture me user authentication add karna hai. Kaise karoge?**

> Main **Amazon Cognito** use karunga kyunki wo is stack me natural fit hai. User Pool banaunga jo user directory aur sign-up/sign-in flows handle karega, MFA aur password policies ke saath, aur social ya SAML identity providers bhi integrate kar sakta hai. Frontend Cognito se authenticate karke ek **JWT** leta hai. Us JWT ko main **API Gateway ke JWT authorizer** se validate karaunga, taaki invalid tokens Lambda tak pahuchein hi na — matlab main unauthenticated requests ke liye compute ka paisa nahi doonga. Lambda ke andar mujhe token se user ID mil jaata hai jo main authorization decisions ke liye use karta hoon, jaise presigned URL generate karte waqt key prefix me us user ka ID force karna. Static frontend ke liye jo protected hai, main **CloudFront Function** ya Lambda@Edge se token presence check kar sakta hoon aur unauthenticated users ko login page pe redirect kar sakta hoon — CloudFront Function me full JWT signature verification nahi ho sakti kyunki wo bahut limited hai, uske liye Lambda@Edge chahiye hoga. Ek alternative jo main consider karta wo hai **Cognito Identity Pool** se temporary AWS credentials lena taaki frontend directly S3 pe scoped access ke saath kaam kare, lekin maine presigned URL pattern prefer kiya kyunki usme authorization logic backend me centralized rehta hai aur audit karna aasan hai.

---
---

# 14. RAPID-FIRE REVISION SHEET

**Ye section interview se 30 minute pehle padhna hai. Aur kuch nahi.**

---

## 14.1 Master cheat-sheet table

| Service | Ek line definition | Top 3 keywords | Sabse zyada poocha jaane wala question |
|---------|-------------------|----------------|----------------------------------------|
| **Route 53** | AWS ka DNS + domain registration service, 100% SLA ke saath | ALIAS record, Routing policies, Health checks | "ALIAS aur CNAME me kya farq hai?" |
| **CloudFront** | Global CDN jo content ko edge locations pe cache karta hai | Cache key, OAC, Invalidation vs versioning | "Cache hit ratio kaise improve karoge?" |
| **S3** | Unlimited object storage, 11 nines durability | Storage classes, Lifecycle, Presigned URL | "Bucket private hai, CloudFront se kaise serve karoge?" |
| **Lambda** | Serverless compute — sirf execution time ka paisa | Cold start, Concurrency, Memory=CPU | "Cold start kya hai aur kaise kam karoge?" |
| **SES** | Managed email sending with deliverability infra | DKIM/SPF/DMARC, Bounce rate, Sandbox | "SPF, DKIM, DMARC me kya farq hai?" |

---

## 14.2 Numbers jo yaad rakhne hain

| Cheez | Number |
|-------|--------|
| Lambda max timeout | **15 min (900 sec)** |
| Lambda memory range | **128 MB – 10,240 MB** |
| Lambda 1 vCPU pe | **1,769 MB** |
| Lambda sync payload | **6 MB** |
| Lambda async payload | **256 KB** |
| Lambda default concurrency | **1,000 per region (soft)** |
| Lambda /tmp | **512 MB → 10 GB** |
| Lambda package unzipped | **250 MB** (container: 10 GB) |
| Lambda layers max | **5** |
| S3 max object size | **5 TB** |
| S3 single PUT max | **5 GB** |
| S3 multipart min part | **5 MB**, max parts **10,000** |
| S3 durability | **11 nines (99.999999999%)** |
| S3 Standard availability | **99.99%** |
| S3 requests per prefix | **3,500 write / 5,500 read per sec** |
| S3 IA/One Zone-IA min duration | **30 din** |
| S3 Glacier IR / Flexible min | **90 din** |
| S3 Deep Archive min | **180 din** |
| S3 presigned URL max expiry | **7 din** |
| Route 53 hosted zone cost | **$0.50/month** |
| Route 53 standard query | **$0.40 per million** |
| Route 53 health check interval | **30 sec** (fast: 10 sec), threshold 3 |
| CloudFront default TTL | **86,400 sec (24h)**, max 1 saal |
| CloudFront free invalidations | **1,000 paths/month** |
| CloudFront edge locations | **700+** (regional edge caches ~13) |
| CloudFront ACM cert region | **us-east-1 (mandatory)** |
| CloudFront dedicated IP SSL | **$600/month** |
| CloudFront Function limits | **10 KB code, 2 MB memory, <1 ms** |
| SES sandbox quota | **200 emails/24h, 1/sec** |
| SES bounce rate danger | **5% review, 10% pause** |
| SES complaint rate danger | **0.1% review, 0.5% pause** |
| SES pricing | **$0.10 per 1,000 emails** |
| SES max message size | **40 MB** |
| SES dedicated IP | **~$24.95/month** |

---

## 14.3 One-liner answers — instant recall

| Question | Answer |
|----------|--------|
| **ALIAS vs CNAME** | "ALIAS apex pe kaam karta hai, free hai, sirf AWS resources pe; CNAME apex pe nahi chalta kyunki wahan SOA/NS records mandatory hain." |
| **Edge vs Regional edge cache** | "Edge 700+ hain aur user ke paas, chhoti cache; regional edge ~13 hain, badi cache, origin ka load kam karti hai." |
| **Cache policy vs Origin request policy** | "Cache policy cache key define karti hai; origin request policy sirf origin ko forward karti hai bina cache key affect kiye." |
| **Invalidation vs versioning** | "Versioning free aur instant hai, file naam badal jaata hai; invalidation paid hai 1000 ke baad aur propagate hone me time leta hai." |
| **OAC vs OAI** | "OAC naya hai — SSE-KMS support karta hai, saare HTTP methods, aur SigV4 signing. OAI legacy hai." |
| **CF Functions vs Lambda@Edge** | "Functions sub-millisecond, edge pe, viewer triggers only, no network. Lambda@Edge heavy, origin triggers bhi, network access, 6x mehnga." |
| **Signed URL vs signed cookie** | "URL ek file ke liye, cookie ek path pattern ke multiple files ke liye — HLS video ke liye cookie." |
| **Durability vs availability** | "Durability = data kho nahi jaayega (11 nines). Availability = data abhi milega (99.99%)." |
| **Bucket policy vs IAM policy** | "Bucket policy resource-based hai aur usme Principal hota hai to cross-account/public de sakti hai; IAM identity-based hai." |
| **S3 consistency** | "Dec 2020 se strong read-after-write consistency, saare operations pe, bina extra cost ke." |
| **S3 website vs REST endpoint** | "Website endpoint me index-document aur redirects hain but HTTPS nahi aur OAC nahi; REST endpoint ulta." |
| **Cold vs warm start** | "Cold me microVM boot + runtime + package + INIT code chalta hai (100ms-2s); warm me seedha handler (1-10ms)." |
| **Reserved vs provisioned concurrency** | "Reserved free hai, guarantee + cap deta hai. Provisioned paid hai, environments pre-warm karke cold start hataata hai." |
| **Sync vs async invocation** | "Sync me caller wait karta hai, no Lambda retry, 6 MB. Async me 202 turant, 2 retries, DLQ, 256 KB." |
| **DLQ vs Destinations** | "DLQ sirf failure pe aur sirf payload deta hai; Destinations success+failure dono pe aur error context bhi deta hai." |
| **SES sandbox** | "Sirf verified recipients, 200/day, 1/sec — production access support se lena padta hai, aur wo per-region hota hai." |
| **SPF vs DKIM vs DMARC** | "SPF batata hai kaun bhej sakta hai (IP), DKIM prove karta hai message authentic hai (signature), DMARC batata hai fail pe kya karna hai + alignment enforce karta hai." |
| **Hard vs soft bounce** | "Hard = address permanently invalid, turant suppress. Soft = temporary jaise mailbox full, limited retries." |
| **SES vs SNS** | "SES customers ko professional email bhejta hai; SNS systems ke beech pub/sub notifications ke liye hai." |
| **Dedicated vs shared IP** | "Dedicated tab jab volume high aur consistent ho, warming chahiye, ~$25/month. Shared ki reputation AWS manage karta hai." |

---

## 14.4 Last-minute confidence lines

Ye 5 lines yaad kar lo — inme se koi bhi kisi bhi answer me fit ho jaayegi aur depth dikhayegi:

1. *"Maine ALIAS use kiya CNAME nahi, kyunki zone apex pe CNAME allowed nahi hai aur AWS resources pe alias queries free hain."*

2. *"Maine bucket poori tarah private rakha OAC ke saath, aur bucket policy me SourceArn condition lagayi taaki confused deputy problem na ho."*

3. *"Main invalidation ki jagah content hashing use karta hoon — versioning free hai, instant hai, aur rollback bhi easy ho jaata hai."*

4. *"File uploads Lambda ke through nahi jaate — 6 MB payload limit hai aur compute pe paisa dena waste hai. Presigned URL se browser directly S3 pe upload karta hai."*

5. *"SES me sirf DKIM kaafi nahi tha — maine custom MAIL FROM domain bhi configure kiya taaki SPF alignment DMARC ke liye pass ho."*

---
---

# 15. RED FLAGS — Kya nahi bolna

Ye section shayad poore document ka sabse valuable hissa hai. Ye woh cheezein hain jo bolte hi interviewer samajh jaata hai ki bande ne bas tutorial dekha hai.

---

## 15.1 General red flags

| ❌ Ye mat bolo | ✅ Iski jagah ye bolo |
|---------------|----------------------|
| "Maine bucket public kar diya taaki website chale." | "Maine bucket private rakha aur CloudFront ko OAC se access diya, taaki koi CDN bypass na kar sake aur WAF/Shield ka protection bana rahe." |
| "AWS free tier me tha isliye use kiya." | "Maine cost model evaluate kiya — is traffic pattern pe serverless ka idle cost zero hai, jo ek always-on instance se sasta padta hai." |
| "Tutorial me aisa bola tha." | "Maine ye choose kiya kyunki [trade-off]. Alternative X tha, wo maine [specific reason] se reject kiya." |
| "Deploy ke baad main `/*` invalidate kar deta hoon." | "Mera build content hashing karta hai, to main sirf index.html invalidate karta hoon — cost bhi zero aur cache hit ratio bhi maintain rehta hai." |
| "Lambda me main sab kuch handler ke andar likhta hoon." | "SDK clients aur connections main INIT phase me banata hoon taaki warm invocations me reuse ho — cold start ke pehle 10 second charge bhi nahi hote." |
| "DNS propagate hone me 24-48 ghante lagte hain." | "Route 53 me change 60 second me global ho jaata hai; jo delay dikhta hai wo downstream resolvers ki cached entries ka hai, yaani TTL ka effect." |
| "Serverless matlab server hai hi nahi." | "Server hai, bas wo meri responsibility nahi hai — provisioning, patching aur scaling AWS handle karta hai." |
| "Maine `s3:*` permission de di taaki kaam ho jaaye." | "Maine specific actions aur specific prefix-level ARNs diye — thumbnail Lambda originals se read karta hai aur sirf thumbnails prefix pe likh sakta hai." |
| "Secrets maine environment variables me rakhe hain." | "Config environment variables me hai, but secrets Secrets Manager ya SSM SecureString me hain, jo main INIT phase me fetch karke cache karta hoon." |
| "Mera project bilkul perfect hai, koi issue nahi." | "Is architecture ki kuch limitations hain jo main aware hoon — Lambda ka 15 minute timeout, cold start latency, aur AWS-specific vendor lock-in." |
| "S3 eventually consistent hai." | "Dec 2020 se S3 strong read-after-write consistency deta hai, saare operations pe, bina extra cost ke." |
| "VPC me Lambda daalne se cold start bahut badh jaata hai." | "Ye 2019 se pehle sach tha; Hyperplane ENI ke baad VPC ka cold start penalty practically negligible hai." |
| "Bounce handle karne ki zaroorat nahi, wo apne aap ho jaata hai." | "Bounce rate 10% ya complaint rate 0.5% pe AWS sending pause kar deta hai, isliye maine SNS+Lambda ka handling pipeline banaya aur suppression list enable ki." |
| "Cache hit ratio to apne aap high ho jaata hai." | "Cache hit ratio cache key pe depend karta hai — maine marketing query params exclude kiye aur analytics headers ko origin request policy me daala, cache policy me nahi." |
| "Maine 15 minute timeout set kiya, safe side ke liye." | "Timeout main p99 duration ka lagbhag 1.5x rakhta hoon — zyada rakhne se hang hone pe poore time ka paisa lagta hai." |

---

## 15.2 Behavioural red flags (kaise bolte ho)

**1. Confidently galat bolna.**
Ye sabse bada red flag hai. Agar nahi pata to bolo: *"Sir, isko maine apne project me use nahi kiya. Mera understanding ye hai ki [X], but main confident nahi hoon — main isko padhunga."* Ye honesty seniority ka signal hai. Galat answer confidently dena ka matlab hai ki production me bhi aap galat decision confidently loge.

**2. Sirf "what" batana, "why" nahi.**
"CloudFront ek CDN hai" — ye definition hai. "Maine CloudFront isliye lagaya kyunki S3 website endpoint HTTPS support nahi karta aur custom domain pe SSL chahiye tha" — ye reasoning hai. Interviewer reasoning sun raha hai.

**3. Har cheez pe "yes" bolna.**
"Kya aapne multi-region setup kiya?" — agar nahi kiya to "Nahi sir, mera scale usko justify nahi karta tha, but agar karna hota to main latency-based routing with health checks use karta." Ye zyada strong answer hai than jhooth bolna.

**4. Trade-off ka zikr na karna.**
Har technical decision me trade-off hota hai. Agar aap sirf fayde bata rahe ho aur nuksaan nahi, to lagta hai ki aapne sochra hi nahi. "Lambda cheap hai" ke saath "but cold start aur 15 minute limit hai" bhi bolo.

**5. Numbers na bolna.**
"S3 bahut durable hai" vs "S3 11 nines durability deta hai, matlab 10 million objects me se ek khone me statistically 10,000 saal lagenge." Doosra answer clearly better hai.

**6. Cost ke bare me kuch na pata hona.**
Personal project me cost ek real constraint hai. Agar aapko apna monthly bill nahi pata to lagta hai ki aapne console me click kiya aur bhool gaye. "Mera monthly cost lagbhag ek dollar hai" — ye chhota sa number bahut credibility deta hai.

**7. Failure modes ke bare me na sochna.**
"Agar S3 event Lambda ko trigger kare aur Lambda usi bucket me likhe to kya hoga?" — agar aapne infinite loop ke bare me socha hi nahi to wo dikhta hai. Achha engineer hamesha "ye kaise toot sakta hai" sochta hai.

**8. Region-specific / version-specific cheezon pe absolute bolna.**
"ACM cert kisi bhi region me ho sakta hai" — galat. "CloudFront ke liye us-east-1 mandatory hai, ALB ke liye ALB ke region me" — sahi. Aur agar pricing ya feature availability ka exact number nahi pata to bolo "ye number time ke saath badalta hai, main approximate bata raha hoon."

---

## 15.3 Golden phrases — inko apne answers me use karo

Ye phrases naturally use karne se aapke answers senior lagne lagte hain:

- *"Iska trade-off ye hai ki..."*
- *"Maine X consider kiya tha lekin Y ki wajah se reject kiya."*
- *"Ye scale pe change ho jaayega — abhi mere volume pe ye sahi hai, lekin agar traffic 10x ho to main..."*
- *"Blast radius contain karne ke liye maine..."*
- *"Ye defence in depth hai — ek layer fail bhi ho to doosri bachaayegi."*
- *"Main ye assume nahi karta, main isko [metric] se measure karta hoon."*
- *"Ye failure mode maine specifically handle kiya kyunki..."*
- *"Main honest rahunga — ye maine implement nahi kiya, but approach ye hoti."*

---

## 15.4 Final checklist — interview se pehle

- [ ] Apna 30-second aur 2-minute pitch bolke practice kiya (aawaz me, mann me nahi)
- [ ] Section 14.2 ke numbers ek baar dekhe
- [ ] Har service ka "maine X kyun choose kiya" ready hai
- [ ] Har service ka "maine Y kyun reject kiya" ready hai
- [ ] Apne project ka approximate monthly cost pata hai
- [ ] Ek cheez ready hai jo galat hui thi aur aapne kaise fix ki (interviewer ye zaroor poochta hai)
- [ ] Ek cheez ready hai jo aap agli baar alag karte
- [ ] Interviewer ke liye 2 sawaal ready hain

---

## Aakhri baat

Bhai, ye document tumhe **ratta maarne ke liye nahi** diya gaya. Agar tum ye 60+ answers word-to-word yaad karke jaaoge to interviewer 3 questions me pakad lega, kyunki uska agla sawaal kabhi bhi script se bahar ka hoga.

Iska sahi use ye hai: **har concept ka "why" samjho**, aur phir apne shabdon me bolo. Jo answers yahan diye hain wo structure aur depth ka example hain — content wahi rakho, phrasing apni banao.

Aur ek aakhri baat — **apne project ko actually ek baar dobara chalao, console me jaao, bill dekho, ek cheez tod ke dekho ki kya hota hai.** Jo banda apna project break karke fix kar chuka hai, uska confidence bilkul alag hota hai, aur wo interview me clearly sunai deta hai.

All the best. 🚀
