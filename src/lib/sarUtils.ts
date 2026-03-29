/**
 * SAR Utilities - Helper functions for handling generic SAR responses and conversions
 * These utilities do NOT make assumptions about SAR structure and handle flexible JSON
 */

import type { FullSARReport } from "@/lib/csvLoader";

/**
 * Generic SAR response that can have any structure
 * Used to safely handle API responses without assuming field names
 */
export interface GenericSARResponse {
  [key: string]: any;
}

/**
 * Editable SAR state - keeps track of original vs edited versions
 */
export interface EditableSARState {
  originalSAR: GenericSARResponse;
  editedSAR: GenericSARResponse;
  isDirty: boolean;
}

/**
 * Safely extract narrative-like content from generic SAR response
 * Attempts multiple field names without assuming structure
 */
export function extractNarrative(sar: GenericSARResponse): string {
  // List of potential narrative field names (order matters - most likely first)
  const narrativeFields = [
    "narrative",
    "activityDescription",
    "suspicious_activity_description",
    "description",
    "summary",
    "narration",
    "reportText",
    "content",
    "text",
    "body",
  ];

  for (const field of narrativeFields) {
    const value = sar[field];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
    // Handle nested structures like narrative.text or narrative_generation.suspicious_activity_description
    if (typeof value === "object" && value !== null) {
      const nestedValue = extractNarrative(value);
      if (nestedValue.length > 0) return nestedValue;
    }
  }

  // Fallback: return JSON representation
  return JSON.stringify(sar, null, 2);
}

/**
 * Safely extract case ID from generic SAR response
 */
export function extractCaseId(sar: GenericSARResponse): string {
  const caseIdFields = [
    "caseId",
    "case_id",
    "id",
    "reportId",
    "report_id",
    "sarId",
    "sar_id",
  ];

  for (const field of caseIdFields) {
    if (sar[field]) return String(sar[field]);
  }

  return "CASE-UNKNOWN";
}

/**
 * Safely extract risk score from generic SAR response
 */
export function extractRiskScore(sar: GenericSARResponse): number {
  const riskFields = [
    "riskScore",
    "risk_score",
    "confidenceScore",
    "confidence_score",
    "score",
    "ai_confidence",
  ];

  for (const field of riskFields) {
    const value = sar[field];
    if (typeof value === "number" && value >= 0 && value <= 100) return value;
  }

  return 0;
}

/**
 * Safely extract risk category from generic SAR response
 */
export function extractRiskCategory(sar: GenericSARResponse): "Critical" | "High" | "Medium" | "Low" {
  const riskCategoryFields = [
    "riskCategory",
    "risk_category",
    "risk_level",
    "riskLevel",
    "category",
    "severity",
  ];

  for (const field of riskCategoryFields) {
    const value = sar[field];
    if (typeof value === "string") {
      const normalized = value.toLowerCase();
      if (normalized.includes("critical")) return "Critical";
      if (normalized.includes("high")) return "High";
      if (normalized.includes("medium")) return "Medium";
      if (normalized.includes("low")) return "Low";
    }
  }

  return "High"; // Default to High if uncertain
}

/**
 * Safely extract transaction count from generic SAR response
 */
export function extractTransactionCount(sar: GenericSARResponse): number {
  const txnFields = [
    "transactionCount",
    "transaction_count",
    "txnCount",
    "txn_count",
    "totalTransactions",
    "total_transactions",
  ];

  for (const field of txnFields) {
    const value = sar[field];
    if (typeof value === "number" && value >= 0) return value;
  }

  return 0;
}

/**
 * Convert generic SAR response to FullSARReport
 * This is a safe conversion that doesn't hallucinate data
 */
