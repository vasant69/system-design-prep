import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fukd-1",
    question:
      "ASP.NET Core Web API me file upload securely kaise handle karoge? Poori flow batao.",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Endpoint `multipart/form-data` leta hai with an `IFormFile` parameter. Main defence-in-depth lagata hoon: request-level size limits, extension allowlist, declared content-type check, magic-byte signature sniff, ek generated stored name, bytes ko disk/blob pe stream, aur ek metadata row DB me.",
    detailedAnswer:
      "Layers, is order me:\n1. `[RequestSizeLimit]` + `[RequestFormLimits(MultipartBodyLengthLimit = ...)]` taaki bada payload bytes padhne se pehle reject ho.\n2. Extension allowlist (`.pdf`, `.png`, `.jpg`, `.jpeg`) — allowlist, blocklist nahi.\n3. Declared `IFormFile.ContentType` allowlist match — sasta pehla filter.\n4. Magic-byte sniff — pehle 8 bytes padho, `%PDF` / PNG / JPEG signature verify karo. Yahi ek trustworthy check hai kyunki filename aur content-type client-controlled hain.\n5. Stored name generate karo: `Guid.NewGuid():N` + validated extension. Client ka naam kabhi disk pe nahi. `OriginalFileName` sirf metadata me, `Path.GetFileName` se saaf karke.\n6. Bytes stream karo: `file.OpenReadStream()` se target `FileStream` me `CopyToAsync` (~80 KB buffer). Poori file kabhi memory me nahi.\n7. `EmployeeDocument` row insert: `EmployeeId`, original + stored name, content type, `SizeBytes` (`long`), `DocumentType` enum, `UploadedAtUtc`.\n8. `201 Created` + `Location` header download endpoint ka.\nProduction me local disk ki jagah S3 / Azure Blob for multi-instance + retention, aur ek antivirus scan hook.",
    followUp:
      "Magic bytes kyun jab extension already check kar liya? Ek se kaam nahi chal jaata?",
    redFlag:
      "'Extension aur content-type match ho gaye to file safe hai' maan lena — dono client-controlled hain, ye koi validation nahi.",
  },
  {
    id: "fukd-2",
    question:
      "Trap: dev bolta hai 'maine `.exe`, `.bat`, `.sh` block kar diye hain blocklist se, ab upload safe hai'. Kya galat hai?",
    type: "trap",
    difficulty: "intermediate",
    shortAnswer:
      "Blocklist hamesha adhoora rehta hai — `.aspx`, `.cshtml`, `.svg`, `.html`, `.phtml`, double extensions (`resume.pdf.aspx`) sab chhoot jaate hain. Allowlist chahiye: sirf jo explicitly allowed hai wahi.",
    detailedAnswer:
      "Blocklist ka core problem: tumhe har khatarnaak cheez pehle se pata honi chahiye. Naye executable/scriptable extensions aate rehte hain, aur server config pe depend karte hain (IIS handler mappings). `resume.pdf.aspx` blocklist ko chakma de sakta hai agar sirf last-token match kar rahe ho ya `.pdf` dekh kar khush ho jaao. Sahi: ek `AllowedExtensions` array with `.pdf`, `.png`, `.jpg`, `.jpeg` — iske bahar sab reject. Uske upar magic-byte sniff, aur files web-servable path se bahar (`C:\\emp-kyc-store\\...`), taaki accidentally executable file bhi request pe execute na ho.",
    followUp:
      "Allowlist me `.jpg` hai. Attacker ek valid JPEG bana kar usme ek script embed kar de to?",
    redFlag: "'Blocklist bada kar denge, aur extensions add kar denge' — race hamesha haaroge.",
  },
  {
    id: "fukd-3",
    question:
      "Ye code kya problem create karta hai?\n```csharp\nvar path = Path.Combine(_basePath, file.FileName);\nusing var fs = new FileStream(path, FileMode.Create);\nawait file.CopyToAsync(fs);\n```",
    type: "code-output",
    difficulty: "intermediate",
    shortAnswer:
      "`file.FileName` client-controlled hai. Client `..\\..\\..\\inetpub\\wwwroot\\shell.aspx` ya `..\\appsettings.json` bhej kar path traversal kar sakta hai — galat folder me likhna ya existing file overwrite. `FileMode.Create` overwrite bhi silently karta hai.",
    detailedAnswer:
      "`Path.Combine` `..` segments ko resolve karta hai, block nahi. To stored path `_basePath` se bahar ja sakta hai. Fix:\n```csharp\nvar ext = Path.GetExtension(file.FileName).ToLowerInvariant();\nif (!_allowed.Contains(ext)) throw new ValidationException(\"bad ext\");\nvar storedName = $\"{Guid.NewGuid():N}{ext}\";\nvar folder = Path.Combine(_basePath, employeeId.ToString());\nDirectory.CreateDirectory(folder);\nvar fullPath = Path.Combine(folder, storedName);\nusing var fs = new FileStream(fullPath, FileMode.CreateNew, FileAccess.Write, FileShare.None);\nawait file.OpenReadStream().CopyToAsync(fs, ct);\n```\n`FileMode.CreateNew` overwrite pe throw karta hai, `Guid` name traversal aur collision dono khatam kar deta hai.",
    followUp: "`Path.GetFileName(file.FileName)` laga dena kaafi hai path traversal ke liye?",
    redFlag: "'FileName pehle se hi safe aata hai browser se' — API ko browser ka bharosa nahi karna chahiye.",
  },
  {
    id: "fukd-4",
    question:
      "File disk pe likh di, phir `SaveChangesAsync` (metadata row) fail ho gaya. Kya hua, aur kaise handle karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Ek orphan file disk pe reh gayi jiska koi DB record nahi. Do options: `try/catch` jo insert fail hone pe file delete kar de, ya ek periodic cleanup job jo bina metadata row ke stored files ko sweep kare. Robust version: outbox-style, pehle row (Pending), phir file, phir status Committed.",
    detailedAnswer:
      "Disk write aur DB insert ek atomic transaction nahi hain. Simplest mitigation:\n```csharp\ntry\n{\n    _db.EmployeeDocuments.Add(doc);\n    await _db.SaveChangesAsync(ct);\n}\ncatch\n{\n    if (System.IO.File.Exists(fullPath)) System.IO.File.Delete(fullPath);\n    throw;\n}\n```\nYe crash/kill ke beech me nahi bachata. Isliye ek reconciliation job: har raat stored files vs `EmployeeDocument` rows compare karo, orphan files (older than 1 hour, no row) delete karo, aur rows jinki file missing hai unhe flag karo. Blob storage pe yahi kaam lifecycle rule + a 'pending uploads' prefix se hota hai.",
    followUp: "Ulta case — row insert ho gaya par file write fail — kaise pata chalega?",
  },
  {
    id: "fukd-5",
    question:
      "Document download endpoint pe `File(byte[], ...)` vs `PhysicalFile(path, ...)` — kaunsa aur kyun?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "`PhysicalFile` (ya `FileStreamResult`) — framework file ko seedha response me stream karta hai, constant memory, aur range/resume requests automatic. `File(byte[])` poori file RAM me load karta hai (buffering) — sirf chhoti files ya jab bytes transform karne hon tab.",
    detailedAnswer:
      "Streaming vs buffering ka rule: buffer tabhi jab bytes ko modify karna ho (resize, watermark, decrypt) ya source seekable na ho. Warna hamesha stream. `PhysicalFile(path, doc.ContentType, doc.OriginalFileName)` `Content-Disposition` header set karta hai download name ke saath, aur `Accept-Ranges` support karta hai taaki bade PDF resume ho sakein. `File(bytes, ...)` pe 50 concurrent 5 MB downloads = 250 MB RAM spike. Cross-tenant leak rokne ke liye query me `d.Id == docId && d.EmployeeId == id` dono match karo.",
    followUp: "Blob storage pe file hai to download API ke through bhejoge ya pre-signed URL doge?",
    redFlag: "'`File(await File.ReadAllBytesAsync(path))` simple hai' — bade files pe ye memory kill karta hai.",
  },
  {
    id: "fukd-6",
    question:
      "Production me 3 API instances load balancer ke peeche chal rahe hain, files local disk (`BasePath`) pe save ho rahi hain. Kya tootega?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Instance A pe upload hui file instance B ke disk pe nahi hoti. Download request agar B pe route ho to `404`. Fix: ek shared store — Azure Blob / AWS S3 — jise sab instances access karte hain.",
    detailedAnswer:
      "Local disk instance-scoped hai. Load balancer round-robin karega to upload aur download alag instances pe ja sakte hain. Blob storage isse solve karta hai plus deta hai: virtually unlimited size, server-side encryption, lifecycle rules (auto-archive/delete after N years for RBI/SEBI retention), per-object access control, CDN. Code change chhota: `SaveAsync` me `FileStream` ki jagah `BlobClient.UploadAsync`, `StoredFileName` ki jagah blob key. Isiliye `IDocumentBlobStore` interface ke peeche rakhta hoon taaki `LocalDiskStore` aur `AzureBlobStore` swap ho sakein — dev pe disk, prod pe blob.",
    followUp: "Interim fix ke roop me ek NFS/SMB shared mount kaafi hai?",
  },
  {
    id: "fukd-7",
    question:
      "`[RequestSizeLimit]`, `[RequestFormLimits(MultipartBodyLengthLimit)]`, aur Kestrel ka `MaxRequestBodySize` — teeno me farak kya hai?",
    type: "conceptual",
    difficulty: "advanced",
    shortAnswer:
      "Kestrel `MaxRequestBodySize` server-wide default (~30 MB) hai. `[RequestSizeLimit]` per-endpoint us server limit ko override karta hai poori request body ke liye. `[RequestFormLimits(MultipartBodyLengthLimit)]` sirf form/multipart parser ka apna limit hai (default ~128 MB), aur upload endpoints pe ise explicitly chhota karna zaroori hai.",
    detailedAnswer:
      "Teeno alag layers pe kaam karte hain. Agar sirf `[RequestSizeLimit(6MB)]` lagaya par `MultipartBodyLengthLimit` default `128 MB` chhoda, to multipart parser 128 MB tak buffer karne ko taiyaar rahega — request-size guard usse pehle hit hona chahiye, par galat config me gaps reh jaate hain. Best practice: dono attributes har upload endpoint pe explicit, thoda buffer (6 MB for a 5 MB file) multipart boundary overhead ke liye. Over-limit request `413 Payload Too Large` deta hai. Global default badalna ho to `builder.WebHost.ConfigureKestrel(o => o.Limits.MaxRequestBodySize = ...)` ya `FormOptions` via `Configure<FormOptions>`.",
    followUp: "`MultipartBodyLengthLimit` ko `int.MaxValue` set karna kab justified hai?",
    redFlag: "'Ek limit kaafi hai, teen jagah set karna over-engineering hai' — ye alag parser stages hain.",
  },
  {
    id: "fukd-8",
    question:
      "Trap: architect bolta hai 'files ko `varbinary(max)` column me DB me rakho, tab upload aur metadata ek transaction me commit honge, orphan problem hi khatam'. Kya bologe?",
    type: "trap",
    difficulty: "advanced",
    shortAnswer:
      "Transactional consistency milti hai par cost bahut zyada: DB size aur backup time phool jaate hain, buffer pool blob se bhar jaata hai, har query bhaari, restore slow. KYC-size files ke liye ye practically kabhi sahi nahi. Orphan problem ko cleanup job / outbox se solve karo, DB me bytes daal kar nahi.",
    detailedAnswer:
      "Ek 5 MB PDF x 50,000 employees x 3 documents = ~750 GB DB me sirf blobs. Har `SELECT *` accidentally blob load kar sakta hai, backups roz 750 GB, point-in-time restore ghante lega, aur SQL Server buffer pool (RAM cache) blobs se polluted ho kar real query performance giraata hai. Alternatives: bytes disk/blob pe, DB me pointer; consistency ke liye ek `try/catch` cleanup ya transactional-outbox pattern. SQL Server ka `FILESTREAM`/`FileTable` feature bhi generally avoid — operational complexity zyada, faayda kam.",
    followUp: "Kabhi chhoti files (say 20 KB signatures, thumbnails) DB me rakhna theek hai?",
    redFlag: "'Ek backup me sab aa jaayega, simple hai' — us backup ko restore karne ka time socho.",
  },
  {
    id: "fukd-9",
    question:
      "BFSI KYC upload me security team antivirus scan aur retention maang rahi hai. Design kaise karoge?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Upload pe file ko quarantine prefix/folder me rakho with `ScanStatus = Pending`. Ek background scanner (ClamAV / Defender CLI / cloud AV) file check kare aur status `Clean` ya `Infected` set kare. Download tabhi allow jab `Clean`. Retention ke liye blob lifecycle policy ya scheduled job jo N saal baad archive/delete kare.",
    detailedAnswer:
      "`EmployeeDocument` me `ScanStatus` (Pending/Clean/Infected) column. Flow: save to quarantine -> `BackgroundService` ya queue consumer scan chalata hai -> Clean pe file ko main store me move + status update, Infected pe delete + alert. Download endpoint `if (doc.ScanStatus != Clean) return StatusCodes 409/404`. Retention: RBI/SEBI aksar account band hone ke 5-8 saal baad tak KYD rakhna mandate karte hain — blob lifecycle rule (auto-tier to archive after 1 year, delete after 8), ya ek nightly job jo `UploadedAtUtc` + retention policy check kare. Na jaldi delete (compliance), na hamesha rakho (data-minimisation / GDPR).",
    followUp: "Scan Pending state me user ko kya response doge upload ke turant baad?",
  },
];

export default questions;
