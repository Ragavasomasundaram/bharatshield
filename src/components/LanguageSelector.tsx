import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

export default function LanguageSelector() {
  const { i18n, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 transition-colors"
      >
        <span>{current.name}</span>
        <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-50 max-h-72 overflow-y-auto">
          <div className="p-2 text-xs text-gray-500 border-b border-gray-800">{t('language')} — 22 Indian Languages</div>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-800 transition-colors flex items-center justify-between ${lang.code === i18n.language ? 'text-blue-400 bg-gray-800' : 'text-gray-300'}`}
            >
              <span>{lang.name}</span>
              <span className="text-xs text-gray-600">{lang.script}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
