# Amazon S3 — Exhaustive Deep Dive

> **Numbers ke baare me disclaimer (ek baar, upar hi):** saare quotas aur prices **6 August 2026** ko AWS ke official docs (S3 User Guide, S3 FAQs, multipart upload limits page) aur pricing sources se verify kiye gaye hain. Prices **ap-south-1 (Mumbai)** ke hain jahan mention kiya hai, warna us-east-1 ke. AWS pricing chupchaap badalti hai — production budget ke liye AWS Pricing Calculator se confirm karo. Jahan mujhe official pricing page ke bajaye secondary source mila, wahan `⚠️ verify` likha hai.
>
> **Ek important update jo purane blogs me nahi milega:** S3 ka maximum object size **Dec 2025 me 5 TB se 50 TB** ho gaya, aur default bucket quota **100 se 10,000** ho gaya (1 million tak badh sakta hai). Agar tumne 2024 ka koi tutorial padha hai to wo numbers stale hain.

---

## 1. Ek Line Me

S3 ek **regional, infinitely-scalable object storage service** hai jahan tum kisi bhi size ka data ek flat key-value namespace me rakhte ho aur HTTP API se access karte ho — filesystem nahi, block device nahi, **objects**.

---

## 2. Problem Statement

### Before S3 (2006 se pehle)

Agar tumhe application ke files store karne the — user uploads, reports, backups, logs — to teen hi options the:

**Option 1: Server ki local disk.**
```
/var/www/uploads/2006/03/invoice-4471.pdf
```
Problems:
- **Server mar gaya = data gaya.** RAID kuch had tak bachata tha, par RAID controller bhi marte hain.
- **Scale nahi hota.** Disk bhar gayi? Downtime lo, badi disk lagao, data migrate karo.
- **Multiple servers = nightmare.** Load balancer ke peeche 3 web servers hain — user ne server-1 par file upload ki, agli request server-2 par gayi, file "nahi mili". Solution tha rsync cron ya sticky sessions — dono hacky.
- **Backup manual.** Tape, ya doosre server par copy. Aur restore test kabhi nahi hota tha.

**Option 2: NAS/SAN.**
Central shared storage. Better, lekin:
- **Mehnga** — ek entry-level SAN 2006 me $50,000+ ka tha
- **Capacity pehle se buy karni padti thi** — 10 TB chahiye future me? Aaj hi kharido, aaj hi paisa lago
- **Single point of failure** — SAN down = sab servers down
- **Ek data center me hi** — building jal gayi to sab gaya

**Option 3: Database me BLOB.**
```sql
CREATE TABLE Documents (Id INT, FileName NVARCHAR(255), Content VARBINARY(MAX))
```
Tumne ye kiya hoga SQL Server me — aur pata hoga kya hota hai:
- Database size explode karta hai, backups ghanton lagte hain
- Buffer pool BLOB data se bhar jaata hai, actual queries slow ho jaati hain
- Replication lag
- `SELECT *` galti se chala do to server ki memory khatam

### After S3

| Purana dard | S3 ka jawab |
|---|---|
| Capacity planning | **Unlimited.** Kuch provision nahi karna, jitna daalo utna paisa |
| Server fail = data gaya | **11 nines durability** — data multiple AZs me automatically replicate |
| Multi-server file sharing | Har server ke liye ek hi HTTP endpoint |
| Upfront hardware cost | Pay-per-GB, per-month, prorated hourly |
| Backup/DR manual | Versioning, Cross-Region Replication, lifecycle to Glacier |
| DB BLOBs se bloat | Metadata DB me, bytes S3 me, foreign key = object key |
| Static assets serving | Direct HTTP serving + CloudFront integration |

### Aaj ka reality check

S3 sirf "file storage" nahi raha. 2023 ke baad ye ek **data platform** ban gaya hai:

- **General purpose buckets** — classic S3
- **Directory buckets** (S3 Express One Zone, Nov 2023) — single-digit ms latency, single AZ, actual hierarchical namespace
- **Table buckets** (S3 Tables, Dec 2024) — managed Apache Iceberg tables with auto-compaction
- **Vector buckets** (S3 Vectors, GA Dec 2025) — embeddings storage + similarity search

Aur ek architectural shift jo samajhna zaroori hai: **modern data lakes me S3 hi "database" hai.** Athena, Redshift Spectrum, EMR, Glue — sab S3 par directly query karte hain. Storage aur compute alag ho gaye. Tumhare Elasticsearch/SQL Server wale world se ye bada mental jump hai: wahan storage aur compute ek hi box me the.

**Ek honest caveat:** S3 ne durability solve ki, latency nahi. S3 Standard ka first-byte latency typically **100-200 ms** hai. Local SSD ka **~0.1 ms** hai. S3 "fast" nahi hai — wo "always available aur infinitely large" hai. Ye trade-off har design decision me yaad rakhna.

---

## 3. Vocabulary Table

| Term | Matlab | Analogy tumhari duniya se |
|---|---|---|
| **Bucket** | Top-level container. Region-specific. Naam globally unique | Ek database instance — sab kuch iske andar |
| **Object** | Ek stored item — bytes + metadata + key | Ek table row jisme ek BLOB column hai |
| **Key** | Object ka full path-like naam, e.g. `reports/2026/aug.csv` | Primary key. Literally |
| **Prefix** | Key ka shuruaati hissa, e.g. `reports/2026/` | SQL me `WHERE key LIKE 'reports/2026/%'` |
| **Delimiter** | LIST me `/` — isse "folders" simulate hote hain | `GROUP BY` on the path segment |
| **Object metadata** | System (Content-Type, size) + user-defined key-value pairs | Row ke extra columns |
| **ETag** | Object content ka hash (MD5 for simple PUT) | Row version / checksum |
| **Version ID** | Versioning on ho to har object version ka unique ID | Temporal table ka version column |
| **Storage class** | Price/performance tier — Standard, IA, Glacier, etc. | Hot table vs archive table on slower disk |
| **Lifecycle rule** | Automatic transition ya expiry rules | SQL Agent job jo purana data archive table me daal de |
| **Versioning** | Har overwrite/delete par purani copy rakhna | Temporal tables / soft delete |
| **Delete marker** | Versioned bucket me delete ka "tombstone" | `IsDeleted = 1` flag |
| **Multipart upload** | Bade object ko parts me todkar parallel upload | Bulk insert with batching |
| **Presigned URL** | Time-limited signed URL jo bina credentials ke access de | Ek short-lived JWT jo ek specific action allow kare |
| **Bucket policy** | Bucket par lagi resource-based JSON policy | Table-level GRANT/DENY |
| **ACL** | Legacy per-object/per-bucket permission. Ab default disabled | Purana per-row permission system |
| **Block Public Access** | 4 switches jo public grants ko override karke block karte hain | Master kill-switch, firewall jaisa |
| **SSE-S3 / SSE-KMS / SSE-C** | Server-side encryption ke teen flavours | TDE (SQL Server) ke variants |
| **Bucket Key** | KMS calls kam karne ka optimization — 99% tak KMS cost bachata hai | Connection pooling, lekin encryption keys ke liye |
| **Object Lock** | WORM — object ko delete/overwrite se rok do | `WITH (SCHEMABINDING)` + immutability, compliance ke liye |
| **Replication (CRR/SRR)** | Objects ko doosre bucket/region me auto-copy | SQL Server replication / log shipping |
| **Access Point** | Ek bucket ke liye multiple named endpoints, apni-apni policy ke saath | Ek table par multiple views, alag permissions ke saath |
| **Gateway endpoint** | VPC se S3 tak private route (route table entry). **Free** | Private network route, koi appliance nahi |
| **Interface endpoint** | ENI-based PrivateLink endpoint. **Paisa lagta hai** | Ek proxy appliance jo har AZ me chalta hai |
| **Event notification** | Object create/delete par SNS/SQS/Lambda trigger | DB trigger, ya Bull queue par job push |
| **S3 Select** | Object ke andar SQL query chalana (deprecated-ish, Athena prefer) | `SELECT ... WHERE` on a CSV file |
| **Storage Lens** | Account-wide storage analytics dashboard | Monitoring dashboard for storage |
| **S3 Inventory** | Daily/weekly CSV/Parquet report of all objects | Nightly full table dump |
| **Requester Pays** | Bucket owner ke bajaye downloader pay kare | Chargeback model |
| **Transfer Acceleration** | CloudFront edge locations ke through upload speed up | CDN, lekin upload direction me |
| **Directory bucket** | S3 Express One Zone ka bucket type. Real hierarchy, single AZ | Local SSD-backed cache with S3 API |
| **Table bucket** | Managed Apache Iceberg tables | Managed data warehouse table |
| **Conditional write** | `If-None-Match: *` — sirf tab likho jab object exist na kare | `INSERT ... WHERE NOT EXISTS` / optimistic locking |

---

## 4. Mental Model

### Sabse important mental shift: S3 ek filesystem NAHI hai

Ye samajh lo to 60% confusion khatam:

```
FILESYSTEM (jo tum jaante ho)          S3 (asli reality)
─────────────────────────────          ──────────────────────────────
/var/data/                             Flat key-value store:
├── reports/                           ┌──────────────────────────────┐
│   ├── 2026/                          │ KEY                    VALUE │
│   │   └── aug.csv                    ├──────────────────────────────┤
│   └── 2025/                          │ "reports/2026/aug.csv"  bytes│
└── logs/                              │ "reports/2025/jul.csv"  bytes│
    └── app.log                        │ "logs/app.log"          bytes│
                                       └──────────────────────────────┘
"reports" ek DIRECTORY hai —           "reports/2026/aug.csv" ek pura KEY hai.
ek real object jo inodes rakhta hai.   "/" sirf ek CHARACTER hai key ke andar.
                                       Koi "reports" object exist nahi karta.

Rename directory = 1 operation         Rename "folder" = har object ko
                                       COPY + DELETE karna. 10,000 objects
                                       = 20,000 API calls. Ye O(n) hai.
```

Ye ek **hash map** hai, ek **tree** nahi. Node me socho:
```javascript
// S3 aisa hai:
const s3 = new Map();
s3.set("reports/2026/aug.csv", buffer);

// Aisa NAHI hai:
const fs = { reports: { "2026": { "aug.csv": buffer } } };
```

Console tumhe "folders" dikhata hai kyunki wo `Delimiter=/` ke saath LIST karta hai aur common prefixes ko folder icon bana deta hai. Ye pure UI illusion hai.

> Exception: **directory buckets** (S3 Express One Zone) me actual hierarchical namespace hai. Wahan rename/list sasta hai. Ye 2023 me isliye add hua kyunki flat namespace bade datasets par LIST ke liye slow tha.

### Request ka poora journey

```
┌──────────────────────────────────────────────────────────────────────┐
│  CLIENT (Node app, browser, CLI)                                     │
│  GET https://jmfs-reports.s3.ap-south-1.amazonaws.com/2026/aug.csv   │
│       └──── virtual-hosted style (bucket subdomain me) ────┘          │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  DNS RESOLUTION              │
              │  Public: AWS public IP       │
              │  VPC + gateway endpoint:     │
              │    prefix-list route, private│
              │  VPC + interface endpoint:   │
              │    ENI private IP            │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  SigV4 SIGNATURE VERIFY      │
              │  (ya presigned URL check,    │
              │   ya anonymous if public)    │
              └──────────────┬───────────────┘
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│  AUTHORIZATION — sab layers evaluate hoti hain                       │
│                                                                       │
│  1. Block Public Access ────► anonymous/public grant? BLOCK.         │
│                                (bucket policy ko bhi override karta) │
│  2. Organizations SCP / RCP ─► Deny? khatam.                         │
│  3. VPC endpoint policy ─────► endpoint se aa rahe ho to ye bhi      │
│  4. Bucket policy ───────────► resource-based                        │
│  5. IAM identity policy ─────► caller ki apni policy                 │
│  6. Access Point policy ─────► agar access point se aaye             │
│  7. Object ACL ──────────────► ab default disabled (2023 se)         │
│                                                                       │
│  Rule: koi bhi explicit DENY → DENY. Same account me bucket policy   │
│        YA identity policy me Allow chahiye. Cross-account me DONO.   │
└────────────────────────────┬─────────────────────────────────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  STORAGE LAYER               │
              │  Key ko hash karke partition │
              │  dhoondho → replicas se read │
              │  Strong read-after-write     │
              │  consistency (Dec 2020 se)   │
              └──────────────┬───────────────┘
                             ▼
              ┌──────────────────────────────┐
              │  DECRYPT (SSE-S3 / SSE-KMS)  │
              │  KMS ho to kms:Decrypt call  │
              │  (Bucket Key se ye cache     │
              │   hota hai, 99% calls bachte)│
              └──────────────┬───────────────┘
                             ▼
                    200 OK + bytes
```

### Cost ka mental model — ye sabse zaroori hai

S3 ka bill **ek meter se nahi, aath se** banta hai. Log sirf storage dekhte hain aur baaki saat se surprise hote hain:

```
   ┌─────────────────────────────────────────────────────────┐
   │  S3 BILL = 8 INDEPENDENT METERS                         │
   ├─────────────────────────────────────────────────────────┤
   │  1. STORAGE          GB-month × storage class rate      │
   │  2. REQUESTS         PUT/GET/LIST/COPY per 1,000        │
   │  3. DATA TRANSFER    OUT to internet / cross-region     │
   │  4. RETRIEVAL        Glacier/IA se padhne ka alag charge│
   │  5. TRANSITIONS      Lifecycle move karne ka per-object │
   │  6. MANAGEMENT       Inventory, Analytics, Storage Lens │
   │  7. REPLICATION      CRR ka transfer + destination store│
   │  8. ACCELERATION     Transfer Acceleration, S3 Select   │
   └─────────────────────────────────────────────────────────┘

   Typical surprise ranking:
   #1  Data transfer OUT   ← "storage $5 hai, bill $400 kyun?"
   #2  Requests            ← LIST loop me chala diya
   #3  Retrieval fees      ← "Glacier me daala aur bill badh gaya"
   #4  Incomplete MPU      ← invisible storage, koi LIST me nahi dikhta
```

### Storage class decision tree

```
                    Data kitni baar padhi jaayegi?
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   Roz / frequently      Kabhi-kabhi          Almost never
        │                (mahine me 1-2)      (compliance/archive)
        │                     │                     │
        ▼                     ▼                     ▼
   Access pattern       Kitni jaldi           Kitni jaldi
   predictable hai?     chahiye jab           chahiye?
        │               chahiye?                    │
    ┌───┴───┐               │              ┌────────┼────────┐
    │       │          ┌────┴────┐         │        │        │
   HAAN    NAHI     Turant   Minutes    Minutes  Hours   12 hrs OK
    │       │          │       ok         ok      ok         │
    ▼       ▼          ▼        │          │       │         ▼
 STANDARD  INTELLIGENT  STANDARD-IA    GLACIER  GLACIER   DEEP
 $0.025/GB  -TIERING    $0.014/GB      INSTANT  FLEXIBLE  ARCHIVE
            $0.025→     (One Zone-IA   $0.005   $0.004    $0.00099
            $0.0138     $0.011 agar
            + monitoring re-creatable)
                                    ┌──────────────────────────┐
   Latency chahiye <10ms?  ────────►│ S3 EXPRESS ONE ZONE      │
   (ML training, checkpoints)       │ ~$0.11/GB, single AZ     │
                                    └──────────────────────────┘

   ⚠️ ap-south-1 rates, Aug 2026. Verify karna.
```

### Do golden rules

```
RULE 1: KEY DESIGN = PERFORMANCE DESIGN
        S3 keys ko hash karke partitions me daalta hai.
        Sequential keys (timestamps) = ek partition par load = throttle.
        Ye SQL me clustered index par hotspot jaisa hai.

RULE 2: DATA IN FREE, DATA OUT MEHNGA
        Upload karna hamesha free hai. Download ka paisa lagta hai.
        Isliye architecture aisi banao ki data S3 ke paas hi
        process ho (Lambda/Athena/EMR usi region me), na ki
        pehle download karke phir process.
```

---

## 5. Questions & Answers

### 🟢 Q1–Q15 — Fundamentals (Basic)

**Q1: Object storage aur file/block storage me exactly kya fark hai?**

**Block storage** (EBS, SAN) — raw blocks deta hai, filesystem tumhe banana padta hai. OS ko lagta hai ye ek disk hai. Random read/write bahut fast, lekin ek waqt me ek hi instance attach kar sakta hai (mostly).

**File storage** (EFS, NFS, Windows share) — hierarchical directories, POSIX semantics, multiple clients ek saath mount kar sakte hain. File ka ek byte badalna possible hai.

**Object storage** (S3) — flat key-value. Har object **immutable** hai — tum uska ek byte nahi badal sakte, poora object dobara PUT karna padta hai. Koi mount nahi, sirf HTTP API. Badle me: unlimited scale, 11 nines durability, aur bahut sasta.

Kyun ye trade-off: immutability aur flat namespace ki wajah se S3 ko koi lock coordination nahi karni padti. Isi wajah se wo horizontally infinitely scale kar sakta hai. Filesystem me directory metadata ek shared mutable structure hai — wahi scaling bottleneck banta hai.

> 💡 **Gotcha:** "Append to file" S3 me exist nahi karta (general purpose buckets me). Log log-file ko S3 me append karne ki koshish karte hain — har append = poora file dobara upload. 1 GB log me ek line add karne ke liye 1 GB upload. Solution: chhote objects likho aur baad me compact karo, ya Kinesis Firehose use karo jo buffering khud karta hai.

---

**Q2: Bucket kya hai aur naming rules kya hain?**

Bucket top-level container hai. **Region-specific** hota hai — bucket ek hi region me rehta hai, aur banane ke baad region **badal nahi sakte**. Naam bhi badal nahi sakte.

Naming rules (general purpose buckets):
- **3 se 63 characters**
- Sirf lowercase letters, numbers, hyphens (`-`), aur dots (`.`)
- Letter ya number se shuru aur khatam hona chahiye
- IP address format nahi ho sakta (`192.168.1.1`)
- `xn--`, `sthree-`, `amzn-s3-demo-` se shuru nahi ho sakta
- `-s3alias`, `--ol-s3`, `.mrap`, `--x-s3` se khatam nahi ho sakta
- Do consecutive dots nahi
- **Naam globally unique hona chahiye** — poore AWS me, sab accounts me, sab regions me

Kyun globally unique: kyunki bucket ka DNS name `bucket-name.s3.region.amazonaws.com` hota hai. DNS namespace shared hai, isliye naam bhi shared hona padta hai.

> 💡 **Gotcha:** Bucket name me **dots (`.`) mat use karo** agar tum HTTPS use kar rahe ho — jo tum kar rahe ho. Virtual-hosted style URL me `my.bucket.name.s3.amazonaws.com` ban jaata hai, aur AWS ka wildcard SSL certificate (`*.s3.amazonaws.com`) sirf **ek level** cover karta hai. Result: SSL certificate mismatch error. Dots sirf static website hosting ke liye use karo jahan custom domain match karna ho, aur wahan CloudFront lagao.

---

**Q3: Object me exactly kya-kya hota hai?**

Ek object ke paanch hisse hain:

1. **Key** — full name, max **1,024 bytes** UTF-8
2. **Value** — actual bytes, **0 bytes se 50 TB** tak (Dec 2025 se; pehle 5 TB tha)
3. **Version ID** — versioning on ho to unique ID, warna `null`
4. **Metadata** —
   - *System metadata*: `Content-Type`, `Content-Length`, `Last-Modified`, `ETag`, storage class
   - *User-defined metadata*: `x-amz-meta-*` headers, max **2 KB total** (key + value combined)
5. **Subresources** — ACL, torrent (legacy)

```bash
aws s3api head-object --bucket jmfs-reports --key 2026/aug.csv
```
```json
{
  "LastModified": "2026-08-06T09:14:22+00:00",
  "ContentLength": 4823901,
  "ETag": "\"9bb58f26192e4ba00f01e2e7b136bbd8\"",
  "ContentType": "text/csv",
  "Metadata": { "generated-by": "report-service", "tenant": "jmfs" },
  "StorageClass": "STANDARD"
}
```

> 💡 **Gotcha:** User metadata **2 KB** me limited hai aur wo **immutable** hai — object ki metadata badalne ke liye tumhe object ko khud par COPY karna padta hai (`aws s3api copy-object --metadata-directive REPLACE`). 5 GB ka object hai to ye ek 5 GB internal copy operation hai jiska paisa lagta hai. Isliye frequently-changing metadata S3 me mat rakho — DynamoDB ya apne SQL Server me rakho, S3 me sirf immutable stuff.

---

**Q4: S3 me "folders" exist karte hain ya nahi?**

**Nahi.** Namespace bilkul flat hai. `reports/2026/aug.csv` ek pura key hai, aur `/` sirf ek normal character hai.

Console folder isliye dikhata hai kyunki LIST API me `Delimiter` parameter hai:
```bash
# Sab keys — flat
aws s3api list-objects-v2 --bucket jmfs-reports --prefix "reports/"

# Delimiter ke saath — "folders" jaisa dikhega
aws s3api list-objects-v2 --bucket jmfs-reports \
  --prefix "reports/" --delimiter "/"
# → CommonPrefixes: ["reports/2025/", "reports/2026/"]
#   Contents: [reports/README.txt]
```

`CommonPrefixes` hi wo "folders" hain. S3 ne runtime par calculate kiye, koi stored object nahi hai.

Console me jab tum "Create folder" karte ho, wo ek **0-byte object** banata hai jiska key `reports/2026/` hai (trailing slash ke saath). Ye sirf console ko folder dikhane ke liye hai — functionally bekaar.

> 💡 **Gotcha:** "Rename folder" ek **O(n) operation** hai. `reports/2025/` ko `archive/2025/` karne ke liye har object ko COPY karke DELETE karna padta hai. 100,000 objects = 200,000 API calls = ~$1.00 request charges + ghanton ka time. `aws s3 mv --recursive` yahi karta hai internally, dhire-dhire. Isliye **key structure pehle din design karo** — baad me badalna mehnga hai. Ye SQL me clustered index change karne jaisa hai.

---

**Q5: Bucket ka region kaise decide hota hai, aur endpoint kya hota hai?**

Bucket banate waqt region choose karte ho. Wo permanent hai. Data us region ke AZs me hi rehta hai (One Zone classes me ek AZ me).

Endpoint formats:
```
Virtual-hosted style (recommended, default):
  https://jmfs-reports.s3.ap-south-1.amazonaws.com/2026/aug.csv

Path style (deprecated for new buckets):
  https://s3.ap-south-1.amazonaws.com/jmfs-reports/2026/aug.csv

Dual-stack (IPv6):
  https://jmfs-reports.s3.dualstack.ap-south-1.amazonaws.com/...

Legacy global (us-east-1 buckets ke liye):
  https://jmfs-reports.s3.amazonaws.com/...
```

Region kaise choose karo:
1. **Latency** — users ke paas. India ke users ke liye ap-south-1.
2. **Data residency** — RBI/DPDP compliance ke liye India me data rakhna. Financial services me ye aksar hard requirement hai.
3. **Compute ke saath co-locate** — same region me EC2/Lambda ho, warna cross-region transfer ka paisa lagega.
4. **Price** — regions me thoda fark hota hai (us-east-1 sabse sasta, ap-south-1 ~8% mehnga).

> 💡 **Gotcha:** Agar tum galat region ke endpoint par request bhejte ho to `PermanentRedirect` (HTTP 301) milta hai — aur SDK usko automatically follow karta hai lekin ek extra round trip lagta hai. Aur `HeadBucket` ke case me kabhi-kabhi `400 Bad Request` milta hai jo confusing hai. `AWS_REGION` hamesha correctly set karo, ya `getBucketLocation` se pata karo. Node SDK v3 me `followRegionRedirects: true` option hai lekin default off hai.

---

**Q6: Durability aur availability me kya fark hai — 11 nines ka matlab?**

**Durability = data kho jaayega ya nahi.** S3 Standard: **99.999999999% (11 nines)** annual durability. Matlab agar tumhare paas 10 million objects hain, to statistically ek object kho jaane me **10,000 saal** lagenge.

**Availability = abhi access ho paayega ya nahi.** S3 Standard: **99.99%** SLA — matlab saal me ~53 minute downtime allowed hai.

| Storage class | Durability | Availability SLA | AZs |
|---|---|---|---|
| S3 Standard | 11 nines | 99.99% | ≥3 |
| S3 Intelligent-Tiering | 11 nines | 99.9% | ≥3 |
| S3 Standard-IA | 11 nines | 99.9% | ≥3 |
| S3 One Zone-IA | 11 nines* | 99.5% | **1** |
| S3 Glacier Instant Retrieval | 11 nines | 99.9% | ≥3 |
| S3 Glacier Flexible Retrieval | 11 nines | 99.99% | ≥3 |
| S3 Glacier Deep Archive | 11 nines | 99.99% | ≥3 |
| S3 Express One Zone | 11 nines* | 99.95% | **1** |

*One Zone classes me 11 nines **us AZ ke andar** hai. Agar poori AZ destroy ho jaaye (aag, flood) to data gaya. Isliye One Zone sirf re-creatable data ke liye.

Kaise achieve karte hain: har object multiple devices par, multiple AZs me redundantly store hota hai, continuous checksum verification ke saath. Corrupt copy detect hote hi healthy copy se repair ho jaati hai.

> 💡 **Gotcha:** **11 nines durability tumhe accidental deletion se nahi bachati.** Agar tumhara code `deleteObject` call kar de, S3 khushi-khushi delete kar dega with 11 nines reliability. Durability hardware failure ke against hai, human/software error ke against nahi. Uske liye **versioning + MFA Delete + Object Lock** chahiye. Ye distinction interview me bahut poocha jaata hai aur log galat karte hain.

---

**Q7: Bucket ke kitne types hain (2026 me)?**

Chaar:

**1. General purpose bucket** — classic S3. Flat namespace, multi-AZ, saare storage classes, saare features. 99% cases me yahi.

**2. Directory bucket** — S3 Express One Zone ka container. **Actual hierarchical namespace**, single AZ, single-digit ms latency. Naming alag hai: `bucket-base-name--azid--x-s3`. LIST operations directory-scoped hain, poore namespace ka prefix scan nahi.

**3. Table bucket** — S3 Tables (Dec 2024). Managed **Apache Iceberg** tables with automatic compaction, snapshot management, aur unreferenced file cleanup. Athena/Redshift/EMR/Spark directly query karte hain. 2025 me Iceberg V3 support add hua (deletion vectors ke saath).

**4. Vector bucket** — S3 Vectors (GA Dec 2025). Embeddings store karo aur similarity search karo, bina vector database chalaye. RAG applications ke liye.

Kyun ye split: ek hi bucket abstraction sab use cases serve nahi kar sakta. Flat namespace analytics ke liye acha hai lekin low-latency random access ke liye bura. Iceberg tables ko compaction chahiye jo generic object store nahi kar sakta. AWS ne specialization choose ki.

> 💡 **Gotcha:** Directory buckets **feature-parity nahi rakhte** general purpose buckets ke saath. Versioning nahi, lifecycle limited, replication nahi, aur bahut sare bucket-level features missing hain. Aur pricing model alag hai — per-GB storage sasta nahi hai (~$0.11/GB) lekin requests bahut saste hain. Migrate karne se pehle feature matrix check karo, assume mat karo.

---

**Q8: Saare storage classes kya hain aur kab kaunsa?**

⚠️ Prices **ap-south-1**, Aug 2026, verify karna zaroori hai.

| Class | Storage $/GB-mo | Min duration | Min billable size | Retrieval | Kab use karo |
|---|---|---|---|---|---|
| **Standard** | $0.025 | — | — | Free | Active data, <30 din purana |
| **Intelligent-Tiering** | $0.025 → $0.0138 → Glacier tiers | — | — | Free (frequent/infrequent) | Access pattern unknown ho |
| **Standard-IA** | $0.014 | 30 days | 128 KB | $0.01/GB | Backup, monthly reports |
| **One Zone-IA** | $0.011 | 30 days | 128 KB | $0.01/GB | Re-creatable data (thumbnails, transcoded copies) |
| **Glacier Instant Retrieval** | $0.005 | 90 days | 128 KB | $0.03/GB | Quarterly-access archives, medical images |
| **Glacier Flexible Retrieval** | $0.004 | 90 days | 40 KB | $0.01-0.03/GB + per-request | Backups, 1-5 min (expedited) se 5-12 hrs |
| **Glacier Deep Archive** | $0.00099 | 180 days | 40 KB | $0.02/GB | 7-saal compliance retention |
| **Express One Zone** | ~$0.11 | 1 hour | 512 KB | Free | ML training, checkpoints, hot cache |

**Intelligent-Tiering** ka mechanism: object 30 din access na ho to Infrequent Access tier me chala jaata hai (automatic), 90 din me Archive Instant Access me. Optional deep tiers bhi enable kar sakte ho (90/180 days). Access hote hi wapas Frequent tier me aa jaata hai, **koi retrieval fee nahi**. Cost: **$0.0025 per 1,000 objects per month** monitoring fee.

> 💡 **Gotcha:** **Minimum billable object size** ka trap. Standard-IA me 128 KB ka minimum hai — matlab agar tumhare paas 10 KB ke 1 million objects hain, to tum **128 KB × 1M** ke liye pay karoge, 10 GB ke bajaye 128 GB ke liye. Standard me wahi 10 GB × $0.025 = $0.25 hota, IA me 128 GB × $0.014 = $1.79. **IA "sasta" hone ke bajaye 7× mehnga ho gaya.** Chhote objects ke liye Standard hi rakho, ya unhe compact karke bade objects banao.

