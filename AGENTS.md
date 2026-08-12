# KSE 글로벌 모션 프로토타입

## Deploy Configuration (configured by /setup-deploy)
- Platform: Amazon S3 static website
- Production URL: http://kse-global-motion-prototype-pastino.s3-website.ap-northeast-2.amazonaws.com
- Deploy workflow: manual AWS CLI sync
- Deploy status command: aws s3 ls s3://kse-global-motion-prototype-pastino/
- Merge method: merge
- Project type: Vite React web app
- Post-deploy health check: http://kse-global-motion-prototype-pastino.s3-website.ap-northeast-2.amazonaws.com

### Custom deploy hooks
- Pre-merge: npm run test:run && npm run build
- Deploy trigger: aws s3 sync dist/ s3://kse-global-motion-prototype-pastino/ --delete
- Deploy status: aws s3 ls s3://kse-global-motion-prototype-pastino/
- Health check: http://kse-global-motion-prototype-pastino.s3-website.ap-northeast-2.amazonaws.com
