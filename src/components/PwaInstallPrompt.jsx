import { useState, useEffect } from 'react'
import { X, Download, Share2 } from 'lucide-react'

export default function PwaInstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIos, setIsIos] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone

    setIsIos(ios && isSafari)
    setIsStandalone(standalone)

    if (standalone) return

    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    if (ios) {
      const dismissed = localStorage.getItem('pwa-install-dismissed')
      if (!dismissed) {
        setTimeout(() => setShow(true), 3000)
      }
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      if (result.outcome === 'accepted') setShow(false)
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isStandalone || !show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={handleDismiss} />
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-t-3xl p-5 animate-slideUp shadow-2xl" style={{ borderTop: '1px solid rgba(255,255,255,0.4)' }}>
        <button onClick={handleDismiss} className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/30">
          <X size={18} className="text-[#6E6E73]" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8652D] flex items-center justify-center flex-shrink-0 shadow-lg">
            <Download size={22} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-[#1D1D1F] text-base">Install App</h3>
            <p className="text-xs text-[#6E6E73]">Get the best ordering experience</p>
          </div>
        </div>

        <p className="text-sm text-[#1D1D1F] leading-relaxed mb-4">
          {isIos ? (
            <>Tap the Share <Share2 size={14} className="inline text-[#E8652D]" /> button in Safari, then scroll down and tap <strong>Add to Home Screen</strong>.</>
          ) : (
            'Add this app to your home screen for a faster, full-screen experience without the browser toolbar.'
          )}
        </p>

        {deferredPrompt ? (
          <button onClick={handleInstall} className="btn-primary w-full flex items-center justify-center gap-2">
            <Download size={18} /> Install App
          </button>
        ) : isIos ? (
          <div className="glass-card p-3 flex items-center gap-3">
            <Share2 size={18} className="text-[#E8652D] flex-shrink-0" />
            <p className="text-sm text-[#1D1D1F]">Tap Share <Share2 size={14} className="inline text-[#E8652D]" /> then <strong>"Add to Home Screen"</strong></p>
          </div>
        ) : null}

        <p className="text-xs text-[#6E6E73] text-center mt-3">
          <button onClick={handleDismiss} className="underline hover:text-[#1D1D1F]">Don't show again</button>
        </p>
      </div>
    </div>
  )
}
