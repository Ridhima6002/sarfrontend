import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Code, Lock, Users, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Case Metadata (Header Section)
interface CaseMetadata {
  case_id: string;
  date_generated: string;
  reporting_unit: string;
  primary_country: string;
  ai_confidence: number;
  regulatory_impact: number;
  model_version: string;
}

// Subject Profile (Customer Risk Entity)
interface SubjectProfile {
  account_id: string;
  risk_score: number;
  risk_category: string;
  kyc_status: string;
  risk_types: string[];
  connections_count: number;
  relationship_types: string[];
  institution: string;
  countries_involved: string[];
}

// Transaction Summary (Aggregated Features)
interface TransactionSummary {
  review_period: {
    start: string;
    end: string;
  };
  total_amount: number;
  transaction_count: number;
  suspicious_transaction_count: number;
  average_amount: number;
  max_transaction: number;
  countries: string[];
  patterns_detected: string[];
}

// Suspicious Transaction Details (Row-Level Output)
interface SuspiciousTransaction {
  date: string;
  amount: number;
  type: string;
  from_account: string;
  to_account: string;
  indicator: string[];
}

// Regulatory Mapping (VERY IMPORTANT ⚠️)
interface RegulatoryMapping {
  severity: string;
  regulation: string;
  reference: string;
  confidence: number;
  trigger_reason: string;
}

// Risk Indicators (Explainability Layer)
type RiskIndicators = string[];

// Evidence Summary (Audit Layer)
interface EvidenceSummary {
  transaction_records: number;
  risk_score: number;
  network_connections: number;
  external_intelligence_hits: number;
  detection_type: string;
}

// Narrative Generation (LLM Output)
interface NarrativeGeneration {
  suspicious_activity_description: string;
  conclusion: string;
}

// Sample SAR Case Data
const sarCaseData = {
  metadata: {
    case_id: "SAR-2026-63084",
    date_generated: "2026-03-28",
    reporting_unit: "AML Compliance / FIU",
    primary_country: "KY",
    ai_confidence: 0.72,
    regulatory_impact: 0.76,
    model_version: "SAR Guardian v2.1",
  } as CaseMetadata,
  subject_profile: {
    account_id: "ACCT100192",
    risk_score: 70,
    risk_category: "HIGH",
    kyc_status: "UNDER_REVIEW",
    risk_types: [],
    connections_count: 2,
    relationship_types: ["high_value_flow", "shared_device"],
    institution: "Barclays Bank PLC",
    countries_involved: ["KY", "UK", "RU", "US", "AE", "CN", "IN"],
  } as SubjectProfile,
  transaction_summary: {
    review_period: {
      start: "2025-01-20",
      end: "2025-03-29",
    },
    total_amount: 476,
    transaction_count: 10,
    suspicious_transaction_count: 4,
    average_amount: 48,
    max_transaction: 144,
    countries: ["KY", "UK", "RU", "US", "AE", "CN", "IN"],
    patterns_detected: ["layering"],
  } as TransactionSummary,
  suspicious_transactions: [
    {
      date: "2025-01-27",
      amount: 23,
      type: "withdrawal",
      from_account: "ACCT100192",
      to_account: "ACCT200221",
      indicator: ["layering", "high_risk_country"],
    },
  ] as SuspiciousTransaction[],
  regulatory_mapping: [
    {
      severity: "CRITICAL",
      regulation: "BSA SAR Rule",
      reference: "31 USC §5318(g)",
      confidence: 0.97,
      trigger_reason: "4 suspicious transactions totaling $476",
    },
  ] as RegulatoryMapping[],
  risk_indicators: [
    "High-risk jurisdiction involvement: KY, RU",
    "Transaction velocity anomaly",
    "Peer group deviation",
  ] as RiskIndicators,
  evidence_summary: {
    transaction_records: 10,
    risk_score: 70,
    network_connections: 2,
    external_intelligence_hits: 0,
    detection_type: "pattern_based",
  } as EvidenceSummary,
  narrative_generation: {
    suspicious_activity_description:
      "Multiple irregular transactions detected involving high-risk jurisdictions with velocity anomalies and significant peer group deviations.",
    conclusion:
      "The account demonstrates clear indicators of suspicious activity requiring immediate investigation and regulatory reporting.",
  } as NarrativeGeneration,
};

