import axios from 'axios'

export type ApiErrorInfo = {
  status: number | null
  message: string
  fieldErrors: Record<string, string>
  data: Record<string, unknown>
}

export function parseApiError(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): ApiErrorInfo {
  if (!axios.isAxiosError(error)) {
    return { status: null, message: fallback, fieldErrors: {}, data: {} }
  }

  if (!error.response) {
    return {
      status: null,
      message: 'We could not reach the server. Check your connection and try again.',
      fieldErrors: {},
      data: {},
    }
  }

  const data = (error.response.data ?? {}) as Record<string, unknown>
  const fieldErrors: Record<string, string> = {}
  const errors = data.errors as Record<string, Array<string>> | undefined

  if (errors) {
    for (const [field, messages] of Object.entries(errors)) {
      const key = field.split('.')[0]
      if (!fieldErrors[key] && messages.length > 0) fieldErrors[key] = messages[0]
    }
  }

  const message =
    error.response.status === 422 && errors
      ? 'Please review the highlighted fields.'
      : typeof data.message === 'string'
        ? data.message
        : fallback

  return { status: error.response.status, message, fieldErrors, data }
}