---

**Q9: S3 ki consistency model kya hai?**

**December 2020 se S3 me strong read-after-write consistency hai**, saare operations par, saare regions me, bina kisi extra cost ya performance penalty ke.

Matlab:
- PUT karke turant GET karo → naya data milega (nayi object ho ya overwrite ho)
- DELETE karke turant GET karo → 404 milega
- PUT karke turant LIST karo → object dikhega

Pehle (2020 se pehle) sirf naye objects par read-after-write consistency thi, aur overwrites/deletes **eventually consistent** the. Log workarounds likhte the — DynamoDB me consistency layer, retry loops, S3Guard (EMR ka feature). Wo sab ab bekaar hai.

Kyun ye badla: eventual consistency data lake workloads ke liye correctness bug tha. Spark job ne file likhi, agla stage usse padhne gaya, file nahi mili — silent data loss. AWS ne apne metadata subsystem ko redesign karke strong consistency di.

> 💡 **Gotcha:** Strong consistency **object data** par hai, **bucket-level configuration** par nahi. Bucket policy, lifecycle rules, replication config, CORS — ye abhi bhi **eventually consistent** hain aur propagate hone me seconds lag sakte hain. CI/CD me bucket policy laga ke turant test karoge to flaky hoga. Aur bucket delete karke usi naam se turant naya banane me `BucketAlreadyExists` ya weird errors mil sakte hain — kuch minute wait karo.

---

**Q10: Object size ki limits kya hain?**

| Limit | Value |
|---|---|
| Minimum object size | **0 bytes** |
| Maximum object size | **50 TB** (Dec 2025 se; pehle 5 TB) |
| Single PUT me maximum | **5 GB** |
| Console se upload maximum | **160 GB** |
| Multipart: max parts | **10,000** |
| Multipart: part size | **5 MiB – 5 GiB** (last part ka koi minimum nahi) |
| Multipart me theoretical max | 10,000 × 5 GiB = **48.8 TiB (~53.7 TB)** |
| Key length | **1,024 bytes** UTF-8 |
| User metadata | **2 KB** total |

Note: docs "50 TB" kehte hain lekin actual multipart math 48.8 TiB deta hai — dono numbers same cheez hain, alag units me.

50 TB ke liye AWS **Common Runtime (CRT)** aur S3 Transfer Manager use karne ko kehta hai, kyunki normal SDK code itne bade uploads efficiently handle nahi karta.

> 💡 **Gotcha:** **100 MB se bade objects ke liye multipart use karo**, chahe single PUT allowed ho (5 GB tak). Kyun: single PUT me network glitch aane par **poora upload dobara** karna padta hai. 4 GB upload 95% par fail ho gaya = 4 GB dobara. Multipart me sirf wo ek part retry hoga. `@aws-sdk/lib-storage` ka `Upload` class ye automatically karta hai — raw `PutObjectCommand` nahi karta.

---

**Q11: Versioning kya hai aur enable karne se pehle kya sochna chahiye?**

Versioning on karne ke baad, har overwrite ya delete purani copy ko rakhta hai apne unique **version ID** ke saath.

```bash
aws s3api put-bucket-versioning --bucket jmfs-reports \
  --versioning-configuration Status=Enabled

aws s3api list-object-versions --bucket jmfs-reports --prefix 2026/aug.csv
```

**Delete behaviour:** versioned bucket me `DeleteObject` actually delete nahi karta — wo ek **delete marker** daal deta hai jo latest version ban jaata hai. Object "gayab" ho jaata hai normal GET me, lekin sab versions maujood hain. Delete marker hata do, object wapas aa jaayega.

Actually delete karne ke liye version ID specify karna padta hai:
```bash
aws s3api delete-object --bucket jmfs-reports --key 2026/aug.csv \
  --version-id "3HL4kqtJlcpXroDTDmjVBH40Nrjfkd"
```

States: `Unversioned` (default) → `Enabled` → `Suspended`. **Enabled se wapas Unversioned nahi ja sakte** — sirf Suspended kar sakte ho, aur purane versions phir bhi rahenge (aur bill aata rahega).

> 💡 **Gotcha:** Versioning **silently bill badha deta hai** aur log mahino baad pata karte hain. Ek 1 GB file jo roz overwrite hoti hai = 30 GB/month storage after a month. Aur `aws s3 ls` sirf current versions dikhata hai — purane versions invisible hain. Versioning enable karo to **turant lifecycle rule bhi lagao**:
> ```json
> { "NoncurrentVersionExpiration": { "NoncurrentDays": 30, "NewerNoncurrentVersions": 3 } }
> ```
> Aur `ExpiredObjectDeleteMarker: true` bhi, warna orphaned delete markers jamā hote rahenge.

---

**Q12: Multipart upload kaise kaam karta hai?**

Teen steps:
```
1. CreateMultipartUpload  → UploadId milta hai
2. UploadPart × N          → har part ka ETag milta hai (parallel ho sakta hai)
3. CompleteMultipartUpload → sab ETags bhejo, S3 assemble karta hai
   (ya AbortMultipartUpload → sab parts discard)
```

Fayde:
- **Parallel upload** — throughput multiply hota hai
- **Resumable** — network toota to sirf failed part retry
- **Streaming** — total size pata na ho tab bhi upload shuru kar sakte ho
- **Pause/resume** — initiate karne ke baad koi expiry nahi

Node me (SDK v3) — manually mat karo, `lib-storage` use karo:
```typescript
import { Upload } from "@aws-sdk/lib-storage";
const upload = new Upload({
  client: s3,
  params: { Bucket: "jmfs-reports", Key: "big.zip", Body: readStream },
  queueSize: 4,              // parallel parts
  partSize: 10 * 1024 * 1024, // 10 MB
  leavePartsOnError: false,
});
upload.on("httpUploadProgress", p => console.log(p.loaded, "/", p.total));
await upload.done();
```

> 💡 **Gotcha:** **Incomplete multipart uploads ka storage bill aata hai aur wo LIST me dikhte hi nahi.** Agar tumhara upload fail hua aur abort nahi hua, wo parts hamesha ke liye storage lete rehte hain — invisible. Maine aise buckets dekhe hain jinme "0 objects" the aur 2 TB ka bill aa raha tha. **Har bucket par ye lifecycle rule day-1 se lagao:**
> ```json
> { "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 } }
> ```
> Existing garbage check karne ke liye: `aws s3api list-multipart-uploads --bucket X`

---

**Q13: Presigned URL kya hai aur kab use karte hain?**

Presigned URL ek temporary signed URL hai jo bina AWS credentials ke ek specific operation allow karta hai.

```typescript
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";

const url = await getSignedUrl(s3,
  new GetObjectCommand({ Bucket: "jmfs-reports", Key: "2026/aug.csv" }),
  { expiresIn: 900 }  // 15 minutes
);
// → https://jmfs-reports.s3.ap-south-1.amazonaws.com/2026/aug.csv?X-Amz-Algorithm=...
```

Use cases:
1. **Private file download** — user ko file dena bina bucket public kiye. Tumhara Node API auth check karta hai, phir 15-min URL deta hai.
2. **Direct browser upload** — user ka file tumhare server ke through jaane ke bajaye seedha S3 me jaaye. Bandwidth aur latency dono bachte hain.
3. **Third-party ko temporary access**

Expiry limits: IAM user credentials se signed URL max **7 days**. Temporary credentials (role session) se signed URL **credentials ke expire hone tak** valid — matlab typically 1 ghanta, chahe tum `expiresIn: 604800` likho.

> 💡 **Gotcha:** Presigned URL ki permissions **signer** ki permissions hain, requester ki nahi. Agar tumhara Lambda role poore bucket ko read kar sakta hai aur tum galat key ke liye URL bana do, to user wo file padh lega. **Key ko kabhi user input se directly mat lo** — path traversal (`../../other-tenant/data.csv`) ka risk hai. Hamesha server-side validate karo ki key us user ke tenant prefix ke andar hai. Aur ye bhi yaad rakho: URL **share ho sakta hai** — jisko bhi milega wo use karega, koi additional auth nahi hai.

---

**Q14: Bucket public kaise hota hai, aur Block Public Access kya hai?**

Public access do tareeke se aa sakta hai: **bucket/object ACL** (legacy) ya **bucket policy** with `"Principal": "*"`.

**Block Public Access (BPA)** ek override layer hai — 4 independent switches:

| Setting | Kya karta hai |
|---|---|
| `BlockPublicAcls` | Naye public ACLs banane se rokta hai (PUT reject) |
| `IgnorePublicAcls` | Existing public ACLs ko ignore karta hai |
| `BlockPublicPolicy` | Public bucket policy set karne se rokta hai |
| `RestrictPublicBuckets` | Public policy ko sirf AWS service principals aur authorized users tak limit karta hai |

**April 2023 se naye buckets me BPA default ON hai aur ACLs default disabled hain.** Ye AWS ka sabse important security default change tha — usse pehle countless data breaches sirf "someone made a bucket public" ki wajah se hue the.

BPA **account level** par bhi set kar sakte ho — phir koi bhi bucket public nahi ho sakta, chahe koi kuch bhi kare:
```bash
aws s3control put-public-access-block --account-id 123456789012 \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

> 💡 **Gotcha:** Log static website hosting ke liye BPA off kar dete hain. **Ye ab zaroori nahi hai.** Sahi tareeka: BPA **on** rakho, bucket private rakho, aur **CloudFront + Origin Access Control (OAC)** lagao. CloudFront bucket policy me allowed hota hai (service principal + SourceArn condition ke saath), user CloudFront se aata hai, bucket kabhi public nahi hota. Bonus: CDN caching aur WAF bhi mil jaata hai. Bucket ko public karna 2026 me almost hamesha galti hai.

---

**Q15: S3 vs EBS vs EFS — kaunsa kab?**

| | **S3** | **EBS** | **EFS** |
|---|---|---|---|
| Type | Object | Block | File (NFS) |
| Access | HTTP API | Attach to 1 EC2 (mostly) | Mount on many EC2 |
| Latency | ~100-200 ms | ~0.1-1 ms | ~1-3 ms |
| Throughput | Very high (parallel) | Up to ~4 GB/s (io2 Block Express) | Scales with size |
| Capacity | Unlimited | Up to 64 TiB per volume | Unlimited |
| Partial writes | ❌ Nahi | ✅ Haan | ✅ Haan |
| Durability | 11 nines, multi-AZ | 99.8-99.9%, single AZ | 11 nines, multi-AZ |
| Price (ap-south-1 approx) | $0.025/GB-mo | gp3 ~$0.092/GB-mo | ~$0.36/GB-mo (Standard) |
| Backup | Built-in (versioning) | Snapshots | Backup service |

Decision:
- **Database ka data file, OS boot volume, koi cheez jisme random writes hon** → EBS
- **Shared filesystem jahan multiple instances ek saath likhen (legacy apps, WordPress uploads, CMS)** → EFS
- **User uploads, backups, logs, data lake, static assets, koi bhi write-once-read-many data** → S3

> 💡 **Gotcha:** Log EFS ko "S3 ka mountable version" samajh lete hain aur EFS par sab kuch daal dete hain — phir bill dekh ke chaunk jaate hain. EFS S3 se **~14× mehnga** hai. Agar tumhe sirf isliye EFS chahiye ki tumhara legacy code `fs.readFile()` use karta hai, to **Mountpoint for Amazon S3** dekho — wo S3 ko FUSE se mount kar deta hai (read-heavy workloads ke liye). Poora rewrite kiye bina S3 pricing mil jaati hai.

---

### 🟡 Q16–Q40 — Configuration, Networking, Security (Intermediate)

**Q16: Lifecycle policy kaise likhte hain aur kya-kya kar sakti hai?**

Lifecycle rules do cheezein karti hain: **transition** (storage class badalna) aur **expiration** (delete karna).

```json
{
  "Rules": [
    {
      "ID": "ReportsArchival",
      "Status": "Enabled",
      "Filter": {
        "And": {
          "Prefix": "reports/",
          "ObjectSizeGreaterThan": 131072,
          "Tags": [{ "Key": "Retention", "Value": "long" }]
        }
      },
      "Transitions": [
        { "Days": 30,  "StorageClass": "STANDARD_IA" },
        { "Days": 90,  "StorageClass": "GLACIER_IR" },
        { "Days": 365, "StorageClass": "DEEP_ARCHIVE" }
      ],
      "Expiration": { "Days": 2555 }
    },
    {
      "ID": "CleanupNoncurrentVersions",
      "Status": "Enabled",
      "Filter": {},
      "NoncurrentVersionExpiration": { "NoncurrentDays": 30, "NewerNoncurrentVersions": 3 },
      "Expiration": { "ExpiredObjectDeleteMarker": true }
    },
    {
      "ID": "AbortStuckUploads",
      "Status": "Enabled",
      "Filter": {},
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}
```

Rules:
- Standard → Standard-IA me **minimum 30 din** wait karna padta hai
- Transitions ek hi direction me jaati hain (Standard → IA → Glacier), ulta nahi
- **Har transition ka per-object charge hai** — Standard-IA me ~$0.01/1,000 objects, Glacier classes me ~$0.05/1,000 ⚠️ verify
- Lifecycle asynchronous hai — "Days: 30" ka matlab 30 din baad *eventually*, exact 30.0 din nahi
- Maximum **1,000 rules per bucket**

> 💡 **Gotcha:** Chhote objects ko Glacier me transition karna **paisa barbaad** karta hai. 10 KB ka object Glacier Deep Archive me: storage $0.00099 × 0.04 GB (40 KB minimum billable) = $0.00004/month, lekin transition ka charge $0.00005 hai — **ek hi baar ka transition charge 1+ mahine ke storage se zyada hai**. Plus Glacier har object par **32-40 KB ka metadata overhead** charge karta hai. Isliye lifecycle rule me hamesha `ObjectSizeGreaterThan` filter lagao — typically 128 KB ya usse zyada.

---

**Q17: Intelligent-Tiering kaise kaam karta hai — kab worth hai?**

Intelligent-Tiering objects ko access pattern ke hisaab se automatically tiers me move karta hai:

```
        Object PUT
             │
             ▼
   ┌─────────────────────┐  30 din access nahi   ┌──────────────────────┐
   │  Frequent Access    │ ────────────────────► │  Infrequent Access   │
   │  $0.025/GB          │ ◄──────────────────── │  $0.0138/GB          │
   └─────────────────────┘   access hote hi       └──────────┬───────────┘
                             turant wapas                     │ 90 din
                             (koi fee nahi)                   ▼
                                                  ┌──────────────────────┐
                                                  │ Archive Instant      │
                                                  │ Access $0.005/GB     │
                                                  └──────────┬───────────┘
                                                             │ optional
                                    ┌────────────────────────┴──────────┐
                                    ▼                                   ▼
                          Archive Access (90+ d)           Deep Archive Access (180+ d)
                          (opt-in, retrieval time lagta)   (opt-in)

   Monitoring fee: $0.0025 per 1,000 objects per month
```

Break-even math: monitoring fee $0.0025/1,000 objects/month = **$0.0000025 per object per month**. Standard aur IA ka difference $0.025 − $0.0138 = **$0.0112 per GB per month**.

Ek object ke liye worth hai agar: `object_size_GB × $0.0112 > $0.0000025`
→ object size > **0.000223 GB = ~228 KB**

Practical rule: **agar tumhare average object 250 KB se bade hain to Intelligent-Tiering worth hai. Chhote objects par ye loss hai.** (AWS ne 128 KB se chhote objects ko monitoring fee se exempt kar diya hai, lekin wo Frequent tier me hi rehte hain — koi savings nahi.)

> 💡 **Gotcha:** Intelligent-Tiering ka main fayda ye hai ki **koi retrieval fee nahi** (Frequent/Infrequent/Archive Instant tiers me). Standard-IA me har GB padhne ka $0.01 lagta hai. Agar tumhara access pattern unpredictable hai, to IA me manually daalna backfire kar sakta hai — ek unexpected full-dataset scan aur retrieval fees storage savings se zyada ho jaayengi. Intelligent-Tiering us risk ko khatam karta hai. Ye "insurance premium" ki tarah socho.

---

**Q18: Encryption ke kitne options hain?**

**January 2023 se S3 me saare naye objects default me SSE-S3 se encrypted hote hain**, bina kuch kiye. Options:

| Type | Key kaun manage karta | Cost | Kab use karo |
|---|---|---|---|
| **SSE-S3** (`AES256`) | AWS, poori tarah | Free | Default. 90% cases |
| **SSE-KMS** | Tum (KMS CMK) | $1/key/mo + $0.03/10k requests | Audit trail chahiye, key rotation control, compliance |
| **DSSE-KMS** | Tum, **double encryption** | SSE-KMS × 2 | Sirf specific government/defense requirements |
| **SSE-C** | Tum, key har request me bhejte ho | Free | Tumhe key AWS ko dena hi nahi hai |
| **Client-side** | Tum, S3 pahunchne se pehle encrypt | Free | Zero-trust, S3 ko plaintext kabhi nahi dikhta |

**S3 Bucket Keys** — SSE-KMS ke saath ye **zaroor** enable karo:
```bash
aws s3api put-bucket-encryption --bucket jmfs-pii \
  --server-side-encryption-configuration '{
    "Rules":[{
      "ApplyServerSideEncryptionByDefault":{
        "SSEAlgorithm":"aws:kms",
        "KMSMasterKeyID":"arn:aws:kms:ap-south-1:123:key/abc"
      },
      "BucketKeyEnabled": true
    }]}'
```
Bucket Key ek short-lived bucket-level key generate karta hai jo KMS calls ko **99% tak kam** kar deta hai. Ek million objects encrypt karne me KMS cost $3.00 se ~$0.03 ho jaata hai.

> 💡 **Gotcha:** SSE-KMS use kar rahe ho to consumer ko **`kms:Decrypt` permission bhi chahiye** us key par — sirf `s3:GetObject` kaafi nahi. Ye AccessDenied ka classic reason hai jab bucket policy bilkul theek dikhti hai. Aur cross-account me KMS key ki **key policy** me bhi doosre account ko allow karna padta hai. Debug karte waqt error message dekho — agar `KMS.NotFoundException` ya `AccessDenied` KMS ka mention kare, to problem S3 me nahi hai.

---

**Q19: Object Ownership aur ACLs ka kya chakkar hai?**

Historically S3 me **ACLs** the — per-object aur per-bucket permission grants, IAM se alag system. Ye pre-IAM era ka legacy hai (2006 me IAM tha hi nahi).

Problem: cross-account writes me object ka **owner writer account** hota tha, bucket owner nahi. Matlab Account A ne tumhare bucket me file daali — tum (bucket owner) usko padh nahi sakte the! Workaround tha writer ko `x-amz-acl: bucket-owner-full-control` bhejna, jo log bhool jaate the.

**Object Ownership** setting (3 options):
- **Bucket owner enforced** (default naye buckets me, April 2023 se) — **ACLs poori tarah disabled**, bucket owner automatically har object ka owner. Ye chahiye.
- **Bucket owner preferred** — ACLs enabled, lekin `bucket-owner-full-control` ACL wale objects bucket owner ke ho jaate hain
- **Object writer** — purana behaviour, writer owner hota hai

```bash
aws s3api put-bucket-ownership-controls --bucket jmfs-reports \
  --ownership-controls '{"Rules":[{"ObjectOwnership":"BucketOwnerEnforced"}]}'
```

> 💡 **Gotcha:** ACLs disable karne ke baad koi bhi request jo ACL set karne ki koshish kare wo **`AccessControlListNotSupported` (400)** se fail hogi. Purane SDKs, purane scripts, aur bahut se third-party tools (backup software, CMS plugins) automatically `--acl private` bhejte hain — aur wo **ab toot jaayenge**, chahe `private` ACL harmless hai. Migration ke waqt apne code me `ACL:` parameter grep karo aur hatao. Terraform ke `aws_s3_bucket_acl` resources bhi hatane padenge.

---

**Q20: Object Lock (WORM) kya hai — compliance ke liye kaise use karte hain?**

Object Lock objects ko delete/overwrite hone se rokta hai ek fixed time tak. Ye SEBI/RBI/SEC 17a-4 jaise regulations ke liye banaya gaya hai — financial services me ye relevant hai.

**Do modes:**

| | **Governance mode** | **Compliance mode** |
|---|---|---|
| Retention badal sakte ho? | Haan, agar `s3:BypassGovernanceRetention` ho | **Nahi. Koi nahi.** |
| Object delete ho sakta? | Special permission se haan | **Nahi. Root bhi nahi. AWS bhi nahi.** |
| Retention kam kar sakte ho? | Haan | **Nahi** — sirf badha sakte ho |
| Kab use | Internal policy enforcement | Regulatory requirement |

**Legal Hold** alag hai — retention period se independent, indefinite hold jab tak koi `s3:PutObjectLegalHold` se hataye nahi.

```bash
# Bucket par enable — VERSIONING PEHLE ON HONA CHAHIYE, aur ye IRREVERSIBLE hai
aws s3api create-bucket --bucket jmfs-compliance --object-lock-enabled-for-bucket \
  --region ap-south-1 --create-bucket-configuration LocationConstraint=ap-south-1

# Default retention
aws s3api put-object-lock-configuration --bucket jmfs-compliance \
  --object-lock-configuration '{"ObjectLockEnabled":"Enabled",
    "Rule":{"DefaultRetention":{"Mode":"COMPLIANCE","Years":7}}}'

# Per-object
aws s3api put-object-retention --bucket jmfs-compliance --key trade-log.csv \
  --retention '{"Mode":"COMPLIANCE","RetainUntilDate":"2033-08-06T00:00:00Z"}'
```

> 💡 **Gotcha:** **COMPLIANCE mode literally irreversible hai.** Agar tumne galti se 100 TB data par 7-saal ka compliance lock laga diya, to tum 7 saal tak us storage ka bill bharoge. Delete karne ka koi tareeka nahi — bucket delete nahi hoga, account close karne par bhi AWS us data ko retention tak rakhega. Ye AWS ka intentional design hai (warna WORM ka matlab hi nahi rehta). **Hamesha pehle GOVERNANCE mode me test karo**, ek chhote test bucket me, aur automation me compliance mode dene se pehle triple-check karo.

---

**Q21: Replication (CRR/SRR) kaise setup karte hain aur kya requirements hain?**

**CRR** = Cross-Region Replication, **SRR** = Same-Region Replication.

Requirements:
1. **Source aur destination dono par versioning ON** — mandatory
2. Ek **IAM role** jise S3 assume kar sake
3. Replication configuration bucket par

```json
{
  "Role": "arn:aws:iam::123456789012:role/S3ReplicationRole",
  "Rules": [{
    "ID": "ReplicateToDR",
    "Priority": 1,
    "Status": "Enabled",
    "Filter": { "Prefix": "critical/" },
    "DeleteMarkerReplication": { "Status": "Enabled" },
    "Destination": {
      "Bucket": "arn:aws:s3:::jmfs-reports-dr",
      "StorageClass": "STANDARD_IA",
      "ReplicationTime": { "Status": "Enabled", "Time": { "Minutes": 15 } },
      "Metrics": { "Status": "Enabled", "EventThreshold": { "Minutes": 15 } },
      "Account": "999988887777",
      "AccessControlTranslation": { "Owner": "Destination" }
    }
  }]
}
```

**S3 RTC (Replication Time Control)** — SLA deta hai ki **99.99% objects 15 minute me** replicate honge, plus CloudWatch metrics. Extra cost: **$0.015 per GB** replicated ⚠️ verify.

Use cases: DR, data residency (ek copy India me, ek Singapore me), latency (users ke paas copy), aur compliance separation (logs ko alag account me).

> 💡 **Gotcha:** Replication **sirf naye objects par** lagti hai — configuration lagane se pehle ke objects replicate **nahi** honge. Purana data copy karne ke liye **S3 Batch Replication** alag se chalana padta hai. Aur by default **delete markers replicate nahi hote** (explicitly enable karna padta hai), aur **version deletes kabhi replicate nahi hote** — ye intentional hai taaki source par accidental delete DR copy ko na maare. Ye "DR bucket empty kyun hai" ka #1 reason hai.

---

**Q22: Event notifications kaise setup karte hain — kaunsa target kab?**

S3 object events par trigger de sakta hai. Targets: **SNS, SQS, Lambda, EventBridge**.

```json
{
  "LambdaFunctionConfigurations": [{
    "Id": "ProcessUploads",
    "LambdaFunctionArn": "arn:aws:lambda:ap-south-1:123:function:Processor",
    "Events": ["s3:ObjectCreated:*"],
    "Filter": { "Key": { "FilterRules": [
      { "Name": "prefix", "Value": "uploads/" },
      { "Name": "suffix", "Value": ".csv" }
    ]}}
  }]
}
```

Event types: `s3:ObjectCreated:*` (Put, Post, Copy, CompleteMultipartUpload), `s3:ObjectRemoved:*`, `s3:ObjectRestore:*`, `s3:Replication:*`, `s3:LifecycleTransition`, `s3:LifecycleExpiration`, `s3:ObjectTagging:*`.

**Target kaunsa:**
- **SQS** — buffering chahiye, retry chahiye, consumer apni speed se process kare. Sabse robust. Tumhare Bull/RabbitMQ ka equivalent.
- **Lambda** — turant lightweight processing. Direct invoke.
- **SNS** — fan-out, multiple subscribers.
- **EventBridge** — sabse flexible: advanced filtering, multiple targets, cross-account routing, archive/replay. **Naye designs me ye prefer karo.**

> 💡 **Gotcha:** Native S3 notifications (SNS/SQS/Lambda) me **do same-scope rules overlap nahi kar sakte** — same prefix+suffix par do configurations dogeee to `Configurations overlap` error milega. Aur ye configuration **poori replace** hoti hai, append nahi — do alag CDK stacks ek hi bucket par notification lagayenge to doosra pehle ko mita dega. **EventBridge is problem ko poori tarah solve karta hai** (bucket par ek switch on karo, phir jitne chaho rules banao). Multi-team environments me EventBridge hi sahi answer hai.

---

**Q23: CORS configuration kab aur kaise?**

Agar browser se directly S3 par request ja rahi hai (presigned upload, ya JS se fetch), to CORS chahiye — warna browser block kar dega.

```json
[{
  "AllowedOrigins": ["https://app.jmfinancial.com"],
  "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag", "x-amz-request-id", "x-amz-version-id"],
  "MaxAgeSeconds": 3000
}]
```

`ExposeHeaders` critical hai — bina uske browser JS `ETag` nahi padh sakta, aur multipart upload me tumhe har part ka ETag chahiye hota hai. Ye Angular/React se direct multipart upload karte waqt sabse common bug hai.

> 💡 **Gotcha:** CORS **sirf browsers** par lagta hai. Node se request kar rahe ho to CORS ka koi matter nahi — agar CORS error dikh raha hai to problem browser me hai, server me nahi. Aur `"AllowedOrigins": ["*"]` production me mat likhna — koi bhi website tumhare presigned URLs ko apne page se hit kar sakti hai. Aur CORS config eventually consistent hai — change karke turant test mat karo, ek minute do.

---

**Q24: S3 endpoints — path style aur virtual-hosted style ka fark?**

```
Virtual-hosted style:  https://bucket-name.s3.region.amazonaws.com/key
Path style:            https://s3.region.amazonaws.com/bucket-name/key
```

AWS ne path-style ko **deprecate** kar diya hai naye buckets ke liye (Sept 2020 ke baad banaye gaye buckets). Purane buckets par abhi bhi kaam karta hai, lekin naye code me virtual-hosted use karo.

Kyun deprecate: virtual-hosted style me bucket name DNS me hai, jisse AWS traffic ko bucket-specific infrastructure par route kar sakta hai bina HTTP path parse kiye. Ye load balancing aur scaling ke liye better hai.

Node SDK v3 me virtual-hosted default hai. Force karna ho:
```typescript
const s3 = new S3Client({ region: "ap-south-1", forcePathStyle: true });  // MinIO/LocalStack ke liye
```

> 💡 **Gotcha:** `forcePathStyle: true` sirf **local development** ke liye chahiye — MinIO ya LocalStack ke saath, jahan wildcard DNS nahi hai. Log ise production config me chhod dete hain aur phir naye buckets par `PermanentRedirect` errors aate hain. Environment-specific config me rakho.

---

**Q25: Gateway endpoint aur Interface endpoint me kya fark hai — kaunsa use karo?**

Ye S3 ka sabse bada **cost gotcha** hai aur bahut kam log jaante hain.

| | **Gateway endpoint** | **Interface endpoint (PrivateLink)** |
|---|---|---|
| Mechanism | Route table entry + prefix list | ENI per AZ, private IP |
| **Cost** | **FREE** | **~$0.01/hr per AZ + $0.01/GB** |
| On-prem se access | ❌ Nahi | ✅ Haan (Direct Connect/VPN se) |
| Cross-region | ❌ Nahi | ✅ Haan (limited) |
| DNS | S3 public DNS, route se private | Private DNS names |
| Security groups | ❌ Nahi lagti | ✅ Lagti hain |
| Setup | Route table me add | ENI provision |

**Decision:** agar tumhara traffic **VPC ke andar se** aa raha hai to **gateway endpoint** use karo. Wo free hai. Interface endpoint sirf tab jab on-premises se private access chahiye ho, ya cross-region.

```bash
# Gateway endpoint — free, 30 seconds ka kaam
aws ec2 create-vpc-endpoint \
  --vpc-id vpc-0abc123 \
  --service-name com.amazonaws.ap-south-1.s3 \
  --vpc-endpoint-type Gateway \
  --route-table-ids rtb-0aaa rtb-0bbb
