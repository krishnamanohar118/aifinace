import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
export function Loading({ label = "Loading..." }) {
  return (
    <div className="state">
      <LoaderCircle className="spin" />
      <p>{label}</p>
    </div>
  );
}
export function ErrorState({ message = "Something went wrong." }) {
  return (
    <div className="state">
      <AlertCircle />
      <p>{message}</p>
    </div>
  );
}
export function EmptyState({ message = "Nothing here yet." }) {
  return (
    <div className="state">
      <Inbox />
      <p>{message}</p>
    </div>
  );
}
