export interface TradeCompetencyProfile {
  trade_id: string;
  trade_name: string;
  competency_vector: [number, number, number, number];
  median_wage: number;
  female_safety_score: number;
  center_distance_km: number;
}

export interface HouseholdParameters {
  student_aptitude: [number, number, number, number];
  parent_reservation_wage: number;
  parent_requires_female_safety: boolean;
  weights: { w1: number; w2: number; w3: number };
  gamma: number;
  lambda: number;
  conflict_threshold: number;
}

export interface EvaluationResult {
  similarity: number;
  feasibility: number;
  accessibility: number;
  compositeUtility: number;
  divergence: number;
  isArbitrationTriggered: boolean;
}

const rounded = (value: number) => Number(value.toFixed(3));

export function computeCosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, value, index) => sum + value * (vecB[index] ?? 0), 0);
  const magnitudeA = Math.sqrt(vecA.reduce((sum, value) => sum + value * value, 0));
  const magnitudeB = Math.sqrt(vecB.reduce((sum, value) => sum + value * value, 0));
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dot / (magnitudeA * magnitudeB);
}

export function computeParentFeasibility(
  tradeWage: number,
  reservationWage: number,
  safetyScore: number,
  requiresSafety: boolean,
  gamma = 0.0005,
): number {
  const exponent = Math.max(-60, Math.min(60, -gamma * (tradeWage - reservationWage)));
  const sigmoidWage = 1 / (1 + Math.exp(exponent));
  const safetyIndicator = !requiresSafety || safetyScore >= 8.5 ? 1 : 0;
  return sigmoidWage * safetyIndicator;
}

export function computeGeographicAccessibility(distanceKm: number, lambda = 0.05): number {
  return Math.exp(-lambda * Math.max(0, distanceKm));
}

export function evaluateDyadConsensus(
  trade: TradeCompetencyProfile,
  params: HouseholdParameters,
): EvaluationResult {
  const similarity = computeCosineSimilarity(params.student_aptitude, trade.competency_vector);
  const feasibility = computeParentFeasibility(
    trade.median_wage,
    params.parent_reservation_wage,
    trade.female_safety_score,
    params.parent_requires_female_safety,
    params.gamma,
  );
  const accessibility = computeGeographicAccessibility(trade.center_distance_km, params.lambda);

  const weights = [params.weights.w1, params.weights.w2, params.weights.w3].map((weight) =>
    Math.max(0, weight),
  );
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  const normalized =
    weightTotal > 0 ? weights.map((weight) => weight / weightTotal) : [1 / 3, 1 / 3, 1 / 3];
  const compositeUtility =
    normalized[0]! * similarity + normalized[1]! * feasibility + normalized[2]! * accessibility;
  const divergence = Math.abs(similarity - feasibility);

  return {
    similarity: rounded(similarity),
    feasibility: rounded(feasibility),
    accessibility: rounded(accessibility),
    compositeUtility: rounded(compositeUtility),
    divergence: rounded(divergence),
    isArbitrationTriggered: divergence > params.conflict_threshold,
  };
}
