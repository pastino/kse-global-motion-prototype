# KSE 글로벌 모션 프로토타입

## Deploy Configuration (configured by /setup-deploy)
- Platform: GitHub Pages
- Production URL: https://pastino.github.io/kse-global-motion-prototype/
- Deploy workflow: .github/workflows/deploy-pages.yml
- Deploy status command: gh run list --workflow deploy-pages.yml --limit 5
- Merge method: merge
- Project type: Vite React web app
- Post-deploy health check: https://pastino.github.io/kse-global-motion-prototype/

### Custom deploy hooks
- Pre-merge: npm run test:run && npm run build
- Deploy trigger: automatic on push to main
- Deploy status: gh run list --workflow deploy-pages.yml --limit 5
- Health check: https://pastino.github.io/kse-global-motion-prototype/
