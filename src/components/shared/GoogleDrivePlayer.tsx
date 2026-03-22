import { useState } from "react";
import { Loader2 } from "lucide-react";

interface GoogleDrivePlayerProps {
  fileId: string;
  title?: string;
}

/** Extract Google Drive file ID from various URL formats */
export const extractDriveFileId = (url: string): string | null => {
  if (!url) return null;
  // Already a bare ID (no slashes, no dots)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url.trim();
  // /file/d/FILE_ID
  const match1 = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match1) return match1[1];
  // ?id=FILE_ID
  const match2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match2) return match2[1];
  // open?id=FILE_ID
  const match3 = url.match(/open\?id=([a-zA-Z0-9_-]+)/);
  if (match3) return match3[1];
  return null;
};

const GoogleDrivePlayer = ({ fileId, title }: GoogleDrivePlayerProps) => {
  const [loading, setLoading] = useState(true);
  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/50"
      onContextMenu={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      <iframe
        src={embedUrl}
        title={title || "فيديو تدريبي"}
        className="w-full h-full border-0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        sandbox="allow-scripts allow-same-origin allow-presentation"
        onLoad={() => setLoading(false)}
        referrerPolicy="no-referrer"
      />
      {/* Overlay to block right-click and interactions with Drive UI */}
      <div
        className="absolute top-0 left-0 right-0 h-12 bg-transparent z-20"
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
};

export default GoogleDrivePlayer;
