import { site } from "@/content/site";

type Props = {
  text: string;
};

// Franja de vista previa mientras site.demoMode sea true (docs/01).
export function DemoBanner({ text }: Props) {
  if (!site.demoMode) return null;
  return <p className="demo-banner">{text}</p>;
}