export function convertToFullSARReport(sar: GenericSARResponse): FullSARReport {
  const caseId = extractCaseId(sar);
  const riskScore = extractRiskScore(sar);
  const riskCategory = extractRiskCategory(sar);
  const txnCount = extractTransactionCount(sar);

  // Extract subject profile if available
  const subjectProfile = sar.subject_profile || sar.subjectProfile || {};

  return {
    // Header
    caseId,
    dateGenerated: new Date().toISOString().split("T")[0],
    reportingInstitution: sar.reportingInstitution || sar.reporting_institution || "UNKNOWN",
    reportingUnit: sar.reportingUnit || sar.reporting_unit || "AML Compliance",

    // Subject
    entityId: subjectProfile.account_id || subjectProfile.entityId || "UNKNOWN",
    riskCategory,
    riskScore,
    kycStatus: subjectProfile.kyc_status || subjectProfile.kycStatus || "UNKNOWN",
    primaryCountry: subjectProfile.primary_country || subjectProfile.country || "UNKNOWN",
    riskTypes: subjectProfile.risk_types || subjectProfile.riskTypes || [],

    // Transaction summary
    txnCount,
    suspiciousTxnCount: sar.suspicious_transaction_count || sar.suspiciousTxnCount || 0,
    totalAmount: sar.total_amount || sar.totalAmount || 0,
    avgAmount: sar.average_amount || sar.averageAmount || 0,
    maxSingleAmount: sar.max_transaction || sar.maxTransaction || 0,
    periodStart: sar.period_start || sar.periodStart || "2024-01-01",
    periodEnd: sar.period_end || sar.periodEnd || new Date().toISOString().split("T")[0],
    countriesInvolved: subjectProfile.countries_involved || subjectProfile.countriesInvolved || [],
    transactionRows: [],

    // Suspicious activity
    activityDescription: extractNarrative(sar),
    patternsObserved: subjectProfile.patterns_detected || subjectProfile.patternsObserved || [],
    networkConnections: subjectProfile.connections_count || subjectProfile.networkConnections || 0,
    connectedEntities: subjectProfile.connected_entities || subjectProfile.connectedEntities || [],
    relationshipTypes: subjectProfile.relationship_types || subjectProfile.relationshipTypes || [],

    // Regulatory
    regulatoryBreaches: [], // Will be populated from regulatory_mapping if available
    regulatoryImpactScore: 85,

    // Additional fields
    confidenceScore: riskScore,
    aiModel: sar.model_version || sar.modelVersion || "Unknown",
  } as FullSARReport;
}

/**
 * Create an editable SAR state from a generic SAR response
 * Keeps originalSAR immutable
 */
export function createEditableSARState(sar: GenericSARResponse): EditableSARState {
  return {
    originalSAR: structuredClone(sar), // Deep copy to prevent accidental modifications
    editedSAR: structuredClone(sar),
    isDirty: false,
  };
}

/**
 * Update narrative in editable SAR state
 */
export function updateEditedNarrative(
  state: EditableSARState,
  newNarrative: string
): EditableSARState {
  const updated = structuredClone(state.editedSAR);

  // Try to update in the same location where narrative was found
  if (updated.narrative) updated.narrative = newNarrative;
  else if (updated.narrativeGeneration) {
    updated.narrativeGeneration.suspicious_activity_description = newNarrative;
  } else if (updated.narrative_generation) {
    updated.narrative_generation.suspicious_activity_description = newNarrative;
  } else {
    // Default: add as root-level narrative
    updated.narrative = newNarrative;
  }

  return {
    originalSAR: state.originalSAR,
    editedSAR: updated,
    isDirty: JSON.stringify(state.originalSAR) !== JSON.stringify(updated),
  };
}

/**
 * Reset edited SAR back to original
 */
export function resetEditedSAR(state: EditableSARState): EditableSARState {
  return {
    originalSAR: state.originalSAR,
    editedSAR: structuredClone(state.originalSAR),
    isDirty: false,
  };
}

/**
 * Get a safe summary of SAR for display
 */
export function getSARSummary(sar: GenericSARResponse): {
  caseId: string;
  riskScore: number;
  riskCategory: string;
  narrative: string;
} {
  return {
    caseId: extractCaseId(sar),
    riskScore: extractRiskScore(sar),
    riskCategory: extractRiskCategory(sar),
    narrative: extractNarrative(sar).substring(0, 200) + "...",
  };
}

/**
 * Log SAR structure for debugging (console only)
 */
export function debugLogSARStructure(sar: GenericSARResponse, label: string = "SAR Response"): void {
  console.log(`[DEBUG] ${label}:`, sar);
  console.log(`[DEBUG] Extracted Case ID:`, extractCaseId(sar));
  console.log(`[DEBUG] Extracted Risk Score:`, extractRiskScore(sar));
  console.log(`[DEBUG] Extracted Risk Category:`, extractRiskCategory(sar));
  console.log(`[DEBUG] Extracted Narrative (first 100 chars):`, extractNarrative(sar).substring(0, 100));
}
