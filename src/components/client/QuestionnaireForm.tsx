"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Question, Section } from "@/content/questionnaire";

// Cuestionario para el dueño (docs/07). Todo ocurre en el navegador: nada se
// guarda en la VPS. El borrador se conserva en el propio teléfono (localStorage)
// para poder responder por partes. Al terminar: enviar por correo (Web3Forms),
// compartir por WhatsApp, copiar o descargar un .doc.

type Value = string | string[] | Record<string, string> | undefined;
type Answers = Record<string, Value>;

const STORAGE_KEY = "dhc-cuestionario-v1";
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";
const DRIVE_URL = process.env.NEXT_PUBLIC_QUESTIONNAIRE_DRIVE_URL ?? "";

type Props = { sections: Section[] };

// ---------- Texto con preguntas y respuestas ----------

function formatAnswer(q: Question, v: Value): string {
  if (v === undefined) return "—";
  switch (q.kind) {
    case "text":
    case "textarea":
      return (v as string).trim() || "—";
    case "single": {
      const o = v as Record<string, string>;
      const parts = [o.choice, o.extra ? `${q.extra}: ${o.extra}` : ""].filter(Boolean);
      return parts.join("\n") || "—";
    }
    case "multi": {
      const o = v as Record<string, string>;
      const chosen = (o.choices ?? "").split("|").filter(Boolean);
      if (o.other) chosen.push(`Otros: ${o.other}`);
      const parts = [chosen.join(", "), o.extra ? `${q.extra}: ${o.extra}` : ""].filter(Boolean);
      return parts.join("\n") || "—";
    }
    case "matrix": {
      const o = v as Record<string, string>;
      const lines = q.rows.filter((r) => o[r]).map((r) => `• ${r}: ${o[r]}`);
      return lines.join("\n") || "—";
    }
    case "fields": {
      const o = v as Record<string, string>;
      const lines = q.fields.filter((f) => o[f.id]?.trim()).map((f) => `• ${f.label}: ${o[f.id].trim()}`);
      return lines.join("\n") || "—";
    }
  }
}

function isAnswered(q: Question, v: Value) {
  return formatAnswer(q, v) !== "—";
}