const getRiskCategoryColor = (category: string) => {
  switch (category.toUpperCase()) {
    case "CRITICAL":
      return "bg-red-500/15 text-red-700 dark:text-red-400";
    case "HIGH":
      return "bg-orange-500/15 text-orange-700 dark:text-orange-400";
    case "MEDIUM":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    case "LOW":
      return "bg-green-500/15 text-green-700 dark:text-green-400";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return "text-green-600 dark:text-green-400";
  if (confidence >= 0.6) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
};

export default function SARElements() {
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<"entities" | "changed" | "laws">("entities");

  // Law Adaptation Data - shows system capability to adapt to regulatory changes
  const lawAdaptationData = {
    suspicious_activity: "Structuring - Multiple transactions below reporting threshold",
    old_law: {
      version: "FinCEN BSA (Pre-2024)",
      triggered_rules: ["Structuring (31 CFR 1010.320)", "Cash Transaction Reporting"],
      risk_classification: "HIGH",
      confidence: 0.68,
      narrative_snippet: "Subject accounts show signs of intentional structuring to avoid reporting thresholds. Pattern consistent with AML typologies documented during previous regulatory period.",
      regulatory_references: ["31 CFR 1010.320", "31 CFR 1020.320", "FinCEN Guidance 2010"],
      suspicious_indicators: ["Multiple transactions €9,990", "Timing pattern: 3 per day", "Different beneficiaries"],
    },
    new_law: {
      version: "Enhanced FinCEN BSA Plus (2024+)",
      triggered_rules: ["Structuring 2.0 (New Dynamic Thresholds)", "Cross-Border Pattern Detection", "Beneficial Ownership Verification"],
      risk_classification: "CRITICAL",
      confidence: 0.89,
      narrative_snippet: "Advanced ML detection identifies structuring behavior combined with new risk factors: unverified beneficial ownership, cross-border component, and real-time pattern anomalies exceeding 2024 dynamic thresholds.",
      regulatory_references: ["31 CFR 1010.320-2024", "Beneficial Ownership Rule 2024", "Real-Time BO Verification", "Dynamic Threshold Model"],
      suspicious_indicators: ["Multiple transactions €9,990", "Timing pattern: 3 per day", "Different beneficiaries", "Unverified BO on 2 accounts", "Cross-border component", "Real-time anomaly score: 0.92"],
    },
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">SAR Elements</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Comprehensive SAR case analysis with regulatory mapping and risk assessment
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {sarCaseData.metadata.case_id}
          </Badge>
        </div>
        <Card className="border-orange-500/40 bg-orange-500/5 shadow-card">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-orange-500/10">
                <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-semibold text-foreground">Active SAR Investigation</p>
                <p className="text-muted-foreground text-xs mt-1">
                  Case: {sarCaseData.metadata.case_id} · Risk Score:{" "}
                  <span className="font-semibold text-orange-600">{sarCaseData.subject_profile.risk_score}</span> ·
                  Confidence: {(sarCaseData.metadata.ai_confidence * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Section Navigation */}
      <div className="flex gap-2 border-b flex-wrap">
        <button
          onClick={() => setActiveSection("entities")}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
            activeSection === "entities"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          SAR Entities
        </button>
        <button
          onClick={() => setActiveSection("changed")}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
            activeSection === "changed"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Newly Changed Entities
        </button>
        <button
          onClick={() => setActiveSection("laws")}
          className={cn(
            "px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px]",
            activeSection === "laws"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Law Adaptation & Sync
        </button>
      </div>

      {/* SAR Entities Section */}
      {activeSection === "entities" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Case metadata, customer profile, transaction analysis, and suspicious activity details
          </div>

          {/* Case Metadata Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "metadata" ? null : "metadata")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <Code className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Case Metadata</CardTitle>
                    <CardDescription className="text-xs">
                      Report generation and system information
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "metadata" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "metadata" && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Case ID</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.metadata.case_id}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Generated</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.metadata.date_generated}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Primary Country</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.metadata.primary_country}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">AI Confidence</p>
                    <p className={`font-mono text-sm font-semibold mt-1 ${getConfidenceColor(sarCaseData.metadata.ai_confidence)}`}>
                      {(sarCaseData.metadata.ai_confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Regulatory Impact</p>
                    <p className={`font-mono text-sm font-semibold mt-1 ${getConfidenceColor(sarCaseData.metadata.regulatory_impact)}`}>
                      {(sarCaseData.metadata.regulatory_impact * 100).toFixed(0)}%
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Reporting Unit</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {sarCaseData.metadata.reporting_unit}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.metadata, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Subject Profile Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "subject" ? null : "subject")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-green-500/10">
                    <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Subject Profile</CardTitle>
                    <CardDescription className="text-xs">
                      Customer account and risk assessment
                    </CardDescription>
                  </div>
                  <Badge className={`text-xs ${getRiskCategoryColor(sarCaseData.subject_profile.risk_category)}`}>
                    {sarCaseData.subject_profile.risk_category}
                  </Badge>
                </div>
                {expandedEntity === "subject" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "subject" && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Account ID</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.subject_profile.account_id}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Risk Score</p>
                    <p className="font-mono text-sm font-semibold text-orange-600 mt-1">
                      {sarCaseData.subject_profile.risk_score}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">KYC Status</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {sarCaseData.subject_profile.kyc_status.replace("_", " ")}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 md:col-span-2">
                    <p className="text-[10px] text-muted-foreground font-medium">Institution</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {sarCaseData.subject_profile.institution}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Connections</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.subject_profile.connections_count}
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1.5">Relationship Types</p>
                    <div className="flex flex-wrap gap-2">
                      {sarCaseData.subject_profile.relationship_types.map((type) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type.replace(/_/g, " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground font-medium mb-1.5">Countries Involved</p>
                    <div className="flex flex-wrap gap-2">
                      {sarCaseData.subject_profile.countries_involved.map((country) => (
                        <Badge key={country} variant="outline" className="text-xs">
                          {country}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.subject_profile, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Transaction Summary Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "transactions" ? null : "transactions")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Transaction Summary</CardTitle>
                    <CardDescription className="text-xs">
                      {sarCaseData.transaction_summary.review_period.start} to{" "}
                      {sarCaseData.transaction_summary.review_period.end}
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "transactions" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "transactions" && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Total Amount</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      ${sarCaseData.transaction_summary.total_amount}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Transaction Count</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.transaction_summary.transaction_count}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Suspicious TXN</p>
                    <p className="font-mono text-sm font-semibold text-red-600 mt-1">
                      {sarCaseData.transaction_summary.suspicious_transaction_count}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Average Amount</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      ${sarCaseData.transaction_summary.average_amount}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Max Transaction</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      ${sarCaseData.transaction_summary.max_transaction}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Patterns</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {sarCaseData.transaction_summary.patterns_detected.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.transaction_summary, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Suspicious Transactions Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "suspicious" ? null : "suspicious")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Suspicious Transaction Details</CardTitle>
                    <CardDescription className="text-xs">
                      Row-level suspicious activity records
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "suspicious" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "suspicious" && (
              <CardContent className="pt-0 border-t">
                <div className="space-y-2 mt-3">
                  {sarCaseData.suspicious_transactions.map((tx, idx) => (
                    <div key={idx} className="bg-muted/30 rounded-lg p-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs mb-2">
                        <div>
                          <p className="text-muted-foreground font-medium">Date</p>
                          <p className="font-mono text-foreground">{tx.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Amount</p>
                          <p className="font-mono text-foreground">${tx.amount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Type</p>
                          <p className="font-mono text-foreground">{tx.type}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">From</p>
                          <p className="font-mono text-foreground text-[10px]">{tx.from_account}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {tx.indicator.map((ind) => (
                          <Badge key={ind} variant="outline" className="text-[9px]">
                            {ind}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.suspicious_transactions, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Newly Changed Entities Section */}
      {activeSection === "changed" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Regulatory mapping, risk indicators, evidence summary, and narrative analysis
          </div>

          {/* Regulatory Mapping Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow border-red-500/40">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "regulatory" ? null : "regulatory")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-red-500/10">
                    <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Regulatory Mapping ⚠️</CardTitle>
                    <CardDescription className="text-xs">
                      Critical compliance triggers and legal references
                    </CardDescription>
                  </div>
                  <Badge className={`text-xs ${getRiskCategoryColor("CRITICAL")}`}>CRITICAL</Badge>
                </div>
                {expandedEntity === "regulatory" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "regulatory" && (
              <CardContent className="pt-0 border-t">
                <div className="space-y-3 mt-3">
                  {sarCaseData.regulatory_mapping.map((reg, idx) => (
                    <div key={idx} className="bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-3 text-xs mb-2">
                        <div>
                          <p className="text-muted-foreground font-medium">Regulation</p>
                          <p className="font-semibold text-foreground">{reg.regulation}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Reference</p>
                          <p className="font-mono text-foreground">{reg.reference}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-muted-foreground font-medium">Confidence</p>
                          <p className={`font-mono font-semibold ${getConfidenceColor(reg.confidence)}`}>
                            {(reg.confidence * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground font-medium">Trigger Reason</p>
                          <p className="text-foreground">{reg.trigger_reason}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.regulatory_mapping, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Risk Indicators Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "indicators" ? null : "indicators")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <TrendingUp className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Risk Indicators</CardTitle>
                    <CardDescription className="text-xs">
                      Explainability layer and Model reasoning
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "indicators" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "indicators" && (
              <CardContent className="pt-0 border-t">
                <div className="space-y-2 mt-3">
                  {sarCaseData.risk_indicators.map((indicator, idx) => (
                    <div key={idx} className="flex items-start gap-2 bg-muted/30 rounded-lg p-3">
                      <CheckCircle2 className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-foreground">{indicator}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.risk_indicators, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Evidence Summary Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "evidence" ? null : "evidence")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Evidence Summary</CardTitle>
                    <CardDescription className="text-xs">
                      Audit layer and detection methodology
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "evidence" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "evidence" && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">TXN Records</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.evidence_summary.transaction_records}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Risk Score</p>
                    <p className="font-mono text-sm font-semibold text-orange-600 mt-1">
                      {sarCaseData.evidence_summary.risk_score}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Connections</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.evidence_summary.network_connections}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium">Intel Hits</p>
                    <p className="font-mono text-sm font-semibold text-foreground mt-1">
                      {sarCaseData.evidence_summary.external_intelligence_hits}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 md:col-span-2">
                    <p className="text-[10px] text-muted-foreground font-medium">Detection Type</p>
                    <p className="text-xs font-semibold text-foreground mt-1">
                      {sarCaseData.evidence_summary.detection_type.replace(/_/g, " ")}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.evidence_summary, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Narrative Generation Card */}
          <Card className="shadow-card hover:shadow-lg transition-shadow">
            <CardHeader
              className="pb-3 cursor-pointer hover:bg-muted/25 transition-colors"
              onClick={() =>
                setExpandedEntity(expandedEntity === "narrative" ? null : "narrative")
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Code className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base">Narrative Generation</CardTitle>
                    <CardDescription className="text-xs">
                      LLM-generated suspicious activity analysis
                    </CardDescription>
                  </div>
                </div>
                {expandedEntity === "narrative" ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </div>
            </CardHeader>

            {expandedEntity === "narrative" && (
              <CardContent className="pt-0 border-t">
                <div className="space-y-3 mt-3">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium mb-2">SUSPICIOUS ACTIVITY DESCRIPTION</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {sarCaseData.narrative_generation.suspicious_activity_description}
                    </p>
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3">
                    <p className="text-[10px] text-muted-foreground font-medium mb-2">CONCLUSION</p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {sarCaseData.narrative_generation.conclusion}
                    </p>
                  </div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 mt-3 font-mono text-xs overflow-auto">
                  <pre className="text-foreground">
                    {JSON.stringify(sarCaseData.narrative_generation, null, 2)}
                  </pre>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Law Adaptation & Regulatory Sync Section */}
      {activeSection === "laws" && (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Demonstrates system capability to adapt to regulatory changes while maintaining historical compliance
          </div>

          {/* Suspicious Activity Overview */}
          <Card className="shadow-card border-blue-500/30 bg-blue-500/5">
            <CardHeader>
              <CardTitle className="text-base">Suspicious Activity Under Review</CardTitle>
              <CardDescription className="text-xs">
                Same suspicious activity analyzed under different regulatory frameworks
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-semibold text-foreground mb-2">{lawAdaptationData.suspicious_activity}</p>
              <p className="text-muted-foreground text-xs">
                This activity will be marked, classified, and reported differently based on the regulatory framework version being applied.
              </p>
            </CardContent>
          </Card>

          {/* Side-by-Side Law Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* OLD LAW */}
            <Card className="shadow-card border-amber-500/30 bg-amber-500/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Old Regulatory Framework</CardTitle>
                    <CardDescription className="text-xs">
                      {lawAdaptationData.old_law.version}
                    </CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-500/20">
                    Legacy
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Classification */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Risk Classification</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-500/20 text-orange-700 border-orange-500/30">
                      {lawAdaptationData.old_law.risk_classification}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(lawAdaptationData.old_law.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Triggered Rules */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Triggered Rules</p>
                  <div className="space-y-1">
                    {lawAdaptationData.old_law.triggered_rules.map((rule) => (
                      <div key={rule} className="flex items-start gap-2 text-xs bg-muted/40 p-2 rounded">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-amber-600 shrink-0" />
                        <span className="text-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suspicious Indicators */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Detected Indicators</p>
                  <div className="space-y-1">
                    {lawAdaptationData.old_law.suspicious_indicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground">
                        <span className="text-amber-600">•</span>
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative */}
                <div className="space-y-2 bg-muted/30 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">SAR Narrative</p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {lawAdaptationData.old_law.narrative_snippet}
                  </p>
                </div>

                {/* Regulatory References */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Regulatory References</p>
                  <div className="flex flex-wrap gap-1">
                    {lawAdaptationData.old_law.regulatory_references.map((ref) => (
                      <Badge key={ref} variant="outline" className="text-[10px] font-mono">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* NEW LAW */}
            <Card className="shadow-card border-green-500/30 bg-green-500/5 relative">
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500/20 text-green-700 border-green-500/30 animate-pulse">
                  🎯 LATEST
                </Badge>
              </div>
              <CardHeader className="pb-3 pr-20">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">New Regulatory Framework</CardTitle>
                    <CardDescription className="text-xs">
                      {lawAdaptationData.new_law.version}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Risk Classification */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Risk Classification</p>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-500/20 text-red-700 border-red-500/30 font-semibold">
                      {lawAdaptationData.new_law.risk_classification}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Confidence: {(lawAdaptationData.new_law.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-[10px] text-green-700 font-semibold">↑ +1 Level Increase (More Sensitive Detection)</p>
                </div>

                {/* Triggered Rules */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Triggered Rules (Enhanced)</p>
                  <div className="space-y-1">
                    {lawAdaptationData.new_law.triggered_rules.map((rule) => (
                      <div key={rule} className="flex items-start gap-2 text-xs bg-green-500/10 p-2 rounded border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3 mt-0.5 text-green-600 shrink-0" />
                        <span className="text-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suspicious Indicators */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Detected Indicators (Advanced)</p>
                  <div className="space-y-1">
                    {lawAdaptationData.new_law.suspicious_indicators.map((indicator, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground">
                        <span className="text-green-600">✓</span>
                        <span>{indicator}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Narrative */}
                <div className="space-y-2 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">SAR Narrative (Updated)</p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {lawAdaptationData.new_law.narrative_snippet}
                  </p>
                </div>

                {/* Regulatory References */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Regulatory References (2024+)</p>
                  <div className="flex flex-wrap gap-1">
                    {lawAdaptationData.new_law.regulatory_references.map((ref) => (
                      <Badge key={ref} variant="outline" className="text-[10px] font-mono bg-green-500/10 text-green-700 border-green-500/30">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Adaptation Capability */}
          <Card className="shadow-card border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                System Synchronization Capability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Dynamic Rule Engine</p>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>✓ Auto-loads new law frameworks</li>
                    <li>✓ Applies multiple rulesets in parallel</li>
                    <li>✓ Maintains compliance history</li>
                  </ul>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Historical Tracking</p>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>✓ Archive old law classifications</li>
                    <li>✓ Track regulatory evolution</li>
                    <li>✓ Audit trail of law changes</li>
                  </ul>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg">
                  <p className="text-xs font-semibold text-foreground mb-1.5">Adaptive Detection</p>
                  <ul className="text-[10px] text-muted-foreground space-y-1">
                    <li>✓ Sensitivity adjusts to new thresholds</li>
                    <li>✓ ML models retrained automatically</li>
                    <li>✓ Zero compliance gap during transitions</li>
                  </ul>
                </div>
              </div>

              {/* Comparison Summary */}
              <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 p-4 rounded-lg border border-primary/20">
                <p className="text-sm font-semibold text-foreground mb-2">Comparison Summary</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Under Old Law:</p>
                    <p className="text-foreground">
                      Risk: <span className="font-semibold text-orange-600">{lawAdaptationData.old_law.risk_classification}</span> 
                      &nbsp;(Confidence: {(lawAdaptationData.old_law.confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Under New Law:</p>
                    <p className="text-foreground">
                      Risk: <span className="font-semibold text-red-600">{lawAdaptationData.new_law.risk_classification}</span> 
                      &nbsp;(Confidence: {(lawAdaptationData.new_law.confidence * 100).toFixed(0)}%)
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  🎯 <span className="font-semibold">System demonstrates perfect synchronization:</span> The same suspicious activity is correctly reclassified and re-scored according to current regulatory requirements, proving the system's ability to adapt seamlessly to evolving AML/CFT compliance standards while maintaining historical audit trails.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      <Card className="border-muted bg-muted/25">
        <CardContent className="p-4 text-xs text-muted-foreground space-y-1">
          <p>
            <span className="font-semibold text-foreground">Model Version:</span> {sarCaseData.metadata.model_version}
          </p>
          <p>
            <span className="font-semibold text-foreground">Generated:</span> {sarCaseData.metadata.date_generated}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
