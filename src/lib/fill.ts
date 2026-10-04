// Rellena los marcadores {nombre} de un texto del diccionario.
// Falla (también en build) si el texto pide un valor que no se pasó: así un
// dato pendiente nunca aparece como "{email}" en la página.

export type FillValues = Record<string, string | number>;

export function fill(template: string, values: FillValues): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined || value === "") {
      throw new Error(`fill(): falta el valor "${key}" para el texto "${template}"`);
    }
    return String(value);
  });
}
