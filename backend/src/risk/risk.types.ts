/**
 * Risk scoring response from external AI service
 */
export interface RiskResponse {
  score: number; // 0-100
  topReasons: string[]; // Top 2 most important risk factors
  allReasons?: string[]; // All identified risk factors
}
