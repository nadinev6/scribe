import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

interface FeaturedImagePlaceholderProps {
  imageUrl?: string;
  onImageChange?: (url: string) => void;
}

export const FeaturedImagePlaceholder = ({
  imageUrl,
  onImageChange
}: FeaturedImagePlaceholderProps) => {
  const { t } = useTranslation();
  const [urlInput, setUrlInput] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onImageChange?.(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onImageChange?.(urlInput.trim());
      setUrlInput("");
    }
  };

  const handleRemoveImage = () => {
    onImageChange?.("");
  };

  return (
    <div
      className="w-full bg-muted rounded-lg overflow-hidden border-2 border-dashed border-border hover:border-primary/50 transition-colors relative group"
      style={{ minHeight: '400px' }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {imageUrl ? (
        <div className="relative w-full">
          <img
            src={imageUrl}
            alt="Featured"
            className="w-full aspect-[19/9] object-cover"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemoveImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className={`w-full h-full min-h-[400px] flex items-center justify-center flex-col gap-6 p-8 transition-all duration-300 ${isDragging ? 'bg-primary/10 border-primary' : ''}`}>
          <div className="flex flex-col items-center gap-4">
            <div className={`p-4 rounded-full bg-primary/10 transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
              <ImagePlus className="w-16 h-16 text-primary" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-lg font-semibold text-foreground">19:9 Featured Image</p>
              <p className="text-sm text-muted-foreground">{t.featuredImage.dragDropText}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-md">
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <Button variant="secondary" size="lg" className="w-full font-medium shadow-sm hover:shadow-md transition-all" asChild>
                <span>
                  <Upload className="h-5 w-5 mr-2" />
                  {t.featuredImage.uploadButton}
                </span>
              </Button>
            </label>

            <div className="relative flex items-center">
              <div className="flex-grow border-t border-border"></div>
              <span className="flex-shrink mx-4 text-xs text-muted-foreground">OR</span>
              <div className="flex-grow border-t border-border"></div>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Paste image URL..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                className="flex-1 h-11"
              />
              <Button onClick={handleUrlSubmit} disabled={!urlInput.trim()} size="lg" className="px-6">
                Add
              </Button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">Supports JPG, PNG, GIF, and WebP formats</p>
        </div>
      )}
    </div>
  );
};
