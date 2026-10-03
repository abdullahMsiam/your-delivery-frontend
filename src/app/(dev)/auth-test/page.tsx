"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api-client";
import { useAuth } from "@/src/hooks/useAuth";
import { queryKeys } from "@/lib/query-keys";
import { useQuery } from "@tanstack/react-query";

export default function AuthTestPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Fetches /auth/me when authenticated — exercises the bearer header.
  const meQuery = useQuery({
    queryKey: queryKeys.auth.me,
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await api.get("/auth/me");
      return res.data.data;
    },
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email, password);
      toast.success(`Logged in as ${u.name} (${u.role})`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast.error(`${err.status}: ${err.message}`);
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await logout();
    toast.success("Logged out");
  }

  return (
    <main className="min-h-screen p-8 flex flex-col items-center gap-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Auth Smoke Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="w-full"
          >
            {loading ? "Logging in…" : "Login"}
          </Button>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>State</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <div>
            <strong>isAuthenticated:</strong> {String(isAuthenticated)}
          </div>
          <div>
            <strong>user.role:</strong> {user?.role ?? "—"}
          </div>
          <div>
            <strong>user.name:</strong> {user?.name ?? "—"}
          </div>
          <div>
            <strong>/auth/me status:</strong>{" "}
            {meQuery.isLoading
              ? "loading…"
              : meQuery.isError
                ? "error"
                : meQuery.isSuccess
                  ? "ok"
                  : "idle"}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
