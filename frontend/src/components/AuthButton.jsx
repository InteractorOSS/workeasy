import React from 'react'
import { getAuthUrl } from '../api/api'

export default function AuthButton({ service, account, onSuccess }) {
  const handleAuth = async () => {
    try {
      // 1) Get the Interactor OAuth URL
      const authUrl = await getAuthUrl(service, account)

      // 2) Open centered popup
      const w = 600, h = 700
      const left = window.screenX + (window.innerWidth - w) / 2
      const top  = window.screenY + (window.innerHeight - h) / 2
      const popup = window.open(
        '',
        'interactorAuth',
        `width=${w},height=${h},left=${left},top=${top}`
      )
      if (!popup) throw new Error('Popup blocked by browser')

      // 3) Lock down opener reference
      try { popup.opener = null } catch {}

      // 4) Navigate to the real auth URL
      popup.location.href = authUrl

      // 5) Poll for popup close
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer)
          onSuccess?.()   // now trigger your context’s fetchEmails()
        }
      }, 500)

    } catch (err) {
      console.error('Failed to start authentication', err)
      alert('Could not start authentication. Check console for details.')
    }
  }

  const label = 'Connect ' + service.charAt(0).toUpperCase() + service.slice(1)
  return <button onClick={handleAuth}>{label}</button>
}