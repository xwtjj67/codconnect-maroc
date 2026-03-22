import { Check, X } from "lucide-react";

interface Props {
  password: string;
}

const rules = [
  { label: "6 أحرف على الأقل", test: (p: string) => p.length >= 6 },
  { label: "حرف كبير", test: (p: string) => /[A-Z]/.test(p) },
  { label: "حرف صغير", test: (p: string) => /[a-z]/.test(p) },
  { label: "رقم واحد", test: (p: string) => /[0-9]/.test(p) },
];

export const isPasswordStrong = (p: string) => rules.every((r) => r.test(p));

const PasswordStrengthIndicator = ({ password }: Props) => {
  if (!password) return null;
  const passed = rules.filter((r) => r.test(password)).length;
  const strength = passed <= 1 ? "ضعيفة" : passed <= 3 ? "متوسطة" : "قوية";
  const color = passed <= 1 ? "text-destructive" : passed <= 3 ? "text-yellow-500" : "text-green-500";
  const barColor = passed <= 1 ? "bg-destructive" : passed <= 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-secondary/50 overflow-hidden">
          <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${(passed / 4) * 100}%` }} />
        </div>
        <span className={`text-xs font-medium ${color}`}>
          {passed <= 1 ? "❌" : passed <= 3 ? "⚠️" : "✔"} كلمة السر {strength}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-1">
        {rules.map((r) => (
          <div key={r.label} className="flex items-center gap-1 text-xs">
            {r.test(password) ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <X className="h-3 w-3 text-muted-foreground" />
            )}
            <span className={r.test(password) ? "text-green-500" : "text-muted-foreground"}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
