import { FRMRiskAssessment, FRMRuleConfig, FRMRiskTier } from '../../types';

export const DEFAULT_FRM_CONFIG: FRMRuleConfig = {
  maxDailyGmvPerCard: 150000, // ₹1,50,000 maximum daily swipe limit
  maxHourlySwipes: 2,         // Max 2 transactions per hour per card
  minCibilScore: 700,         // Minimum credit score threshold
  mandatoryPennyDrop: true,   // Requires 100% name match on payout account
  reserveRatioPercent: 5,     // 5% rolling reserve against chargebacks/returns
  stepUpVerificationAboveGmv: 75000,
};

/**
 * Validates Indian PAN number format (e.g. ABCPS1234F)
 */
export function validatePanFormat(pan: string): boolean {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.toUpperCase().trim());
}

/**
 * Simulates Karza / NSDL PAN verification & Bureau CIBIL pull
 */
export function evaluateFRMRisk(data: {
  name: string;
  panNumber: string;
  bankAccount: string;
  ifsc: string;
  cardLimit: number;
  monthlyIncome: number;
  employmentType: 'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS';
}): FRMRiskAssessment {
  const panValid = validatePanFormat(data.panNumber);
  
  // Deterministic high-accuracy simulated CIBIL score based on PAN hash
  const seed = data.panNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const baseCibil = 680 + (seed % 170); // 680 to 850
  
  let cibilStatus: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' = 'GOOD';
  if (baseCibil >= 780) cibilStatus = 'EXCELLENT';
  else if (baseCibil >= 720) cibilStatus = 'GOOD';
  else if (baseCibil >= 680) cibilStatus = 'FAIR';
  else cibilStatus = 'POOR';

  // Penny Drop Simulation (Karza/Setu bank account validation)
  const pennyDropMatched = data.bankAccount.length >= 8 && data.ifsc.length === 11;
  const pennyDropMatchScore = pennyDropMatched ? 100 : 45;

  const flags: string[] = [];
  let riskScore = 12; // Base baseline risk

  if (!panValid) {
    riskScore += 45;
    flags.push('INVALID_PAN_FORMAT');
  }

  if (baseCibil < 700) {
    riskScore += 25;
    flags.push('SUB_PRIME_CIBIL_SCORE');
  } else if (baseCibil >= 780) {
    riskScore = Math.max(5, riskScore - 8);
  }

  if (data.cardLimit > 500000 && data.monthlyIncome < 100000) {
    riskScore += 20;
    flags.push('HIGH_LIMIT_LEVERAGE_DISPROPORTION');
  }

  if (!pennyDropMatched) {
    riskScore += 35;
    flags.push('PENNY_DROP_NAME_MISMATCH');
  }

  // Tier classification
  let riskTier: FRMRiskTier = 'TIER_1_LOW';
  if (riskScore <= 20) {
    riskTier = 'TIER_1_LOW';
  } else if (riskScore <= 50) {
    riskTier = 'TIER_2_MODERATE';
  } else if (riskScore <= 75) {
    riskTier = 'TIER_3_ELEVATED';
  } else {
    riskTier = 'CRITICAL_HIGH';
  }

  return {
    overallScore: Math.min(100, Math.max(0, riskScore)),
    riskTier,
    cibilScore: baseCibil,
    cibilStatus,
    panVerified: panValid,
    panHolderName: data.name.toUpperCase(),
    aadhaarVerified: true,
    pennyDropMatched,
    pennyDropAccountHolder: data.name.toUpperCase(),
    pennyDropMatchScore,
    amlSanctionsClean: true,
    velocityRiskScore: 8,
    hourlySwipeVelocity: 0,
    dailySwipeGmv: 0,
    disputeReservePercentage: DEFAULT_FRM_CONFIG.reserveRatioPercent,
    flags,
  };
}