```

Aur ye **paisa bhi bachata hai**: gateway endpoint ke bina, private subnet se S3 traffic NAT gateway se jaata hai = **$0.045/GB NAT processing charge**. 10 TB/month traffic = **$450/month** sirf NAT ke, jo gateway endpoint se **$0** ho jaata hai.

> 💡 **Gotcha:** Gateway endpoint banane ke baad tumhe **route tables me add karna padta hai** — sirf endpoint bana dene se kuch nahi hota. Aur agar tumne kuch subnets ki route table me add kiya aur kuch me nahi, to app AZ ke hisaab se kabhi kaam karega kabhi nahi — flaky behaviour jo debug karna painful hai. `--route-table-ids` me **sab** relevant route tables do.

---

**Q26: VPC endpoint policy kya hai aur data exfiltration kaise rokte hain?**

Financial services me common requirement: "hamare VPC se koi apne personal S3 bucket me data nahi bhej sake."

VPC endpoint par apni policy lagti hai:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowOnlyOwnOrgBuckets",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "*",
    "Condition": {
      "StringEquals": { "aws:ResourceOrgID": "o-a1b2c3d4e5" }
    }
  }]
}
```

Ab is endpoint se sirf tumhari organization ke buckets access ho sakte hain. Koi developer apne personal AWS account ka bucket use nahi kar sakta.

Complementary side — bucket policy me VPC lock:
```json
{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": ["arn:aws:s3:::jmfs-pii", "arn:aws:s3:::jmfs-pii/*"],
  "Condition": {
    "StringNotEquals": { "aws:SourceVpce": "vpce-0abc123def456" },
    "Bool": { "aws:PrincipalIsAWSService": "false" }
  }
}
```

Dono milkar bidirectional control dete hain: endpoint policy kehti hai "yahan se sirf hamare buckets", bucket policy kehti hai "is bucket par sirf hamare endpoint se".

> 💡 **Gotcha:** Bucket policy me VPCE lock lagane ke baad **tum console se bucket access nahi kar paoge** (console tumhare laptop se aata hai). Aur agar `Principal: "*"` + `Deny` likha hai to ye **root user par bhi** lagta hai. Recovery ke liye VPC ke andar se EC2 chahiye. **Hamesha ek escape hatch rakho:**
> ```json
> "StringNotLike": { "aws:PrincipalArn": "arn:aws:iam::123:role/BreakGlassAdmin" }
> ```

---

**Q27: S3 Access Points kya hain aur kab kaam aate hain?**

Ek bucket par multiple named endpoints, har ek ki apni policy aur network origin.

Problem jo ye solve karta hai: ek shared data lake bucket hai jisme 15 teams ka data hai. Ek hi bucket policy me sab teams ki permissions likhoge to wo **20 KB limit** hit kar jaayegi aur unreadable ho jaayegi.

```bash
aws s3control create-access-point \
  --account-id 123456789012 \
  --bucket jmfs-datalake \
  --name payments-team \
  --vpc-configuration VpcId=vpc-0abc123 \
  --policy file://ap-policy.json
```

Access point ARN: `arn:aws:s3:ap-south-1:123456789012:accesspoint/payments-team`

Har team apne access point se aati hai, apni policy ke saath. Bucket policy sirf ek line rehti hai (access points ko delegate karo). Aur `--vpc-configuration` lagane se wo access point **sirf us VPC se** accessible hoga — internet se bilkul nahi.

Bucket policy delegation:
```json
{
  "Effect": "Allow",
  "Principal": { "AWS": "*" },
  "Action": "*",
  "Resource": ["arn:aws:s3:::jmfs-datalake", "arn:aws:s3:::jmfs-datalake/*"],
  "Condition": { "StringEquals": { "s3:DataAccessPointAccount": "123456789012" } }
}
```

**Multi-Region Access Points** ek step aage hain — ek global endpoint jo automatically nearest region ke bucket par route karta hai, active-active replication ke saath.

> 💡 **Gotcha:** Access point policy **bucket policy ko replace nahi karti** — dono evaluate hoti hain. Bucket policy me delegation statement zaroori hai, warna access point kuch nahi kar payega. Aur bucket policy ka **20 KB limit** hai — bade multi-team setups me ye limit hit hoti hai, aur wahi access points ka main reason hai. Ek bucket par **10,000 access points** ban sakte hain.

---

**Q28: Bucket policy, IAM policy, aur ACL — evaluation kaise hoti hai?**

Order (S3-specific):

```
1. Block Public Access  → anonymous/public grant hai? BLOCK. Baaki sab bekaar.
2. SCP / RCP            → Organizations level Deny? khatam.
3. VPC endpoint policy  → endpoint se aa rahe ho to ye bhi
4. Koi bhi explicit Deny → DENY
5. Allow chahiye:
   - Same account: bucket policy YA IAM policy (OR)
   - Cross account: bucket policy AUR IAM policy (AND)
   - Anonymous: sirf bucket policy/ACL
6. ACL (agar enabled hain — ab default nahi)
```

