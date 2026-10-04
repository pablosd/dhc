type Props = {
  /** id del H2: la sección lo referencia con aria-labelledby. */
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  className?: string;
};

// Eyebrow + H2 + lead. Cada sección tiene un único H2 (docs/04).
export function SectionHeading({ id, eyebrow, title, lead, className = "" }: Props) {
  return (
    <div className={`grid gap-3.5 ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id}>{title}</h2>
      {lead ? <p className="lead">{lead}</p> : null}
    </div>
  );
}
