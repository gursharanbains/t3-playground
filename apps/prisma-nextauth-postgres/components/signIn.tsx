"use client";
import Label from "@/components/ui/label";
import Input from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    signIn("email", { email, callbackUrl: "/me" });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-96">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          placeholder="example@example.com"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <button
        disabled={loading}
        className="bg-zinc-900 py-2 text-zinc-100 shadow hover:bg-zinc/90 w-full inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
        type="submit"
      >
        Send me a magic link
      </button>
    </form>
  );
}
