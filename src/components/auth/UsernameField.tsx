import { useEffect, useState, useCallback } from "react";
import { User, Check, X, Loader2 } from "lucide-react";
import api from "@/services/api";

interface Props {
  name: string;
  value: string;
  onChange: (val: string) => void;
}

export function generateUsername(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, ".")
    .replace(/^\.+|\.+$/g, "");
}

const UsernameField = ({ name, value, onChange }: Props) => {
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    if (!edited && name) {
      const gen = generateUsername(name);
      if (gen && gen !== value) onChange(gen);
    }
  }, [name, edited]);

  const checkAvailability = useCallback(async (username: string) => {
    if (!username || username.length < 3) {
      setAvailable(null);
      return;
    }
    setChecking(true);
    try {
      const { available: isAvailable } = await api.checkUsername(username);
      setAvailable(isAvailable);
    } catch {
      setAvailable(null);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => checkAvailability(value), 500);
    return () => clearTimeout(timer);
  }, [value, checkAvailability]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">اسم المستخدم</label>
      <div className="relative">
        <User className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="ahmed.benali"
          value={value}
          onChange={(e) => {
            setEdited(true);
            onChange(e.target.value.toLowerCase().replace(/[^a-z0-9.]/g, ""));
          }}
          dir="ltr"
          className="w-full h-11 px-4 pr-10 rounded-lg bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-left"
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          {checking && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {!checking && available === true && <Check className="h-4 w-4 text-green-500" />}
          {!checking && available === false && <X className="h-4 w-4 text-destructive" />}
        </div>
      </div>
      {!checking && available === false && (
        <p className="text-xs text-destructive">اسم المستخدم مأخوذ، جرب اسم آخر</p>
      )}
    </div>
  );
};

export default UsernameField;
