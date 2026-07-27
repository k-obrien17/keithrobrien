// One-time helper: run locally to mint a Spotify OAuth refresh token.
// Requires SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET in the environment,
// and http://127.0.0.1:8888/callback registered as a Redirect URI on the
// app at https://developer.spotify.com/dashboard.
import { createServer } from "node:http";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = "http://127.0.0.1:8888/callback";
const SCOPE = "playlist-read-private";

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET first.");
  process.exit(1);
}

const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", CLIENT_ID);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
authorizeUrl.searchParams.set("scope", SCOPE);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (!code) {
    res.writeHead(400).end("Missing ?code");
    return;
  }

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
  const data = await tokenRes.json();

  if (!tokenRes.ok || !data.refresh_token) {
    res.writeHead(500).end("Token exchange failed, see terminal.");
    console.error("Token exchange failed:", data);
    server.close();
    process.exitCode = 1;
    return;
  }

  res.writeHead(200).end("Done. Refresh token printed in your terminal, you can close this tab.");
  console.log("\nSPOTIFY_REFRESH_TOKEN:");
  console.log(data.refresh_token);
  console.log("\nAdd this as a GitHub Actions secret (SPOTIFY_REFRESH_TOKEN), then clear it from your shell history.");
  server.close();
});

server.listen(8888, () => {
  console.log("Open this URL, log in, and approve access:\n");
  console.log(authorizeUrl.toString());
});