Bucket policy example (least-privilege, TLS enforce ke saath):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::jmfs-reports", "arn:aws:s3:::jmfs-reports/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::jmfs-reports/*",
      "Condition": {
        "StringNotEquals": { "s3:x-amz-server-side-encryption": "aws:kms" }
      }
    },
    {
      "Sid": "AllowAppRole",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::123456789012:role/ReportServiceRole" },
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::jmfs-reports/2026/*"
    }
  ]
}
```

> 💡 **Gotcha:** Bucket policy ka **maximum size 20 KB** hai. Aur `"Principal": "*"` + `Deny` **sabpe** lagta hai including root — is se khud ko lock out karna bahut aasan hai. Deny statements likhte waqt `NotPrincipal` mat use karo (wo counterintuitive hai), balki `Condition` me `StringNotEquals aws:PrincipalArn` use karo.

---

**Q29: `s3:ListBucket` aur `s3:GetObject` ke ARN alag kyun hote hain?**

Kyunki ye do alag **resource types** par operate karte hain:

| Action | Resource type | ARN |
|---|---|---|
| `s3:ListBucket` | Bucket | `arn:aws:s3:::bucket` |
| `s3:GetBucketLocation` | Bucket | `arn:aws:s3:::bucket` |
| `s3:GetBucketPolicy` | Bucket | `arn:aws:s3:::bucket` |
| `s3:PutBucketPolicy` | Bucket | `arn:aws:s3:::bucket` |
| `s3:GetObject` | Object | `arn:aws:s3:::bucket/*` |
| `s3:PutObject` | Object | `arn:aws:s3:::bucket/*` |
| `s3:DeleteObject` | Object | `arn:aws:s3:::bucket/*` |
| `s3:GetObjectVersion` | Object | `arn:aws:s3:::bucket/*` |
| `s3:ListAllMyBuckets` | Account-wide | `*` |

Prefix-level restriction (per-tenant isolation):
```json
[
  {
    "Effect": "Allow",
    "Action": "s3:ListBucket",
    "Resource": "arn:aws:s3:::jmfs-tenants",
    "Condition": { "StringLike": { "s3:prefix": ["tenant-42/*", "tenant-42"] } }
  },
  {
    "Effect": "Allow",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::jmfs-tenants/tenant-42/*"
  }
]
```

> 💡 **Gotcha:** `s3:prefix` condition **sirf ListBucket par** kaam karti hai, `GetObject` par bilkul nahi. `GetObject` ko restrict karne ka ek hi tareeka hai — **Resource ARN me hi prefix likhna**. Log dono jagah `s3:prefix` lagate hain aur sochte hain isolation ho gaya, jabki actually koi bhi tenant kisi bhi doosre tenant ki file `GetObject` se padh sakta hai. Financial services me ye ek serious audit finding hai. Test karo: doosre tenant ki known key ko `aws s3api get-object` se hit karke dekho.

---

**Q30: TLS aur encryption in transit kaise enforce karte hain?**

S3 HTTP aur HTTPS dono accept karta hai. HTTP block karne ke liye bucket policy me explicit deny lagana padta hai:

```json
{
  "Sid": "DenyInsecureTransport",
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": ["arn:aws:s3:::jmfs-reports", "arn:aws:s3:::jmfs-reports/*"],
  "Condition": { "Bool": { "aws:SecureTransport": "false" } }
}
```

Minimum TLS version bhi enforce kar sakte ho:
```json
"Condition": {
  "NumericLessThan": { "s3:TlsVersion": 1.2 }
}
```

CDK me ek line: `enforceSSL: true` — ye pehla wala statement automatically add kar deta hai.

> 💡 **Gotcha:** AWS **default me HTTP allow karta hai** — ye compliance auditors ko turant dikhta hai. Har bucket par ye policy chahiye. Aur `aws:SecureTransport` sirf **transport** cover karta hai, storage nahi — encryption at rest alag setting hai. Dono chahiye. Ek aur baat: `s3:TlsVersion` condition key relatively nayi hai; agar tumhare purane clients TLS 1.1 par hain to unhe pehle upgrade karo, warna production toot jaayega.

---
**Q31: Cross-account access kaise dete hain — aur object ownership ka problem kya tha?**

Do tareeke:

**Tareeka 1 — Bucket policy (direct access):**
```json
{
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::999988887777:role/PartnerReader" },
  "Action": ["s3:GetObject", "s3:ListBucket"],
  "Resource": ["arn:aws:s3:::jmfs-shared", "arn:aws:s3:::jmfs-shared/*"]
}
```
Plus doosre account ki identity policy me bhi same permissions. **Cross-account me DONO chahiye — ye AND hai.**

**Tareeka 2 — Role assumption:** doosra account tumhara role assume kare, phir wo tumhare account ka principal ban jaata hai aur normal same-account rules lagti hain. Cleaner audit trail, aur ek jagah permissions.

**Ownership ka purana problem:** Account A ne tumhare bucket me object daala → object ka owner A tha, tum (bucket owner) usse padh nahi sakte the. Writer ko `x-amz-acl: bucket-owner-full-control` bhejna padta tha. **Ab ye khatam ho gaya** — naye buckets me "Bucket owner enforced" default hai, ACLs disabled hain, aur bucket owner automatically har object ka owner hota hai.

> 💡 **Gotcha:** Agar bucket **SSE-KMS** se encrypted hai to cross-account me teen cheezein chahiye: (1) bucket policy me allow, (2) doosre account ki IAM policy me allow, (3) **KMS key policy me doosre account ko `kms:Decrypt` allow**. Teesra bhoolna sabse common hai — error `AccessDenied` aata hai jo bucket policy ka lagta hai lekin actually KMS ka hai. Error message me KMS ka mention dhoondho.

---

**Q32: MFA Delete kya hai aur ye kaise enable karte hain?**

MFA Delete versioned bucket par ek extra layer hai — version permanently delete karne ya versioning suspend karne ke liye MFA code chahiye.

**Ye sirf root user hi enable kar sakta hai, aur sirf CLI/API se — console se nahi.**

```bash
aws s3api put-bucket-versioning --bucket jmfs-compliance \
  --versioning-configuration Status=Enabled,MFADelete=Enabled \
  --mfa "arn:aws:iam::123456789012:mfa/root-account-mfa-device 123456"
```

Kyun sirf root: kyunki agar koi IAM user isko enable/disable kar sakta, to attacker jo us user ko compromise kare wo pehle MFA Delete off karke phir sab delete kar deta. Root ko involve karke AWS ne is control ko IAM compromise se independent bana diya.

> 💡 **Gotcha:** MFA Delete **operationally painful** hai — har delete ke liye root ka MFA code chahiye, matlab automation kaam nahi karegi. Aur root credentials ko roz use karna khud ek anti-pattern hai. **Modern alternative: Object Lock (Governance mode)** — wo IAM permissions se control hota hai (`s3:BypassGovernanceRetention`), automation-friendly hai, aur similar protection deta hai. MFA Delete sirf tab use karo jab regulator specifically maange.

---

**Q33: Server access logs aur CloudTrail data events me kya fark hai?**

Dono S3 access log karte hain, lekin alag tareeke se:

| | **Server access logs** | **CloudTrail data events** |
|---|---|---|
| Format | Space-delimited text | JSON |
| Destination | Doosra S3 bucket | CloudTrail (S3/CloudWatch Logs) |
| Delivery | Best-effort, ghanton ka delay | ~5-15 minutes |
| Cost | Sirf storage (log delivery free) | **$0.10 per 100,000 events** |
| Detail | HTTP-level (status, bytes, turnaround time, referrer) | IAM-level (principal ARN, error code, encryption context) |
| Completeness | Best-effort — kuch requests miss ho sakte hain | Guaranteed delivery |
| Alerting/automation | Mushkil | Easy (EventBridge, Athena, Security Hub) |

**Kab kaunsa:** compliance aur security investigation ke liye **CloudTrail data events** (guaranteed, IAM-aware). Traffic analysis, billing attribution, aur debugging ke liye **server access logs** (sasta, HTTP-level detail).

Financial services me typically dono chahiye — CloudTrail sensitive buckets par (selective, cost control ke liye), server access logs sab par.

> 💡 **Gotcha:** Server access logs **kabhi usi bucket me mat bhejo** jiske logs le rahe ho — infinite loop ban jaayega (log likhna ek event hai jo log generate karta hai). Aur CloudTrail data events **sab buckets par on karna mehnga hai**. Advanced event selectors se sirf sensitive prefixes par lagao:
> ```bash
> aws cloudtrail put-event-selectors --trail-name main --advanced-event-selectors '[{
>   "Name":"PII only",
>   "FieldSelectors":[
>     {"Field":"eventCategory","Equals":["Data"]},
>     {"Field":"resources.type","Equals":["AWS::S3::Object"]},
>     {"Field":"resources.ARN","StartsWith":["arn:aws:s3:::jmfs-client-pii/"]}]}]'
> ```

---

**Q34: S3 par ABAC (tag-based access) kaise karte hain?**

S3 me **object tags** hote hain (10 tags per object) jinpar policy conditions lag sakti hain.

```json
{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::jmfs-datalake/*",
  "Condition": {
    "StringEquals": {
      "s3:ExistingObjectTag/Team": "${aws:PrincipalTag/Team}"
    }
  }
}
```

Yaani: principal ka `Team` tag object ke `Team` tag se match kare tabhi access. Ek policy jo saari teams ke liye kaam karti hai.

Related condition keys: `s3:ExistingObjectTag/<key>` (existing object par), `s3:RequestObjectTag/<key>` (PUT me bheja gaya tag), `s3:RequestObjectTagKeys` (kaun se tag keys bheje).

**Nov 2025 me S3 ne native attribute-based access control add ki** ⚠️ verify — isse ye pattern aur clean ho gaya hai.

> 💡 **Gotcha:** ABAC bina **tag governance** ke security theatre hai. Agar koi apne object par `Team: finance` tag laga sakta hai to wo finance ka access le lega. Tagging permissions lock karo:
> ```json
> { "Effect": "Deny", "Action": ["s3:PutObjectTagging", "s3:DeleteObjectTagging"],
>   "Resource": "*",
>   "Condition": { "ForAnyValue:StringEquals": { "s3:RequestObjectTagKeys": ["Team", "DataClass"] } } }
> ```
> Aur object tags ka **paisa lagta hai**: ~$0.01 per 10,000 tags per month ⚠️ verify. Millions of objects par ye add up hota hai.

---

**Q35: S3 me kaunse 8 meters se paisa lagta hai?**

| # | Meter | Rate (ap-south-1 approx, ⚠️ verify) |
|---|---|---|
| 1 | **Storage** | $0.025/GB-mo (Standard) → $0.00099 (Deep Archive) |
| 2 | **Requests** | PUT/COPY/POST/LIST: $0.005/1,000<br>GET/SELECT: $0.0004/1,000 |
| 3 | **Data transfer OUT** | Internet: first 100 GB/mo free, phir $0.1093/GB<br>Cross-region: ~$0.086/GB |
| 4 | **Retrieval** | Standard-IA $0.01/GB, Glacier IR $0.03/GB, Deep Archive $0.02/GB |
| 5 | **Lifecycle transitions** | ~$0.01/1,000 (to IA), ~$0.05/1,000 (to Glacier) |
| 6 | **Management** | Inventory ~$0.0025/million objects, Storage Lens advanced ~$0.20/million objects, Analytics ~$0.10/million |
| 7 | **Replication** | Destination storage + cross-region transfer + RTC ($0.015/GB) |
| 8 | **Acceleration / extras** | Transfer Acceleration ~$0.04/GB extra, S3 Select scanned/returned bytes, Object Lambda |

**Hamesha free:**
- Data transfer **IN** (upload), koi bhi amount
- Same-region transfer to EC2/Lambda/Glue **agar gateway endpoint ke through jaaye**
- DELETE aur CancelMultipartUpload requests
- Data transfer to CloudFront

> 💡 **Gotcha:** "Same region me free hai" **poori tarah sach nahi**. Private subnet se S3 traffic agar **NAT gateway** se ja raha hai to NAT ka **$0.045/GB processing charge** lagta hai. 10 TB/month = **$450/month** — S3 se nahi, NAT se. Gateway endpoint (jo free hai) lagane se ye zero ho jaata hai. Ye har company me milta hai aur koi notice nahi karta kyunki bill "NAT Gateway" line item me chhupa hota hai, "S3" me nahi.

---

**Q36: Minimum storage duration aur minimum billable object size kya hai?**

Ye do alag traps hain jo mil kar bade bills banate hain.

**Minimum storage duration** — object ko us class me itne din rakhna hi padega, chahe pehle delete kar do:

| Class | Minimum duration |
|---|---|
| Standard | Koi nahi |
| Intelligent-Tiering | Koi nahi |
| Standard-IA / One Zone-IA | **30 days** |
| Glacier Instant Retrieval | **90 days** |
| Glacier Flexible Retrieval | **90 days** |
| Glacier Deep Archive | **180 days** |
| Express One Zone | **1 hour** |

Agar tumne Deep Archive me object daala aur 10 din baad delete kiya, to bhi **180 din ka bill** aayega.

**Minimum billable object size:**

| Class | Minimum billable |
|---|---|
| Standard, Intelligent-Tiering | Actual size |
| Standard-IA, One Zone-IA, Glacier IR | **128 KB** |
| Glacier FR, Deep Archive | **40 KB** (+ ~32 KB metadata overhead per object) |
| Express One Zone | **512 KB** |

> 💡 **Gotcha:** Ye do milkar **lifecycle rules ko backfire** kara dete hain. Scenario: 50 KB ke 5 million log files hain, tumne lifecycle se Deep Archive me bhej diya "cost bachane ke liye". Reality: 5M × 40 KB minimum + 5M × 32 KB metadata = ~343 GB billable jabki actual data 238 GB hai, **plus** 5M transitions × $0.05/1,000 = **$250 ek baar**, **plus** 180 din ka minimum lock. Aur Standard me rakhne ka cost tha 238 GB × $0.025 = **$5.95/month**. Tumne $250 kharch karke $6/month wali cheez ko $0.34/month kiya — payback period **44 mahine**. Chhote objects ko archive class me daalne se pehle math karo.

---

**Q37: Retrieval fees aur retrieval times kya hain Glacier classes me?**

| Class | Retrieval tiers | Time | Cost/GB ⚠️ verify |
|---|---|---|---|
| Standard-IA | — | Instant | $0.01 |
| One Zone-IA | — | Instant | $0.01 |
| Glacier Instant Retrieval | — | Instant (ms) | $0.03 |
| **Glacier Flexible Retrieval** | Expedited | 1–5 min | ~$0.03 + $10/1,000 requests |
| | Standard | 3–5 hours | ~$0.01 |
| | Bulk | 5–12 hours | **Free** |
| **Glacier Deep Archive** | Standard | ~12 hours | ~$0.02 |
| | Bulk | ~48 hours | ~$0.0025 |

Glacier FR aur Deep Archive me object **directly readable nahi hota** — pehle `RestoreObject` karna padta hai, jo ek temporary copy Standard me banata hai (jitne din tum specify karo).

```bash
aws s3api restore-object --bucket jmfs-archive --key 2019/trades.csv \
  --restore-request '{"Days":7,"GlacierJobParameters":{"Tier":"Standard"}}'

# Status check
aws s3api head-object --bucket jmfs-archive --key 2019/trades.csv
# → "Restore": "ongoing-request=\"true\""  ya  "ongoing-request=\"false\", expiry-date=..."
```

> 💡 **Gotcha:** Restore ke dauraan tum **dono ke liye pay karte ho** — Glacier ka storage AUR temporary Standard copy ka storage, un `Days` tak. Aur agar galti se poora 50 TB archive restore kar diya "just to check", to Standard tier par $0.01/GB × 50,000 GB = **$500 retrieval** + restored copy ka storage. Restore ko **hamesha specific keys tak scope** karo, `--recursive` se bacho, aur `Days` minimum rakho. S3 Batch Operations use karo bulk restore ke liye taaki tumhe progress aur cost visibility mile.

---

**Q38: Bucket aur object ki actual limits kya hain — kaunsi soft, kaunsi hard?**

**Adjustable (soft):**

| Cheez | Default | Maximum |
|---|---|---|
| **General purpose buckets per account** | **10,000** | **1,000,000** (Service Quotas se) |
| Access points per bucket | 10,000 | — |
| Multi-Region Access Points per account | 100 | — |

Note: pehle 2,000 buckets free hain; **2,000 se upar ek chhota monthly fee** lagta hai per bucket ⚠️ verify. Aur agar quota 10,000 se upar hai to `ListBuckets` ko **paginated** hi karna padega — unpaginated requests reject ho jaayenge.

**Hard limits:**

| Cheez | Limit |
|---|---|
| Objects per bucket | **Unlimited** |
| Total data per bucket | **Unlimited** |
| Object size | 0 bytes – **50 TB** (48.8 TiB) |
| Single PUT | 5 GB |
| Console upload | 160 GB |
| Multipart parts | 10,000 |
| Part size | 5 MiB – 5 GiB |
| Key length | 1,024 bytes |
| User metadata | 2 KB |
| Bucket name | 3–63 chars |
| **Bucket policy size** | **20 KB** |
| Lifecycle rules per bucket | 1,000 |
| CORS rules per bucket | 100 |
| Object tags | 10 per object |
| Bucket tags | 50 |
| Event notification configurations | 100 |
| Replication rules per bucket | 1,000 |
| `ListObjectsV2` max keys per response | 1,000 |
| `ListParts` / `ListMultipartUploads` max | 1,000 |

> 💡 **Gotcha:** Bucket quota **sirf us-east-1 se** view/manage hota hai (commercial regions ke liye), chahe tumhare buckets ap-south-1 me hon. Service Quotas console me region us-east-1 par switch karo warna S3 dikhega hi nahi. Aur **bucket delete hone ke baad naam turant free nahi hota** — kuch minute/ghante lag sakte hain global DNS propagation me, isliye delete-and-recreate scripts flaky hote hain.

---

**Q39: S3 ka request rate limit kya hai aur wo kaise scale hota hai?**

Per **partitioned prefix**:
- **3,500** PUT / COPY / POST / DELETE requests per second
- **5,500** GET / HEAD requests per second

**Bucket me prefixes ki koi limit nahi hai** — matlab tum prefixes badha kar linearly scale kar sakte ho. 10 prefixes = 35,000 writes/sec, 55,000 reads/sec.

Important: "prefix" ka matlab yahan **S3 ka internal partition** hai, na ki tumhara logical folder. S3 traffic pattern dekh kar automatically partitions split karta hai. Ye **automatic** hai, lekin **instant nahi** — split hone me 30-60 minutes lag sakte hain.

```
Bura key design (sequential — sab ek partition par):
  logs/2026-08-06T09:14:22-001.json
  logs/2026-08-06T09:14:22-002.json
  logs/2026-08-06T09:14:23-001.json
  → sab "logs/2026-08-06" prefix par → ek partition → throttle at 3,500/s

Acha key design (high-cardinality prefix pehle):
  logs/a3f9/2026-08-06T09:14:22-001.json
  logs/7b2e/2026-08-06T09:14:22-002.json
  logs/c1d8/2026-08-06T09:14:23-001.json
  → 4-hex-char prefix = 65,536 possible partitions
```

Ye exactly wahi problem hai jo SQL Server me **sequential clustered index par hotspot** hoti hai — sab inserts last page par, page latch contention. Solution bhi same hai: key ko distribute karo.

> 💡 **Gotcha:** Ye limit **automatically badhti hai** jab S3 sustained traffic dekhta hai — lekin ramp-up ke dauraan tum `503 SlowDown` khaoge. Agar tum ek naye prefix par sudden 20,000 req/s daaloge to pehle kuch minute throttle hoga. Solution: (a) exponential backoff with jitter (SDK default me hai), (b) traffic gradually ramp karo, (c) agar predictable spike hai to AWS Support ko pehle se batao. Aur **retry ke bina tumhara pipeline data drop kar dega** — SDK ka default `maxAttempts: 3` production ke liye kam hai, `maxAttempts: 5-8` set karo.

---

**Q40: S3 ka throughput kaise maximize karte hain?**

Bottlenecks aur unke fixes:

**1. Single connection throughput** — ek TCP connection typically **~85-100 MB/s** tak jaati hai. Isse zyada chahiye to **parallel connections** chahiye.

**2. Bade objects — multipart parallel:**
```typescript
const upload = new Upload({
  client: s3, params: { Bucket, Key, Body: stream },
  queueSize: 8,                    // 8 parallel parts
  partSize: 16 * 1024 * 1024,      // 16 MB each
});
```

**3. Bade downloads — byte-range GET:**
```typescript
// 1 GB file ko 8 parallel chunks me padho
const CHUNK = 128 * 1024 * 1024;
const parts = await Promise.all(
  Array.from({ length: 8 }, (_, i) =>
    s3.send(new GetObjectCommand({
      Bucket, Key, Range: `bytes=${i * CHUNK}-${(i + 1) * CHUNK - 1}`
    }))
  )
);
```

**4. Bahut sare chhote objects** — request rate bottleneck hai, bandwidth nahi. Prefixes distribute karo aur concurrency badhao.

**5. AWS Common Runtime (CRT)** — SDK ka native transfer layer, jo automatic parallelization, adaptive part sizing, aur connection pooling karta hai. 50 TB objects ke liye AWS explicitly ye recommend karta hai.

**6. Same region me raho** — cross-region GET latency ~200ms extra add karta hai plus transfer cost.

**7. S3 Express One Zone** — latency-bound workloads ke liye (ML training checkpoints, hot cache). ~10× kam latency, lekin 4.4× mehnga storage.

> 💡 **Gotcha:** Log Lambda se S3 padhte hain aur sochte hain slow hai. Actually Lambda ka **network bandwidth memory ke saath scale karta hai** — 128 MB Lambda ko bahut kam bandwidth milti hai. Agar tumhara Lambda S3 se bada data padh raha hai to memory 1,769 MB (1 vCPU) ya usse zyada karo. Ye counter-intuitive hai: **zyada memory dene se cost kam ho sakta hai** kyunki execution time bahut kam ho jaata hai.

---

### 🔴 Q41–Q80 — Advanced, Failure Modes, Integration (Advanced)

**Q41: `AccessDenied` aaya — systematically kaise debug karoge?**

S3 ka AccessDenied 6 alag layers se aa sakta hai. Order me check karo:

```bash
# 1. Main kaun hoon?
aws sts get-caller-identity

# 2. Block Public Access to nahi block kar raha? (anonymous access ke liye)
aws s3api get-public-access-block --bucket jmfs-reports
aws s3control get-public-access-block --account-id 123456789012

# 3. Bucket policy kya kehti hai?
aws s3api get-bucket-policy --bucket jmfs-reports --query Policy --output text | jq .

# 4. Meri identity policy?
aws iam list-attached-role-policies --role-name MyRole
aws iam simulate-principal-policy \
  --policy-source-arn arn:aws:iam::123:role/MyRole \
  --action-names s3:GetObject \
  --resource-arns arn:aws:s3:::jmfs-reports/2026/aug.csv

# 5. Encryption ka issue to nahi? (SSE-KMS)
aws s3api get-bucket-encryption --bucket jmfs-reports
aws kms get-key-policy --key-id <key-id> --policy-name default

# 6. Object ownership / ACL
aws s3api get-bucket-ownership-controls --bucket jmfs-reports

# 7. VPC endpoint policy (agar VPC se aa rahe ho)
aws ec2 describe-vpc-endpoints --vpc-endpoint-ids vpce-0abc123 \
  --query 'VpcEndpoints[0].PolicyDocument'

# 8. SCP (org management account se)
aws organizations list-policies-for-target --target-id 123456789012 \
  --filter SERVICE_CONTROL_POLICY
```

**Checklist for the 5 most common causes:**
1. `ListBucket` ka ARN me `/*` laga diya (ya `GetObject` me nahi lagaya)
2. SSE-KMS hai aur `kms:Decrypt` missing hai
3. Cross-account hai aur sirf ek side configure kiya
4. Block Public Access anonymous access ko block kar raha hai
5. Bucket policy me koi purana `Deny` statement hai (aksar VPCE ya IP restriction)

> 💡 **Gotcha:** S3 kabhi-kabhi `AccessDenied` deta hai jab actual problem **object exist hi nahi karta**. Ye intentional hai — agar tumhare paas `s3:ListBucket` permission nahi hai, to S3 tumhe `404 NoSuchKey` nahi batata (wo information leak hoga: "is key ka object nahi hai" bhi ek fact hai). Wo `403 AccessDenied` deta hai. Isliye jab tum sure ho ki permissions theek hain, **key spelling check karo** — case-sensitive hai, aur trailing spaces bhi count hote hain.

---

**Q42: Common S3 errors ki full list aur unka matlab?**

| Error | HTTP | Kya galat hai | Fix |
|---|---|---|---|
| `AccessDenied` | 403 | Authorization, **ya** object exist nahi + no ListBucket | Q41 checklist |
| `NoSuchBucket` | 404 | Bucket nahi hai — ya galat region | Region check karo |
| `NoSuchKey` | 404 | Key nahi hai (tumhare paas ListBucket hai) | Key spelling, case-sensitivity |
| `PermanentRedirect` | 301 | Galat region ka endpoint | `AWS_REGION` sahi karo |
| `SlowDown` | 503 | Request rate limit hit | Backoff + prefix distribute |
| `ServiceUnavailable` | 503 | Transient S3 issue | Retry with backoff |
| `InternalError` | 500 | S3 side ka error | Retry — ye retryable hai |
| `RequestTimeTooSkewed` | 403 | **Clock skew >15 min** | NTP sync karo |
| `SignatureDoesNotMatch` | 403 | Signature galat — aksar clock, ya special chars in key | Clock, phir key encoding |
| `EntityTooLarge` | 400 | Single PUT me >5 GB | Multipart use karo |
| `EntityTooSmall` | 400 | Multipart part <5 MiB (last part ke alawa) | Part size badhao |
| `InvalidPart` / `InvalidPartOrder` | 400 | Complete me ETags galat ya out of order | Part numbers ascending do |
| `NoSuchUpload` | 404 | UploadId invalid ya already aborted | Naya multipart shuru karo |
| `BucketAlreadyExists` | 409 | Naam duniya me kisi aur ne le rakha hai | Doosra naam |
| `BucketAlreadyOwnedByYou` | 409 | Tumhara hi bucket hai | Idempotent — ignore kar sakte ho |
| `BucketNotEmpty` | 409 | Delete se pehle khaali karo (versions + MPUs bhi) | Sab versions delete karo |
| `InvalidObjectState` | 403 | Glacier object, restore nahi kiya | `restore-object` chalao |
| `AccessControlListNotSupported` | 400 | ACLs disabled hain, code ACL bhej raha hai | Code se `ACL:` hatao |
| `KMS.KMSInvalidStateException` | 400 | KMS key disabled ya pending deletion | Key enable karo |
| `PreconditionFailed` | 412 | Conditional write ki condition fail | Expected — retry logic |
| `MethodNotAllowed` | 405 | Object Lock ne delete block kiya | Retention check karo |

> 💡 **Gotcha:** `RequestTimeTooSkewed` par log ghanton credentials debug karte hain. **Pehle `date -u` chalao.** S3 ±15 minute skew tolerate karta hai. Docker containers jo suspend/resume hue, VMs, aur galat timezone wale systems — ye sabse common culprits hain. Compare karo: `curl -sI https://s3.ap-south-1.amazonaws.com | grep -i date`

---

**Q43: `503 SlowDown` production me aa raha hai — kya karoge?**

Ye request-rate throttling hai. Systematic response:

**Immediate (aaj):**
```typescript
import { S3Client } from "@aws-sdk/client-s3";
const s3 = new S3Client({
  region: "ap-south-1",
  maxAttempts: 8,                          // default 3 — production ke liye kam hai
  retryMode: "adaptive",                   // client-side rate limiting bhi karta hai
});
```
`adaptive` mode SDK ko throttling detect karke khud rate kam karne deta hai — ye `standard` se better hai jab tum consistently limit ke paas ho.

**Short term (is hafte):**
- Concurrency limit karo apni side se (p-limit, semaphore)
- Traffic ko gradually ramp karo, sudden burst se bacho
- Metrics dekho: CloudWatch me `5xxErrors` aur `AllRequests` — ratio nikaalo

**Long term (architecture fix):**
- **Key prefixes distribute karo** (Q39). Hash prefix add karo.
- **LIST calls kam karo** — LIST sabse mehnga aur slow hai. S3 Inventory use karo (daily report) ya object index DynamoDB/SQL me rakho.
- **Bade objects banao** — 1,000 chhote files ke bajaye 1 bada file. Data lake me ye "small files problem" hai.
- **CloudFront lagao** read-heavy workload par — cache hit S3 tak pahunchti hi nahi.

> 💡 **Gotcha:** Sabse common hidden cause **LIST in a loop** hai:
> ```typescript
> // ❌ Har object ke liye ek LIST — 1M objects = 1M LIST calls
> for (const id of ids) {
>   const r = await s3.send(new ListObjectsV2Command({ Bucket, Prefix: `data/${id}/` }));
> }
> ```
> Ye na sirf throttle karega, balki **$0.005/1,000 × 1M = $5** ka bill bhi banayega ek run me. Agar tumhe pata hai key kya hai to `HeadObject` (GET pricing, 12× sasta) use karo, ya index maintain karo.

---

**Q44: Accidental deletion se kaise recover karte hain?**

Layers of protection, sabse light se sabse heavy:

**Layer 1 — Versioning** (minimum, har production bucket par):
```bash
# Delete marker hatao, object wapas
aws s3api delete-object --bucket jmfs-reports --key 2026/aug.csv \
  --version-id "<delete-marker-version-id>"
```

**Layer 2 — Lifecycle me noncurrent version retention** — 30+ din purane versions rakho.

**Layer 3 — Cross-account replication** — DR copy ek **alag account** me. Ye ransomware/insider threat ke against sabse strong hai, kyunki compromised account us copy tak pahunch hi nahi sakta.

**Layer 4 — Object Lock (Governance)** — delete ke liye special permission chahiye.

**Layer 5 — Object Lock (Compliance)** — koi delete nahi kar sakta, period.

**Layer 6 — AWS Backup for S3** — managed backup with point-in-time restore.

Bulk restore ke liye S3 Batch Operations:
```bash
aws s3control create-job --account-id 123456789012 \
  --operation '{"S3DeleteObjectTagging":{}}' \
  --manifest file://manifest.json --report file://report.json \
  --priority 10 --role-arn arn:aws:iam::123:role/BatchOpsRole
```

> 💡 **Gotcha:** Versioning tumhe **accidental delete** se bachati hai, lekin **malicious delete** se nahi — agar attacker ke paas `s3:DeleteObjectVersion` hai to wo versions bhi mita sakta hai. Isliye production me ye policy statement rakho:
> ```json
> { "Effect": "Deny", "Principal": "*", "Action": "s3:DeleteObjectVersion",
>   "Resource": "arn:aws:s3:::jmfs-reports/*",
>   "Condition": { "StringNotLike": { "aws:PrincipalArn": "arn:aws:iam::123:role/BreakGlass*" } } }
> ```
> Aur cross-account replication ke bina tumhara "backup" usi blast radius me hai jisme original.

---

**Q45: Conditional writes kya hain aur concurrency kaise handle karte hain?**

2024-2025 me S3 ne concurrency primitives add kiye — isse pehle S3 me koi atomic compare-and-swap nahi tha.

**Conditional PUT (Aug 2024)** — sirf tab likho jab object exist na kare:
```typescript
await s3.send(new PutObjectCommand({
  Bucket: "jmfs-locks", Key: "job-4471.lock",
  Body: JSON.stringify({ owner: hostname, at: Date.now() }),
  IfNoneMatch: "*",     // ← agar object hai to 412 PreconditionFailed
}));
```
Ye distributed lock / idempotency key ke liye use hota hai.

**Conditional overwrite (Nov 2024)** — sirf tab likho jab ETag match kare (optimistic locking):
```typescript
await s3.send(new PutObjectCommand({
  Bucket, Key, Body: newContent,
  IfMatch: currentETag,   // koi aur ne beech me badla? 412.
}));
```

**Conditional delete (Sep 2025)** aur **conditional copy (Oct 2025)** bhi ab available hain.

Ye SQL me `UPDATE ... WHERE version = @expected` jaisa hai — optimistic concurrency control, bilkul wahi pattern.

Node me handle karna:
```typescript
try {
  await s3.send(new PutObjectCommand({ Bucket, Key, Body, IfMatch: etag }));
} catch (e: any) {
  if (e.name === "PreconditionFailed") {
    // Kisi aur ne beech me likh diya — read karo, merge karo, retry karo
  } else throw e;
}
```

> 💡 **Gotcha:** **Bina conditional writes ke, S3 me "last writer wins" hai** — do concurrent PUTs ka result non-deterministic hai aur **koi error nahi milta**, ek silently lost ho jaata hai. Agar tumhara code S3 ko mutable state ke liye use kar raha hai (counters, aggregates, config) to tumhe conditional writes chahiye, warna tum silent data loss ke saath jee rahe ho. Purana code jo 2024 se pehle likha gaya hai usme ye guard nahi hoga — audit kar lena.

---

**Q46: S3 ko database ki tarah use kar sakte ho?**

Nahi — aur ye kyun nahi, ye samajhna zaroori hai:

| Database chahiye | S3 deta hai? |
|---|---|
| Transactions (multi-object ACID) | ❌ Bilkul nahi |
| Secondary indexes | ❌ Sirf key prefix scan |
| Query by content | ⚠️ S3 Select (limited), ya Athena (alag service) |
| Sub-10ms latency | ❌ ~100-200ms (Express One Zone me ~5-10ms) |
| Partial updates | ❌ Poora object rewrite |
| Row-level locking | ⚠️ Ab conditional writes se limited support |
| High write throughput on one key | ❌ Ek key par ek waqt me ek write |

**Sahi pattern — hybrid:**
```
┌───────────────────────────────────────────────────────────────┐
│  METADATA (SQL Server / DynamoDB)   │  BYTES (S3)             │
├─────────────────────────────────────┼─────────────────────────┤
│  DocumentId, ClientPAN, UploadedAt, │  s3://jmfs-docs/        │
│  DocType, Status, S3Key ───────────►│    2026/08/abc123.pdf   │
│                                     │                          │
│  Indexed, queryable, transactional  │  Cheap, durable, big    │
└───────────────────────────────────────────────────────────────┘
```
Metadata DB me (jahan indexes aur transactions hain), bytes S3 me (jahan sasta aur unlimited hai). `S3Key` foreign key ka kaam karta hai.

Tumhare Orange Migration jaise projects me exactly yahi pattern chahiye — PII ka index/search Elasticsearch me, actual documents S3 me encrypted.

> 💡 **Gotcha:** Log S3 ko "sasta database" samajh kar JSON files me state rakhte hain. Phir do problems aati hain: (1) **koi transaction nahi** — do concurrent updates me ek silently lost, (2) **query karne ke liye poora object padhna padta hai** — 1 field chahiye to bhi 10 MB download. Agar tumhe query karna hai to DynamoDB ($1.25 per million writes) S3 se **sasta** ho sakta hai jab objects chhote hain, kyunki S3 me har PUT $0.005/1,000 = $5 per million hai. S3 chhote frequent writes ke liye mehnga hai.

---

**Q47: S3 aur Lambda ka integration kaise kaam karta hai?**

**Push model (S3 → Lambda):**
```json
{
  "LambdaFunctionConfigurations": [{
    "LambdaFunctionArn": "arn:aws:lambda:ap-south-1:123:function:Processor",
    "Events": ["s3:ObjectCreated:*"],
    "Filter": { "Key": { "FilterRules": [{ "Name": "suffix", "Value": ".csv" }] } }
  }]
}
```
Lambda ko resource policy chahiye:
```bash
aws lambda add-permission --function-name Processor \
  --statement-id s3-invoke --action lambda:InvokeFunction \
  --principal s3.amazonaws.com \
  --source-arn arn:aws:s3:::jmfs-uploads \
  --source-account 123456789012
```

**Robust model (S3 → SQS → Lambda)** — production me ye prefer karo:
```
S3 ──event──► SQS ──event source mapping──► Lambda
                │
                └──► DLQ (failed messages)
```
Kyun better: SQS buffering deta hai (traffic spike Lambda ko nahi maarta), retries built-in hain, DLQ hai, aur tum batch size control kar sakte ho.

**S3 Object Lambda** — GET request ke beech me Lambda chalao jo response transform kare (PII redaction, format conversion, watermarking) bina original object badle.

> 💡 **Gotcha:** Direct S3 → Lambda me **kuch events silently drop ho sakte hain** agar Lambda throttle ho jaaye aur retries exhaust ho jaayein. S3 ka retry limited hai. Aur **circular trigger** ka trap: Lambda usi bucket me output likhta hai jispar trigger laga hai → infinite loop → thousands of dollars in hours. Ye har company me ek baar hota hai. Prevention: **alag input aur output buckets** use karo, ya prefix filter lagao aur output alag prefix me daalo. Aur Lambda par reserved concurrency limit lagao as a circuit breaker.

---

**Q48: S3 + CloudFront ka sahi setup kya hai?**

**Origin Access Control (OAC)** — ye ab sahi tareeka hai (purana OAI deprecated hai).

```
User ──► CloudFront edge (cached) ──OAC-signed──► S3 (private)
             │
             └── WAF, custom domain, TLS cert, compression
```

Bucket policy:
```json
{
  "Effect": "Allow",
  "Principal": { "Service": "cloudfront.amazonaws.com" },
  "Action": "s3:GetObject",
  "Resource": "arn:aws:s3:::jmfs-assets/*",
  "Condition": {
    "StringEquals": {
      "AWS:SourceArn": "arn:aws:cloudfront::123456789012:distribution/E1ABCDEFGH"
    }
  }
}
```

Bucket **poori tarah private** rehta hai. Block Public Access on rehta hai.

**Cost benefit:** CloudFront se data transfer out **S3 direct se sasta** hai (~$0.109/GB India edge vs $0.1093/GB S3 direct — comparable), lekin asli fayda ye hai ki **S3 se CloudFront tak transfer FREE hai** aur cached requests S3 tak pahunchti hi nahi. 80% cache hit ratio = 80% kam S3 GET requests + 80% kam origin transfer.

> 💡 **Gotcha:** SPA (Angular/React) host kar rahe ho to **`index.html` ko cache mat karo** (ya bahut chhota TTL do), warna users purana app version dekhte rahenge deploy ke baad. Hashed assets (`main.a3f9c1.js`) ko lamba TTL do — wo immutable hain. Aur SPA routing ke liye CloudFront me **custom error response** chahiye: 403/404 → `/index.html` with 200 status, warna deep links toot jaayenge. Ye Angular deploy karte waqt sabse common issue hai.

---

**Q49: Athena, Glue, aur data lake ke saath S3 kaise judta hai?**

Modern data lake:
```
        ┌──────────── S3 (storage layer) ────────────┐
        │  s3://jmfs-lake/raw/          (JSON/CSV)   │
        │  s3://jmfs-lake/curated/      (Parquet)    │
        │  s3://jmfs-lake/aggregated/   (Parquet)    │
        └────────────────┬───────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   Glue Catalog     Athena           EMR / Glue ETL
   (schema)         (SQL, serverless) (Spark jobs)
                         │
                         ▼
                   QuickSight / BI
```

Athena pricing: **$5 per TB scanned**. Isliye optimization ka sara focus "kam data scan karo" par hai:

1. **Partitioning** — Hive-style paths:
   ```
   s3://jmfs-lake/trades/year=2026/month=08/day=06/data.parquet
   ```
   `WHERE year=2026 AND month=08` sirf us partition ko scan karega.
2. **Parquet/ORC** — columnar format. CSV se **10-100× kam** scan. Ek query jo 3 columns padhti hai wo sirf 3 columns scan karti hai.
3. **Compression** — Snappy (fast) ya ZSTD (better ratio).
4. **File size** — 128 MB – 1 GB per file ideal. Chhote files = overhead.

Tumhare SQL Server experience se mapping: partitioning = **partitioned tables**, Parquet = **columnstore index**, Glue Catalog = **system catalog/schema**.

> 💡 **Gotcha:** **"Small files problem"** data lake ka #1 killer hai. Agar tumhara streaming pipeline har minute ek 50 KB file likhta hai, to ek saal me **525,600 files** ban jaayengi. Athena ki query time file count ke saath linearly badhti hai — 500k files par ek simple query minutes le sakti hai, aur S3 LIST calls ka bill alag. Fix: **compaction job** chalao (daily Glue job jo chhote files ko 128 MB+ me merge kare), ya **S3 Tables** use karo jo automatic compaction karta hai.

---

**Q50: S3 se OpenSearch/Elasticsearch me data kaise laate hain?**

Tumhare Elasticsearch background ke liye — patterns:

**Pattern 1 — S3 → Lambda → OpenSearch bulk API** (small/medium volume):
```typescript
// S3 event par trigger
const obj = await s3.send(new GetObjectCommand({ Bucket, Key }));
const lines = (await obj.Body!.transformToString()).split("\n");
const bulkBody = lines.flatMap(line => [
  { index: { _index: "trades-2026-08" } },
  JSON.parse(line),
]);
await osClient.bulk({ body: bulkBody, refresh: false });
```

**Pattern 2 — S3 → Kinesis Firehose → OpenSearch** (high volume) — Firehose buffering, retries, aur backup-to-S3 khud handle karta hai.

**Pattern 3 — OpenSearch snapshots to S3** (backup/restore):
```bash
PUT _snapshot/s3-repo
{ "type": "s3", "settings": { "bucket": "jmfs-os-snapshots",
  "region": "ap-south-1", "role_arn": "arn:aws:iam::123:role/OpenSearchSnapshotRole" } }
```

**Pattern 4 — UltraWarm / Cold storage** — OpenSearch Service purane indices ko automatically S3 me move kar deta hai. UltraWarm S3-backed hai with local caching, Cold pure S3. Ye tumhare self-hosted Elastic se bada fayda hai — wahan tumhe hot data ke liye hi disk provision karna padta tha.

> 💡 **Gotcha:** Self-hosted Elasticsearch me tum snapshot repository ko koi bhi shared filesystem bana sakte the. OpenSearch Service me **S3 repository register karne ke liye IAM role ko domain se link karna padta hai** aur wo registration call **SigV4-signed HTTP request** honi chahiye — plain `curl` se nahi hoti. Ye setup step logon ko atkata hai. Python `requests-aws4auth` ya Node me `@aws-sdk/signature-v4` use karo.

---

**Q51: S3 Express One Zone kab worth hai?**

| | **S3 Standard** | **S3 Express One Zone** |
|---|---|---|
| First-byte latency | ~100-200 ms | **~5-10 ms** |
| Storage | $0.025/GB-mo (ap-south-1) | ~$0.11/GB-mo ⚠️ verify |
| Requests | $0.005/1k PUT, $0.0004/1k GET | **Much cheaper** (Apr 2025 me 85% GET, 55% PUT cut) |
| AZs | ≥3 | **1** |
| Namespace | Flat | **Hierarchical** (real directories) |
| Bucket type | General purpose | **Directory bucket** |
| Versioning, replication, lifecycle | ✅ | ⚠️ Limited/absent |

**Break-even ka asli logic storage par nahi, requests par hai.** Express One Zone ka storage 4.4× mehnga hai lekin requests bahut saste hain. Agar tumhara workload **request-heavy aur storage-light** hai (jaise ML training jo same dataset ko baar-baar padhti hai), to total cost kam ho sakta hai.

Worth hai jab:
- Latency **measurably** bottleneck hai (ML training I/O wait, real-time inference feature store)
- Data **re-creatable** hai (single AZ risk acceptable)
- Compute usi AZ me hai (cross-AZ transfer cost se bachne ke liye)

Worth nahi jab: archival, backup, koi bhi durable-source-of-truth data, ya jab latency actually bottleneck nahi hai.

> 💡 **Gotcha:** Express One Zone **ek specific AZ** me hota hai (bucket name me AZ ID hoti hai: `bucket--apse1-az1--x-s3`). Agar tumhara compute doosri AZ me hai to tum **cross-AZ data transfer ($0.01/GB each way)** pay karoge aur latency ka fayda bhi kam ho jaayega. Compute aur bucket **same AZ ID** me hone chahiye — aur AZ ID (`apse1-az1`) AZ name (`ap-south-1a`) se alag hai, accounts me mapping alag hoti hai. `aws ec2 describe-availability-zones` se ZoneId dekho.

---

**Q52: S3 Tables (Iceberg) kya hai aur kab use karo?**

S3 Tables (Dec 2024) managed Apache Iceberg tables deta hai — **table buckets** me.

Kya milta hai:
- **Automatic compaction** — chhote files merge hote rehte hain (small files problem solved)
- **Snapshot management** — purane snapshots automatically expire
- **Unreferenced file cleanup** — orphaned data files delete
- **ACID transactions** on tables (Iceberg ka feature)
- **Schema evolution** — column add/rename bina rewrite ke
- **Time travel** — purane snapshot par query
- Athena, Redshift, EMR, Spark ka native integration
- 2025 me **Iceberg V3** support (deletion vectors = faster updates, kam storage)

Self-managed Iceberg-on-S3 se compare:
| | Self-managed Iceberg | S3 Tables |
|---|---|---|
| Compaction | Tumhe Spark job likhna aur chalana padega | Automatic |
| Snapshot expiry | Manual/scheduled | Automatic |
| Query performance | Tuning tumhari zimmedari | AWS-optimized (~3× faster claim) |
| Cost | S3 storage + compute for maintenance | S3 Tables pricing (storage + requests + compaction) |
| Lock-in | Kam (open format, portable) | Zyada (AWS-managed) |

> 💡 **Gotcha:** S3 Tables **general purpose bucket ke features nahi** rakhta — koi arbitrary object PUT nahi, koi lifecycle rules apne hisaab se nahi, koi normal S3 API nahi. Ye ek **table abstraction** hai, storage abstraction nahi. Agar tumhe raw file access bhi chahiye to alag general purpose bucket rakhna padega. Aur pricing model alag hai (compaction ka bhi charge hai) — apne actual data volume par calculator chalao, assume mat karo ki S3 Standard jaisa hoga.

---

**Q53: Requester Pays kya hai aur kab use karte hain?**

Normally bucket owner data transfer aur request charges bharta hai. Requester Pays me **downloader** bharta hai.

```bash
aws s3api put-bucket-request-payment --bucket jmfs-public-data \
  --request-payment-configuration Payer=Requester

# Requester ko explicitly header bhejna padta hai
aws s3 cp s3://jmfs-public-data/file.csv . --request-payer requester
```

Use cases: public datasets share karna, partner ko bulk data dena, chargeback model within a large org.

Requirements: requester **anonymous nahi ho sakta** — authenticated AWS principal hona chahiye (kyunki bill kisi ko lagana hai). Aur requester ko `x-amz-request-payer: requester` header bhejna hi padta hai, warna `403 AccessDenied`.

> 💡 **Gotcha:** Requester Pays on karne ke baad **tumhara apna code bhi tootega** agar wo header nahi bhejta. Sab SDKs, sab scripts, sab lifecycle-adjacent tooling ko update karna padega. Aur storage ka charge phir bhi **tumhara** hai — sirf requests aur transfer requester par shift hota hai. Log sochte hain "ab bill zero ho jaayega", nahi hota.

---

**Q54: Transfer Acceleration kya hai aur CloudFront se kaise alag hai?**

Transfer Acceleration CloudFront ke edge locations use karta hai lekin **upload direction** me — user nearest edge se connect karta hai, phir AWS ka optimized backbone S3 tak le jaata hai.

```bash
aws s3api put-bucket-accelerate-configuration --bucket jmfs-uploads \
  --accelerate-configuration Status=Enabled

# Alag endpoint use karna padta hai
aws s3 cp big.zip s3://jmfs-uploads/ --endpoint-url https://s3-accelerate.amazonaws.com
```

Cost: **~$0.04/GB extra** ⚠️ verify (regular transfer ke upar).

| | Transfer Acceleration | CloudFront |
|---|---|---|
| Direction | Upload (aur download) | Mostly download |
| Caching | ❌ Nahi | ✅ Haan |
| Best for | Large file uploads from far away | Repeated downloads |
| Cost | Extra per GB | Often cheaper than direct S3 |

**Decision:** downloads ke liye **CloudFront** (caching se paisa bachta hai). Long-distance uploads ke liye **Transfer Acceleration**. Bulk one-time migration ke liye **Snowball/DataSync** (dono se sasta).

> 💡 **Gotcha:** Transfer Acceleration **hamesha faster nahi hota**. Agar user already region ke paas hai (Mumbai user, ap-south-1 bucket), to koi fayda nahi — sirf extra $0.04/GB. AWS ka **speed comparison tool** hai (`s3-accelerate-speedtest`) — enable karne se pehle apne actual user locations se test karo. Aur AWS sirf tab charge karta hai jab acceleration actually faster ho — lekin measurement uska hai, tumhara nahi.

---

**Q55: Storage Lens, Inventory, aur Storage Class Analysis me kya fark hai?**

| Tool | Kya deta hai | Cost |
|---|---|---|
| **Storage Lens** | Account/org-wide dashboard — usage, activity, cost-optimization recommendations, 60+ metrics | Free tier (28 metrics, 14 days); Advanced ~$0.20/million objects/month ⚠️ verify |
| **S3 Inventory** | Daily/weekly CSV/ORC/Parquet report — har object ki list with metadata | ~$0.0025 per million objects listed ⚠️ verify |
| **Storage Class Analysis** | Access pattern analysis — batata hai kaunse objects IA me ja sakte hain | ~$0.10 per million objects/month ⚠️ verify |

**Kab kaunsa:**
- **Storage Lens** — "poore account me kya ho raha hai" ka dashboard. Cost optimization ka starting point. **Sabse pehle ise dekho.**
- **Inventory** — object-level audit, reconciliation, ya S3 Batch Operations ke liye manifest banane ke liye. LIST API se **bahut sasta** hai jab objects millions me hon.
- **Storage Class Analysis** — lifecycle rules design karne se pehle data-driven decision lene ke liye.

2026 me Storage Lens me **performance metrics** bhi aa gaye — hot prefixes identify karne ke liye jo throttling cause kar rahe hain.

> 💡 **Gotcha:** 10 million objects ko `ListObjectsV2` se list karna = 10,000 LIST calls (1,000 keys per response) = $0.05 aur ghanton ka time. **S3 Inventory** wahi kaam ek daily Parquet file me deta hai jise tum Athena se query kar sakte ho — ~$0.025 aur seconds me. Koi bhi script jo "sab objects par iterate" kar rahi hai, usse Inventory-based me convert karo.

---
**Q56: Replication kaam nahi kar rahi — kaise debug karoge?**

Checklist, order me:

```bash
# 1. Dono buckets par versioning ON hai?
aws s3api get-bucket-versioning --bucket source-bucket
aws s3api get-bucket-versioning --bucket dest-bucket

# 2. Replication config sahi hai?
aws s3api get-bucket-replication --bucket source-bucket

# 3. Kisi object ka replication status kya hai?
aws s3api head-object --bucket source-bucket --key test.csv \
  --query 'ReplicationStatus'
# → PENDING | COMPLETED | FAILED | REPLICA

# 4. IAM role ke paas permissions hain?
aws iam get-role-policy --role-name S3ReplicationRole --policy-name ReplicationPolicy

# 5. Metrics (agar RTC enabled hai)
aws cloudwatch get-metric-statistics --namespace AWS/S3 \
  --metric-name OperationsFailedReplication \
  --dimensions Name=SourceBucket,Value=source-bucket \
  --start-time 2026-08-05T00:00:00Z --end-time 2026-08-06T00:00:00Z \
  --period 3600 --statistics Sum
```

Replication role ki minimum policy:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    { "Effect": "Allow",
      "Action": ["s3:GetReplicationConfiguration", "s3:ListBucket"],
      "Resource": "arn:aws:s3:::source-bucket" },
    { "Effect": "Allow",
      "Action": ["s3:GetObjectVersionForReplication", "s3:GetObjectVersionAcl",
                 "s3:GetObjectVersionTagging"],
      "Resource": "arn:aws:s3:::source-bucket/*" },
    { "Effect": "Allow",
      "Action": ["s3:ReplicateObject", "s3:ReplicateDelete", "s3:ReplicateTags"],
      "Resource": "arn:aws:s3:::dest-bucket/*" },
    { "Effect": "Allow",
      "Action": ["kms:Decrypt"], "Resource": "<source-kms-key-arn>" },
    { "Effect": "Allow",
      "Action": ["kms:Encrypt"], "Resource": "<dest-kms-key-arn>" }
  ]
}
```

Common causes: (1) purane objects — replication sirf **nayi** writes par lagti hai, (2) KMS permissions missing, (3) destination bucket policy cross-account me allow nahi karti, (4) delete markers replicate nahi ho rahe (explicitly enable karna padta hai).

> 💡 **Gotcha:** Existing objects ke liye **S3 Batch Replication** alag se chalana padta hai. Log replication config lagate hain aur mahino baad pata karte hain ki DR bucket me sirf naya data hai. Aur `ReplicationStatus: FAILED` par S3 **automatically retry nahi karta** — tumhe manually re-copy karna padta hai (object ko khud par COPY karke). CloudWatch alarm lagao `OperationsFailedReplication` par.

---

**Q57: Bucket delete nahi ho raha — `BucketNotEmpty` aa raha hai lekin bucket khaali dikh raha hai?**

Teen chhupi hui cheezein bucket ko "non-empty" rakhti hain:

```bash
# 1. Object versions (versioning on tha)
aws s3api list-object-versions --bucket jmfs-old --max-items 5

# 2. Delete markers
aws s3api list-object-versions --bucket jmfs-old \
  --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}'

# 3. Incomplete multipart uploads — ye LIST me BILKUL nahi dikhte
aws s3api list-multipart-uploads --bucket jmfs-old
```

Poora cleanup:
```bash
BUCKET=jmfs-old

# Sab versions delete
aws s3api list-object-versions --bucket "$BUCKET" \
  --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \
  --output json > /tmp/versions.json
aws s3api delete-objects --bucket "$BUCKET" --delete file:///tmp/versions.json

# Sab delete markers
aws s3api list-object-versions --bucket "$BUCKET" \
  --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' \
  --output json > /tmp/markers.json
aws s3api delete-objects --bucket "$BUCKET" --delete file:///tmp/markers.json

# Sab incomplete MPUs abort
aws s3api list-multipart-uploads --bucket "$BUCKET" \
  --query 'Uploads[].{Key:Key,UploadId:UploadId}' --output text | \
while read KEY UPLOADID; do
  aws s3api abort-multipart-upload --bucket "$BUCKET" --key "$KEY" --upload-id "$UPLOADID"
done

aws s3api delete-bucket --bucket "$BUCKET"
```

`delete-objects` ek call me **1,000 objects** tak leta hai — millions ke liye loop chahiye, ya better: ek lifecycle rule lagao jo sab expire kar de aur 1-2 din wait karo (free hai, jabki DELETE calls ka bhi... actually DELETE free hai, lekin LIST calls ka paisa lagta hai).

> 💡 **Gotcha:** Agar bucket par **Object Lock (Compliance mode)** hai to bucket **retention period tak delete ho hi nahi sakta** — koi tareeka nahi, root bhi nahi. Aur agar bucket 10 million objects wala hai to CLI se delete karna ghanton lega aur LIST charges lagenge. Us case me: lifecycle rule `Expiration: {Days: 1}` + `NoncurrentVersionExpiration: {NoncurrentDays: 1}` lagao, 2 din wait karo, phir bucket delete karo. Lifecycle expiration **free** hai.

---

**Q58: S3 ka bill achanak badh gaya — kaise pata karoge kahan se?**

Systematic approach:

**Step 1 — Cost Explorer me dimension breakdown:**
```
Service = S3, Group by = Usage Type
```
Usage types batate hain exact meter:
- `APS3-TimedStorage-ByteHrs` → storage
- `APS3-Requests-Tier1` → PUT/COPY/POST/LIST
- `APS3-Requests-Tier2` → GET
- `APS3-DataTransfer-Out-Bytes` → internet egress
- `APS3-Retrieval-SIA` → Standard-IA retrieval
- `APS3-EarlyDelete-SIA` → minimum duration violation
- `APS3-Monitoring-AutomationV2` → Intelligent-Tiering monitoring

**Step 2 — Storage Lens** se pata karo kaunsa bucket/prefix.

**Step 3 — Common causes ki checklist:**

| Symptom | Likely cause |
|---|---|
| Storage badha, object count nahi | Versioning on hai, purane versions jamā ho rahe |
| Storage badha, "0 objects" dikh raha | **Incomplete multipart uploads** |
| Tier1 requests spike | LIST loop, ya har request par PutObject |
| Tier2 requests spike | Cache miss, ya polling loop |
| DataTransfer-Out spike | Public bucket scrape, ya CloudFront hata diya, ya cross-region read |
| EarlyDelete charges | Lifecycle rule minimum duration se pehle delete kar raha |
| NatGateway line item badha | Gateway endpoint missing hai |

**Step 4 — CloudTrail/server logs se caller identify karo:**
```sql
SELECT useridentity.arn, eventname, count(*) AS calls
FROM cloudtrail_logs
WHERE eventsource = 's3.amazonaws.com'
  AND eventtime > current_timestamp - interval '7' day
GROUP BY 1, 2 ORDER BY calls DESC LIMIT 20;
```

> 💡 **Gotcha:** Sabse expensive surprise **public bucket ka scrape** hai. Ek public bucket jisme 500 GB assets hain, koi scraper roz poora download kare = 15 TB/month egress = **~$1,600/month**. Aur tumhe pata bhi nahi chalega jab tak bill na aaye. Prevention: public buckets rakho hi mat (CloudFront + OAC use karo), aur **AWS Budgets me anomaly alert** lagao — $50 se zyada daily spike par email.

---

**Q59: S3 region down ho jaaye to kya — DR strategy kya hai?**

S3 ka **99.99% availability SLA** hai, matlab saal me ~53 minute expected downtime. Regional outages hue hain (2017 ka us-east-1 wala famous hai).

**Tiers of DR:**

| Tier | Setup | RPO | RTO | Cost |
|---|---|---|---|---|
| 1 | Kuch nahi | ∞ | ∞ | $0 |
| 2 | Versioning + lifecycle | 0 (deletes ke liye) | Minutes | ~10-20% extra storage |
| 3 | **CRR to another region** | Minutes | Manual failover | 2× storage + transfer |
| 4 | CRR + RTC (15-min SLA) | <15 min | Manual | + $0.015/GB |
| 5 | **Multi-Region Access Point** | <15 min | **Automatic** | + MRAP routing charges |

Financial services me typically **Tier 3-4** hota hai: primary ap-south-1, DR ap-southeast-1 ya us-east-1, plus ek alag account me copy (insider threat/ransomware ke liye).

**Application-side readiness:** DR ka fayda tabhi hai jab tumhara code failover kar sake:
```typescript
const PRIMARY = { region: "ap-south-1", bucket: "jmfs-data" };
const DR      = { region: "ap-southeast-1", bucket: "jmfs-data-dr" };

async function getWithFailover(key: string) {
  try {
    return await getFrom(PRIMARY, key);
  } catch (e: any) {
    if (["ServiceUnavailable", "InternalError", "TimeoutError"].includes(e.name)) {
      return await getFrom(DR, key);
    }
    throw e;
  }
}
```

> 💡 **Gotcha:** S3 ka **control plane** (bucket create, policy update) us-east-1 par zyada depend karta hai data plane se. 2017 outage me log yahi seekhe: existing objects padhna kaam kar raha tha lekin naye buckets nahi ban rahe the. **DR bucket, policies, aur roles pehle se bane hue hone chahiye** — incident ke waqt create karne ki koshish mat karna. Aur DR ko **quarterly test karo**, warna incident ke din pata chalega ki replication 6 mahine se FAILED status me hai.

---

**Q60: Mountpoint for Amazon S3 aur S3 Files kya hain?**

Legacy applications jo `fs.readFile()` / `File.OpenRead()` use karti hain, unhe S3 par chalane ke liye:

**Mountpoint for Amazon S3** (2023) — ek FUSE client jo S3 bucket ko local directory ki tarah mount karta hai:
```bash
mount-s3 jmfs-reports /mnt/reports
ls /mnt/reports/2026/
```
Optimized for **high-throughput sequential reads** aur **sequential writes to new objects**. Random writes, appends, aur file rename **support nahi** karta — kyunki S3 me wo operations exist hi nahi karte.

**Amazon S3 Files** (April 2026) — newer, more complete file-system access layer ⚠️ verify current capabilities aur pricing, ye bahut naya hai.

Comparison:
| | Mountpoint S3 | EFS | FSx |
|---|---|---|---|
| Cost | S3 pricing ($0.025/GB) | ~$0.36/GB | Higher |
| POSIX compliance | ⚠️ Partial | ✅ Full | ✅ Full |
| Random writes | ❌ | ✅ | ✅ |
| Multi-writer same file | ❌ | ✅ | ✅ |
| Throughput | Very high (parallel reads) | Scales with size | High |

> 💡 **Gotcha:** Mountpoint ko **EFS ka sasta replacement mat samjho**. Wo read-heavy analytics workloads ke liye banaya gaya hai (ML training data, log processing). Agar tumhari app file me seek karke likhti hai, ya do processes ek file par likhte hain, ya rename karti hai — wo **silently galat behave karegi ya fail hogi**. Migration se pehle apni app ka actual file access pattern audit karo, assume mat karo ki "filesystem hai to sab chalega".

---

**Q61: On-prem se S3 me terabytes data kaise laate hain?**

| Method | Best for | Speed |
|---|---|---|
| `aws s3 sync` | <1 TB, decent bandwidth | Bandwidth-limited |
| **AWS DataSync** | 1-100 TB, ongoing sync | 10× faster than plain copy, incremental |
| **AWS Snowball Edge** | 10-100 TB, slow/no internet | Physical device, days |
| **AWS Snowmobile** | 10+ PB | Truck. Literally. |
| **Direct Connect** | Ongoing high-volume | Dedicated line |
| **Storage Gateway (File Gateway)** | Hybrid — on-prem cache + S3 backend | Transparent |

Math: 50 TB over a 1 Gbps line at 70% utilization ≈ **7 days** of continuous transfer, assuming nothing breaks. Snowball me ~1 week door-to-door lagta hai lekin tumhari internet line free rehti hai.

DataSync example:
```bash
aws datasync create-task \
  --source-location-arn arn:aws:datasync:ap-south-1:123:location/loc-onprem \
  --destination-location-arn arn:aws:datasync:ap-south-1:123:location/loc-s3 \
  --options '{"VerifyMode":"POINT_IN_TIME_CONSISTENT","OverwriteMode":"ALWAYS",
              "PreserveDeletedFiles":"PRESERVE","TaskQueueing":"ENABLED"}'
```

> 💡 **Gotcha:** `aws s3 sync` bade migrations ke liye **bura** hai — wo single-threaded-ish hai, resume karne par poora re-scan karta hai, aur network glitch par crash ho jaata hai. Tuning helps:
> ```bash
> aws configure set default.s3.max_concurrent_requests 50
> aws configure set default.s3.multipart_chunksize 64MB
> ```
> Lekin 10 TB se upar **DataSync use karo** — usme retry, checksum verification, bandwidth throttling, aur progress reporting built-in hai. Log `s3 sync` ko `screen` me chala kar chhod dete hain aur 3 din baad pata chalta hai ki wo din 1 par hi mar gaya tha.

---

**Q62: S3 Batch Operations kya hai?**

Millions of objects par ek operation chalane ke liye — copy, tag, restore, invoke Lambda, replicate, object lock apply.

```bash
aws s3control create-job --account-id 123456789012 \
  --operation '{"S3PutObjectCopy":{
      "TargetResource":"arn:aws:s3:::jmfs-archive",
      "StorageClass":"GLACIER_IR"}}' \
  --manifest '{"Spec":{"Format":"S3BatchOperations_CSV_20180820",
      "Fields":["Bucket","Key"]},
      "Location":{"ObjectArn":"arn:aws:s3:::jmfs-manifests/list.csv",
                  "ETag":"abc123"}}' \
  --report '{"Bucket":"arn:aws:s3:::jmfs-reports","Format":"Report_CSV_20180820",
             "Enabled":true,"Prefix":"batch-reports","ReportScope":"AllTasks"}' \
  --priority 10 --role-arn arn:aws:iam::123:role/BatchOpsRole \
  --no-confirmation-required
```

Manifest **S3 Inventory report** se aa sakta hai (recommended) ya tumhari apni CSV se.

Cost: **$0.25 per job** + **$1.00 per million object operations** ⚠️ verify, plus underlying request charges.

Kyun ye better hai apne script se: automatic retries, progress tracking, completion report, aur throttling handling. 50 million objects par apna script likhna aur usko 3 din chalana — wo fail hoga aur tumhe pata nahi chalega kahan se resume karna hai.

> 💡 **Gotcha:** Manifest me **ETag dena mandatory** hai (manifest object ka), aur agar manifest file badal gayi to job fail hogi. Aur **job priority** (0-2147483647) sirf tumhare apne jobs ke beech ordering karti hai, AWS ki queue me nahi. Bade jobs ke liye `--priority` set karo aur ek waqt me ek hi bada job chalao, warna wo aapas me compete karenge aur dono slow honge.

---

**Q63: S3 Object Lambda kya hai?**

GET request ke response ko Lambda se transform karo, bina original object badle.

```
Client ──GET──► S3 Object Lambda Access Point
                       │
                       ├──► Lambda function (transform)
                       │         │
                       │         └──► S3 (original object padho)
                       │
                       └──► transformed response client ko
```

Use cases jo tumhare context me relevant hain:
- **PII redaction** — same object, alag users ko alag masking (PAN masked vs full)
- **Format conversion** — Parquet stored, CSV returned
- **Watermarking** — documents par user ka naam
- **Row-level filtering** — CSV se sirf us tenant ki rows

```typescript
export const handler = async (event: any) => {
  const { getObjectContext } = event;
  const { outputRoute, outputToken, inputS3Url } = getObjectContext;

  const original = await fetch(inputS3Url);
  const text = await original.text();

  // PAN mask karo
  const redacted = text.replace(/[A-Z]{5}\d{4}[A-Z]/g, m => `XXXXX${m.slice(-5)}`);

  const s3 = new S3Client({});
  await s3.send(new WriteGetObjectResponseCommand({
    RequestRoute: outputRoute, RequestToken: outputToken, Body: redacted,
  }));
  return { statusCode: 200 };
};
```

> 💡 **Gotcha:** Object Lambda **har GET par Lambda invoke** karta hai — caching nahi hoti. High-traffic read path par ye mehnga aur slow hai (Lambda cold start + execution + S3 read). Cost: Lambda invocations + duration + S3 Object Lambda ka apna per-GB charge (~$0.005/GB processed ⚠️ verify). Agar transformations **deterministic aur limited variants** wali hain (jaise 3 masking levels), to pre-compute karke alag prefixes me store karna bahut sasta hai. Object Lambda tab use karo jab variants unbounded hon (per-user watermark).

---

**Q64: SQL Server / RDS ka backup S3 me kaise jaata hai?**

**RDS SQL Server — native backup/restore to S3:**
```sql
-- Backup
EXEC msdb.dbo.rds_backup_database
  @source_db_name='JMFSProd',
  @s3_arn_to_backup_to='arn:aws:s3:::jmfs-db-backups/prod-2026-08-06.bak',
  @overwrite_S3_backup_file=1;

-- Status
EXEC msdb.dbo.rds_task_status @db_name='JMFSProd';

-- Restore
EXEC msdb.dbo.rds_restore_database
  @restore_db_name='JMFSRestore',
  @s3_arn_to_restore_from='arn:aws:s3:::jmfs-db-backups/prod-2026-08-06.bak';
```
Iske liye RDS option group me `SQLSERVER_BACKUP_RESTORE` option chahiye, ek IAM role ke saath jo S3 access de.

**Self-managed SQL Server on EC2:**
```powershell
# Native backup to local, phir S3
BACKUP DATABASE JMFSProd TO DISK = 'D:\backup\prod.bak' WITH COMPRESSION;
aws s3 cp D:\backup\prod.bak s3://jmfs-db-backups/ --storage-class STANDARD_IA
```

**Automated RDS snapshots** alag hain — wo AWS-managed hain, tumhare bucket me nahi dikhte, aur unka apna pricing hai (allocated storage tak free, usse zyada charged).

> 💡 **Gotcha:** Database backups ko **turant Glacier me mat daalo**. Restore ke waqt tumhe wo file **abhi** chahiye — Deep Archive se 12 ghante wait karna production incident me acceptable nahi hai. Sensible lifecycle: 7 din Standard (recent restores), 30 din Standard-IA, 1 saal Glacier IR (instant retrieval — ye key hai), phir Deep Archive compliance ke liye. Aur **restore test quarterly karo** — untested backup backup nahi hai.

---

**Q65: Checksums aur data integrity kaise verify karte hain?**

S3 multiple checksum algorithms support karta hai: **CRC32, CRC32C, CRC64-NVME, SHA-1, SHA-256**.

```typescript
await s3.send(new PutObjectCommand({
  Bucket, Key, Body: data,
  ChecksumAlgorithm: "SHA256",   // S3 verify karega upload par
}));

const head = await s3.send(new HeadObjectCommand({
  Bucket, Key, ChecksumMode: "ENABLED",
}));
console.log(head.ChecksumSHA256);
```

**ETag ka trap:**
- **Simple PUT + SSE-S3/no encryption** → ETag = content ka MD5. Verification ke liye use kar sakte ho.
- **Multipart upload** → ETag = `<hash-of-part-hashes>-<partCount>`, jaise `a1b2c3...-42`. Ye content ka MD5 **nahi** hai.
- **SSE-KMS ya SSE-C** → ETag content ka MD5 **nahi** hai.

Isliye **ETag ko integrity check ke liye mat use karo** general case me. Explicit checksums use karo.

Modern SDKs (2025+) default me CRC32 checksum add karte hain har upload par — ye automatic hai.

> 💡 **Gotcha:** Log ETag compare karke sochte hain "file same hai". Agar file 100 MB ki hai aur SDK ne automatically multipart use kiya, to ETag part size par depend karta hai — **same file, alag part size = alag ETag**. Do buckets ke beech reconciliation script jo ETag compare karti hai wo false mismatches degi. Explicit `ChecksumAlgorithm: "SHA256"` set karo dono jagah, ya S3 Inventory me checksum field include karo.

---

**Q66: Static website hosting kaise karte hain — aur kyun ab CloudFront hi sahi hai?**

**Purana tareeka (S3 website endpoint):**
```bash
aws s3 website s3://jmfs-site/ --index-document index.html --error-document error.html
# Endpoint: http://jmfs-site.s3-website.ap-south-1.amazonaws.com
```
Problems: **HTTP only** (koi HTTPS nahi), koi custom domain SSL nahi, koi CDN, koi WAF, bucket public karna padta hai.

**Sahi tareeka (2026):**
```
Route 53 ──► CloudFront (ACM cert, WAF) ──OAC──► S3 (private, BPA on)
```
- HTTPS with custom domain
- Global CDN caching
- WAF protection
- Bucket **private** rehta hai
- Data transfer sasta (cache hits)

CDK me:
```typescript
const bucket = new s3.Bucket(this, "SiteBucket", {
  blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
  encryption: s3.BucketEncryption.S3_MANAGED,
});

const distribution = new cloudfront.Distribution(this, "Dist", {
  defaultBehavior: {
    origin: origins.S3BucketOrigin.withOriginAccessControl(bucket),
    viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
  },
  defaultRootObject: "index.html",
  errorResponses: [
    { httpStatus: 403, responseHttpStatus: 200, responsePagePath: "/index.html" },
    { httpStatus: 404, responseHttpStatus: 200, responsePagePath: "/index.html" },
  ],  // ← Angular/React SPA routing ke liye
});
```

> 💡 **Gotcha:** **S3 website endpoint** aur **S3 REST endpoint** alag hain aur alag behave karte hain. Website endpoint index documents aur redirects support karta hai lekin HTTPS nahi. REST endpoint HTTPS support karta hai lekin index document nahi (`/` par 403 dega). CloudFront ke saath **REST endpoint + OAC** use karo, aur `defaultRootObject` CloudFront me set karo. Log website endpoint ko CloudFront origin banate hain — phir OAC kaam nahi karta aur bucket public rakhna padta hai.

---

**Q67: Presigned PUT aur presigned POST me kya fark hai?**

**Presigned PUT** — simple, ek object, fixed key:
```typescript
const url = await getSignedUrl(s3,
  new PutObjectCommand({ Bucket, Key: `uploads/${uuid}.pdf`, ContentType: "application/pdf" }),
  { expiresIn: 900 });
// Browser: fetch(url, { method: "PUT", body: file })
```

**Presigned POST** — HTML form-based, aur **policy conditions** laga sakte ho:
```typescript
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

const { url, fields } = await createPresignedPost(s3, {
  Bucket: "jmfs-uploads",
  Key: `uploads/${tenantId}/${uuid}`,
  Conditions: [
    ["content-length-range", 0, 10 * 1024 * 1024],       // max 10 MB
    ["starts-with", "$Content-Type", "image/"],           // sirf images
    ["starts-with", "$key", `uploads/${tenantId}/`],      // tenant isolation
  ],
  Fields: { "x-amz-server-side-encryption": "AES256" },
  Expires: 900,
});
```

**Key difference: presigned POST me tum file size aur content type par server-side limit laga sakte ho, PUT me nahi.**

Presigned PUT me agar user 5 GB ki file upload kar de to S3 accept kar lega — tumne size limit nahi lagayi. Ye ek real abuse vector hai.

> 💡 **Gotcha:** Presigned PUT me `ContentType` sign karne par **client ko exactly wahi Content-Type header bhejna padega**, warna `SignatureDoesNotMatch`. Browser kabhi-kabhi apne aap Content-Type badal deta hai. Aur `content-length-range` presigned PUT me possible hi nahi hai — agar tumhe upload size limit chahiye (jo production me chahiye hoti hai) to **presigned POST use karo**, ya PUT ke baad Lambda se size verify karke oversized objects delete karo.

---

**Q68: S3 Select aur Athena me kya fark hai — kaunsa kab?**

**S3 Select** — ek single object ke andar SQL chalao, sirf matching data return hoga:
```sql
SELECT s.orderId, s.amount FROM S3Object s WHERE s.status = 'SETTLED'
```
Ek object par. Koi joins nahi, koi aggregations nahi (limited), koi multi-file query nahi.

**Athena** — poore dataset par proper SQL, joins, aggregations, window functions, partitioning.

| | S3 Select | Athena |
|---|---|---|
| Scope | 1 object | Poora dataset (millions of files) |
| SQL | Bahut limited | Full Presto/Trino SQL |
| Joins | ❌ | ✅ |
| Cost | ~$0.002/GB scanned + $0.0007/GB returned | $5/TB scanned |
| Setup | Kuch nahi | Glue catalog / table definition |
| Latency | ~100ms | Seconds |

AWS ab **S3 Select ke bajaye Athena recommend karta hai** almost sab cases me. S3 Select ka use case bahut sankeern ho gaya hai — sirf jab tumhe ek specific bade object se chhota subset chahiye aur query bahut simple ho.

> 💡 **Gotcha:** Log sochte hain "S3 Select sasta hai kyunki kam data transfer hota hai". Reality: ek 1 GB CSV par S3 Select = $0.002 scanned. Wahi data Parquet me Athena se query karo aur sirf 2 columns chahiye = shayad 50 MB scan = $0.00025. **Parquet + Athena aksar S3 Select se sasta aur zyada powerful hai.** Agar tum S3 Select ke baare me soch rahe ho, to pehle "kya main is data ko Parquet me convert karke Athena use kar sakta hoon" ka jawab dhoondho.

---

**Q69: S3 ka namespace flat kyun hai — hierarchical kyun nahi banaya?**

Kyunki hierarchy **shared mutable state** hai, aur shared mutable state distributed systems ka dushman hai.

Filesystem me:
```
/data/reports/2026/aug.csv likhne ke liye:
  → /data ka inode padho
  → /data/reports ka inode padho aur LOCK karo (naya entry add karne ke liye)
  → ... har level par
```
Har directory ek shared structure hai jise concurrent writers lock karte hain. 1,000 processes ek hi directory me file bana rahe hain = lock contention. Ye 10 servers par manageable hai, 10 million par impossible.

Flat namespace me:
```
"data/reports/2026/aug.csv" → hash → partition N → write
```
Koi lock nahi, koi parent traversal nahi. Har key independent hai. Isliye S3 **linearly scale** karta hai — infinite parallel writers, koi coordination nahi.

Trade-off jo AWS ne accept kiya:
- ✅ Unlimited scale, no contention
- ❌ Rename/move = O(n) copy operations
- ❌ "Directory size" jaisa concept nahi (poora prefix scan karna padega)
- ❌ LIST bade prefixes par slow

Aur jab ye trade-off kuch workloads ke liye bura hone laga, AWS ne **directory buckets** (S3 Express One Zone, 2023) launch kiye — jinme actual hierarchy hai, lekin **single AZ** me. Ye bataata hai ki hierarchy ki keemat multi-AZ scale hai.

> 💡 **Gotcha:** Isi wajah se **key design ek permanent decision hai**. Tumne agar `2026/08/06/tenant-42/file.csv` chuna aur baad me `tenant-42/2026/08/06/file.csv` chahiye, to migration ek O(n) copy job hai. Design karte waqt socho: **kis dimension par tum sabse zyada filter karoge, wo prefix me sabse pehle aana chahiye** — bilkul jaise composite index me column order matter karta hai SQL me.

---

**Q70: Bucket names globally unique kyun hone chahiye?**

Kyunki bucket ka naam **DNS hostname** ka hissa hai:
```
https://jmfs-reports.s3.ap-south-1.amazonaws.com/
        └────────┬───────┘
        ye ek DNS label hai
```

DNS namespace globally shared hai. `jmfs-reports.s3.amazonaws.com` do alag cheezon ko point nahi kar sakta.

Kyun virtual-hosted style choose kiya (jisse ye constraint aayi): kyunki isse AWS request ko **DNS level par route** kar sakta hai, HTTP body parse kiye bina. Load balancers aur edge infrastructure sirf hostname dekhkar traffic ko sahi backend par bhej sakte hain. Path-style me har request ko application layer tak jaana padta, jo scale par mehnga hai.

**2026 update:** AWS ne **account-level regional namespaces** introduce kiye hain ⚠️ verify — jisse tum apne account me `my-data` naam ka bucket bana sakte ho chahe koi aur company ke paas wahi naam ho. Ye IaC ke liye bada relief hai (predictable naming across accounts/regions).

Practical naming convention jab tak global uniqueness lagti hai:
```
<company>-<env>-<purpose>-<region>-<account-id>
jmfs-prod-reports-aps1-123456789012
```
Account ID lagane se collision ka chance zero ho jaata hai, aur CDK me `${this.account}` se automatic bhi ho jaata hai.

> 💡 **Gotcha:** **Bucket name enumeration ek reconnaissance technique hai.** Attackers `company-backup`, `company-prod`, `company-dev` jaise naam guess karke check karte hain ki exist karte hain ya nahi (403 vs 404 se pata chal jaata hai). Predictable naam mat rakho sensitive buckets ke liye — random suffix add karo. Aur **bucket delete karne ke baad naam koi aur le sakta hai** — agar tumhara koi purana app abhi bhi us URL par likh raha hai to tum apna data kisi aur ke bucket me bhej rahe ho. Ye "S3 bucket takeover" attack hai.

---

**Q71: S3 eventual consistency se strong consistency par kyun move hua — aur pehle kyun nahi tha?**

**Pehle kyun eventual tha (2006-2020):** S3 ka metadata subsystem geographically distributed cache par based tha. Ek object ka location metadata multiple places par cached tha performance ke liye. Overwrite karne par sab caches ko invalidate karna sync me karna hota to har PUT ki latency badh jaati.

Trade-off tha: **fast writes, occasionally stale reads.**

**Kyun badla (Dec 2020):** data lake workloads me ye correctness bug ban gaya:
```
Spark stage 1: part-00001.parquet likhi
Spark stage 2: LIST karke padho → file nahi mili → SILENTLY skip
Result: galat aggregation, koi error nahi
```
Log workarounds bana rahe the — Netflix ka S3mper, Hadoop ka S3Guard, EMRFS consistent view — sab DynamoDB me ek external consistency layer maintain karte the. Ye operationally bhaari tha aur khud buggy tha.

AWS ne metadata subsystem redesign kiya — ab har read ek strongly consistent metadata store se jaata hai, aur cache invalidation synchronous hai. **Bina koi extra cost, bina performance penalty, bina kisi opt-in ke.** Ye AWS ke bade engineering achievements me se ek hai.

Lesson jo generalize hota hai: **eventual consistency "acceptable" tab tak lagti hai jab tak wo ek correctness bug na ban jaaye.** Agar tumhara system read-after-write pattern use karta hai, to eventual consistency tumhare liye latent bug hai — abhi nahi to kabhi.

> 💡 **Gotcha:** Strong consistency **object data** par hai. **Bucket-level configuration abhi bhi eventually consistent hai** — policy, lifecycle, CORS, replication config, encryption settings. IaC pipelines me policy apply karke turant test karoge to flaky hoga. Ye ek chhota sa asterisk hai jo docs me hai lekin log padhte nahi.

---

**Q72: Storage classes itne saare kyun — 2-3 kaafi nahi the?**

Kyunki storage cost ke **teen independent dimensions** hain, aur har workload unhe alag weight deta hai:

```
                Storage $/GB
                     ▲
                     │  Standard ●
                     │           ╲
                     │   IA ●     ╲  Har class ek point hai
                     │        ╲    ╲ is 3D space me
   Glacier IR ●──────┼─────────╲    ╲
                     │  Glacier FR ● ╲
   Deep Archive ●────┼──────────────●─┼──► Retrieval cost/time
                     │                │
                     ▼                ▼
              Availability      Access frequency
```

Har class ek **specific point** hai (storage price, retrieval price, retrieval latency, availability) space me:

| Workload | Kya optimize karna | Class |
|---|---|---|
| Live app data | Latency + no retrieval fee | Standard |
| Access pattern unknown | Risk of guessing wrong | Intelligent-Tiering |
| Monthly reports | Storage, occasional retrieval OK | Standard-IA |
| Transcoded thumbnails (re-creatable) | Storage, AZ risk acceptable | One Zone-IA |
| Medical/legal archive, quarterly access | Storage, but need instant when needed | Glacier IR |
| Backups, restore rare | Storage above all, hours OK | Glacier FR |
| 7-year compliance retention | Storage above ALL else | Deep Archive |
| ML training checkpoints | Latency + request cost | Express One Zone |

AWS 2-3 classes bhi de sakta tha, lekin phir har customer 2-3× zyada pay karta un dimensions ke liye jinki unhe zaroorat nahi thi. Ye price discrimination hai — aur is case me customer ke favour me, kyunki tum exactly wahi pay karte ho jo tumhe chahiye.

> 💡 **Gotcha:** **Zyada options = zyada galat choose karne ka chance.** Sabse common galti hai "sabse sasta = sabse acha" sochna aur sab kuch Deep Archive me daal dena. Phir retrieval fees, minimum duration charges, aur transition costs mil kar bill badha dete hain. **Rule: agar tum sure nahi ho, Intelligent-Tiering use karo.** Wo tumhare liye decide kar dega, aur galat decision ka risk uthana usse mehnga hai jitni monitoring fee lagti hai.

---

**Q73: Data IN free aur data OUT mehnga kyun hai?**

Do reasons, ek technical aur ek commercial:

**Technical:** AWS ke data centers ka ingress bandwidth relatively saste hai kyunki wo apne peering agreements aur backbone se aata hai. Egress ISPs ko pay karna padta hai — transit costs actual hain.

**Commercial (ye bada reason hai):** free ingress data ko andar laane ka incentive deta hai. Ek baar tumhara 500 TB S3 me aa gaya, to usko nikaalna **$0.09/GB × 500,000 GB = $45,000** ka hai. Ye **gravity** create karta hai — data jahan hai, compute wahi jaayega. Isko industry me "data gravity" ya cynically "roach motel pricing" kehte hain.

**Iska architecture par impact:**
```
❌ Bura pattern:
   S3 (Mumbai) ──download──► on-prem server ──process──► upload back
   500 GB down = $54, har baar

✅ Acha pattern:
   S3 (Mumbai) ──► Lambda/Athena/EMR (usi region) ──► result S3 me
   Transfer $0 (gateway endpoint se), sirf compute ka paisa
```

**Free egress paths:**
- S3 → EC2/Lambda **same region** (gateway endpoint ke through)
- S3 → CloudFront (phir CloudFront se user ko, jo alag rate par)
- Data IN, hamesha
- 2024 se: **account close karne par 60 din ka free data transfer out** (EU regulation ki wajah se) ⚠️ verify current terms

> 💡 **Gotcha:** "Same region free hai" me **gateway endpoint ki condition** chhupi hui hai. Private subnet se NAT ke through S3 jaane par NAT ka $0.045/GB lagta hai — S3 free hai lekin NAT nahi. Aur **cross-AZ** traffic bhi ($0.01/GB each way) count hota hai kuch scenarios me. Egress bill dekhte waqt sirf "S3" line item mat dekho, "NAT Gateway" aur "EC2-Other" bhi dekho.

---

**Q74: Objects immutable kyun hain — partial update kyun nahi de sakte?**

Immutability S3 ke poore design ko simple aur scalable banati hai:

1. **Replication trivial ho jaati hai.** Object badalta nahi, isliye copies ko sync me rakhne ka koi problem nahi. Mutable data me tumhe consistency protocol chahiye (Paxos/Raft) har write par — mehnga aur slow.

2. **Caching trivial ho jaati hai.** CloudFront ek object ko hamesha ke liye cache kar sakta hai. Mutable hota to har request par validate karna padta.

3. **Erasure coding possible ho jaati hai.** S3 objects ko chunks me todkar parity ke saath store karta hai (RAID jaisa, lekin distributed). Agar ek byte badal sakta to poori parity recompute karni padti. Immutable objects me ye ek baar ka kaam hai.

4. **Versioning natural ban jaata hai.** Har write ek naya immutable object hai — versioning bas unhe rakh lena hai.

5. **Integrity verification simple.** Ek checksum poore object ke liye, hamesha ke liye valid.

Trade-off: **read-modify-write cycle tumhari zimmedari hai.** 1 GB file me ek line badalni hai? Poori file download, modify, upload. Ye 2 GB ka transfer hai.

Isliye S3 ka natural fit **write-once-read-many** data hai: logs, backups, media, uploads, analytics data.

> 💡 **Gotcha:** Agar tumhara data frequently mutate hota hai to S3 galat jagah hai — aur ye sirf performance ka issue nahi, **cost ka bhi** hai. Ek 10 MB config file jo har 5 minute update hoti hai = 8,640 PUTs/month × 10 MB = 86 GB writes/month, plus $0.043 request charges. Wahi state DynamoDB me rakho to items ke hisaab se centavos me ho jaayega. **Frequently-changing chhota data = DynamoDB/RDS. Rarely-changing bada data = S3.**

---

**Q75: 11 nines durability lekin sirf 99.99% availability — ye kaise?**

Ye do bilkul alag properties hain aur alag mechanisms se aati hain:

**Durability** = data physically exist karta hai. Ye **redundancy** se aati hai — multiple copies, multiple devices, multiple AZs, continuous checksumming. Ek copy corrupt hui? Doosri se repair. Durability lose karne ke liye tumhe **simultaneously** saari copies kho deni padengi, jo statistically almost impossible hai.

**Availability** = abhi is waqt request serve ho sakti hai. Ye **operational** hai — network partition, software deployment ka bug, capacity issue, DNS problem, ya AZ ka power outage. Data safe hai, bas abhi reachable nahi.

```
Durability failure:  data GAYA. Kabhi wapas nahi aayega.  (1 in 10^11 per year)
Availability failure: data hai, abhi nahi mil raha.        (~53 min/year)
```

99.99% availability = saal me **52.6 minutes** downtime allowed hai SLA ke andar. Usse zyada ho to AWS service credits deta hai (10-25% depending on how bad).

Ye asymmetry intentional hai: **data lose karna unforgivable hai, temporarily unavailable hona recoverable hai.** AWS ne apne engineering effort ko usi hisaab se allocate kiya.

> 💡 **Gotcha:** Tumhari application ki availability **S3 ki availability se kam** hogi agar tum retry nahi karte. 99.99% ka matlab hai har 10,000 requests me ek fail ho sakti hai — 1 million requests/day par **100 failures/day**. Agar tumhara code retry nahi karta to wo 100 user-facing errors hain. **SDK ka default retry (`maxAttempts: 3`) enable rakho aur production me 5-8 karo.** Ye "S3 slow/unreliable hai" wali complaints ka asli reason hai — usually retry logic missing hai.

---

**Q76: Minimum storage duration kyun hai?**

Kyunki archival storage classes ka **cost structure alag** hai. Glacier ka data physically slower, denser media par store hota hai jisme write karna aur organize karna mehnga hai. AWS ka business model ye hai ki wo upfront ingestion cost ko lambe storage period par amortize karta hai.

Agar minimum duration na hota:
```
Din 1:  1 PB Deep Archive me daalo   → AWS ka ingestion cost lagta hai
Din 5:  sab delete kar do            → AWS ne 5 din ka $0.005/GB kamaya
                                       lekin ingestion par usse zyada kharch kiya
```
Ye arbitrage ban jaata — log Deep Archive ko temporary storage ki tarah use karte.

Minimum duration ye ensure karta hai ki tum sirf tab archival class choose karo jab tumhara **actual intent** long-term retention ho.

| Class | Min duration | Iska matlab |
|---|---|---|
| Standard-IA | 30 days | "Kam se kam ek mahina rakhoge" |
| Glacier IR / FR | 90 days | "Ye quarterly-or-longer data hai" |
| Deep Archive | 180 days | "Ye saalon ka archive hai" |

> 💡 **Gotcha:** **Lifecycle rules minimum duration ko violate kar sakti hain aur tumhe "early delete" charge lagega.** Example: rule kehti hai "30 din par IA me, 60 din par delete". Object 60 din par delete hoga lekin IA me sirf 30 din raha — IA ka minimum 30 din hai to ye theek hai. Lekin agar rule "30 din par Glacier IR, 60 din par delete" hai, to Glacier IR ka 90-din minimum violate hua = **60 extra din ka charge**. Lifecycle rules design karte waqt **transition day + minimum duration ≤ expiration day** ensure karo. Cost Explorer me `EarlyDelete` usage type dekho — agar wahan kuch hai to tumhari lifecycle rules galat hain.

---

**Q77: Request rate limit "per prefix" kyun hai, "per bucket" kyun nahi?**

Kyunki S3 internally objects ko **key ke hash se partitions me** distribute karta hai. Ek partition ek physical resource set hai jiski apni throughput capacity hai.

```
Bucket "jmfs-data" ke keys:
  reports/2026/aug.csv  ──hash──► Partition A  (3,500 writes/s capacity)
  logs/app/2026.json    ──hash──► Partition B  (3,500 writes/s capacity)
  uploads/x/file.pdf    ──hash──► Partition C  (3,500 writes/s capacity)
                                       ↓
                        Total bucket capacity = A + B + C + ... = unlimited
```

Agar limit "per bucket" hoti to bucket ek scaling unit hota — aur phir tumhe artificially multiple buckets banane padte scale karne ke liye (jo purana 100-bucket quota ke saath impossible tha).

Per-prefix hone se **bucket infinitely scale karta hai**, bas tumhe keys distribute karni hain. AWS traffic dekh kar partitions automatically split karta rehta hai.

Ye exactly wahi concept hai jo DynamoDB me **partition key** ka hai, aur SQL Server me **partitioned table** ka. Aur bottleneck bhi wahi hai: **hot partition**.

> 💡 **Gotcha:** Partition splitting **automatic hai lekin instant nahi** — 30-60 minutes lag sakte hain. Agar tumhara workload predictable spike wala hai (jaise month-end batch jo 20,000 writes/s karta hai), to pehle se **warm-up** karo: traffic ko gradually ramp karo, ya AWS Support ko batao. Cold start par sudden burst = throttling ke pehle 30 minutes. Aur **key ka pehla hissa hi matter karta hai** hashing ke liye — `2026-08-06/tenant-42/x` me sab objects ek partition par jaayenge kyunki prefix same hai. `tenant-42/2026-08-06/x` better hai kyunki tenant IDs distributed hain.

---

**Q78: S3 ko filesystem ki tarah mount karna bura idea kyun hai (usually)?**

Kyunki tum ek **API mismatch** ko abstraction se chhupa rahe ho, aur wo abstraction leak karegi:

| Filesystem expect karta hai | S3 deta hai | Result |
|---|---|---|
| `open()` → `seek()` → `write()` | Poora object PUT | Har write = poora file re-upload |
| `append()` | Kuch nahi | FUSE layer download+append+upload karega |
| `rename()` — atomic, O(1) | COPY + DELETE | Non-atomic, O(size), fail ho sakta beech me |
| `stat()` — microseconds | HeadObject — ~50-100 ms | `ls -la` ek directory me = ghanta |
| File locking (`flock`) | Kuch nahi | Multiple writers = silent corruption |
| Directory listing — instant | LIST API — paginated, slow | `ls` bade folder me = minutes + $$ |

FUSE layer inko emulate karta hai, lekin emulation ki keemat hai. Ek `ls -la` jo local disk par 1 ms leta hai, wo S3 mount par har file ke liye ek HeadObject call karta hai — 10,000 files = 10,000 API calls = **seconds to minutes + $0.004**.

**Kab theek hai:** read-heavy, sequential access, bade files — jaise ML training data padhna ya log files process karna. **Mountpoint for S3** exactly isi ke liye optimize hai.

**Kab bura hai:** koi bhi write-heavy workload, random access, shared mutable files, ya jab app metadata operations bahut karti hai.

> 💡 **Gotcha:** Legacy app migration me log sochte hain "S3 mount kar denge, code change nahi karna padega". Phir production me: app slow ho jaati hai, bill unexpected aata hai, aur kabhi-kabhi **silent data corruption** hoti hai (do instances ek file par likh rahe hain, koi lock nahi). Agar app ka data actually object-shaped hai (write-once files) to **code ko S3 SDK par port karo** — ye 2 din ka kaam hai aur permanently better hai. Mount sirf tab jab port karna genuinely impossible ho (closed-source vendor app).

---

**Q79: S3 ko cache layer ki tarah use kar sakte ho?**

Technically haan, lekin usually galat choice:

| | S3 | ElastiCache (Redis) | CloudFront |
|---|---|---|---|
| Latency | ~100-200 ms | ~0.5 ms | ~10-50 ms (edge) |
| Cost model | Per request + storage | Per hour (provisioned) | Per request + transfer |
| TTL/expiry | Lifecycle (daily granularity) | Native, second-level | Native |
| Size limit | Unlimited | Memory-bound | Unlimited (origin S3) |

**S3 cache ke liye theek hai jab:** cached items **bade** hain (MBs), TTL **lamba** hai (hours/days), aur latency matter nahi karti. Example: pre-computed report PDFs, generated thumbnails, ML model artifacts.

**S3 cache ke liye bura hai jab:** items chhote hain, TTL chhota hai, ya latency matter karti hai. Ek 1 KB session token S3 me: $0.005/1,000 writes + 150 ms latency. Redis me: microseconds aur effectively free per operation.

**Sahi layered architecture:**
```
Request ──► CloudFront (edge cache, seconds-to-days TTL)
              │ miss
              ▼
            Redis (hot data, ms latency, seconds TTL)
              │ miss
              ▼
            S3 (source of truth, unlimited, durable)
```

> 💡 **Gotcha:** S3 par "cache" banane ki koshish me log `HeadObject` se existence check karte hain phir `GetObject` — **do requests, do round trips**. Seedha `GetObject` karo aur `NoSuchKey` catch karo — ek request, aadhi latency, aadha cost. Ye ek chhota sa pattern hai jo high-traffic path par bada fark deta hai.

---

**Q80: Ek naye project me S3 ka setup checklist kya hona chahiye?**

Ye din-1 checklist hai, jo maine baar-baar galat hote dekha hai:

```
□ Block Public Access — ON (bucket + account level)
□ ACLs disabled (ObjectOwnership: BucketOwnerEnforced)
□ Default encryption — SSE-S3 minimum; SSE-KMS + Bucket Key sensitive data ke liye
□ Bucket policy: DenyInsecureTransport (aws:SecureTransport = false)
□ Versioning ON (production buckets par)
□ Lifecycle rule: AbortIncompleteMultipartUpload after 7 days  ← ye SABSE zyada bhoolte hain
□ Lifecycle rule: NoncurrentVersionExpiration (versioning ke saath)
□ Lifecycle rule: ExpiredObjectDeleteMarker: true
□ Gateway VPC endpoint (free — NAT charges bachao)
□ CloudTrail data events (sensitive prefixes par, selective)
□ Server access logs (alag bucket me)
□ Tags: Environment, Owner, CostCenter, DataClassification
□ Naming: <company>-<env>-<purpose>-<region>-<account-id>
□ CRR to another region/account (production/compliance data)
□ AWS Budgets anomaly alert
□ IaC me define kiya (console me manual nahi)
□ cdk-nag / checkov pipeline me
```

CDK me ye ~30 lines me ho jaata hai (Section 6.3 dekho).

> 💡 **Gotcha:** In sab me se **AbortIncompleteMultipartUpload sabse zyada miss hota hai aur sabse chhupa hua cost hai.** Wo objects `aws s3 ls` me nahi dikhte, console me nahi dikhte, Storage Lens ke basic view me nahi dikhte — lekin bill me dikhte hain. Har existing bucket par abhi check karo:
> ```bash
> for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
>   N=$(aws s3api list-multipart-uploads --bucket "$B" \
>       --query 'length(Uploads)' --output text 2>/dev/null)
>   [ "$N" != "None" ] && [ "$N" != "0" ] && echo "$B: $N incomplete uploads"
> done
> ```

---

## 6. Hands-On Lab

**Scenario:** Ek production-grade bucket banao — private, encrypted, versioned, lifecycle rules ke saath, aur usse ek Node service se padho/likho. Phir cleanup.

Jo banayenge:
- Bucket: `jmfs-lab-docs-<random>`
- Bucket policy: TLS enforce + unencrypted uploads deny
- Lifecycle: IA → Glacier IR → expire, plus MPU cleanup, plus version cleanup
- IAM role prefix-scoped access ke saath

---

### 6.1 AWS Console (clicks ke saath)

**Step 1 — Bucket banao**
1. Console → **S3** → **Create bucket**
2. Bucket type: **General purpose**
3. Name: `jmfs-lab-docs-8x2k` (globally unique — apna suffix daalo)
4. Region: **Asia Pacific (Mumbai) ap-south-1**
5. Object Ownership: **ACLs disabled (recommended)** — default
6. Block Public Access: **saare 4 checkboxes ON** — default, chhedo mat
7. Bucket Versioning: **Enable**
8. Default encryption: **SSE-S3 (SSE-S3)**; agar KMS chahiye to **SSE-KMS** chuno aur **Bucket Key: Enable** zaroor karo
9. Tags: `Environment=lab`, `Owner=shani`, `CostCenter=CC-4471`
10. **Create bucket**

**Step 2 — Lifecycle rules**
1. Bucket kholo → **Management** tab → **Create lifecycle rule**
2. Rule name: `DocsArchival`
3. Scope: **Limit the scope** → Prefix: `docs/`
4. Object size: **Minimum 131072 bytes** (128 KB — chhote objects ko archive mat karo)
5. Actions checkboxes:
   - ☑ Move current versions between storage classes
     - Standard-IA after **30** days
     - Glacier Instant Retrieval after **90** days
   - ☑ Expire current versions after **2555** days (7 years)
   - ☑ Permanently delete noncurrent versions after **30** days, keep **3** newer versions
   - ☑ Delete expired object delete markers
   - ☑ **Delete incomplete multipart uploads after 7 days** ← ye kabhi mat bhoolna
6. **Create rule**

**Step 3 — Bucket policy (TLS + encryption enforce)**
1. **Permissions** tab → **Bucket policy** → **Edit**
2. Paste karo (bucket name badalna):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::jmfs-lab-docs-8x2k",
        "arn:aws:s3:::jmfs-lab-docs-8x2k/*"
      ],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::jmfs-lab-docs-8x2k/*",
      "Condition": {
        "Null": { "s3:x-amz-server-side-encryption": "true" }
      }
    }
  ]
}
```
3. **Save changes**

**Step 4 — Test karo**
1. **Objects** tab → **Create folder** → `docs` → Create
2. Us folder me koi PDF/CSV upload karo
3. Upload karke **Properties** tab dekho — Storage class `Standard`, Encryption `SSE-S3` dikhna chahiye
4. Same file dobara upload karo (overwrite) → **Versions** toggle on karo → do versions dikhenge
5. File delete karo → versions toggle on karke dekho → ek **delete marker** dikhega, original version abhi bhi hai

---

### 6.2 AWS CLI (actual commands)

```bash
set -euo pipefail
export AWS_REGION=ap-south-1
BUCKET="jmfs-lab-docs-$(openssl rand -hex 3)"
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
echo "Bucket: $BUCKET  Account: $ACCOUNT"

# ── 1. Bucket create ───────────────────────────────────────────────
aws s3api create-bucket \
  --bucket "$BUCKET" --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

# ── 2. Block Public Access (naye buckets me default hai, but be explicit)
aws s3api put-public-access-block --bucket "$BUCKET" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# ── 3. ACLs disable ────────────────────────────────────────────────
aws s3api put-bucket-ownership-controls --bucket "$BUCKET" \
  --ownership-controls '{"Rules":[{"ObjectOwnership":"BucketOwnerEnforced"}]}'

# ── 4. Versioning ──────────────────────────────────────────────────
aws s3api put-bucket-versioning --bucket "$BUCKET" \
  --versioning-configuration Status=Enabled

# ── 5. Default encryption (SSE-S3) ─────────────────────────────────
aws s3api put-bucket-encryption --bucket "$BUCKET" \
  --server-side-encryption-configuration '{
    "Rules":[{
      "ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},
      "BucketKeyEnabled":true}]}'
# SSE-KMS ke liye:
#   "SSEAlgorithm":"aws:kms","KMSMasterKeyID":"arn:aws:kms:ap-south-1:123:key/abc"
#   BucketKeyEnabled:true  ← ye 99% KMS cost bachata hai, HAMESHA true rakho

# ── 6. Lifecycle rules ─────────────────────────────────────────────
cat > /tmp/lifecycle.json <<'EOF'
{
  "Rules": [
    {
      "ID": "DocsArchival",
      "Status": "Enabled",
      "Filter": { "And": { "Prefix": "docs/", "ObjectSizeGreaterThan": 131072 } },
      "Transitions": [
        { "Days": 30, "StorageClass": "STANDARD_IA" },
        { "Days": 90, "StorageClass": "GLACIER_IR" }
      ],
      "Expiration": { "Days": 2555 }
    },
    {
      "ID": "CleanupNoncurrentVersions",
      "Status": "Enabled",
      "Filter": {},
      "NoncurrentVersionExpiration": { "NoncurrentDays": 30, "NewerNoncurrentVersions": 3 },
      "Expiration": { "ExpiredObjectDeleteMarker": true }
    },
    {
      "ID": "AbortStuckUploads",
      "Status": "Enabled",
      "Filter": {},
      "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 }
    }
  ]
}
EOF
aws s3api put-bucket-lifecycle-configuration --bucket "$BUCKET" \
  --lifecycle-configuration file:///tmp/lifecycle.json

# ── 7. Bucket policy ───────────────────────────────────────────────
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": ["arn:aws:s3:::$BUCKET", "arn:aws:s3:::$BUCKET/*"],
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    },
    {
      "Sid": "DenyUnencryptedUploads",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::$BUCKET/*",
      "Condition": { "Null": { "s3:x-amz-server-side-encryption": "true" } }
    }
  ]
}
EOF
aws s3api put-bucket-policy --bucket "$BUCKET" --policy file:///tmp/bucket-policy.json

# ── 8. Tags ────────────────────────────────────────────────────────
aws s3api put-bucket-tagging --bucket "$BUCKET" --tagging \
  'TagSet=[{Key=Environment,Value=lab},{Key=Owner,Value=shani},{Key=CostCenter,Value=CC-4471}]'

# ── 9. Test upload / download / versioning ─────────────────────────
echo "order_id,amount,status" > /tmp/test.csv
aws s3 cp /tmp/test.csv "s3://$BUCKET/docs/test.csv"

echo "order_id,amount,status,updated" > /tmp/test.csv
aws s3 cp /tmp/test.csv "s3://$BUCKET/docs/test.csv"     # v2

aws s3api list-object-versions --bucket "$BUCKET" --prefix docs/test.csv \
  --query 'Versions[].{Ver:VersionId,Latest:IsLatest,Size:Size}' --output table

aws s3 rm "s3://$BUCKET/docs/test.csv"                    # delete marker banega
aws s3 ls "s3://$BUCKET/docs/"                            # khaali dikhega
aws s3api list-object-versions --bucket "$BUCKET" --prefix docs/ \
  --query 'DeleteMarkers[].{Key:Key,Ver:VersionId}' --output table

# Delete marker hatao — object wapas
MARKER=$(aws s3api list-object-versions --bucket "$BUCKET" --prefix docs/test.csv \
  --query 'DeleteMarkers[0].VersionId' --output text)
aws s3api delete-object --bucket "$BUCKET" --key docs/test.csv --version-id "$MARKER"
aws s3 ls "s3://$BUCKET/docs/"                            # wapas aa gaya

# ── 10. Multipart tuning + bada file test ──────────────────────────
aws configure set default.s3.max_concurrent_requests 20
aws configure set default.s3.multipart_threshold 64MB
aws configure set default.s3.multipart_chunksize 16MB

# ── 11. Kya chhupa hua garbage hai? ────────────────────────────────
aws s3api list-multipart-uploads --bucket "$BUCKET"
aws s3api get-bucket-lifecycle-configuration --bucket "$BUCKET"

# ── 12. Presigned URL banake test ──────────────────────────────────
aws s3 presign "s3://$BUCKET/docs/test.csv" --expires-in 900
```

---

### 6.3 AWS CDK (TypeScript)

```bash
mkdir s3-lab && cd s3-lab
npx cdk init app --language typescript
npm install aws-cdk-lib constructs
npm install --save-dev cdk-nag
```

`lib/s3-lab-stack.ts`:
```typescript
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as iam from "aws-cdk-lib/aws-iam";
import * as kms from "aws-cdk-lib/aws-kms";

export class S3LabStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // ── Optional: customer-managed KMS key ────────────────────────
    const key = new kms.Key(this, "DocsKey", {
      enableKeyRotation: true,
      description: "Encryption key for jmfs docs bucket",
      removalPolicy: cdk.RemovalPolicy.DESTROY,   // sirf lab me!
    });

    // ── Bucket ─────────────────────────────────────────────────────
    const bucket = new s3.Bucket(this, "DocsBucket", {
      bucketName: `jmfs-lab-docs-${this.account}-${this.region}`,

      // Security
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_ENFORCED,  // ACLs off
      encryption: s3.BucketEncryption.KMS,
      encryptionKey: key,
      bucketKeyEnabled: true,          // ← 99% KMS cost saving. HAMESHA.
      enforceSSL: true,                // ← DenyInsecureTransport policy auto-add

      // Durability
      versioned: true,

      // Lifecycle
      lifecycleRules: [
        {
          id: "DocsArchival",
          enabled: true,
          prefix: "docs/",
          objectSizeGreaterThan: 131072,          // 128 KB
          transitions: [
            { storageClass: s3.StorageClass.INFREQUENT_ACCESS, transitionAfter: cdk.Duration.days(30) },
            { storageClass: s3.StorageClass.GLACIER_INSTANT_RETRIEVAL, transitionAfter: cdk.Duration.days(90) },
          ],
          expiration: cdk.Duration.days(2555),    // 7 years
        },
        {
          id: "CleanupNoncurrentVersions",
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(30),
          noncurrentVersionsToRetain: 3,
          expiredObjectDeleteMarker: true,
        },
        {
          id: "AbortStuckUploads",
          enabled: true,
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),  // ← MANDATORY
        },
      ],

      // Lab only — production me RETAIN
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    cdk.Tags.of(bucket).add("Environment", "lab");
    cdk.Tags.of(bucket).add("Owner", "shani");
    cdk.Tags.of(bucket).add("CostCenter", "CC-4471");

    // ── Deny unencrypted uploads ───────────────────────────────────
    bucket.addToResourcePolicy(new iam.PolicyStatement({
      sid: "DenyUnencryptedUploads",
      effect: iam.Effect.DENY,
      principals: [new iam.AnyPrincipal()],
      actions: ["s3:PutObject"],
      resources: [bucket.arnForObjects("*")],
      conditions: { Null: { "s3:x-amz-server-side-encryption": "true" } },
    }));

    // ── App role with prefix-scoped access ─────────────────────────
    const appRole = new iam.Role(this, "DocServiceRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      description: "Read/write access to docs/ prefix only",
    });

    // CDK ka grant helper — KMS permissions bhi automatically add karta hai
    bucket.grantReadWrite(appRole, "docs/*");
    // Ye internally teen cheezein karta hai:
    //   1. s3:GetObject/PutObject/DeleteObject on bucket/docs/*
    //   2. s3:ListBucket on bucket (prefix condition ke saath)
    //   3. kms:Decrypt/GenerateDataKey on the key
    // Manually likhne me log #3 bhool jaate hain aur ghanton debug karte hain

    new cdk.CfnOutput(this, "BucketName", { value: bucket.bucketName });
    new cdk.CfnOutput(this, "RoleArn", { value: appRole.roleArn });
  }
}
```

`bin/s3-lab.ts`:
```typescript
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { S3LabStack } from "../lib/s3-lab-stack";

const app = new cdk.App();
new S3LabStack(app, "S3LabStack", {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: "ap-south-1" },
});
Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
```

Deploy:
```bash
npx cdk bootstrap aws://<ACCOUNT>/ap-south-1
npx cdk synth      # generated CloudFormation + cdk-nag findings dekho
npx cdk diff
npx cdk deploy
```

`cdk-nag` jo flag karega: `AwsSolutions-S1` (server access logs missing) — production me wo bhi add karo.

---

### 6.4 Cleanup

**CDK:**
```bash
npx cdk destroy    # autoDeleteObjects: true hone se objects bhi jaayenge
```

**CLI (order matter karta hai):**
```bash
BUCKET=jmfs-lab-docs-8x2k

# 1. Sab object versions
aws s3api list-object-versions --bucket "$BUCKET" \
  --query '{Objects: Versions[].{Key:Key,VersionId:VersionId}}' \
  --output json > /tmp/v.json
[ "$(jq '.Objects | length' /tmp/v.json)" != "0" ] && \
  aws s3api delete-objects --bucket "$BUCKET" --delete file:///tmp/v.json

# 2. Sab delete markers
aws s3api list-object-versions --bucket "$BUCKET" \
  --query '{Objects: DeleteMarkers[].{Key:Key,VersionId:VersionId}}' \
  --output json > /tmp/m.json
[ "$(jq '.Objects | length' /tmp/m.json)" != "0" ] && \
  aws s3api delete-objects --bucket "$BUCKET" --delete file:///tmp/m.json

# 3. Incomplete multipart uploads (ye LIST me nahi dikhte!)
aws s3api list-multipart-uploads --bucket "$BUCKET" \
  --query 'Uploads[].[Key,UploadId]' --output text | \
while read KEY UPLOADID; do
  [ -n "$KEY" ] && aws s3api abort-multipart-upload \
    --bucket "$BUCKET" --key "$KEY" --upload-id "$UPLOADID"
done

# 4. Ab bucket delete
aws s3api delete-bucket --bucket "$BUCKET"
```

> **Millions of objects hain?** CLI se mat karo. Ek lifecycle rule lagao (`Expiration: {Days: 1}` + `NoncurrentVersionExpiration: {NoncurrentDays: 1}` + `AbortIncompleteMultipartUpload: {DaysAfterInitiation: 1}`), 2 din wait karo, phir bucket delete karo. Lifecycle expiration **free** hai; LIST + DELETE calls ka paisa lagta hai.

---

## 7. Code Integration

### 7.1 Node.js / TypeScript (AWS SDK v3)

```bash
npm install @aws-sdk/client-s3 @aws-sdk/lib-storage \
            @aws-sdk/s3-request-presigner @aws-sdk/s3-presigned-post
```

**Client setup (production-tuned):**
```typescript
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";
import { Agent } from "https";

export const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "ap-south-1",
  maxAttempts: 6,                   // default 3 — production ke liye kam hai
  retryMode: "adaptive",            // throttling par khud rate kam karega
  requestHandler: new NodeHttpHandler({
    httpsAgent: new Agent({ maxSockets: 100, keepAlive: true }),
    connectionTimeout: 3_000,
    requestTimeout: 60_000,
  }),
});
```
`keepAlive: true` critical hai — bina uske har request par naya TLS handshake, jo ~50-100 ms add karta hai.

**Upload — chhota object:**
```typescript
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function putSmall(key: string, body: Buffer | string) {
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET!,
    Key: key,
    Body: body,
    ContentType: "application/json",
    ServerSideEncryption: "aws:kms",
    ChecksumAlgorithm: "SHA256",
    Metadata: { "generated-by": "report-service" },
  }));
}
```

**Upload — bada object / stream (multipart, resumable):**
```typescript
import { Upload } from "@aws-sdk/lib-storage";
import { createReadStream } from "fs";

export async function putLarge(key: string, filePath: string) {
  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.BUCKET!,
      Key: key,
      Body: createReadStream(filePath),
      ServerSideEncryption: "aws:kms",
    },
    queueSize: 8,                     // parallel parts
    partSize: 16 * 1024 * 1024,       // 16 MB
    leavePartsOnError: false,         // fail par parts abort karo — MPU garbage se bacho
  });

  upload.on("httpUploadProgress", (p) => {
    if (p.total) console.log(`${Math.round((p.loaded! / p.total) * 100)}%`);
  });

  return upload.done();
}
```
`leavePartsOnError: false` bahut important hai — warna failed uploads ke parts storage lete rehte hain (Q12 gotcha).

**Download — stream (poora memory me mat lo):**
```typescript
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { pipeline } from "stream/promises";
import { createWriteStream } from "fs";
import type { Readable } from "stream";

export async function getToFile(key: string, dest: string) {
  const res = await s3.send(new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
  await pipeline(res.Body as Readable, createWriteStream(dest));
}

// Chhote objects ke liye
export async function getText(key: string): Promise<string> {
  const res = await s3.send(new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
  return res.Body!.transformToString();
}
```

**Parallel byte-range download (bade files, max throughput):**
```typescript
export async function getParallel(key: string, concurrency = 8): Promise<Buffer> {
  const head = await s3.send(new HeadObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
  const size = head.ContentLength!;
  const chunk = Math.ceil(size / concurrency);

  const parts = await Promise.all(
    Array.from({ length: concurrency }, async (_, i) => {
      const start = i * chunk;
      const end = Math.min(start + chunk - 1, size - 1);
      if (start > end) return Buffer.alloc(0);
      const res = await s3.send(new GetObjectCommand({
        Bucket: process.env.BUCKET!, Key: key, Range: `bytes=${start}-${end}`,
      }));
      return Buffer.from(await res.Body!.transformToByteArray());
    })
  );
  return Buffer.concat(parts);
}
```

**Pagination — sab objects list karo (memory-safe):**
```typescript
import { paginateListObjectsV2 } from "@aws-sdk/client-s3";

export async function* allKeys(prefix: string) {
  const paginator = paginateListObjectsV2(
    { client: s3, pageSize: 1000 },
    { Bucket: process.env.BUCKET!, Prefix: prefix }
  );
  for await (const page of paginator) {
    for (const obj of page.Contents ?? []) yield obj.Key!;
  }
}

// Use:
for await (const key of allKeys("docs/2026/")) { /* ... */ }
```
Manual `ContinuationToken` loop mat likho — paginator sab handle karta hai.

**Presigned URLs:**
```typescript
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { GetObjectCommand } from "@aws-sdk/client-s3";

