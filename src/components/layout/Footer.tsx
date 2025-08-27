import { useTranslations } from 'next-intl'
import type { ContentConfig, BrandingConfig } from '@/types'

interface FooterProps {
  content: ContentConfig
  branding: BrandingConfig
}

export function Footer({ content, branding }: FooterProps) {
  const t = useTranslations()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {branding.name}
            </h3>
            {content.footerText && (
              <p className="text-sm text-gray-600 mb-4">
                {content.footerText}
              </p>
            )}
            {content.contactEmail && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">{t('footer.contact')}:</span>{' '}
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="text-primary-600 hover:text-primary-800"
                >
                  {content.contactEmail}
                </a>
              </div>
            )}
          </div>

          {/* Legal Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {t('footer.legalPrivacy')}
            </h3>
            <div className="space-y-2">
              {content.privacyPolicy && (
                <div>
                  <a
                    href={content.privacyPolicy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 hover:text-primary-800"
                  >
                    {t('footer.privacyPolicy')}
                  </a>
                </div>
              )}
              <div className="text-sm text-gray-600">
                {t('footer.confidentialText')}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-500">
              © {currentYear} {branding.name}. {t('footer.allRightsReserved')}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>{t('footer.poweredBy')}</span>
              <div className="flex items-center space-x-1">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span>{t('footer.secure')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
