'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCompareCart } from '../../../lib/store';
import { evaluateFRMRisk, validatePanFormat } from '../../../lib/frm/frm-engine';
import { FRMRiskAssessment } from '../../../types';
import {
  CreditCard,
  ShieldCheck,
  UserCheck,
  Building,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  UploadCloud,
  FileCheck2,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

export const PartnerOnboardingWizard: React.FC = () => {
  const router = useRouter();
  const { submitPartnerOnboarding } = useCompareCart();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [name, setName] = useState('Vikramaditya Rao');
  const [email, setEmail] = useState('vikram.rao@fintech.in');
  const [phone, setPhone] = useState('+91 98450 11234');
  const [city, setCity] = useState('Mumbai');
  const [panNumber, setPanNumber] = useState('ABCPS1234F');
  const [aadhaarMasked, setAadhaarMasked] = useState('•••• •••• 9921');
  const [employmentType, setEmploymentType] = useState<'SALARIED' | 'SELF_EMPLOYED' | 'BUSINESS'>('SALARIED');
  const [monthlyIncome, setMonthlyIncome] = useState(250000);

  // Bank State
  const [bankAccount, setBankAccount] = useState('50100489211023');
  const [ifsc, setIfsc] = useState('HDFC0001234');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [pennyDropVerified, setPennyDropVerified] = useState(false);
  const [isVerifyingPenny, setIsVerifyingPenny] = useState(false);

  // Card State
  const [cardBank, setCardBank] = useState('HDFC Bank');
  const [cardName, setCardName] = useState('HDFC Infinia Metal Card');
  const [cardLast4, setCardLast4] = useState('8832');
  const [cardLimit, setCardLimit] = useState(500000);
  const [billingCycleDay, setBillingCycleDay] = useState(15);
  const [statementUploaded, setStatementUploaded] = useState(true);

  // FRM Result
  const [frmResult, setFrmResult] = useState<FRMRiskAssessment | null>(null);
  const [isEvaluatingRisk, setIsEvaluatingRisk] = useState(false);
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null);

  const handlePennyDropTest = () => {
    setIsVerifyingPenny(true);
    setTimeout(() => {
      setPennyDropVerified(true);
      setIsVerifyingPenny(false);
    }, 1200);
  };

  const handleRunFRMCheck = () => {
    setIsEvaluatingRisk(true);
    setTimeout(() => {
      const assessment = evaluateFRMRisk({
        name,
        panNumber,
        bankAccount,
        ifsc,
        cardLimit,
        monthlyIncome,
        employmentType,
      });
      setFrmResult(assessment);
      setIsEvaluatingRisk(false);
      setStep(4);
    }, 1400);
  };

  const handleFinalSubmit = () => {
    if (!frmResult) return;
    const req = submitPartnerOnboarding({
      name,
      email,
      phone,
      city,
      panNumber,
      aadhaarMasked,
      employmentType,
      monthlyIncome,
      bankAccount,
      ifsc,
      bankName,
      initialCardBank: cardBank,
      initialCardName: cardName,
      initialCardLast4: cardLast4,
      initialCardLimit: cardLimit,
      billingCycleDay,
      cardStatementUploaded: statementUploaded,
      frmAssessment: frmResult,
    });
    setSubmittedRequestId(req.id);
    setStep(5);
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Wizard Header */}
      <div className="text-center mb-8 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-white font-medium inline-block">
          CARDHOLDER ONBOARDING & RISK VETTING
        </span>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Join the CompareCart Partner Network
        </h1>
        <p className="text-xs sm:text-sm text-[#86868b] max-w-xl mx-auto leading-relaxed">
          Monetize your premium credit cards by facilitating instant discount swiping for verified buyers under RBI-compliant Tripartite Escrow protection.
        </p>
      </div>

      {/* Apple-Style Segmented Stepper */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {[
          { num: 1, label: 'Identity & PAN' },
          { num: 2, label: 'Bank Settlement' },
          { num: 3, label: 'Card Portfolio' },
          { num: 4, label: 'Risk Assessment' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-3 rounded-2xl border text-center transition-all ${
              step === s.num
                ? 'bg-white text-black border-white shadow-sm font-semibold'
                : step > s.num
                ? 'bg-black/50 text-[#30d158] border-[#30d158]/30 font-medium'
                : 'bg-black/40 text-[#86868b] border-white/5 font-normal'
            }`}
          >
            <div className="text-[10px] font-mono uppercase">Step {s.num}</div>
            <div className="text-xs truncate mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* STEP 1: IDENTITY & PAN */}
      {step === 1 && (
        <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
            <UserCheck className="w-5 h-5 text-[#2997ff]" />
            <div>
              <h3 className="text-base font-semibold text-white">Legal Identity & Income Verification</h3>
              <p className="text-xs text-[#86868b]">Government identity validation according to RBI CDD requirements.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Full Legal Name (as on PAN)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">PAN Number</label>
              <input
                type="text"
                maxLength={10}
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none focus:border-amber-400 uppercase"
              />
              {!validatePanFormat(panNumber) && panNumber.length > 0 && (
                <span className="text-[10px] text-rose-400 mt-1 block">Expected format: ABCPS1234F</span>
              )}
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Masked Aadhaar Number</label>
              <input
                type="text"
                value={aadhaarMasked}
                onChange={(e) => setAadhaarMasked(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Primary City of Residence</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value as any)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none"
              >
                <option value="SALARIED">Salaried Corporate / Professional</option>
                <option value="BUSINESS">Business Owner / Director</option>
                <option value="SELF_EMPLOYED">Self-Employed Consultant</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Monthly Gross Income (₹)</label>
              <input
                type="number"
                step="25000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => setStep(2)}
              disabled={!name || !validatePanFormat(panNumber)}
              className="apple-pill-btn text-xs py-3 px-6 flex items-center gap-2 disabled:opacity-40"
            >
              <span>Continue to Bank Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: BANK SETTLEMENT */}
      {step === 2 && (
        <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
            <Building className="w-5 h-5 text-[#2997ff]" />
            <div>
              <h3 className="text-base font-semibold text-white">Nodal Settlement Bank Account</h3>
              <p className="text-xs text-[#86868b]">Account where your swiped transaction reimbursements & commissions will be deposited.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Account Number</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">IFSC Code</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono uppercase focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>
          </div>

          {/* Penny Drop Verification Banner */}
          <div className="bg-zinc-950/80 p-4 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">NPCI Instant Penny-Drop Verification</span>
                {pennyDropVerified && (
                  <span className="emerald-foil-badge text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Name Match
                  </span>
                )}
              </div>
              <p className="text-[11px] text-zinc-400 mt-0.5">
                Verifies account holder name matches PAN details to comply with PMLA anti-money laundering norms.
              </p>
            </div>

            <button
              onClick={handlePennyDropTest}
              disabled={isVerifyingPenny || pennyDropVerified}
              className={`text-xs font-bold px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                pennyDropVerified
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                  : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/15'
              }`}
            >
              {isVerifyingPenny ? 'Pinging Karza API...' : pennyDropVerified ? 'Verified ✓' : 'Run Penny Drop'}
            </button>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={() => setStep(3)}
              className="apple-pill-btn text-xs py-3 px-6 flex items-center gap-2"
            >
              <span>Continue to Card Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: CARD PORTFOLIO */}
      {step === 3 && (
        <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 pb-4 border-b border-white/[0.08]">
            <CreditCard className="w-5 h-5 text-[#2997ff]" />
            <div>
              <h3 className="text-base font-semibold text-white">Credit Card Declaration & Tokenization</h3>
              <p className="text-xs text-[#86868b]">Register the primary card you wish to allocate for buyer order matching.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Issuing Bank</label>
              <select
                value={cardBank}
                onChange={(e) => setCardBank(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="SBI Card">SBI Card</option>
                <option value="Kotak Bank">Kotak Mahindra Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Card Product Name</label>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Card Last 4 Digits</label>
              <input
                type="text"
                maxLength={4}
                value={cardLast4}
                onChange={(e) => setCardLast4(e.target.value)}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-300 font-semibold mb-1">Allocated Monthly Limit (₹)</label>
              <input
                type="number"
                step="50000"
                value={cardLimit}
                onChange={(e) => setCardLimit(Number(e.target.value))}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-zinc-300 font-semibold mb-1">Billing Cycle Statement Day (1 - 31)</label>
              <input
                type="number"
                min={1}
                max={31}
                value={billingCycleDay}
                onChange={(e) => setBillingCycleDay(Number(e.target.value))}
                className="w-full bg-zinc-950 text-white p-3 rounded-xl border border-white/10 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Statement Verification Upload Simulator */}
          <div className="p-4 bg-zinc-950/80 rounded-2xl border border-dashed border-white/20 text-center">
            <UploadCloud className="w-6 h-6 text-zinc-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-white">Masked Card Statement Uploaded</p>
            <p className="text-[11px] text-zinc-500 mt-0.5">statement_aug2026_masked.pdf (Verified name & last 4 digits)</p>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(2)}
              className="text-xs text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl border border-white/10 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleRunFRMCheck}
              disabled={isEvaluatingRisk}
              className="apple-pill-btn text-xs py-3 px-6 flex items-center gap-2"
            >
              {isEvaluatingRisk ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Evaluating Risk Engine...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Run Risk Analysis</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: FRM RISK ENGINE EVALUATION */}
      {step === 4 && frmResult && (
        <div className="bg-[#161617]/90 rounded-[28px] p-6 sm:p-8 border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-[#30d158]" />
              <div>
                <h3 className="text-base font-semibold text-white">Bureau Risk Assessment</h3>
                <p className="text-xs text-[#86868b]">Automated screening across CIBIL, Karza NSDL, and AML sanctions.</p>
              </div>
            </div>

            <span className="text-xs font-mono font-medium text-[#30d158] bg-[#30d158]/10 border border-[#30d158]/30 px-3 py-1 rounded-full">
              {frmResult.riskTier}
            </span>
          </div>

          {/* Risk Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Overall Risk Index</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">{frmResult.overallScore}/100</p>
              <span className="text-[9px] text-zinc-400 block font-mono">0 = Safest</span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">CIBIL Bureau Score</span>
              <p className="text-xl font-black text-amber-300 mt-0.5">{frmResult.cibilScore}</p>
              <span className="text-[9px] text-emerald-400 block font-semibold">{frmResult.cibilStatus}</span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">Penny Drop Match</span>
              <p className="text-xl font-black text-white mt-0.5">{frmResult.pennyDropMatchScore}%</p>
              <span className="text-[9px] text-emerald-400 block font-semibold">100% Name Match</span>
            </div>

            <div className="bg-zinc-950 p-3.5 rounded-2xl border border-white/5 text-center">
              <span className="text-[10px] text-zinc-500 uppercase font-bold block">AML Sanctions</span>
              <p className="text-xl font-black text-emerald-400 mt-0.5">CLEAN</p>
              <span className="text-[9px] text-zinc-400 block font-mono">0 Hits Found</span>
            </div>
          </div>

          {/* Breakdown checklist */}
          <div className="bg-zinc-950/70 p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">PAN NSDL Database Verification:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified ({frmResult.panHolderName})
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-white/5">
              <span className="text-zinc-400">NPCI Beneficiary Account Match:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct Match ({frmResult.pennyDropAccountHolder})
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-400">Dispute & Return Rolling Reserve:</span>
              <span className="text-amber-300 font-mono font-bold">
                {frmResult.disputeReservePercentage}% (Standard Protection)
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={() => setStep(3)}
              className="apple-pill-btn-secondary text-xs px-4 py-2.5 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleFinalSubmit}
              className="apple-pill-btn text-xs py-3 px-6 flex items-center gap-2"
            >
              <span>Submit for Admin Activation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: SUBMITTED CONFIRMATION */}
      {step === 5 && (
        <div className="bg-[#161617]/90 rounded-[28px] p-8 border border-white/10 text-center space-y-5 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-[#30d158]/10 border border-[#30d158]/20 text-[#30d158] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-[#30d158]" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-[#30d158]/10 text-[#30d158] border border-[#30d158]/30 font-medium inline-block mb-2">
              APPLICATION LODGED • AWAITING ADMIN REVIEW
            </span>
            <h2 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Cardholder Onboarding Request Received
            </h2>
            <p className="text-xs text-[#86868b] max-w-md mx-auto mt-2 leading-relaxed">
              Your application has passed automated FRM scoring (Score: {frmResult?.overallScore}/100) and is queued in the Super Admin Approvals Deck for final KYC authorization.
            </p>
          </div>

          <div className="p-4 bg-black/50 rounded-2xl border border-white/10 max-w-sm mx-auto text-left text-xs font-mono space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#86868b]">Request ID:</span>
              <span className="text-white font-medium">{submittedRequestId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Card Allocated:</span>
              <span className="text-[#2997ff] font-medium">{cardBank} {cardName} (..{cardLast4})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#86868b]">Assigned Limit:</span>
              <span className="text-[#30d158] font-medium">₹{cardLimit.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <Link
              href="/admin"
              className="apple-pill-btn text-xs py-3 px-5 text-center"
            >
              Open Admin Approvals Deck
            </Link>

            <Link
              href="/partner"
              className="apple-pill-btn-secondary text-xs py-3 px-5 text-center"
            >
              Back to Partner Portal
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
