export const validateEmbedUrl = (url: string): { isValid: boolean; error?: string } => {
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required and must be a string' }
  }

  try {
    const parsed = new URL(url)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' }
    }

    if (import.meta.env.PROD && parsed.hostname === 'localhost') {
      return { isValid: false, error: 'Localhost URLs are not allowed in production' }
    }

    return { isValid: true }
  } catch {
    return { isValid: false, error: 'Invalid URL format' }
  }
}
