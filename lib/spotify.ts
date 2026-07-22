export interface SpotifyTrack {
  title: string;
  artists: string;
  url: string;
  addedAt: string;
}

export interface SpotifyPlaylist {
  name: string;
  url: string;
  tracks: SpotifyTrack[];
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;

  const data = await res.json();
  return data.access_token ?? null;
}

export async function getPlaylist(playlistId: string): Promise<SpotifyPlaylist | null> {
  if (!playlistId) return null;

  const token = await getAccessToken();
  if (!token) return null;

  const fields =
    "name,external_urls.spotify,tracks.items(added_at,track(name,external_urls.spotify,artists(name)))";
  const res = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}?fields=${encodeURIComponent(fields)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) return null;

  const data = await res.json();
  const tracks: SpotifyTrack[] = (data.tracks?.items ?? [])
    .filter((item: { track: unknown }) => item.track)
    .map((item: { added_at: string; track: { name: string; external_urls: { spotify: string }; artists: { name: string }[] } }) => ({
      title: item.track.name,
      artists: item.track.artists.map((a) => a.name).join(", "),
      url: item.track.external_urls.spotify,
      addedAt: item.added_at,
    }));

  return {
    name: data.name,
    url: data.external_urls?.spotify ?? "",
    tracks,
  };
}
