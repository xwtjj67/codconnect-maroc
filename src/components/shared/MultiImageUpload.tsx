import { useState, useRef, useCallback } from "react";
import { Upload, X, GripVertical, Image as ImageIcon } from "lucide-react";

interface MultiImageUploadProps {
  images: { file: File; preview: string }[];
  onChange: (images: { file: File; preview: string }[]) => void;
  maxImages?: number;
  disabled?: boolean;
}

const MultiImageUpload = ({ images, onChange, maxImages = 10, disabled }: MultiImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const newImages = [...images];
      const fileArr = Array.from(files);
      for (const file of fileArr) {
        if (newImages.length >= maxImages) break;
        if (!file.type.startsWith("image/")) continue;
        newImages.push({ file, preview: URL.createObjectURL(file) });
      }
      onChange(newImages);
    },
    [images, maxImages, onChange]
  );

  const removeImage = (index: number) => {
    const updated = [...images];
    URL.revokeObjectURL(updated[index].preview);
    updated.splice(index, 1);
    onChange(updated);
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const [item] = updated.splice(index, 1);
    updated.unshift(item);
    onChange(updated);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  // Drag reorder
  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const updated = [...images];
    const [item] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, item);
    onChange(updated);
    setDragIndex(index);
  };
  const handleDragEnd = () => setDragIndex(null);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        صور المنتج * <span className="text-muted-foreground font-normal">({images.length}/{maxImages})</span>
      </label>

      {/* Uploaded images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {images.map((img, i) => (
            <div
              key={img.preview}
              draggable={!disabled}
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
                i === 0 ? "border-primary" : "border-border"
              } ${dragIndex === i ? "opacity-50" : ""}`}
            >
              <img src={img.preview} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-primary text-primary-foreground">
                  رئيسية
                </span>
              )}
              {!disabled && (
                <div className="absolute top-1 left-1 flex gap-1">
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="p-0.5 rounded-full bg-background/80 text-destructive hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {i !== 0 && !disabled && (
                <button
                  type="button"
                  onClick={() => setAsMain(i)}
                  className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] bg-background/80 text-foreground hover:bg-background"
                >
                  رئيسية
                </button>
              )}
              <div className="absolute bottom-1 left-1">
                <GripVertical className="h-3 w-3 text-foreground/50" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`w-full py-6 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-secondary/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Upload className="h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center px-2">
            اسحب الصور هنا أو انقر للاختيار (حتى {maxImages} صور)
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files) addFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default MultiImageUpload;
