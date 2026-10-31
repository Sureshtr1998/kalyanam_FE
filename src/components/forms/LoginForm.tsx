import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/fields/Field";
import { PasswordInput } from "@/components/fields/PasswordInput";
import api from "@/utils/api";
import { setItem, user_login_token } from "@/utils/localStore";
import type { FormType } from "@/utils/interfaces";
import { errorMessage } from "@/lib/errors";

const LoginForm = ({ setCurrentForm }: { setCurrentForm: (f: FormType) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { email: email.trim().toLowerCase(), password, isPartner });
      setItem(user_login_token, res.data);
      window.location.href = res.data.role === "BROKER" ? "/partner" : "/home";
    } catch (err) {
      toast.error("Login failed", { description: errorMessage(err) });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="mb-1 text-center">
        <h2 className="font-display text-3xl font-bold">Welcome back</h2>
        <p className="text-sm text-muted-foreground">Log in to continue your search</p>
      </div>
      <Field label="Email" htmlFor="login-email">
        <Input
          id="login-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="h-11 bg-card"
        />
      </Field>
      <Field
        label={
          <span className="flex w-full items-center justify-between">
            Password
            <button
              type="button"
              onClick={() => setCurrentForm("forgotPassword")}
              className="text-xs font-semibold text-primary hover:underline">
              Forgot password?
            </button>
          </span>
        }
        htmlFor="login-password">
        <PasswordInput
          id="login-password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11"
        />
      </Field>
      <div className="flex items-center gap-2">
        <Checkbox id="partner" checked={isPartner} onCheckedChange={(v) => setIsPartner(v === true)} />
        <Label htmlFor="partner" className="text-sm font-normal text-muted-foreground">
          I am a registered matchmaker partner
        </Label>
      </div>
      <Button type="submit" size="lg" className="h-11" disabled={loading}>
        <LogIn />
        {loading ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        New to Seetha Rama Kalyana?{" "}
        <button type="button" onClick={() => setCurrentForm(1)} className="font-semibold text-primary hover:underline">
          Create a profile
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
