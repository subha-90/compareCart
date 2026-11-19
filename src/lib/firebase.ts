// Firebase Web SDK for CompareCart Carrier SMS Verification
// Free 10,000 phone verifications / month worldwide on Firebase Spark Plan
// Invisible reCAPTCHA - Zero friction, RBI / TRAI compliant

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
  process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

if (typeof window !== 'undefined' && isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { auth };

/**
 * Creates or retrieves an invisible RecaptchaVerifier on the specified container DOM element ID
 */
export function initRecaptchaVerifier(containerId: string): RecaptchaVerifier | null {
  if (typeof window === 'undefined' || !auth) {
    return null;
  }

  try {
    // Clear any previous instance on window to avoid duplicates
    const win = window as unknown as { recaptchaVerifier?: RecaptchaVerifier };
    if (win.recaptchaVerifier) {
      try {
        win.recaptchaVerifier.clear();
      } catch {
        // best effort
      }
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
      callback: () => {
        // reCAPTCHA solved - allow signInWithPhoneNumber
      },
      'expired-callback': () => {
        console.warn('[Firebase] Recaptcha expired, re-initialization needed');
      },
    });

    win.recaptchaVerifier = verifier;
    return verifier;
  } catch (err) {
    console.warn('[Firebase] Error initializing RecaptchaVerifier:', err);
    return null;
  }
}

/**
 * Dispatches real Carrier SMS via Firebase Phone Auth
 * @param phoneNumber E.164 formatted number e.g. +919876543210
 * @param appVerifier RecaptchaVerifier instance
 */
export async function sendCarrierPhoneOtp(
  phoneNumber: string,
  appVerifier: RecaptchaVerifier
): Promise<{ success: boolean; confirmationResult?: ConfirmationResult; error?: string }> {
  if (!auth) {
    return {
      success: false,
      error: 'Firebase is not configured. Falling back to local verification.',
    };
  }

  try {
    // Ensure number is E.164 format (+91 prefix for 10-digit Indian numbers)
    let formatted = phoneNumber.trim().replace(/[\s-]/g, '');
    if (!formatted.startsWith('+')) {
      if (formatted.length === 10) {
        formatted = `+91${formatted}`;
      } else {
        formatted = `+${formatted}`;
      }
    }

    const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
    return {
      success: true,
      confirmationResult,
    };
  } catch (err: any) {
    console.error('[Firebase] Send SMS Error:', err);
    return {
      success: false,
      error: err.message || 'Failed to dispatch carrier SMS via Firebase Phone Auth.',
    };
  }
}

/**
 * Confirms the 6-digit OTP received on the carrier phone
 */
export async function verifyCarrierPhoneOtp(
  confirmationResult: ConfirmationResult,
  code: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    const userCredential = await confirmationResult.confirm(code);
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (err: any) {
    console.error('[Firebase] Verify OTP Error:', err);
    return {
      success: false,
      error: err.message || 'Invalid or expired OTP code entered.',
    };
  }
}
