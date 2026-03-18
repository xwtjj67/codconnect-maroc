import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  preview?: string | null;
  onClear?: () => void;
  disabled?: boolean;
}

const ImageUpload = ({ onFileSelect, preview, onClear, disabled }: ImageUploadProps) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      if (file.type.startsWith("image/")) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">صورة المنتج *</label>
      {preview ? (
        <div className="relative w-full aspect-square max-w-[200px] rounded-lg overflow-hidden border border-border">
          <img src={preview} alt="preview" className="w-full h-full object-cover" />
          {onClear && !disabled && (
            <button
              type="button"
              onClick={onClear}
              className="absolute top-1.5 left-1.5 p-1 rounded-full bg-background/80 text-destructive hover:bg-background transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`w-full aspect-square max-w-[200px] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
            dragOver
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 bg-secondary/30"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Upload className="h-8 w-8 text-muted-foreground" />
          <p className="text-xs text-muted-foreground text-center px-2">
            اسحب الصورة هنا أو انقر للاختيار
          </p>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.[0]) handleFile(e.target.files[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImageUpload;
