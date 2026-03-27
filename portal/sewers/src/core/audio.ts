export function playSystemSound(type: 'success' | 'error' | 'info') {
  const sounds = {
    success: '/sounds/success.wav',
    error: '/sounds/error.wav',
    info: '/sounds/info.wav',
      warning: '/sounds/warning.wav'
  }
  const audio = new Audio(sounds[type])
  audio.play().catch(() => {})
}