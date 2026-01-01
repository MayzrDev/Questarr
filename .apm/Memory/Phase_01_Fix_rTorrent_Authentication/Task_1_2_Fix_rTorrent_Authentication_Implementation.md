---
agent: Agent_Backend_Downloaders
task_ref: Task 1.2
status: Completed
ad_hoc_delegation: false
compatibility_issues: false
important_findings: true
---

# Task Log: Task 1.2 - Fix rTorrent Authentication Implementation

## Summary
Successfully implemented and verified authentication fixes for rTorrent and Transmission clients. The implementation now supports both ISO-8859-1 (latin1) Basic Auth and MD5 Digest Authentication, resolving persistent 401 Unauthorized errors.

## Details

### Phase 1: Basic Auth & Encoding (Completed)
- Applied `latin1` encoding to `Buffer.from()` for Basic Auth credentials to comply with RFC 7617.
- Verified fix with unit tests for special characters.

### Phase 2: Digest Authentication (Completed)
- Identified that the rTorrent server required Digest Auth via header inspection.
- Implemented `computeDigestHeader` in `RTorrentClient` using the `crypto` module.
- Added automatic 401 retry logic to `makeXMLRPCRequest`.
- **Bug Fix:** Corrected a critical flaw in the `WWW-Authenticate` header parser that failed on `nonce` values containing `=` signs. The parser now uses a robust regex loop.

### Phase 3: Enhanced Error Handling (Completed)
- Updated all downloader clients (`Transmission`, `RTorrent`, `qBittorrent`) to log response bodies on error.
- Added logging for `WWW-Authenticate` headers to facilitate rapid diagnosis of authentication mismatches.

## Technical Details

**Digest Header Parsing:**
```typescript
const regex = /([a-z0-9_-]+)=(?:"([^"]+)"|([a-z0-9_-]+))/gi;
while ((match = regex.exec(authHeader)) !== null) {
  const key = match[1].toLowerCase();
  const value = match[2] || match[3];
  challenge[key] = value;
}
```

**MD5 Response Calculation:**
- Implemented standard RFC 2617 Digest calculation supporting `qop="auth"`.

## Results
- ✅ All unit tests passing.
- ✅ `npm run check` passing.
- ✅ User verified fix with live server.

## Output
- `server/downloaders.ts`: Updated with Digest Auth and Latin1 encoding.