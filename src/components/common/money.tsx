import { formatMinor } from "@/lib/money";

interface MoneyProps {
  amountMinor: number;
  currency?: string;
  locale?: string;
  className?: string;
}

export function Money({ amountMinor, currency = "USD", locale = "en-US", className }: MoneyProps) {
  return <span className={className}>{formatMinor(amountMinor, currency, locale)}</span>;
}