// Download URL
export async function downloadUrl(key: string) {
  return getSignedUrl(s3, new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }),
    { expiresIn: 900 });
}

// Upload — POST ke saath size/type limits (PUT me ye possible nahi)
export async function uploadForm(tenantId: string, filename: string) {
  return createPresignedPost(s3, {
    Bucket: process.env.BUCKET!,
    Key: `uploads/${tenantId}/${crypto.randomUUID()}-${filename}`,
    Conditions: [
      ["content-length-range", 1, 10 * 1024 * 1024],        // 1 byte – 10 MB
      ["starts-with", "$Content-Type", "application/pdf"],
      ["starts-with", "$key", `uploads/${tenantId}/`],       // tenant isolation
    ],
    Fields: { "x-amz-server-side-encryption": "aws:kms" },
    Expires: 900,
  });
}
```

**Conditional write (optimistic locking):**
```typescript
export async function updateIfUnchanged(key: string, body: string, expectedETag: string) {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.BUCKET!, Key: key, Body: body, IfMatch: expectedETag,
    }));
    return { ok: true as const };
  } catch (e: any) {
    if (e.name === "PreconditionFailed") return { ok: false as const, reason: "conflict" };
    throw e;
  }
}

// Distributed lock / idempotency key
export async function acquireLock(lockKey: string): Promise<boolean> {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: process.env.BUCKET!, Key: lockKey,
      Body: JSON.stringify({ owner: process.env.HOSTNAME, at: Date.now() }),
      IfNoneMatch: "*",
    }));
    return true;
  } catch (e: any) {
    if (e.name === "PreconditionFailed") return false;   // kisi aur ke paas lock hai
    throw e;
  }
}
```

**Error handling jo actually kaam karta hai:**
```typescript
const RETRYABLE = new Set([
  "SlowDown", "ServiceUnavailable", "InternalError",
  "RequestTimeout", "ThrottlingException", "TimeoutError",
]);

