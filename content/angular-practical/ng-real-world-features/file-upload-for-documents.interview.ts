import type { InterviewQuestion } from "@/lib/types";

const questions: InterviewQuestion[] = [
  {
    id: "fud-1",
    question: "Angular me file upload with progress ko end-to-end kaise implement karoge?",
    type: "coding",
    difficulty: "intermediate",
    shortAnswer:
      "`<input type=file>` -> `File`. Validate type/size in code. `const form = new FormData(); form.append('file', file, file.name)`. `http.post(url, form, { observe: 'events', reportProgress: true })`. In the subscription: `UploadProgress` -> `progress = round(100 * loaded / total)`; `Response` -> use `event.body`. Cancel = `unsubscribe()`. Never set `Content-Type`.",
    detailedAnswer:
      "Service returns `Observable<HttpEvent<AppDocument>>`. Component keeps `{ progress, status }` state (signal). Drag-drop via `@HostListener('dragover'/'drop')` reading `dataTransfer.files`. Multiple files: an array of upload states + a concurrency cap (`mergeMap` with `concurrent: 3`). Huge files / cloud storage: pre-signed URL + direct `PUT` + notify API. Server: validate MIME (magic bytes, not just extension), size, and virus-scan.",
    followUp: "Multiple parallel uploads ko ek concurrency limit ke saath kaise chalaoge?",
  },
  {
    id: "fud-2",
    question: "Client-side file validation kya cover karта hai aur server ko kya karna zaroori hai?",
    type: "conceptual",
    difficulty: "intermediate",
    shortAnswer:
      "Client: extension/MIME allowlist, size cap, maybe dimensions for images, an instant preview. All bypassable, so it's UX only. Server: authoritative MIME check (magic-byte sniffing, not trusting `file.type`), hard size limit, malware scan, storage-quota checks, and safe storage (no executable perms, random keys).",
    detailedAnswer:
      "`file.type` comes from the OS/browser and can be spoofed; `accept` only filters the picker. So the server must sniff the actual bytes (`file(1)` / a library) and reject mismatches, enforce its own `MAX_SIZE` regardless of what the client claimed, run an AV scan, and store outside the web root with non-guessable names and correct `Content-Type`/`Content-Disposition` on download. Client validation exists so users don't wait 2 minutes to be told 'wrong type' — nothing more.",
    followUp: "Ek uploaded PDF ko safely serve karne ke liye download response par kaunse headers zaroori hain?",
  },
  {
    id: "fud-3",
    question:
      "Ek 300 MB file upload API server ke through jaa rahi hai aur server memory spike ho raha hai. Redesign?",
    type: "scenario",
    difficulty: "advanced",
    shortAnswer:
      "Don't route large files through the API. Flow: front-end `GET /uploads/presign?name=&type=` -> API returns a short-lived S3 (or equivalent) pre-signed `PUT` URL + the final key; front-end `PUT`s the file directly to that URL with `observe: 'events'` progress; then `POST /documents { key, size, name }` so the API records metadata. The file never touches the API server.",
    detailedAnswer:
      "Benefits: API stays lightweight, scales, and isn't a bandwidth bottleneck; storage handles the heavy lifting. For very large files, use S3 multipart upload (chunked, resumable) via the SDK or presigned part URLs. Security: presign with the exact content-type and a size condition, short expiry, and a key namespaced to the user/employee. After the `POST /documents`, the API can verify the object exists and its size/type before marking it valid. CORS on the bucket must allow `PUT` from your origin.",
    followUp: "Resumable upload (network drop ke baad continue) ke liye multipart flow kaisa dikhta hai?",
  },
  {
    id: "fud-4",
    question: "Upload cancel aur retry ko kaise handle karoge? Progress state ka model?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Keep the `Subscription`; `cancel()` calls `unsubscribe()` (the browser aborts the XHR/fetch) and resets state to `idle`. Retry re-invokes `upload(file)` (keep the `File` reference). State: a signal `{ progress: number, status: 'idle' | 'uploading' | 'done' | 'error' }` per upload, or an array for multiple.",
    detailedAnswer:
      "`unsubscribe()` on an HttpClient upload Observable aborts the request — no server-side cleanup call needed for a plain proxy upload (for presigned S3, a partial multipart may need an `AbortMultipartUpload`). Retry: because you still hold the `File`, just call `upload` again; for presigned flows you may need a fresh URL if the old one expired. Error state should show the reason (`AppError.message`) and a Retry button. For a queue of files, cap concurrency and let each row cancel/retry independently.",
    followUp: "Presigned S3 multipart upload cancel karne par server-side cleanup kya chahiye?",
  },
  {
    id: "fud-5",
    question: "Image upload ke liye client par preview aur (optional) resize/compress — kaise?",
    type: "scenario",
    difficulty: "intermediate",
    shortAnswer:
      "Preview: `URL.createObjectURL(file)` -> bind to `<img [src]>`; `revokeObjectURL` on destroy. Resize/compress: draw the image onto a `<canvas>` at target dimensions, then `canvas.toBlob(blob => ..., 'image/jpeg', 0.8)` and upload the Blob instead of the original File.",
    detailedAnswer:
      "`createObjectURL` is cheaper than `FileReader.readAsDataURL` for previews (no base64, no memory blow-up) — remember to `URL.revokeObjectURL(url)` to avoid leaks. Client-side resize: `const img = new Image(); img.src = objectUrl; img.onload = () => { canvas dimensions; ctx.drawImage(...); canvas.toBlob(...) }`. Upload the resulting `Blob` via `FormData.append('file', blob, 'photo.jpg')`. Benefits: smaller uploads, faster, less storage. Caveat: strip/handle EXIF orientation, and keep the original if the backend needs full resolution.",
    followUp: "`createObjectURL` aur `FileReader.readAsDataURL` me memory/perf farak?",
  },
];

export default questions;
