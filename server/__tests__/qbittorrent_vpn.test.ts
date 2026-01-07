import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Downloader } from "@shared/schema";

vi.mock("parse-torrent", () => ({
  default: vi.fn().mockResolvedValue({ infoHash: "abc123def456" }),
}));

describe("QBittorrentClient - VPN/Gluetun Fixes", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    fetchMock = vi.fn();
    global.fetch = fetchMock;
  });

  const createTestDownloader = (overrides: Partial<Downloader> = {}): Downloader => ({
    id: "qb-vpn-test",
    name: "QBittorrent Behind VPN",
    type: "qbittorrent",
    url: "http://localhost:8080",
    port: null,
    useSsl: false,
    skipTlsVerify: false,
    urlPath: null,
    username: "admin",
    password: "adminpass",
    enabled: true,
    priority: 1,
    downloadPath: "/downloads",
    category: "games",
    label: null,
    addStopped: false,
    removeCompleted: false,
    postImportCategory: null,
    settings: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  });

  describe("Cookie Parsing", () => {
    it("should parse and store only cookie name=value without attributes", async () => {
      const testDownloader = createTestDownloader();

      // Mock login with Set-Cookie that has attributes (path, domain, etc)
      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([
          ["set-cookie", "SID=test-session-12345; Path=/; HttpOnly; SameSite=Lax"],
        ]),
        text: async () => "Ok.",
      };

      // Mock version check response
      const versionResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "v4.5.0",
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse) // authenticate
        .mockResolvedValueOnce(versionResponse); // testConnection version check

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.testDownloader(testDownloader);

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(2);

      // Verify the second call (version check) includes only the cookie name=value
      const secondCall = fetchMock.mock.calls[1];
      const headers = secondCall[1].headers;
      expect(headers.Cookie).toBe("SID=test-session-12345");
    });

    it("should handle missing Set-Cookie gracefully", async () => {
      const testDownloader = createTestDownloader();

      // Mock login without Set-Cookie header
      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers(), // No Set-Cookie
        text: async () => "Ok.",
      };

      const versionResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "v4.5.0",
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(versionResponse);

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.testDownloader(testDownloader);

      // Should still succeed even without cookie
      expect(result.success).toBe(true);
    });
  });

  describe("403 Re-authentication", () => {
    it("should re-authenticate and retry on 403 response", async () => {
      const testDownloader = createTestDownloader();

      // Mock initial login
      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=initial-session"]]),
        text: async () => "Ok.",
      };

      // Mock 403 response (session expired)
      const forbiddenResponse = {
        ok: false,
        status: 403,
        statusText: "Forbidden",
        headers: new Headers(),
        text: async () => "Forbidden",
      };

      // Mock re-authentication
      const reAuthResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=new-session-after-403"]]),
        text: async () => "Ok.",
      };

      // Mock successful version check after re-auth
      const versionResponseAfterReauth = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "v4.5.0",
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse) // initial authenticate
        .mockResolvedValueOnce(forbiddenResponse) // version check returns 403
        .mockResolvedValueOnce(reAuthResponse) // re-authenticate
        .mockResolvedValueOnce(versionResponseAfterReauth); // retry version check

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.testDownloader(testDownloader);

      expect(result.success).toBe(true);
      expect(fetchMock).toHaveBeenCalledTimes(4);

      // Verify re-authentication was called
      const reAuthCall = fetchMock.mock.calls[2];
      expect(reAuthCall[0]).toContain("/api/v2/auth/login");

      // Verify retry with new cookie
      const retryCall = fetchMock.mock.calls[3];
      const retryHeaders = retryCall[1].headers;
      expect(retryHeaders.Cookie).toBe("SID=new-session-after-403");
    });

    it("should not retry infinitely on 403 (prevents infinite loop)", async () => {
      const testDownloader = createTestDownloader();

      // Mock login
      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=session"]]),
        text: async () => "Ok.",
      };

      // Always return 403
      const forbiddenResponse = {
        ok: false,
        status: 403,
        statusText: "Forbidden",
        headers: new Headers(),
        text: async () => "Forbidden",
      };

      fetchMock.mockResolvedValue(forbiddenResponse);
      // Override first call for login
      fetchMock.mockResolvedValueOnce(loginResponse);

      const { DownloaderManager } = await import("../downloaders.js");

      // Should fail (not throw) after retry fails
      const result = await DownloaderManager.testDownloader(testDownloader);
      expect(result.success).toBe(false);
      expect(result.message).toContain("Authentication failed");

      // Verify it didn't retry infinitely - should be:
      // 1. initial authenticate
      // 2. version check (403)
      // 3. re-authenticate (also returns 403)
      expect(fetchMock).toHaveBeenCalledTimes(3);
    });
  });

  describe("Multipart File Upload", () => {
    it("should use multipart/form-data for .torrent file uploads", async () => {
      const testDownloader = createTestDownloader();

      // Mock login
      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=session"]]),
        text: async () => "Ok.",
      };

      // Mock torrent file download
      const torrentFileResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        arrayBuffer: async () => new ArrayBuffer(1024), // Fake torrent file
      };

      // Mock add torrent response
      const addResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "Ok.",
      };

      // Mock torrents info to find added torrent
      const torrentsInfoResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => [
          {
            hash: "torrent-hash-123",
            name: "Game From Torrent File",
          },
        ],
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse) // authenticate
        .mockResolvedValueOnce(torrentFileResponse) // download .torrent file
        .mockResolvedValueOnce(addResponse) // add torrent via multipart
        .mockResolvedValueOnce(torrentsInfoResponse); // verify added

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.addTorrent(testDownloader, {
        url: "http://tracker.example.com/download/game.torrent",
        title: "Game From Torrent File",
      });

      expect(result.success).toBe(true);

      // Verify the add torrent call used FormData (body should be FormData, not string)
      const addTorrentCall = fetchMock.mock.calls[2];
      expect(addTorrentCall[0]).toContain("/api/v2/torrents/add");
      
      // FormData body will be an object, not a string
      const body = addTorrentCall[1].body;
      expect(body).toBeInstanceOf(FormData);
      
      // Content-Type should NOT be manually set (FormData sets it with boundary)
      const headers = addTorrentCall[1].headers;
      expect(headers["Content-Type"]).toBeUndefined();
    });

    it("should use application/x-www-form-urlencoded for magnet links", async () => {
      const testDownloader = createTestDownloader();

      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=session"]]),
        text: async () => "Ok.",
      };

      const addResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "Ok.",
      };

      const verifyResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        json: async () => [
          {
            hash: "1234567890123456789012345678901234567890",
            name: "Magnet Game",
          },
        ],
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(addResponse)
        .mockResolvedValueOnce(verifyResponse);

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.addTorrent(testDownloader, {
        url: "magnet:?xt=urn:btih:1234567890123456789012345678901234567890",
        title: "Magnet Game",
      });

      expect(result.success).toBe(true);

      // Verify the add torrent call used URLSearchParams (string body)
      const addTorrentCall = fetchMock.mock.calls[1];
      const body = addTorrentCall[1].body;
      expect(typeof body).toBe("string");
      expect(body).toContain("urls=magnet");

      // Content-Type should be set for URL-encoded
      const headers = addTorrentCall[1].headers;
      expect(headers["Content-Type"]).toBe("application/x-www-form-urlencoded");
    });
  });

  describe("TLS Skip Support", () => {
    it("should include https.Agent when skipTlsVerify is enabled", async () => {
      const testDownloader = createTestDownloader({
        useSsl: true,
        skipTlsVerify: true,
      });

      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=session"]]),
        text: async () => "Ok.",
      };

      const versionResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "v4.5.0",
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(versionResponse);

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.testDownloader(testDownloader);

      expect(result.success).toBe(true);

      // Note: We can't easily verify the agent was set because it's internal to fetch
      // But we can verify the call succeeded and didn't throw
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("should not set agent when skipTlsVerify is false", async () => {
      const testDownloader = createTestDownloader({
        useSsl: true,
        skipTlsVerify: false, // explicitly false
      });

      const loginResponse = {
        ok: true,
        status: 200,
        headers: new Headers([["set-cookie", "SID=session"]]),
        text: async () => "Ok.",
      };

      const versionResponse = {
        ok: true,
        status: 200,
        headers: new Headers(),
        text: async () => "v4.5.0",
      };

      fetchMock
        .mockResolvedValueOnce(loginResponse)
        .mockResolvedValueOnce(versionResponse);

      const { DownloaderManager } = await import("../downloaders.js");
      const result = await DownloaderManager.testDownloader(testDownloader);

      expect(result.success).toBe(true);
      // Normal TLS verification should be used
    });
  });
});
