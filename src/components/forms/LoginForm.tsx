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
import { usePublicLang } from "@/lib/i18n";
import { landerText } from "@/screens/lander/lang";

const LoginForm = ({ setCurrentForm }: { setCurrentForm: (f: FormType) => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPartner, setIsPartner] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = landerText[usePublicLang()[0]];

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error(t.enterBoth);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/login", { email: email.trim().toLowerCase(), password, isPartner });
      setItem(user_login_token, res.data);
      window.location.href = res.data.role === "BROKER" ? "/partner" : "/home";
    } catch (err) {
      toast.error(t.loginFailed, { description: errorMessage(err) });
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="mb-1 text-center">
        <h2 className="font-display text-3xl font-bold">{t.welcome}</h2>
        <p className="text-sm text-muted-foreground">{t.welcomeSub}</p>
      </div>
      <Field label={t.email} htmlFor="login-email">
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
            {t.password}
            <button
              type="button"
              onClick={() => setCurrentForm("forgotPassword")}
              className="text-xs font-semibold text-primary hover:underline">
              {t.forgot}
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
          {t.isPartner}
        </Label>
      </div>
      <Button type="submit" size="lg" className="h-11" disabled={loading}>
        <LogIn />
        {loading ? t.loggingIn : t.login}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        {t.newHere}{" "}
        <button type="button" onClick={() => setCurrentForm(1)} className="font-semibold text-primary hover:underline">
          {t.createProfile}
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
