import { useEffect, useState, useCallback } from "react";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  designation: string;
  ministry: string;
  districtHub: string;
}

export interface AdminSession {
  token: string;
  user: AdminUser;
  issuedAt: number;
  expiresAt: number;
  rememberMe: boolean;
}

const SESSION_STORAGE_KEY = "mitraskill_admin_session_v1";
const ATTEMPTS_STORAGE_KEY = "mitraskill_admin_attempts_v1";
const SALT = "mitraskill_salt_msde_2026";
// SHA-256 of "mitraskill_salt_msde_2026:MitraAdmin@2026"
const TARGET_PASSWORD_HASH = "22ed9ec781c708535217eb5fa1229330930943c52310529c72c3da7997d55306";
const DEMO_EMAILS = ["admin@msde.gov.in", "admin", "director@dgt.gov.in"];

export const DEMO_CREDENTIALS = {
  username: "admin@msde.gov.in",
  password: "MitraAdmin@2026",
  role: "Director of Vocational Triage & Guidance",
  ministry: "Ministry of Skill Development & Entrepreneurship (MSDE)",
  portalNotice: "Official DGT & NCVT Administration Console",
};

async function sha256(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSessionToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function useAdminAuth() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check existing session in localStorage or sessionStorage
  useEffect(() => {
    try {
      const stored =
        localStorage.getItem(SESSION_STORAGE_KEY) ||
        sessionStorage.getItem(SESSION_STORAGE_KEY);

      if (stored) {
        const parsed: AdminSession = JSON.parse(stored);
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setSession(parsed);
        } else {
          // Expired
          localStorage.removeItem(SESSION_STORAGE_KEY);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
          setSession(null);
        }
      }
    } catch {
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Check lockout
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (raw) {
        const { lockedUntil } = JSON.parse(raw);
        if (lockedUntil && lockedUntil > Date.now()) {
          setLockoutRemaining(Math.ceil((lockedUntil - Date.now()) / 1000));
        }
      }
    } catch {
      // Ignore
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          try {
            sessionStorage.removeItem(ATTEMPTS_STORAGE_KEY);
          } catch {
            // Ignore
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutRemaining]);

  const login = useCallback(
    async (
      usernameInput: string,
      passwordInput: string,
      rememberMe: boolean = true
    ): Promise<{ success: boolean; error?: string }> => {
      if (lockoutRemaining > 0) {
        return {
          success: false,
          error: `Account temporarily locked due to multiple failed attempts. Please retry in ${lockoutRemaining} seconds.`,
        };
      }

      const trimmedUser = usernameInput.trim().toLowerCase();
      const trimmedPass = passwordInput.trim();

      const userMatch = DEMO_EMAILS.some((email) => email.toLowerCase() === trimmedUser);
      const computedHash = await sha256(`${SALT}:${trimmedPass}`);
      const passMatch = computedHash === TARGET_PASSWORD_HASH;

      if (!userMatch || !passMatch) {
        // Record failed attempt
        try {
          const raw = sessionStorage.getItem(ATTEMPTS_STORAGE_KEY);
          const data = raw ? JSON.parse(raw) : { count: 0 };
          data.count = (data.count || 0) + 1;
          if (data.count >= 5) {
            data.lockedUntil = Date.now() + 30_000; // 30 sec lockout
            setLockoutRemaining(30);
          }
          sessionStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(data));
        } catch {
          // Ignore
        }

        return {
          success: false,
          error: "Invalid Administrator ID or Passcode. Please check demo credentials shown above.",
        };
      }

      // Success: clear attempts
      try {
        sessionStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      } catch {
        // Ignore
      }

      const newSession: AdminSession = {
        token: `msde_auth_${generateSessionToken()}`,
        user: {
          id: "MSDE-OFFICER-7801",
          name: "Dr. R. K. Srivastava",
          email: "admin@msde.gov.in",
          role: "Central Administrator",
          designation: "Director of Vocational Guidance & Family Consensus",
          ministry: "Ministry of Skill Development & Entrepreneurship (MSDE)",
          districtHub: "National ITI Strategic Oversight Grid",
        },
        issuedAt: Date.now(),
        // 8 hours expiry
        expiresAt: Date.now() + 8 * 60 * 60 * 1000,
        rememberMe,
      };

      try {
        const serialized = JSON.stringify(newSession);
        if (rememberMe) {
          localStorage.setItem(SESSION_STORAGE_KEY, serialized);
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        } else {
          sessionStorage.setItem(SESSION_STORAGE_KEY, serialized);
          localStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch {
        // Ignore
      }

      setSession(newSession);
      return { success: true };
    },
    [lockoutRemaining]
  );

  const quickDemoLogin = useCallback(async () => {
    return login(DEMO_CREDENTIALS.username, DEMO_CREDENTIALS.password, true);
  }, [login]);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
    setSession(null);
  }, []);

  return {
    session,
    isAuthenticated: !!session,
    isLoading,
    lockoutRemaining,
    login,
    quickDemoLogin,
    logout,
  };
}
