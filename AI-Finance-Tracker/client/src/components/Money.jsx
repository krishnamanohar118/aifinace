import { useAuth } from "../hooks/useAuth";
export default function Money({ value = 0 }) {
  const { user } = useAuth();
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: user?.currency || "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
