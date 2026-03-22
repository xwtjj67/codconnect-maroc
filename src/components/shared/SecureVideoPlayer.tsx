interface SecureVideoPlayerProps {
  url: string;
  title?: string;
}

const SecureVideoPlayer = ({ url, title }: SecureVideoPlayerProps) => {
  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-black"
      onContextMenu={(e) => e.preventDefault()}
    >
      <video
        src={url}
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        playsInline
        className="w-full h-full object-contain"
        title={title}
      >
        متصفحك لا يدعم الفيديو
      </video>
      {/* Overlay to prevent inspect */}
      <div className="absolute inset-0 pointer-events-none" />
    </div>
  );
};

export default SecureVideoPlayer;
