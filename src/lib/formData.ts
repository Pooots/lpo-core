type FormValue = string | number | boolean | File | Array<string> | null | undefined

/** Builds multipart data the way Laravel expects (arrays as key[], booleans as 1/0). */
export function toFormData(values: Record<string, FormValue>): FormData {
  const data = new FormData()

  for (const [key, value] of Object.entries(values)) {
    if (value === null || value === undefined) continue
    if (Array.isArray(value)) {
      value.forEach((item) => data.append(`${key}[]`, item))
    } else if (value instanceof File) {
      data.append(key, value)
    } else if (typeof value === 'boolean') {
      data.append(key, value ? '1' : '0')
    } else {
      data.append(key, String(value))
    }
  }

  return data
}

/** Forces axios to send FormData as multipart instead of converting it to JSON. */
export const MULTIPART = { headers: { 'Content-Type': 'multipart/form-data' } }
