import { assetUrl } from '../lib/asset-url'

export function SiteFooter() {
  return (
    <footer className="site-footer site-footer--standalone section-shell">
      <img src={assetUrl('assets/kse-logo.png')} alt="KSE 국제로지스틱" />
      <p>Owned infrastructure in Korea &amp; Japan. Connected to the world.</p>
      <span>Prototype © KSE</span>
    </footer>
  )
}
