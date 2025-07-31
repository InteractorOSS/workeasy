import React from 'react'
import { getAuthUrl } from '../api/api'

export default function AuthButton({ service, account, onSuccess }) {
  const handleAuth = async () => {
    try {
      // grab the one true URL
      const authUrl = await getAuthUrl(service, account)

      // open a centered popup
      const w = 600, h = 700
      const left = window.screenX + (window.innerWidth - w) / 2
      const top  = window.screenY + (window.innerHeight - h) / 2
      const popup = window.open(
        '',
        'interactorAuth',
        `width=${w},height=${h},left=${left},top=${top}`
      )
      if (!popup) throw new Error('Popup blocked')

      // for security
      try { popup.opener = null } catch {}
      // navigate to the real URL
      popup.location.href = authUrl

      // let the AppContext know we tried it
      onSuccess?.()
    } catch (err) {
      console.error('Failed to start authentication', err)
      alert('Could not start authentication. Check console for details.')
    }
  }

  const label = 'Connect ' + service.charAt(0).toUpperCase() + service.slice(1)
  return <button onClick={handleAuth}>{label}</button>
}