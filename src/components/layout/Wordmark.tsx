import { site } from "@/content/site";

type Props = {
  href: string;
  /** Sufijo solo para lectores de pantalla: "inicio" / "home". */
  label: string;
  className?: string;
};

// Logotipo provisional en texto (docs/03 → Logo) hasta tener el vector (H3).
export function Wordmark({ href, label, className = "" }: Props) {
  return (
    <a href={href} className={`wordmark ${className}`}>
      <span className="wordmark-mark">{site.wordmark.mark}</span>{" "}
      <span className="wordmark-sub">{site.wordmark.sub}</span>
      <span className="sr-only"> — {label}</span>
    </a>
  );
}