export async function withS3Retry<T>(fn: () => Promise<T>, maxTries = 6): Promise<T> {
  for (let i = 0; i < maxTries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      const name = err?.name ?? "";

      // Ye kabhi retry se theek nahi honge
      if (name === "AccessDenied") {
        console.error("S3 authorization failed — policy/KMS check karo:", err.message);
        throw err;
      }
      if (name === "NoSuchKey" || name === "NoSuchBucket") throw err;

      if (!RETRYABLE.has(name) || i === maxTries - 1) throw err;

      const delay = Math.min(2 ** i * 200, 10_000) + Math.random() * 300;  // jitter
      await new Promise(r => setTimeout(r, delay));
    }
  }
  throw new Error("unreachable");
}
```

**Existence check — sahi tareeka:**
```typescript
// ❌ Do requests
// if (await exists(key)) { const o = await get(key); }

// ✅ Ek request
export async function getIfExists(key: string) {
  try {
    return await s3.send(new GetObjectCommand({ Bucket: process.env.BUCKET!, Key: key }));
  } catch (e: any) {
    if (e.name === "NoSuchKey" || e.$metadata?.httpStatusCode === 404) return null;
    throw e;
  }
}
```

---

### 7.2 .NET Core (C#)

Tumhare primary stack ke liye:

```bash
dotnet add package AWSSDK.S3
dotnet add package AWSSDK.Extensions.NETCore.Setup
```

**DI setup:**
```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();
```

**Upload with TransferUtility (multipart automatic):**
```csharp
using Amazon.S3;
using Amazon.S3.Model;
using Amazon.S3.Transfer;

