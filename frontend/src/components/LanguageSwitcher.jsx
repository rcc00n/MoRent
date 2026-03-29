import { useTranslation } from 'react-i18next'

import { setAppLanguage } from '../i18n'

function LanguageSwitcher({ className = '' }) {
  const { i18n, t } = useTranslation()
  const currentLanguage = i18n.resolvedLanguage === 'ru' ? 'ru' : 'en'

  return (
    <div
      aria-label={t('nav.switcherLabel')}
      className={`language-switcher ${className}`.trim()}
      role="group"
    >
      {['en', 'ru'].map((language) => (
        <button
          aria-pressed={currentLanguage === language}
          className={
            currentLanguage === language
              ? 'language-switcher__button is-active'
              : 'language-switcher__button'
          }
          key={language}
          onClick={() => setAppLanguage(language)}
          type="button"
        >
          {t(`nav.languages.${language}`)}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
