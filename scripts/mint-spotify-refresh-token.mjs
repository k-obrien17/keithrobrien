// One-time helper: run locally to mint a Spotify OAuth refresh token.
// Requires SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in the environment,
// and http://127.0.0.1:8888/callback registered as a Redirect URI on the
// app at https://developer.spotify.com/dashboard.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "playlist-read-private";
const LISTENER_TIMEOUT_MS = 5 * 60 * 1000;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const state = randomBytes(16).toString("hex");

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", CLIENT_ID);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPE);
authorizeUrl.searchParams.set("state", state);

const timeout = setTimeout(() => {
  console.error(`No callback received within ${LISTENER_TIMEOUT_MS / 1000}s, closing listener.`);
  server.close();
  process.exitCode = 1;
}, LISTENER_TIMEOUT_MS);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const returnedState = url.searchParams.get("state");
  if (returnedState !== state) {
    res.writeHead(400).end("State mismatch, aborting.");
    clearTimeout(timeout);
    server.close();
    process.exitCode = 1;
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing ?code");
    clearTimeout(timeout);
    server.close();
    process.exitCode = 1;
    return;
  }

  let data;
  try {
    const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });
    data = await tokenRes.json();

    if (!tokenRes.ok || !data.refresh_token) {
      res.writeHead(500).end("Token exchange failed, see terminal.");
      console.error("Token exchange failed:", data);
      clearTimeout(timeout);
      server.close();
      process.exitCode = 1;
      return;
    }
  } catch (err) {
    res.writeHead(500).end("Token exchange failed, see terminal.");
    console.error("Token exchange error:", err);
    clearTimeout(timeout);
    server.close();
    process.exitCode = 1;
    return;
  }

  res.writeHead(200).end("Done. Refresh token printed in your terminal, you can close this tab.");
  console.log("\nSPOTIFY_REFRESH_TOKEN:");
  console.log(data.refresh_token);
  console.log("\nAdd this as a GitHub Actions secret (SPOTIFY_REFRESH_TOKEN), then clear it from your shell history.");
  clearTimeout(timeout);
  server.close();
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error("Port 8888 is already in use. Is another instance running? Kill it and try again.");
  } else {
    console.error("Server error:", err);
  }
  process.exit(1);
});

server.listen(8888, () => {
  console.log("Open this URL, log in, and approve access:\n");
  console.log(authorizeUrl.toString());
});
