import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

function format(remaining: number) {
  const seconds = Math.max(0, Math.ceil(remaining / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

export function CartExpiryNotice({
  expiresAt,
  onExpire,
}: {
  expiresAt: number | null;
  onExpire: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!expiresAt) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);
  useEffect(() => {
    if (expiresAt && now >= expiresAt) onExpire();
  }, [expiresAt, now, onExpire]);
  if (!expiresAt) return null;
  return (
    <div
      className="mt-4 flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2.5 text-xs leading-5 text-[#075dbb]"
      role="status"
    >
      <Clock3 size={15} className="shrink-0" />
      <span>
        Votre sélection sera retirée de ce panier dans{" "}
        <strong className="tabular-nums">{format(expiresAt - now)}</strong>.
      </span>
    </div>
  );
}
