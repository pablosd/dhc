import { site } from "@/content/site";

type Props = {
  text: string;
  label: string;
};

// Franja de vista previa mientras site.demoMode sea true (docs/01).
export function DemoBanner({ text, label }: Props) {
  if (!site.demoMode) return null;
  return (
    <aside className="demo-banner" aria-label={label}>
      {text}
    </aside>
  );
}
