import { NextResponse } from "next/server";
import { UserRole } from "@/src/types";

/**
 * Server-side demo login.
 * Reads credentials from server-only env vars, calls the backend,
 * and returns the token pair to the browser.
 *
 * NOTE: this is a demo convenience. In production, replace with proper
 * onboarding or a `demo` flag on the backend itself.
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

type DemoRole = "ADMIN" | "CUSTOMER" | "AGENT";

const CREDS: Record<DemoRole, { email?: string; password?: string }> = {
  ADMIN: {
    email: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
  },
  CUSTOMER: {
    email: process.env.DEMO_CUSTOMER_EMAIL,
    password: process.env.DEMO_CUSTOMER_PASSWORD,
  },
  AGENT: {
    email: process.env.DEMO_AGENT_EMAIL,
    password: process.env.DEMO_AGENT_PASSWORD,
  },
};

export async function POST(req: Request) {
  let role: DemoRole;
  try {
    const body = await req.json();
    role = body?.role;
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (role !== "ADMIN" && role !== "CUSTOMER" && role !== "AGENT") {
    return NextResponse.json(
      { success: false, message: "Unknown role" },
      { status: 400 },
    );
  }

  const creds = CREDS[role];
  if (!creds.email || !creds.password) {
    return NextResponse.json(
      {
        success: false,
        message: `Demo ${role.toLowerCase()} credentials are not configured on the server.`,
      },
      { status: 500 },
    );
  }

  // Call the backend from the server. The credentials never reach the browser.
  const backendRes = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ email: creds.email, password: creds.password }),
    cache: "no-store",
  });

  const text = await backendRes.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    json = { success: false, message: text || "Backend error" };
  }

  if (!backendRes.ok) {
    return NextResponse.json(json, { status: backendRes.status });
  }

  // Only return the fields the client needs. Never echo the password.
  const data = (
    json as {
      data: { accessToken: string; refreshToken: string; user: unknown };
    }
  ).data;

  return NextResponse.json({
    success: true,
    message: "Demo login successful",
    data: {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    },
  });
}
