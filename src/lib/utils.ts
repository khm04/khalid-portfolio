export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function toEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // YouTube watch
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    // YouTube Shorts
    if (u.hostname.includes("youtube.com") && u.pathname.startsWith("/shorts/")) {
      const id = u.pathname.replace("/shorts/", "");
      return `https://www.youtube.com/embed/${id}`;
    }
    // youtu.be short link
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
    // Vimeo
    if (u.hostname.includes("vimeo.com") && !u.hostname.includes("player")) {
      return `https://player.vimeo.com/video${u.pathname}`;
    }
  } catch {
    // not a valid URL — return as-is
  }
  return url;
}