public sealed class DocumentStore
{
    private readonly IAmazonS3 _s3;
    private readonly string _bucket;

    public DocumentStore(IAmazonS3 s3, IConfiguration cfg)
    {
        _s3 = s3;
        _bucket = cfg["S3:Bucket"]!;
    }

    public async Task UploadAsync(string key, Stream content, CancellationToken ct = default)
    {
        // TransferUtility automatically multipart use karta hai bade files ke liye
        var transfer = new TransferUtility(_s3);
        var request = new TransferUtilityUploadRequest
        {
            BucketName = _bucket,
            Key = key,
            InputStream = content,
            ServerSideEncryptionMethod = ServerSideEncryptionMethod.AWSKMS,
            PartSize = 16 * 1024 * 1024,      // 16 MB
            ContentType = "application/pdf",
        };
        request.UploadProgressEvent += (_, e) =>
            Console.WriteLine($"{e.PercentDone}% ({e.TransferredBytes}/{e.TotalBytes})");

        await transfer.UploadAsync(request, ct);
    }

    public async Task<Stream> DownloadAsync(string key, CancellationToken ct = default)
    {
        var response = await _s3.GetObjectAsync(
            new GetObjectRequest { BucketName = _bucket, Key = key }, ct);
        return response.ResponseStream;   // caller dispose karega
    }

    public async Task<bool> ExistsAsync(string key, CancellationToken ct = default)
    {
        try
        {
            await _s3.GetObjectMetadataAsync(
                new GetObjectMetadataRequest { BucketName = _bucket, Key = key }, ct);
            return true;
        }
        catch (AmazonS3Exception ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
        {
            return false;
        }
    }
}
```

**Pagination:**
```csharp
public async IAsyncEnumerable<string> ListKeysAsync(
    string prefix, [EnumeratorCancellation] CancellationToken ct = default)
{
    var request = new ListObjectsV2Request
    {
        BucketName = _bucket, Prefix = prefix, MaxKeys = 1000
    };

    ListObjectsV2Response response;
    do
    {
        response = await _s3.ListObjectsV2Async(request, ct);
        foreach (var obj in response.S3Objects) yield return obj.Key;
        request.ContinuationToken = response.NextContinuationToken;
    }
    while (response.IsTruncated);
}
```

**Presigned URL:**
```csharp
public string GetDownloadUrl(string key, TimeSpan validFor)
{
    return _s3.GetPreSignedURL(new GetPreSignedUrlRequest
    {
        BucketName = _bucket,
        Key = key,
        Verb = HttpVerb.GET,
        Expires = DateTime.UtcNow.Add(validFor),
    });
}
```

**Error handling:**
```csharp
try
{
    await store.UploadAsync(key, stream);
}
catch (AmazonS3Exception ex) when (ex.ErrorCode == "AccessDenied")
{
    logger.LogError(ex, "S3 access denied for {Key}. Bucket policy, IAM policy, " +
                        "aur KMS key policy teeno check karo.", key);
    throw;
}
catch (AmazonS3Exception ex) when (ex.ErrorCode == "SlowDown")
{
    logger.LogWarning("S3 throttling — prefix distribution ya concurrency dekho");
    throw;
}
```

---

### 7.3 Go

```go
package main

import (
	"context"
	"log"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/s3/manager"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/aws/aws-sdk-go-v2/service/s3/types"
)

func main() {
	ctx := context.Background()
	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithRegion("ap-south-1"),
		config.WithRetryMaxAttempts(6),
	)
	if err != nil {
		log.Fatal(err)
	}
	client := s3.NewFromConfig(cfg)

	// Upload — manager.Uploader multipart khud handle karta hai
	f, _ := os.Open("big.zip")
	defer f.Close()

	uploader := manager.NewUploader(client, func(u *manager.Uploader) {
		u.PartSize = 16 * 1024 * 1024 // 16 MB
		u.Concurrency = 8
		u.LeavePartsOnError = false   // ← failed upload ke parts abort karo
	})

	_, err = uploader.Upload(ctx, &s3.PutObjectInput{
		Bucket:               aws.String("jmfs-docs"),
		Key:                  aws.String("archives/big.zip"),
		Body:                 f,
		ServerSideEncryption: types.ServerSideEncryptionAwsKms,
	})
	if err != nil {
		log.Fatal(err)
	}

	// Pagination
	paginator := s3.NewListObjectsV2Paginator(client, &s3.ListObjectsV2Input{
		Bucket: aws.String("jmfs-docs"),
		Prefix: aws.String("archives/"),
	})
	for paginator.HasMorePages() {
		page, err := paginator.NextPage(ctx)
		if err != nil {
			log.Fatal(err)
		}
		for _, obj := range page.Contents {
			log.Println(*obj.Key, obj.Size)
		}
	}
}
```

> **Go gotcha:** `manager.Uploader` ka `LeavePartsOnError` **default `false`** hai (Go me sahi default), lekin `manager.Downloader` ka concurrency default 5 hai — bade files ke liye badhao. Aur Go me `paginator.HasMorePages()` loop hi sahi tareeka hai, manual token juggling mat karo.

---

## 8. Production Gotchas

Ye wo galtiyaan hain jo actually production me hoti hain — har ek maine ya toh khud ki hai ya kisi ko karte dekha hai.

**1. Incomplete multipart uploads ka lifecycle rule na lagana**
Failed uploads ke parts **hamesha ke liye** storage lete rehte hain aur `aws s3 ls` me **bilkul nahi dikhte**. Maine "0 objects" wale bucket ka 2 TB bill dekha hai. Har bucket par day-1 se:
```json
{ "AbortIncompleteMultipartUpload": { "DaysAfterInitiation": 7 } }
```
Existing damage check: `aws s3api list-multipart-uploads --bucket X`

**2. Versioning on karke noncurrent version expiration na lagana**
Ek 1 GB file jo roz overwrite hoti hai = mahine me 30 GB. Versioning **hamesha** lifecycle ke saath aata hai:
```json
{ "NoncurrentVersionExpiration": { "NoncurrentDays": 30, "NewerNoncurrentVersions": 3 },
  "Expiration": { "ExpiredObjectDeleteMarker": true } }
