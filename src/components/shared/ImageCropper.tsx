import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Crop, RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface ImageCropperProps {
  open: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob) => void;
}

const ASPECT_OPTIONS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "16:9", value: 16 / 9 },
];

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", reject);
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });
}

async function getCroppedImg(imageSrc: string, crop: Area, rotation: number): Promise<Blob> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const radians = (rotation * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  const bBoxWidth = image.width * cos + image.height * sin;
  const bBoxHeight = image.width * sin + image.height * cos;

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(radians);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(crop.x, crop.y, crop.width, crop.height);

  canvas.width = crop.width;
  canvas.height = crop.height;
  ctx.putImageData(data, 0, 0);

  // Compress
  const maxDim = 1200;
  if (canvas.width > maxDim || canvas.height > maxDim) {
    const scale = maxDim / Math.max(canvas.width, canvas.height);
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width * scale;
    tempCanvas.height = canvas.height * scale;
    const tempCtx = tempCanvas.getContext("2d")!;
    tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
    return new Promise((resolve) => tempCanvas.toBlob((b) => resolve(b!), "image/jpeg", 0.85));
  }

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.85));
}

const ImageCropper = ({ open, imageSrc, onClose, onCropComplete }: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [saving, setSaving] = useState(false);

  const onCropDone = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedArea) return;
    setSaving(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedArea, rotation);
      onCropComplete(blob);
    } catch {
      // fallback
    }
    setSaving(false);
  };

  const handleClose = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setAspect(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Crop className="h-4 w-4" />
            قص الصورة
          </DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-[300px] sm:h-[350px] bg-black/90">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropDone}
          />
        </div>

        <div className="px-4 py-3 space-y-3">
          {/* Aspect ratio */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground w-12">النسبة</span>
            <div className="flex gap-1.5">
              {ASPECT_OPTIONS.map((opt) => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setAspect(opt.value)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    aspect === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2">
            <ZoomOut className="h-3.5 w-3.5 text-muted-foreground" />
            <Slider
              value={[zoom]}
              onValueChange={([v]) => setZoom(v)}
              min={1}
              max={3}
              step={0.05}
              className="flex-1"
            />
            <ZoomIn className="h-3.5 w-3.5 text-muted-foreground" />
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-2">
            <RotateCw className="h-3.5 w-3.5 text-muted-foreground" />
            <Slider
              value={[rotation]}
              onValueChange={([v]) => setRotation(v)}
              min={0}
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-8 text-left">{rotation}°</span>
          </div>
        </div>

        <DialogFooter className="px-4 pb-4 gap-2">
          <Button variant="outline" size="sm" onClick={handleClose}>
            إلغاء
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? "جاري القص..." : "تأكيد القص"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