function buildText(sections: Section[], answers: Answers, respondent: string, bold = true) {
  const b = (s: string) => (bold ? `*${s}*` : s);
  const out = [b("Cuestionario DHC — respuestas"), respondent ? `Respondido por: ${respondent}` : "", ""];
  for (const s of sections) {
    out.push(b(`${s.id} · ${s.title.toUpperCase()}`), "");
    for (const q of s.questions) {
      out.push(b(`${q.id}${q.star ? " ★" : ""} ${q.text}`), formatAnswer(q, answers[q.id]), "");
    }
  }
  return out.join("\n");
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function buildDoc(sections: Section[], answers: Answers, respondent: string) {
  const body = sections
    .map(
      (s) =>
        `<h2>${s.id} · ${escapeHtml(s.title)}</h2>` +
        s.questions
          .map(
            (q) =>
              `<p><b>${q.id}${q.star ? " ★" : ""} ${escapeHtml(q.text)}</b><br>${escapeHtml(formatAnswer(q, answers[q.id])).replace(/\n/g, "<br>")}</p>`,
          )
          .join(""),
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Cuestionario DHC</title></head><body style="font-family:Arial,sans-serif"><h1>Cuestionario DHC — respuestas</h1>${respondent ? `<p>Respondido por: ${escapeHtml(respondent)}</p>` : ""}${body}</body></html>`;
}

// ---------- Componente ----------

function loadDraft(): { answers: Answers; respondent: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as { answers?: Answers; respondent?: string };
      return { answers: saved.answers ?? {}, respondent: saved.respondent ?? "" };
    }
  } catch {}
  return { answers: {}, respondent: "" };
}

// Se renderiza solo en el navegador (QuestionnaireLoader, ssr: false), así que
// el borrador se lee al iniciar el estado.
export function QuestionnaireForm({ sections }: Props) {
  const [answers, setAnswers] = useState<Answers>(() => loadDraft().answers);
  const [respondent, setRespondent] = useState(() => loadDraft().respondent);
  const [status, setStatus] = useState<{ kind: "idle" | "sending" | "sent" | "error" | "copied" | "info"; msg?: string }>({ kind: "idle" });
  const [confirmClear, setConfirmClear] = useState(false);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  // Borrador guardado en este teléfono (nunca sale de él salvo al enviar).
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, respondent }));
    } catch {}
  }, [answers, respondent]);

  const all = useMemo(() => sections.flatMap((s) => s.questions), [sections]);
  const stars = all.filter((q) => q.star);
  const answeredStars = stars.filter((q) => isAnswered(q, answers[q.id])).length;
  const answeredAll = all.filter((q) => isAnswered(q, answers[q.id])).length;

  const set = (id: string, v: Value) => setAnswers((a) => ({ ...a, [id]: v }));
  const setPart = (id: string, key: string, value: string) =>
    setAnswers((a) => ({ ...a, [id]: { ...((a[id] as Record<string, string>) ?? {}), [key]: value } }));

  const text = () => buildText(sections, answers, respondent);

  // ---------- Acciones ----------

  const sendEmail = async () => {
    if (!ACCESS_KEY) {
      setStatus({ kind: "error", msg: "El envío por correo no está configurado. Usa WhatsApp o descarga el documento." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const data = new FormData();
      data.set("access_key", ACCESS_KEY);
      data.set("subject", `Cuestionario DHC — ${respondent || "respuestas"}`);
      data.set("from_name", "Cuestionario DHC");
      data.set("respondido_por", respondent || "—");
      data.set("preguntas_imprescindibles", `${answeredStars} de ${stars.length}`);
      data.set("message", buildText(sections, answers, respondent, false));
      const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || json.success === false) throw new Error(`HTTP ${res.status}`);
      setStatus({ kind: "sent", msg: "¡Enviado! Pablo ya tiene tus respuestas. Puedes seguir editando y volver a enviar si cambias algo." });
    } catch {
      setStatus({ kind: "error", msg: "No se pudo enviar. Prueba con WhatsApp o descarga el documento." });
    }
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text());
      setStatus({ kind: "copied", msg: "Copiado. Pégalo en WhatsApp o en un correo para Pablo." });
    } catch {
      // Respaldo: mostrar el texto seleccionado para copiarlo a mano.
      const el = fallbackRef.current;
      if (el) {
        el.value = text();
        el.hidden = false;
        el.select();
      }
      setStatus({ kind: "info", msg: "Selecciona el texto de abajo y cópialo." });
    }
  };

  const share = async () => {
    const t = text();
    if (navigator.share) {
      try {
        await navigator.share({ title: "Cuestionario DHC", text: t });
        return;
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(t)}`, "_blank", "noopener");
  };

  const download = () => {
    const blob = new Blob([buildDoc(sections, answers, respondent)], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cuestionario-dhc.doc";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  const clearAll = () => {
    setAnswers({});
    setRespondent("");
    setConfirmClear(false);
    setStatus({ kind: "info", msg: "Respuestas borradas de este teléfono." });
  };

  // ---------- Render de cada pregunta ----------

  const renderQuestion = (q: Question) => {
    const v = answers[q.id];
    const o = (v as Record<string, string>) ?? {};
    const hint = q.help ? <p className="q-help">{q.help}</p> : null;
    const title = (
      <>
        <span className="q-id">{q.id}</span>
        {q.star ? <span className="q-star" title="Imprescindible">★</span> : null} {q.text}
      </>
    );

    switch (q.kind) {
      case "text":
      case "textarea":
        return (
          <div className="q-card" key={q.id}>
            <label className="q-title" htmlFor={q.id}>
              {title}
            </label>
            {hint}
            {q.kind === "text" ? (
              <input id={q.id} className="q-input" value={(v as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />
            ) : (
              <textarea id={q.id} className="q-input" rows={3} value={(v as string) ?? ""} onChange={(e) => set(q.id, e.target.value)} />
            )}
          </div>
        );
      case "single":
        return (
          <fieldset className="q-card" key={q.id}>
            <legend className="q-title">{title}</legend>
            {hint}
            <div className="q-options">
              {q.options.map((opt) => (
                <label key={opt} className="q-option">
                  <input type="radio" name={q.id} checked={o.choice === opt} onChange={() => setPart(q.id, "choice", opt)} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {q.extra ? (
              <label className="q-extra">
                {q.extra}
                <input className="q-input" value={o.extra ?? ""} onChange={(e) => setPart(q.id, "extra", e.target.value)} />
              </label>
            ) : null}
          </fieldset>
        );
      case "multi": {
        const chosen = (o.choices ?? "").split("|").filter(Boolean);
        const toggle = (opt: string) => {
          const next = chosen.includes(opt) ? chosen.filter((c) => c !== opt) : [...chosen, opt];
          setPart(q.id, "choices", next.join("|"));
        };
        return (
          <fieldset className="q-card" key={q.id}>
            <legend className="q-title">{title}</legend>
            {hint}
            <div className="q-options">
              {q.options.map((opt) => (
                <label key={opt} className="q-option">
                  <input type="checkbox" checked={chosen.includes(opt)} onChange={() => toggle(opt)} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
            {q.other ? (
              <label className="q-extra">
                Otros
                <input className="q-input" value={o.other ?? ""} onChange={(e) => setPart(q.id, "other", e.target.value)} />
              </label>
            ) : null}
            {q.extra ? (
              <label className="q-extra">
                {q.extra}
                <input className="q-input" value={o.extra ?? ""} onChange={(e) => setPart(q.id, "extra", e.target.value)} />
              </label>
            ) : null}
          </fieldset>
        );
      }
      case "matrix":
        return (
          <fieldset className="q-card" key={q.id}>
            <legend className="q-title">{title}</legend>
            {hint}
            <div className="q-matrix">
              {q.rows.map((row) => (
                <fieldset key={row} className="q-matrix-row">
                  <legend>{row}</legend>
                  <div className="q-chips">
                    {q.cols.map((col) => (
                      <label key={col} className={`q-chip ${o[row] === col ? "is-on" : ""}`}>
                        <input type="radio" name={`${q.id}-${row}`} checked={o[row] === col} onChange={() => setPart(q.id, row, col)} />
                        {col}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ))}
            </div>
          </fieldset>
        );
      case "fields":
        return (
          <fieldset className="q-card" key={q.id}>
            <legend className="q-title">{title}</legend>
            {hint}
            {q.fields.map((f) => (
              <label key={f.id} className="q-extra">
                {f.label}
                <input className="q-input" value={o[f.id] ?? ""} onChange={(e) => setPart(q.id, f.id, e.target.value)} />
              </label>
            ))}
          </fieldset>
        );
    }
  };

  return (
    <main className="qz">
      <header className="qz-hero">
        <p className="qz-brand">DHC · WOODCRAFT &amp; INSTALLATION</p>
        <h1>Cuestionario para tu sitio web</h1>
        <p>
          Para que la web atraiga clientes y aparezca en Google necesitamos información real de la empresa. Te tomará unos{" "}
          <b>30–40 minutos</b> y puedes responder por partes: <b>tus respuestas se guardan en este teléfono</b> hasta que las envíes.
        </p>
        <ul>
          <li>
            Las preguntas con <span className="q-star">★</span> son las más importantes.
          </li>
          <li>Si no sabes algo o no aplica, déjalo en blanco. Nunca publicaremos datos inventados.</li>
        </ul>
        <label className="q-extra qz-name">
          Tu nombre
          <input className="q-input" value={respondent} onChange={(e) => setRespondent(e.target.value)} autoComplete="name" />
        </label>
        <nav className="qz-nav" aria-label="Secciones">
          {sections.map((s) => (
            <a key={s.id} href={`#sec-${s.id}`}>
              {s.id} · {s.title}
            </a>
          ))}
        </nav>
      </header>

      {sections.map((s) => (
        <section key={s.id} id={`sec-${s.id}`} className="qz-section" aria-labelledby={`h-${s.id}`}>
          <h2 id={`h-${s.id}`}>
            {s.id} · {s.title}
          </h2>
          {s.intro ? <p className="qz-intro">{s.intro}</p> : null}
          {s.questions.map(renderQuestion)}
        </section>
      ))}

      <section id="enviar" className="qz-section qz-send" aria-labelledby="h-enviar">
        <h2 id="h-enviar">Enviar respuestas</h2>
        <p>
          Respondidas: <b>{answeredAll}</b> de {all.length} · imprescindibles ★: <b>{answeredStars}</b> de {stars.length}
        </p>

        <div className="qz-photos">
          <h3>Fotos y logo</h3>
          {DRIVE_URL ? (
            <>
              <p>Súbelos a esta carpeta de Google Drive (con tu cuenta de Google). Por cada foto, si puedes, indica el servicio, la ciudad y los materiales en el nombre del archivo.</p>
              <a className="btn btn-light" href={DRIVE_URL} target="_blank" rel="noopener">
                Abrir la carpeta de Drive
              </a>
            </>
          ) : (
            <p>Mándale a Pablo por WhatsApp el logo y las fotos de trabajos (o compártelos en una carpeta de Google Drive).</p>
          )}
        </div>

        <div className="qz-actions">
          <button type="button" className="btn btn-primary" onClick={sendEmail} disabled={status.kind === "sending"}>
            {status.kind === "sending" ? "Enviando…" : "Enviar a Pablo"}
          </button>
          <button type="button" className="btn btn-light" onClick={share}>
            Compartir por WhatsApp
          </button>
          <button type="button" className="btn btn-light" onClick={copy}>
            Copiar respuestas
          </button>
          <button type="button" className="btn btn-light" onClick={download}>
            Descargar documento
          </button>
        </div>
        {status.msg ? (
          <p className={`qz-status ${status.kind === "error" ? "is-error" : ""}`} role="status">
            {status.msg}
          </p>
        ) : null}
        <textarea ref={fallbackRef} className="q-input qz-fallback" rows={8} hidden readOnly aria-label="Respuestas en texto" />

        <div className="qz-clear">
          {confirmClear ? (
            <>
              <span>¿Borrar todas las respuestas de este teléfono?</span>
              <button type="button" className="btn btn-light" onClick={clearAll}>
                Sí, borrar
              </button>
              <button type="button" className="btn btn-light" onClick={() => setConfirmClear(false)}>
                Cancelar
              </button>
            </>
          ) : (
            <button type="button" className="qz-link" onClick={() => setConfirmClear(true)}>
              Borrar mis respuestas
            </button>
          )}
        </div>
      </section>

      <a href="#enviar" className="qz-bar">
        <span>
          ★ {answeredStars}/{stars.length} · {answeredAll}/{all.length} respondidas
        </span>
        <span>Ir a enviar →</span>
      </a>
    </main>
  );
}
