/**
 * SAREditModal - Component for editing SAR narrative and regenerating PDFs
 * Supports both generic SAR responses and structured reports
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertCircle,
  Save,
  Undo2,
  FileText,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  GenericSARResponse,
  EditableSARState,
  extractNarrative,
  extractCaseId,
  extractRiskScore,
  extractRiskCategory,
  createEditableSARState,
  updateEditedNarrative,
  resetEditedSAR,
} from "@/lib/sarUtils";

interface SAREditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sarData: GenericSARResponse | null;
  onSaveEdits: (editedSAR: GenericSARResponse) => void;
  onRegeneratePDF?: (sar: GenericSARResponse) => void;
}

export function SAREditModal({
  isOpen,
  onClose,
  sarData,
  onSaveEdits,
  onRegeneratePDF,
}: SAREditModalProps) {
  const [editState, setEditState] = useState<EditableSARState | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize state when modal opens
  useEffect(() => {
    if (isOpen && sarData) {
      setEditState(createEditableSARState(sarData));
      setSaveSuccess(false);
      setCopied(false);
    }
  }, [isOpen, sarData]);

  if (!editState || !sarData) return null;

  const narrative = extractNarrative(editState.editedSAR);
  const caseId = extractCaseId(editState.editedSAR);
  const riskScore = extractRiskScore(editState.editedSAR);
  const riskCategory = extractRiskCategory(editState.editedSAR);

  const handleNarrativeChange = (newText: string) => {
    setEditState(updateEditedNarrative(editState, newText));
    setSaveSuccess(false);
  };

  const handleReset = () => {
    setEditState(resetEditedSAR(editState));
    setSaveSuccess(false);
  };

  const handleSaveEdits = async () => {
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      onSaveEdits(editState.editedSAR);
      setSaveSuccess(true);
      setTimeout(setSaveSuccess, 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyNarrative = () => {
    navigator.clipboard.writeText(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    if (editState.isDirty) {
      const confirm = window.confirm(
        "You have unsaved changes. Are you sure you want to close?"
      );
      if (!confirm) return;
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg">
        {/* Header */}
        <DialogHeader className="border-b border-border pb-4 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Edit SAR Narrative
              </DialogTitle>
              <DialogDescription className="mt-1">
                Modify the SAR narrative and regenerate PDF for analyst review
              </DialogDescription>
            </div>
          </div>

          {/* Case Info */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border/50">
            <div className="text-xs">
              <span className="text-muted-foreground">Case ID:</span>
              <span className="ml-2 font-mono font-semibold text-foreground">{caseId}</span>
            </div>
            <div className="text-xs">
              <span className="text-muted-foreground">Risk Score:</span>
              <span className="ml-2 font-mono font-semibold text-foreground">{riskScore}%</span>
            </div>
            <Badge
              variant={
                riskCategory === "Critical"
                  ? "destructive"
                  : riskCategory === "High"
                    ? "warning"
                    : "secondary"
              }
              className="text-xs"
            >
              {riskCategory} Risk
            </Badge>
            {editState.isDirty && (
              <div className="flex items-center gap-1 ml-auto text-amber-600 dark:text-amber-400 text-xs font-medium">
                <AlertTriangle className="w-3.5 h-3.5" />
                Unsaved changes
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-4">
            {/* Info Box */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Edit the narrative text below. Your changes will be saved in the edited version.
                The original SAR remains unchanged for audit purposes.
              </p>
            </div>

            {/* Narrative Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  SAR Narrative
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7"
                  onClick={handleCopyNarrative}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copied ? "Copied" : "Copy"}
                </Button>
              </div>
              <textarea
                className="w-full min-h-96 p-4 rounded-lg border border-border bg-muted/30 text-sm font-mono leading-relaxed text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                value={narrative}
                onChange={(e) => handleNarrativeChange(e.target.value)}
                placeholder="Enter SAR narrative..."
              />
              <p className="text-xs text-muted-foreground">
                {narrative.length} characters
              </p>
            </div>

            {/* Raw Data Preview (Optional) */}
            <details className="space-y-2">
              <summary className="text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer hover:text-foreground">
                View Raw SAR Data
              </summary>
              <div className="p-3 rounded-lg bg-muted/50 border border-border overflow-auto max-h-48">
                <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-words">
                  {JSON.stringify(editState.editedSAR, null, 2)}
                </pre>
              </div>
            </details>
          </div>
        </ScrollArea>

        {/* Footer */}
        <DialogFooter className="flex items-center justify-between gap-2 border-t border-border pt-4 shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={handleReset}
              disabled={!editState.isDirty || isSaving}
            >
              <Undo2 className="w-3 h-3 mr-1" />
              Reset
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-medium">
                <Check className="w-3.5 h-3.5" />
                Changes saved
              </div>
            )}
            {onRegeneratePDF && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => onRegeneratePDF(editState.editedSAR)}
                disabled={isSaving}
              >
                Regenerate PDF
              </Button>
            )}
            <Button
              size="sm"
              className="text-xs"
              onClick={handleSaveEdits}
              disabled={!editState.isDirty || isSaving}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1" />
                  Save Changes
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" className="text-xs" onClick={handleClose}>
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
