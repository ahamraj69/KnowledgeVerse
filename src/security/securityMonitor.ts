import { SecurityEvent, SecurityEventLog } from "./securityConstants";
import { logSecurityEventTransaction } from "./auditLogger";
import { dispatchSecurityAlertSignal, SecurityAlertSeverity } from "./securityAlerts";

export interface SecurityIncidentSummary {
  event: SecurityEvent;
  userId: string;
  severity: SecurityAlertSeverity;
  contextText: string;
}

/**
 * Monitors real-time validation anomalies to assign severity alerts and notify administrators [INDEX].
 */
export async function trackAndMonitorSecurityIncident(incident: SecurityIncidentSummary): Promise<void> {
  console.log(`[SECURITY MONITOR] Processing active event trace: ${incident.event} (Severity: ${incident.severity})`);

  // 1. Log structural item entries inside the immutable tracking data store
  await logSecurityEventTransaction(incident.userId, incident.event, {
    description: incident.contextText,
    severityRating: incident.severity
  });

  // 2. Escalate critical operational metrics straight to high-priority alert queues
  if (incident.severity === "high" || incident.severity === "critical") {
    await dispatchSecurityAlertSignal(
      incident.event,
      incident.severity,
      `CRITICAL INTRUSION TRIGGERED: ${incident.contextText}. Node assigned for auditing review.`
    );
  }
}
