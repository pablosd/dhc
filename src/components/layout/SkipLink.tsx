type Props = {
  label: string;
};

// Primer elemento enfocable de la página; lleva a <main id="main">.
export function SkipLink({ label }: Props) {
  return (
    <a href="#main" className="skip-link">
      {label}
    </a>
  );
}