```

**3. Gateway VPC endpoint na banana**
Private subnet se S3 traffic NAT gateway se jaata hai = **$0.045/GB**. 10 TB/month = **$450/month**. Gateway endpoint **free** hai aur ye charge zero kar deta hai. Ye har company me milta hai kyunki bill "NAT Gateway" line me chhupa hota hai, "S3" me nahi.

**4. `s3:ListBucket` aur `s3:GetObject` ke ARN mix karna**
`ListBucket` bucket ARN par (`arn:aws:s3:::bucket`), `GetObject` object ARN par (`arn:aws:s3:::bucket/*`). Symptom: `aws s3 cp` chalta hai lekin `aws s3 ls` fail hota hai (ya ulta). Sabse common S3 permission galti.

**5. SSE-KMS use karke Bucket Key enable na karna**
Bina Bucket Key ke har object operation ek KMS API call hai. 1 million objects = **$3.00 KMS charges**. Bucket Key se ye **~$0.03** ho jaata hai. Ek boolean flag, 99% saving:
```json
"BucketKeyEnabled": true
```

**6. Sequential keys use karna high-throughput workload me**
`logs/2026-08-06T09:14:22-001.json` jaise keys sab ek partition par jaate hain → **3,500 req/s par throttle**. High-cardinality prefix pehle daalo: `logs/a3f9/2026-08-06T...`. Ye SQL me sequential clustered index par hotspot jaisa hi problem hai.

**7. Chhote objects ko Glacier/IA me daalna**
Minimum billable size (IA me 128 KB, Glacier me 40 KB + 32 KB overhead) aur transition charges milkar cost **badha** dete hain. 50 KB ke 5M objects Deep Archive me bhejna: $250 one-time transition + 180-din lock, jabki Standard me monthly cost sirf $6 tha. Lifecycle rule me hamesha `ObjectSizeGreaterThan: 131072` lagao.

**8. Bucket ko public karna static website ke liye**
2026 me ye almost hamesha galti hai. **CloudFront + Origin Access Control (OAC)** use karo — bucket private rehta hai, tumhe CDN, WAF, custom domain SSL, aur sasta transfer bhi milta hai.

**9. Lambda ka output usi bucket me likhna jispar trigger laga hai**
Infinite loop. Thousands of dollars in hours. Har company me ek baar hota hai. Prevention: **alag input aur output buckets**, ya strict prefix filters, plus Lambda par reserved concurrency as a circuit breaker.

**10. `LIST` ko loop me chalana**
```typescript
for (const id of ids) {              // ❌ 1M objects = 1M LIST calls = $5 + throttling
  await s3.send(new ListObjectsV2Command({ Bucket, Prefix: `data/${id}/` }));
}
```
Agar key pata hai to `HeadObject` (12× sasta). Bulk work ke liye **S3 Inventory** (daily Parquet report) + Athena. Millions of objects par LIST se scan karna architectural galti hai.

**11. Replication laga ke sochna ki purana data bhi copy ho gaya**
Replication **sirf naye writes** par lagti hai. Existing objects ke liye **S3 Batch Replication** alag se chalana padta hai. Aur delete markers default me replicate **nahi** hote. DR bucket 6 mahine se aadha khaali ho sakta hai aur tumhe pata nahi chalega — `OperationsFailedReplication` par CloudWatch alarm lagao.

**12. Bucket policy me `Principal: "*"` + `Deny` likhkar khud ko lock out karna**
Ye **root user par bhi** lagta hai. VPCE ya IP restriction lagate waqt hamesha ek escape hatch rakho:
```json
"StringNotLike": { "aws:PrincipalArn": "arn:aws:iam::123:role/BreakGlassAdmin" }
```

**13. Presigned PUT me size limit na lagana**
Presigned PUT me `content-length-range` possible hi nahi hai — user 5 GB upload kar sakta hai. Agar size limit chahiye (production me chahiye hoti hai) to **presigned POST** use karo.

**14. Object Lock COMPLIANCE mode galti se lagana**
**Irreversible.** 100 TB par 7-saal ka lock = 7 saal ka bill, delete karne ka koi tareeka nahi, root bhi nahi, account close karne par bhi nahi. Hamesha pehle GOVERNANCE mode me test karo.

**15. Cross-account access me sirf ek side configure karna**
Cross-account me **bucket policy AUR requester ki IAM policy dono** chahiye — ye AND hai. Aur SSE-KMS ho to **KMS key policy** bhi teesri jagah hai. 40-minute debugging session guaranteed hai jab tak teeno check na karo.

**16. `ETag` ko integrity check ke liye use karna**
Multipart upload ka ETag content ka MD5 **nahi** hai — wo `<hash-of-hashes>-<partcount>` hai, aur **part size par depend karta hai**. Same file, alag part size = alag ETag. Explicit `ChecksumAlgorithm: "SHA256"` use karo.

**17. Retry logic na hona**
S3 ka SLA 99.99% hai — 1M requests/day par **100 expected failures/day**. SDK ka default `maxAttempts: 3` production ke liye kam hai. `maxAttempts: 6` + `retryMode: "adaptive"` set karo. "S3 unreliable hai" wali complaints ka asli reason yahi hota hai.

**18. `keepAlive` disable rehna**
Default me har request naya TLS handshake karta hai = **~50-100 ms extra per request**. High-throughput service me ye 2× latency ka fark hai:
```typescript
new NodeHttpHandler({ httpsAgent: new Agent({ keepAlive: true, maxSockets: 100 }) })
```

**19. Bucket name me dots use karna**
`my.bucket.name.s3.amazonaws.com` — AWS ka wildcard cert sirf ek level cover karta hai → **SSL certificate mismatch**. Dots sirf tab jab custom domain match karna ho, aur wahan bhi CloudFront lagao.

**20. Restore ko `--recursive` ke saath chalana**
50 TB archive ka accidental full restore = **$500+ retrieval charges** + restored copy ka storage + wo bhi Standard rate par jitne `Days` diye. Restore hamesha specific keys tak scope karo, aur bulk ke liye S3 Batch Operations use karo (progress + cost visibility milti hai).

**21. Console me manual changes karke IaC drift banana**
Emergency fix console se kiya, PR nahi banaya → agla `cdk deploy` usko revert kar dega, aksar production incident ke beech me. AWS Config drift detection lagao.

**22. Public bucket ka scrape notice na karna**
500 GB public assets, roz koi scraper poora download kare = 15 TB/month = **~$1,600/month**. AWS Budgets me anomaly alert lagao ($50 daily spike par email), aur public buckets rakho hi mat.

---

## 9. Cost Example

### Scenario

Ek document-management workload — tumhare JMFS context ke kareeb:

| Parameter | Value |
|---|---|
| Clients | 10,000 |
| Total objects | ~5 million (KYC docs, statements, trade confirmations) |
| Total storage | 5 TB (growing ~300 GB/month) |
| PUT + LIST requests | 1,000,000 / month |
| GET requests | 4,000,000 / month |
| Egress to users | 200 GB / month (CloudFront ke through) |
| Encryption | SSE-KMS, 2 CMKs |
| Versioning | ON (30-day noncurrent retention) |
| DR | CRR to ap-southeast-1, critical 2 TB only |
| Compliance | 7-year retention, CloudTrail on PII prefix |
| Region | ap-south-1 (Mumbai) |

Storage distribution (lifecycle ke baad):
- Standard: 1.5 TB (current-year, active)
- Standard-IA: 2 TB (30-90 days old)
- Glacier IR: 1.5 TB (90+ days, quarterly access)
- Noncurrent versions: 300 GB

### Line-by-line monthly bill

⚠️ ap-south-1 rates, Aug 2026. AWS Pricing Calculator se verify karo.

| # | Line item | Calculation | Monthly |
|---|---|---|---|
| **STORAGE** | | | |
| 1 | S3 Standard | 1,536 GB × $0.025 | **$38.40** |
| 2 | S3 Standard-IA | 2,048 GB × $0.014 | **$28.67** |
| 3 | S3 Glacier Instant Retrieval | 1,536 GB × $0.005 | **$7.68** |
| 4 | Noncurrent versions (Standard) | 300 GB × $0.025 | **$7.50** |
| **REQUESTS** | | | |
| 5 | PUT / COPY / POST / LIST | 1,000,000 / 1,000 × $0.005 | **$5.00** |
| 6 | GET / SELECT | 4,000,000 / 1,000 × $0.0004 | **$1.60** |
| 7 | IA / Glacier IR retrieval requests | ~150,000 / 1,000 × $0.001 | **$0.15** |
| **RETRIEVAL** | | | |
| 8 | Standard-IA data retrieval | 50 GB × $0.01 | **$0.50** |
| 9 | Glacier IR data retrieval | 10 GB × $0.03 | **$0.30** |
| **LIFECYCLE TRANSITIONS** | | | |
| 10 | Standard → Standard-IA | 200,000 / 1,000 × $0.01 | **$2.00** |
| 11 | Standard-IA → Glacier IR | 150,000 / 1,000 × $0.05 | **$7.50** |
| **REPLICATION (DR)** | | | |
| 12 | CRR data transfer (cross-region) | 300 GB × $0.086 | **$25.80** |
| 13 | DR bucket storage (Standard-IA, ap-southeast-1) | 2,048 GB × $0.014 | **$28.67** |
| 14 | DR replication PUT requests | 200,000 / 1,000 × $0.005 | **$1.00** |
| **ENCRYPTION** | | | |
| 15 | KMS keys | 2 × $1.00 | **$2.00** |
| 16 | KMS requests (**Bucket Key ON**) | ~10,000 / 10,000 × $0.03 | **$0.03** |
| **DATA TRANSFER** | | | |
| 17 | S3 → CloudFront | Free | **$0.00** |
| 18 | S3 → internet (direct, admin/API) | 20 GB (first 100 GB free) | **$0.00** |
| 19 | S3 → EC2/Lambda same region (gateway endpoint) | Free | **$0.00** |
| **MANAGEMENT** | | | |
| 20 | S3 Inventory (weekly) | 5M objects × 4 × $0.0025/M | **$0.05** |
| 21 | Storage Lens (free tier) | — | **$0.00** |
| 22 | CloudTrail data events (PII prefix only) | 500,000 / 100,000 × $0.10 | **$0.50** |
| 23 | Server access logs storage | 5 GB × $0.025 | **$0.13** |
| **CDN (S3 ke saath aata hai)** | | | |
| 24 | CloudFront data transfer out (India) | 200 GB × $0.109 | **$21.80** |
| 25 | CloudFront requests | 4M × $0.0090/10,000 | **$3.60** |
| | **TOTAL** | | **~$182.88 / month** |

### Agar ye sab galat kiya hota (same workload)

| Galti | Extra cost |
|---|---|
| Sab kuch Standard me (koi lifecycle nahi) | 5,120 GB × $0.025 = $128 vs $74.75 → **+$53** |
| Gateway endpoint nahi, NAT se S3 traffic (2 TB internal) | 2,048 GB × $0.045 → **+$92** |
| Bucket Key off (SSE-KMS ke saath) | 5M KMS calls × $0.03/10k → **+$15** |
| CloudFront nahi, direct S3 egress | 200 GB × $0.1093 (100 GB free ke baad) → **+$11** |
| Incomplete MPU cleanup nahi (1 saal ka jamā) | ~400 GB invisible × $0.025 → **+$10** |
| Noncurrent version expiry nahi (1 saal) | ~2 TB extra × $0.025 → **+$51** |
| | **~$232 extra/month = $2,784/year** |

**Yaani sahi setup ka bill $183 hai, galat setup ka $415.** Same data, same traffic. Ye **2.3×** ka fark sirf configuration ka hai.

### Cost optimization tips (impact ke order me)

**1. Gateway VPC endpoint lagao (savings: $50-500/month)**
Sabse bada single win. Free hai, 30 second ka kaam hai, aur NAT charges zero kar deta hai.
```bash
aws ec2 create-vpc-endpoint --vpc-id vpc-0abc --vpc-endpoint-type Gateway \
  --service-name com.amazonaws.ap-south-1.s3 --route-table-ids rtb-0aaa rtb-0bbb
```

**2. Lifecycle rules — but size filter ke saath (savings: 40-60% storage)**
```json
"Filter": { "And": { "Prefix": "docs/", "ObjectSizeGreaterThan": 131072 } }
```
Size filter ke bina chhote objects par lifecycle **ulta mehnga** padta hai.

**3. Noncurrent version expiration (savings: 20-50% agar versioning on hai)**
Versioning ke saath ye **mandatory** hai, optional nahi.

**4. Incomplete MPU cleanup (savings: variable, kabhi-kabhi huge)**
```bash
# Sab buckets me check karo — abhi
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  N=$(aws s3api list-multipart-uploads --bucket "$B" --query 'length(Uploads)' --output text 2>/dev/null)
  [ "$N" != "None" ] && [ "$N" != "0" ] && echo "$B: $N incomplete"
done
```

**5. CloudFront lagao read-heavy workload par (savings: 60-80% GET + transfer)**
Cache hit S3 tak pahunchti hi nahi — na GET charge, na transfer charge.

**6. Bucket Key ON karo (savings: 99% KMS cost)**
Ek boolean. Agar SSE-KMS use kar rahe ho aur ye off hai to abhi on karo.

**7. Intelligent-Tiering jab access pattern pata na ho (savings: 20-40%, risk-free)**
Objects >250 KB par worth hai. Galat lifecycle guess karne se better.

**8. Small files ko compact karo (savings: requests + Athena scan time)**
Data lake me daily compaction job, ya S3 Tables (automatic compaction).

**9. LIST ko S3 Inventory se replace karo (savings: request charges + hours)**
5M objects list karna: LIST se 5,000 calls + ghanta; Inventory se ek Parquet file + seconds.

**10. AWS Budgets anomaly alert (savings: catastrophe prevention)**
Daily spike par email. Ye paisa nahi bachata, **disaster rokta hai**.

**Realistic optimized target: ~$150-165/month** — yaani baseline se ~10-15% aur, bina kisi functionality compromise ke.

---

## 10. Limits Cheat Sheet

### Buckets

| Cheez | Default | Maximum | Soft/Hard |
|---|---|---|---|
| **General purpose buckets per account** | **10,000** | **1,000,000** | Soft (Service Quotas) |
| Buckets free of charge | 2,000 | — | First 2,000 free, upar chhota monthly fee ⚠️ verify |
| Bucket name length | — | 3–63 chars | Hard |
| Objects per bucket | — | **Unlimited** | — |
| Total data per bucket | — | **Unlimited** | — |
| Bucket policy size | — | **20 KB** | Hard |
| Lifecycle rules per bucket | — | 1,000 | Hard |
| CORS rules per bucket | — | 100 | Hard |
| Replication rules per bucket | — | 1,000 | Hard |
| Event notification configs | — | 100 | Hard |
| Bucket tags | — | 50 | Hard |
| Access points per bucket | — | 10,000 | Hard |
| Multi-Region Access Points per account | 100 | — | Soft |

> Bucket quota **sirf us-east-1 se** view/manage hota hai (commercial regions ke liye). Aur quota 10,000 se upar ho to `ListBuckets` **paginated** hi chalegi.

### Objects

| Cheez | Limit |
|---|---|
| Minimum object size | 0 bytes |
| **Maximum object size** | **50 TB** (48.8 TiB) — Dec 2025 se; pehle 5 TB |
| Single PUT maximum | **5 GB** |
| Console upload maximum | **160 GB** |
| Key length | **1,024 bytes** (UTF-8) |
| User-defined metadata | **2 KB** total |
| Object tags | 10 per object |
| Versions per object | Unlimited |

### Multipart upload

| Cheez | Limit |
|---|---|
| Maximum parts per upload | **10,000** |
| Part numbers | 1 – 10,000 |
| Part size | **5 MiB – 5 GiB** (last part ka koi minimum nahi) |
| Recommended threshold | 100 MB se bade objects |
| Parts returned per `ListParts` | 1,000 |
| Uploads returned per `ListMultipartUploads` | 1,000 |
| Multipart upload expiry | **Koi nahi** — manually abort ya lifecycle rule |

### Performance

| Cheez | Limit |
|---|---|
| PUT / COPY / POST / DELETE | **3,500 per second per partitioned prefix** |
| GET / HEAD | **5,500 per second per partitioned prefix** |
| Prefixes per bucket | **Unlimited** (yaani bucket throughput unlimited) |
| Partition split time | ~30–60 minutes (automatic) |
| Single TCP connection throughput | ~85–100 MB/s (practical) |
| `ListObjectsV2` keys per response | 1,000 |

### Storage class minimums

| Class | Min storage duration | Min billable object size |
|---|---|---|
| Standard | — | Actual size |
| Intelligent-Tiering | — | Actual size (monitoring fee 128 KB+ par) |
| Standard-IA | **30 days** | **128 KB** |
| One Zone-IA | **30 days** | **128 KB** |
| Glacier Instant Retrieval | **90 days** | **128 KB** |
| Glacier Flexible Retrieval | **90 days** | **40 KB** (+ ~32 KB overhead) |
| Glacier Deep Archive | **180 days** | **40 KB** (+ ~32 KB overhead) |
| Express One Zone | **1 hour** | **512 KB** |

### Retrieval times

| Class | Tier | Time |
|---|---|---|
| Standard / IA / Glacier IR | — | Milliseconds (instant) |
| Glacier Flexible Retrieval | Expedited | 1–5 minutes |
| | Standard | 3–5 hours |
| | Bulk | 5–12 hours (free) |
| Glacier Deep Archive | Standard | ~12 hours |
| | Bulk | ~48 hours |

### Apne account me check karo

```bash
# Bucket quota (sirf us-east-1 se)
aws service-quotas list-service-quotas --service-code s3 --region us-east-1 \
  --query 'Quotas[].{Name:QuotaName,Value:Value,Adjustable:Adjustable}' --output table

# Kitne buckets hain
aws s3api list-buckets --query 'length(Buckets)'

# Ek bucket me kitna data (Storage Lens ya CloudWatch se — LIST se mat karo)
aws cloudwatch get-metric-statistics --namespace AWS/S3 \
  --metric-name BucketSizeBytes \
  --dimensions Name=BucketName,Value=jmfs-docs Name=StorageType,Value=StandardStorage \
  --start-time "$(date -u -d '2 days ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --period 86400 --statistics Average
```

---

## 11. Interview Questions

### Junior level (0–3 years)

**J1. S3 kya hai aur ye filesystem se kaise alag hai?**
S3 object storage hai — flat key-value store jahan har object ek key se identify hota hai, HTTP API se access hota hai. Filesystem me hierarchy hoti hai, partial writes hote hain, aur `seek()` kaam karta hai. S3 me objects **immutable** hain — ek byte badalne ke liye poora object dobara PUT karna padta hai. `reports/2026/aug.csv` me `/` sirf ek character hai, koi actual directory nahi. Console jo "folders" dikhata hai wo LIST API ke `Delimiter` parameter se compute hote hain.

**J2. Bucket aur object me kya fark hai?**
Bucket top-level container hai jo ek specific region me rehta hai aur jiska naam **globally unique** hona chahiye (kyunki wo DNS hostname ka hissa hai). Object bucket ke andar stored item hai — key, value (0 bytes se 50 TB), metadata, aur version ID. Ek bucket me objects ki koi limit nahi hai. Bucket ka naam aur region banane ke baad badal nahi sakte.

**J3. Storage classes kaunse hain aur Standard vs Glacier kab?**
S3 Standard active data ke liye — koi retrieval fee nahi, instant access, sabse mehnga ($0.025/GB-mo ap-south-1 me). Glacier classes archive ke liye — bahut sasta ($0.004 se $0.00099/GB-mo) lekin retrieval fee lagti hai aur Flexible/Deep Archive me object ko pehle `restore` karna padta hai (minutes se 48 hours). Beech me Standard-IA hai. Rule: agar data mahine me ek se zyada baar padha jaata hai to Standard, warna lifecycle rules se archive me bhejo.

**J4. Bucket ko public kaise karte hain — aur kyun nahi karna chahiye?**
Technically bucket policy me `"Principal": "*"` + `s3:GetObject`, aur Block Public Access off karna padta hai. Lekin **2026 me ye almost hamesha galti hai**. Sahi tareeka: bucket private rakho (Block Public Access on), aur CloudFront + Origin Access Control lagao. Isse HTTPS, custom domain, CDN caching, WAF, aur sasta data transfer sab mil jaata hai — aur bucket kabhi public nahi hota. Public buckets data breach aur scraping cost dono ka #1 source hain.

**J5. Versioning kya karti hai?**
Versioning on hone par har overwrite purani copy ko rakh leta hai apne version ID ke saath, aur `DeleteObject` actually delete nahi karta — wo ek **delete marker** daal deta hai. Object gayab lagta hai lekin sab versions maujood hain; delete marker hatate hi wapas aa jaata hai. Accidental deletion se bachne ke liye zaroori hai. **Lekin** har version ka storage bill aata hai, isliye versioning ke saath hamesha `NoncurrentVersionExpiration` lifecycle rule lagana chahiye.

---

### Mid level (3–7 years)

**M1. S3 ka bill achanak badh gaya — kaise investigate karoge?**
Cost Explorer me Service=S3, Group by **Usage Type** — ye exact meter batata hai (`TimedStorage` = storage, `Requests-Tier1` = PUT/LIST, `Requests-Tier2` = GET, `DataTransfer-Out` = egress, `EarlyDelete` = minimum duration violation). Phir Storage Lens se bucket/prefix identify karo. Common causes: (a) versioning on hai aur noncurrent versions jamā ho rahe, (b) **incomplete multipart uploads** — jo LIST me dikhte hi nahi, (c) LIST loop kisi code me, (d) public bucket ka scrape, (e) gateway VPC endpoint missing hai to NAT charges. Aakhri ka bill "NAT Gateway" line me aata hai, "S3" me nahi — isliye log dhoondh nahi paate.

**M2. Ek bucket me 10,000 requests/second chahiye — kaise design karoge?**
Limit **per partitioned prefix** hai: 3,500 writes/s, 5,500 reads/s. Prefixes ki koi limit nahi, isliye keys distribute karke linearly scale karo. Sequential keys (`logs/2026-08-06T09:14:22-001`) sab ek partition par jaati hain — hotspot. High-cardinality prefix pehle daalo: `logs/a3f9/2026-08-06T...` (4 hex chars = 65,536 partitions). Aur: SDK me `retryMode: "adaptive"` + `maxAttempts: 6`, keepAlive on, aur traffic gradually ramp karo kyunki partition splitting me 30-60 minutes lagte hain. Read-heavy ho to CloudFront lagao — cache hits S3 tak pahunchti hi nahi.

**M3. Cross-account S3 access setup karo — kya-kya chahiye?**
Cross-account me **dono** side chahiye (ye AND hai, OR nahi): (1) target bucket ki **bucket policy** me source account ka principal allowed ho, (2) source account ki **IAM policy** me wahi permissions hon. Agar bucket SSE-KMS se encrypted hai to **teesri** cheez bhi chahiye: KMS **key policy** me source account ko `kms:Decrypt`/`kms:GenerateDataKey`. Teesra bhoolna sabse common hai aur error `AccessDenied` aata hai jo bucket policy ka lagta hai. Alternative aur cleaner: source account tumhara role assume kare — phir wo tumhare account ka principal ban jaata hai aur normal same-account rules lagti hain, plus clean audit trail milta hai.

**M4. Lifecycle rule lagayi Glacier me bhejne ke liye, lekin bill badh gaya — kyun?**
Teen possible reasons. (a) **Minimum billable object size** — Glacier me 40 KB minimum + ~32 KB metadata overhead per object. 10 KB ke millions objects par tum actual data se 7× zyada pay kar rahe ho. (b) **Transition charges** — ~$0.05 per 1,000 objects to Glacier; 5M objects = $250 one-time, jo months ka storage saving kha jaata hai. (c) **Early delete** — Glacier ka 90-din (Deep Archive ka 180-din) minimum duration; agar lifecycle usse pehle expire kar rahi hai to full minimum ka charge lagta hai (`EarlyDelete` usage type me dikhega). Fix: lifecycle rule me `ObjectSizeGreaterThan: 131072` filter lagao, aur ensure karo ki transition day + minimum duration ≤ expiration day.

**M5. Browser se directly S3 me file upload karana hai — secure design kya hoga?**
Server-side me user ko authenticate karo, phir **presigned POST** generate karo (presigned PUT nahi) — kyunki POST me `Conditions` laga sakte ho: `content-length-range` (size limit), `starts-with $Content-Type` (file type), aur `starts-with $key` (tenant prefix isolation). Key server generate kare (`uploads/${tenantId}/${uuid}`), kabhi user input se nahi — warna path traversal se doosre tenant ke prefix me likh sakta hai. Bucket par CORS configure karo with specific origin (`*` nahi), `ExposeHeaders` me ETag rakho (multipart ke liye zaroori). Expiry chhoti rakho (15 min). Upload ke baad S3 event → Lambda se validate karo (actual content type, virus scan, size).

---

### Senior / Architect level (7+ years)

**S1. 500 TB ka data lake design karo — S3 layer ki decisions kya hongi?**
**Layout:** medallion architecture — `raw/` (original format, immutable), `curated/` (Parquet, partitioned), `aggregated/` (query-optimized). **Partitioning:** Hive-style paths (`year=/month=/day=`) us dimension par jispar sabse zyada filter hota hai — ye composite index ka column order choose karne jaisa hai. **File format:** Parquet + Snappy/ZSTD; target file size 128 MB – 1 GB. **Small files problem** biggest killer hai — daily compaction job, ya S3 Tables (automatic compaction with Iceberg). **Storage classes:** raw → lifecycle to Glacier IR after 90 days; curated → Intelligent-Tiering (access pattern unpredictable hota hai analytics me). **Access:** Lake Formation ya S3 Access Points per-team, taaki bucket policy 20 KB limit na hit ho. **Networking:** gateway VPC endpoint (NAT charges bachane ke liye — 500 TB par ye lakhs ka fark hai). **Cost control:** Storage Lens, S3 Inventory (LIST ke bajaye), Athena partition projection. **Governance:** object tags + ABAC with locked tagging permissions.

**Follow-up jo aata hai:** "Athena queries slow hain, kya karoge?" — pehle `EXPLAIN` aur scanned-bytes dekho. 90% cases me answer teen me se ek hai: partitioning nahi hai (full scan), CSV/JSON use ho raha hai (Parquet me convert karo), ya small files problem (compaction chalao).

**S2. S3 ka consistency model kya hai, aur pehle kya tha — architectural implications kya thi?**
December 2020 se S3 **strongly consistent** hai — saare operations par, bina extra cost ya latency ke. Usse pehle overwrites aur deletes **eventually consistent** the (naye objects par read-after-write consistency thi). Wo data lake workloads me **silent correctness bug** tha: Spark stage 1 file likhta, stage 2 LIST karke padhne jaata, file nahi milti, aggregation chupchaap galat aa jaati — koi error nahi. Industry ne workarounds banaye — Netflix ka S3mper, Hadoop ka S3Guard, EMRFS consistent view — sab DynamoDB me external consistency layer maintain karte the, jo khud buggy aur operationally bhaari tha. AWS ne metadata subsystem redesign karke ye solve kiya. **Important caveat:** strong consistency **object data** par hai; **bucket-level configuration** (policy, lifecycle, CORS, replication) abhi bhi eventually consistent hai — IaC pipelines me policy apply karke turant test karna flaky rahega.

**S3. RPO 15 minutes aur RTO 1 hour chahiye 50 TB S3 data ke liye — design karo.**
**Replication:** CRR to a different region **aur** different account (ransomware/insider threat ke liye account separation zaroori hai — same account ka DR compromised credentials se bhi delete ho sakta hai). **RTC (Replication Time Control)** enable karo — ye 99.99% objects 15 minute me replicate karne ka SLA deta hai aur CloudWatch metrics deta hai; cost $0.015/GB. **Existing data:** S3 Batch Replication chalao, kyunki normal replication sirf naye writes par lagti hai. **Delete protection:** versioning + `s3:DeleteObjectVersion` par explicit Deny (break-glass role ko chhodkar) + Object Lock Governance mode. **RTO ke liye:** DR bucket, IAM roles, aur bucket policies **pehle se bane hue** hone chahiye — incident ke waqt control plane operations unreliable ho sakte hain. Application me failover logic ho (primary fail → DR endpoint), ya Multi-Region Access Point use karo automatic routing ke liye. **Monitoring:** `OperationsFailedReplication` par CloudWatch alarm, aur `ReplicationLatency` metric. **Testing:** quarterly failover drill — untested DR DR nahi hai.

**S4. Multi-tenant SaaS me S3 par tenant isolation kaise karoge — aur kya galtiyaan hoti hain?**
Teen options: (a) **bucket per tenant** — strongest isolation, lekin 10,000 bucket quota aur per-bucket configuration overhead; ab 10,000 default hone se ye zyada viable hai than pehle. (b) **Prefix per tenant** with IAM/session policies — sabse common. (c) **S3 Access Points per tenant** — beech ka raasta, per-tenant policy without bucket explosion. Prefix approach me **classic galti**: log `s3:prefix` condition lagakar sochte hain isolation ho gaya — lekin `s3:prefix` **sirf ListBucket** par kaam karti hai, `GetObject` par bilkul nahi. `GetObject` ko restrict karne ka ek hi tareeka hai — **Resource ARN me hi prefix** (`arn:aws:s3:::bucket/tenant-42/*`). Bina uske koi bhi tenant doosre ki known key padh sakta hai. Scale ke liye: ek broad role + **session policy** per request (AssumeRole ke waqt tenant-scoped policy pass karo) — isse per-tenant IAM role banane ki zaroorat nahi padti. Aur presigned URLs me key **kabhi user input se mat lo** — path traversal.

**S5. Ek team bol rahi hai "S3 hamare use case ke liye slow hai" — kaise diagnose karoge?**
Pehle **measure** karo, guess mat karo: first-byte latency vs total transfer time alag karo. S3 Standard ka first-byte ~100-200 ms hai — agar app har request par chhota object padh rahi hai to bottleneck **latency** hai, bandwidth nahi. Diagnosis tree: (a) **Chhote objects, high request rate** → ye S3 ka use case nahi hai; DynamoDB ya ElastiCache use karo, ya CloudFront lagao, ya S3 Express One Zone (~5-10 ms) consider karo. (b) **Bade objects, slow transfer** → parallel multipart/byte-range GET use kar rahe ho? Single TCP connection ~85-100 MB/s par capped hai. `keepAlive` on hai? Lambda me memory badhao (network bandwidth memory ke saath scale karti hai). (c) **LIST slow hai** → S3 Inventory par shift karo. (d) **503 SlowDown aa raha hai** → prefix distribution ka problem hai. (e) **Cross-region read** → 200 ms extra; replicate karo ya compute move karo. Architectural answer: agar latency genuinely bottleneck hai to sawal ye hai ki data S3 me hona bhi chahiye ya nahi — S3 "always available, infinitely large, cheap" ke liye optimize hai, "fast" ke liye nahi. Ye trade-off explicit karo team ke saath.

---

## 12. Commands Cheat Sheet

### Basics (`aws s3` — high-level)
```bash
aws s3 ls                                        # sab buckets
aws s3 ls s3://jmfs-docs/                        # bucket ka top level
aws s3 ls s3://jmfs-docs/reports/ --recursive --human-readable --summarize

aws s3 cp file.pdf s3://jmfs-docs/docs/          # upload
aws s3 cp s3://jmfs-docs/docs/file.pdf .         # download
aws s3 cp s3://jmfs-docs/docs/ ./local/ --recursive
aws s3 mv s3://jmfs-docs/a.pdf s3://jmfs-docs/b/ # COPY + DELETE (atomic nahi!)
aws s3 rm s3://jmfs-docs/docs/file.pdf
aws s3 rm s3://jmfs-docs/tmp/ --recursive

aws s3 sync ./local/ s3://jmfs-docs/docs/ --delete
aws s3 sync s3://src-bucket/ s3://dst-bucket/ --source-region ap-south-1

aws s3 presign s3://jmfs-docs/docs/file.pdf --expires-in 900
```

### Bucket configuration (`aws s3api`)
```bash
aws s3api create-bucket --bucket X --region ap-south-1 \
  --create-bucket-configuration LocationConstraint=ap-south-1

aws s3api get-bucket-location --bucket X
aws s3api get-bucket-versioning --bucket X
aws s3api get-bucket-encryption --bucket X
aws s3api get-bucket-policy --bucket X --query Policy --output text | jq .
aws s3api get-bucket-lifecycle-configuration --bucket X
aws s3api get-public-access-block --bucket X
aws s3api get-bucket-ownership-controls --bucket X
aws s3api get-bucket-cors --bucket X
aws s3api get-bucket-replication --bucket X
aws s3api get-bucket-tagging --bucket X
aws s3api get-bucket-notification-configuration --bucket X

aws s3api put-bucket-versioning --bucket X --versioning-configuration Status=Enabled
aws s3api put-bucket-policy --bucket X --policy file://policy.json
aws s3api put-bucket-lifecycle-configuration --bucket X --lifecycle-configuration file://lc.json
aws s3api delete-bucket-policy --bucket X
```

### Objects
```bash
aws s3api head-object --bucket X --key docs/file.pdf         # metadata, koi download nahi
aws s3api get-object --bucket X --key docs/file.pdf out.pdf
aws s3api put-object --bucket X --key docs/file.pdf --body file.pdf \
  --server-side-encryption aws:kms --metadata source=upload-svc

aws s3api list-objects-v2 --bucket X --prefix docs/ --max-items 20
aws s3api list-objects-v2 --bucket X --prefix docs/ --delimiter / \
  --query 'CommonPrefixes[].Prefix'                          # "folders"

aws s3api copy-object --bucket X --key new.pdf \
  --copy-source X/old.pdf --metadata-directive REPLACE --metadata k=v

aws s3api get-object-tagging --bucket X --key docs/file.pdf
aws s3api put-object-tagging --bucket X --key docs/file.pdf \
  --tagging 'TagSet=[{Key=Team,Value=payments}]'
```

### Versions aur delete markers
```bash
aws s3api list-object-versions --bucket X --prefix docs/ \
  --query 'Versions[].{Key:Key,Ver:VersionId,Latest:IsLatest,Size:Size}' --output table

aws s3api list-object-versions --bucket X \
  --query 'DeleteMarkers[].{Key:Key,Ver:VersionId}' --output table

aws s3api get-object --bucket X --key docs/f.pdf --version-id "abc123" out.pdf
aws s3api delete-object --bucket X --key docs/f.pdf --version-id "abc123"
```

### Multipart (chhupa hua garbage dhoondho)
```bash
aws s3api list-multipart-uploads --bucket X
aws s3api list-parts --bucket X --key big.zip --upload-id "abc123"
aws s3api abort-multipart-upload --bucket X --key big.zip --upload-id "abc123"

# SAB buckets me incomplete uploads dhoondho — ye abhi chalao
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  N=$(aws s3api list-multipart-uploads --bucket "$B" --query 'length(Uploads)' --output text 2>/dev/null)
  [ "$N" != "None" ] && [ "$N" != "0" ] && echo "$B: $N incomplete uploads"
done
```

### Glacier restore
```bash
aws s3api restore-object --bucket X --key archive/2019.csv \
  --restore-request '{"Days":7,"GlacierJobParameters":{"Tier":"Standard"}}'

aws s3api head-object --bucket X --key archive/2019.csv --query Restore
# → "ongoing-request=\"true\""  ya  "ongoing-request=\"false\", expiry-date=\"...\""
```

### Size aur cost investigation
```bash
# Bucket size — CloudWatch se (LIST se MAT karo, mehnga aur slow hai)
aws cloudwatch get-metric-statistics --namespace AWS/S3 \
  --metric-name BucketSizeBytes \
  --dimensions Name=BucketName,Value=X Name=StorageType,Value=StandardStorage \
  --start-time "$(date -u -d '2 days ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --period 86400 --statistics Average

# Object count
aws cloudwatch get-metric-statistics --namespace AWS/S3 \
  --metric-name NumberOfObjects \
  --dimensions Name=BucketName,Value=X Name=StorageType,Value=AllStorageTypes \
  --start-time "$(date -u -d '2 days ago' +%Y-%m-%dT%H:%M:%SZ)" \
  --end-time "$(date -u +%Y-%m-%dT%H:%M:%SZ)" --period 86400 --statistics Average

# Storage class ke hisaab se breakdown
aws s3api list-objects-v2 --bucket X --query \
  'Contents[].StorageClass' --output text | tr '\t' '\n' | sort | uniq -c
```

### Performance tuning (CLI)
```bash
aws configure set default.s3.max_concurrent_requests 30
aws configure set default.s3.max_queue_size 10000
aws configure set default.s3.multipart_threshold 64MB
aws configure set default.s3.multipart_chunksize 16MB
aws configure set default.s3.max_bandwidth 100MB/s     # throttle karna ho to
```

### Batch Operations aur Inventory
```bash
aws s3api put-bucket-inventory-configuration --bucket X --id weekly \
  --inventory-configuration file://inventory.json

aws s3control create-job --account-id 123456789012 \
  --operation '{"S3PutObjectCopy":{"TargetResource":"arn:aws:s3:::dst","StorageClass":"GLACIER_IR"}}' \
  --manifest file://manifest.json --report file://report.json \
  --priority 10 --role-arn arn:aws:iam::123:role/BatchOpsRole --no-confirmation-required

aws s3control describe-job --account-id 123456789012 --job-id <job-id>
```

### Emergency / audit one-liners
```bash
# Kaunse buckets public hain?
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  R=$(aws s3api get-public-access-block --bucket "$B" 2>/dev/null \
      --query 'PublicAccessBlockConfiguration.BlockPublicPolicy' --output text)
  [ "$R" != "True" ] && echo "⚠️  $B — BlockPublicPolicy not enforced"
done

# Kaunse buckets me versioning nahi hai?
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  V=$(aws s3api get-bucket-versioning --bucket "$B" --query Status --output text 2>/dev/null)
  [ "$V" != "Enabled" ] && echo "$B: versioning=${V:-None}"
done

# Kaunse buckets me lifecycle rule nahi hai?
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  aws s3api get-bucket-lifecycle-configuration --bucket "$B" >/dev/null 2>&1 || \
    echo "$B: NO lifecycle rules"
done

# Kaunse buckets unencrypted hain?
for B in $(aws s3api list-buckets --query 'Buckets[].Name' --output text); do
  aws s3api get-bucket-encryption --bucket "$B" >/dev/null 2>&1 || \
    echo "$B: NO default encryption"
done
```

---

## 13. Kab NAHI Use Karna

### ❌ S3 galat tool hai jab...

| Requirement | Kyun S3 nahi | Sahi tool |
|---|---|---|
| **Sub-10ms latency** | S3 Standard ~100-200 ms | ElastiCache (Redis), DynamoDB, ya S3 Express One Zone (~5-10 ms) |
| **Partial file updates** | Objects immutable — poora rewrite | EBS, EFS, ya database |
| **Multi-writer same file** | Koi locking nahi (conditional writes limited help) | EFS, FSx, ya database |
| **Transactions across objects** | Koi multi-object ACID nahi | RDS, DynamoDB (transactions) |
| **Secondary indexes / query by content** | Sirf key prefix scan | DynamoDB (GSI), RDS, OpenSearch |
| **Frequently mutating small state** | Har PUT $0.005/1,000 + poora rewrite | DynamoDB, ElastiCache, RDS |
| **POSIX filesystem semantics** | Rename O(n), no locks, no seek-write | EFS, FSx for Lustre/Windows |
| **Append-only log writing** | Append exist hi nahi karta | Kinesis Data Streams, Firehose (jo baad me S3 me daalta hai) |
| **Sub-second stream processing** | Event notifications me seconds ka delay | Kinesis, MSK (Kafka) |
| **Message queue** | Koi ordering, visibility timeout, DLQ nahi | SQS, SNS, EventBridge |

### ⚠️ S3 theek hai lekin galat tareeke se use ho raha hai

**"S3 ko database ki tarah use karna"** — JSON files me application state. Do problems: (a) koi transaction nahi, concurrent updates silently lost (jab tak conditional writes na use karo), (b) ek field ke liye poora object download. Sahi pattern hybrid hai: **metadata DB me, bytes S3 me** — `S3Key` foreign key ki tarah kaam karta hai.

**"S3 ko cache ki tarah use karna"** — chhote items ke liye Redis se mehnga aur 200× slow. S3 cache ke liye tab theek hai jab items **bade** hain aur TTL **lamba** hai (pre-computed reports, model artifacts).

**"S3 mount karke legacy app chalana"** — FUSE mount POSIX semantics emulate karta hai jo S3 me exist nahi karte. Random writes, appends, aur file locking silently galat behave karenge. **Mountpoint for S3** read-heavy sequential workloads ke liye acha hai; write-heavy ke liye nahi.

**"Har cheez Deep Archive me daal do, sasta hai"** — minimum duration (180 din), minimum billable size (40 KB + 32 KB overhead), transition charges, aur retrieval fees milkar aksar Standard se **mehnga** kar dete hain, especially chhote objects par.

### ✅ Alternatives ka comparison

| Need | Option A | Option B | Kab kaunsa |
|---|---|---|---|
| Object storage | **S3** | MinIO (self-hosted) | S3 hamesha AWS me; MinIO sirf on-prem/hybrid requirement par |
| Shared filesystem | EFS | **Mountpoint for S3** | Mountpoint read-heavy ke liye (14× sasta); EFS jab POSIX chahiye |
| Low-latency object access | S3 Standard | **S3 Express One Zone** | Express jab latency measurably bottleneck ho aur data re-creatable |
| Data lake tables | Self-managed Iceberg on S3 | **S3 Tables** | S3 Tables jab compaction/maintenance overhead se bachna ho; self-managed jab lock-in se bachna ho |
| Static site | S3 website endpoint | **CloudFront + OAC** | CloudFront hamesha — HTTPS, CDN, WAF, private bucket |
| Bulk migration | `aws s3 sync` | **DataSync / Snowball** | sync <1 TB tak; DataSync 1-100 TB; Snowball jab bandwidth hi problem ho |
| Query on S3 data | S3 Select | **Athena** | Athena almost hamesha — Parquet ke saath sasta bhi aur zyada powerful bhi |
| Tenant isolation | Bucket per tenant | **Prefix + session policy** | Prefix approach scale karta hai; bucket-per-tenant ab 10,000 quota ke saath zyada viable hai |
| Archive | Glacier lifecycle | **Intelligent-Tiering** | Intelligent-Tiering jab access pattern unknown ho aur objects >250 KB |

### Ek honest trade-off jo log nahi batate

**Managed features (S3 Tables, S3 Vectors, S3 Metadata) vs open alternatives:**

Ye features **real problems** solve karte hain — S3 Tables ka automatic compaction genuinely painful maintenance khatam kar deta hai. Lekin har ek **lock-in badhata hai**. Self-managed Iceberg on plain S3 portable hai (koi bhi engine, koi bhi cloud); S3 Tables AWS-specific hai.

**Practical framework:** teen dimensions par socho —
1. **Capability** — kya ye kuch aisa deta hai jo main khud nahi bana sakta?
2. **Operational savings** — kitna maintenance bachega, actual engineer-hours me?
3. **Lock-in cost** — agar 3 saal baad migrate karna pade to kitna painful hoga?

S3 Express One Zone ke liye lock-in kam hai (standard S3 API, sirf bucket type alag) — **adopt karo** jab latency genuinely bottleneck ho. S3 Tables ke liye operational savings real hain lekin lock-in zyada — **evaluate karo** agar tum already AWS + Iceberg par committed ho. S3 Vectors aur S3 Metadata abhi naye hain — **watch and wait**, jab tak ecosystem mature na ho.

---

## Quick Reference — Ye 12 Cheezein Yaad Rakho

1. **S3 flat key-value hai, filesystem nahi.** `/` sirf ek character hai. Rename = O(n) copy.
2. **`s3:ListBucket` bucket ARN par, `s3:GetObject` object ARN (`/*`) par.** #1 permission galti.
3. **`s3:prefix` condition sirf ListBucket par kaam karti hai** — GetObject ke liye Resource ARN me prefix likho.
4. **AbortIncompleteMultipartUpload lifecycle rule har bucket par** — invisible storage, real bill.
5. **Versioning ke saath NoncurrentVersionExpiration mandatory hai.**
6. **Gateway VPC endpoint FREE hai** aur NAT ke $0.045/GB bachata hai. Interface endpoint paisa leta hai.
7. **SSE-KMS ke saath `BucketKeyEnabled: true`** — 99% KMS cost saving, ek boolean.
8. **Chhote objects ko IA/Glacier me mat daalo** — 128 KB / 40 KB minimum billable size trap hai.
9. **Data IN free, data OUT mehnga.** Compute ko data ke paas laao, data ko compute ke paas nahi.
10. **3,500 writes / 5,500 reads per second per prefix.** Sequential keys = hotspot.
11. **Bucket public karne ki zaroorat nahi hai** — CloudFront + OAC use karo.
12. **`maxAttempts: 6` + `retryMode: "adaptive"` + `keepAlive: true`** — SDK defaults production ke liye kam hain.
