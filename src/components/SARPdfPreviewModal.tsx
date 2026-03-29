/**
 * SARPdfPreviewModal - Component for previewing SAR PDF with fullscreen capability
 */

import React, { useRef, useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Download, Maximize2, Minimize2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SARPdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  filename: string;
  isLoading?: boolean;
  onDownload?: () => void;
}

/**
 * Hook helper to manage PDF preview state
 * Kept separate from component for React Refresh compatibility
 */
export function useSARPdfPreview() {
  const [pdfPreview, setPdfPreview] = useState<{ url: string; filename: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const openPreview = (blob: Blob, filename: string) => {
    setIsLoading(true);
    const url = URL.createObjectURL(blob);
    setPdfPreview({ url, filename });
    // Simulate load delay - remove if PDF viewer is fast
    setTimeout(() => setIsLoading(false), 500);
  };

  const closePreview = () => {
    if (pdfPreview?.url) {
      URL.revokeObjectURL(pdfPreview.url);
    }
    setPdfPreview(null);
    setIsLoading(false);
  };

  return {
    pdfPreview,
    isLoading,
    openPreview,
    closePreview,
  };
}

export function SARPdfPreviewModal({
  isOpen,
  onClose,
  pdfUrl,
  filename,
  isLoading = false,
  onDownload,
}: SARPdfPreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden flex flex-col min-h-0 transition-all",
          isFullscreen
            ? "w-screen h-screen max-w-none max-h-none rounded-none border-0"
            : "w-full max-w-4xl h-[85vh] max-h-[85vh] rounded-lg"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 p-4 border-b border-border bg-muted/30 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div>
              <DialogTitle className="text-sm font-semibold">{filename}</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                SAR PDF Preview · {isLoading ? "Loading..." : "Ready for download"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={onDownload}
                disabled={!pdfUrl || isLoading}
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Download
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center flex-1 bg-muted/10">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">Generating PDF preview...</p>
            </div>
          </div>
        ) : !pdfUrl ? (
          <div className="flex items-center justify-center flex-1 bg-muted/10">
            <div className="text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
              <p className="text-sm text-muted-foreground">PDF could not be loaded</p>
              <Button variant="outline" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            src={pdfUrl}
            className="flex-1 w-full border-0"
            title="SAR PDF Preview"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
