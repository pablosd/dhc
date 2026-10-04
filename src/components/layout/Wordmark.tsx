import { site } from "@/content/site";

type Props = {
  href: string;
  label: string;
  className?: string;
};

// Logotipo provisional en texto (docs/03 → Logo) hasta tener el vector (H3).
export function Wordmark({ href, label, className = "" }: Props) {
  return (
    <a href={href} aria-label={label} className={`wordmark ${className}`}>
      <span className="wordmark-mark" aria-hidden="true">
        {site.wordmark.mark}
      </span>
      <span className="wordmark-sub" aria-hidden="true">
        {site.wordmark.sub}
      </span>
    </a>
  );
}
