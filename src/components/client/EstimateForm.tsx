"use client";

import { useState, type FormEvent } from "react";

export type EstimateFormText = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  projectTypePlaceholder: string;
  city: string;
  message: string;
  messagePlaceholder: string;
  optional: string;
  submit: string;
  sending: string;
  success: string;
  /** Ya rellenado con el teléfono de la página. */
  error: string;
  consent: string;
  validation: { required: string; selectRequired: string; email: string; phone: string };
};

type Props = {
  lang: "en" | "es";
  text: EstimateFormText;
  /** Títulos de los servicios + "Otro". */
  projectTypes: string[];
  phoneHref: string;
};

type Status = "idle" | "sending" | "success" | "error";

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY ?? "";

// 10 dígitos (o 11 empezando por 1), con cualquier formato: (737) 400-1540.
const validPhone = (value: string) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
};

// Formulario de estimado (docs/02 → Formulario). Validación nativa con los
// mensajes del diccionario (los del navegador salen en SU idioma, no en el de
// la página), honeypot antispam y envío a Web3Forms (fase 2: /api/estimate).
export function EstimateForm({ lang, text, projectTypes, phoneHref }: Props) {
  const [status, setStatus] = useState<Status>("idle");

  const messageFor = (el: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
    if (el.validity.valueMissing) return el instanceof HTMLSelectElement ? text.validation.selectRequired : text.validation.required;
    if (el.validity.typeMismatch && el.type === "email") return text.validation.email;
    if (el.name === "phone" && !validPhone(el.value)) return text.validation.phone;
    return "";
  };

  // Recalcula el mensaje de cada campo y deja que el navegador lo muestre.
  const validate = (form: HTMLFormElement) => {
    for (const el of form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea")) {
      if (el.type === "hidden" || el.name === "botcheck") continue;
      el.setCustomValidity("");
      el.setCustomValidity(messageFor(el));
    }
    return form.reportValidity();
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!validate(form)) return;

    const data = new FormData(form);
    // Honeypot: las personas no ven este campo; si viene marcado, es un bot.
    if (data.get("botcheck")) {
      setStatus("success");
      return;
    }

    setStatus("sending");
    try {
      if (!ACCESS_KEY) throw new Error("Falta NEXT_PUBLIC_FORM_ACCESS_KEY (ver .env.example)");
      data.set("access_key", ACCESS_KEY);
      data.set("subject", `${lang === "es" ? "Nuevo estimado" : "New estimate"} · ${data.get("name")}`);
      data.set("from_name", "DHC Woodcraft — web");
      const res = await fetch(ENDPOINT, { method: "POST", body: data, headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => ({}))) as { success?: boolean };
      if (!res.ok || json.success === false) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      window.umami?.track("form_submit_success");
    } catch (err) {
      console.error("EstimateForm:", err);
      setStatus("error");
      window.umami?.track("form_submit_error");
    }
  };

  if (status === "success") {
    return (
      <p className="form-success" role="status">
        {text.success}
      </p>
    );
  }

  const clear = (e: FormEvent<HTMLElement>) => (e.target as HTMLInputElement).setCustomValidity?.("");
  const optional = <small>{text.optional}</small>;

  return (
    // noValidate: la validación la lanza onSubmit con reportValidity(), para que
    // los mensajes sean los del diccionario y no los del navegador.
    <form className="estimate-form" onSubmit={onSubmit} onInput={clear} noValidate>
      <label>
        {text.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        {text.phone}
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" />
      </label>
      <label>
        <span>
          {text.email} {optional}
        </span>
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label>
        {text.projectType}
        <select name="project_type" required defaultValue="">
          <option value="" disabled>
            {text.projectTypePlaceholder}
          </option>
          {projectTypes.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>
      <label className="form-full">
        {text.city}
        <input name="city" required autoComplete="postal-code" />
      </label>
      <label className="form-full">
        <span>
          {text.message} {optional}
        </span>
        <textarea name="message" rows={4} placeholder={text.messagePlaceholder} />
      </label>

      <input type="hidden" name="language" value={lang} />
      {/* Honeypot (Web3Forms): invisible para las personas. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" className="form-honeypot" />

      <div className="form-full form-actions">
        <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
          {status === "sending" ? text.sending : text.submit}
        </button>
        <p className="form-consent">{text.consent}</p>
        {status === "error" ? (
          <p className="form-error" role="alert">
            <a href={phoneHref}>{text.error}</a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
