/*
  TRELLIS.2 image-to-3D 클라이언트 (RunPod Serverless).

  meshy.mjs 와 **같은 인터페이스**로 맞춰 놨다. 같은 이미지를 같은 자리에 넣어
  같은 이름의 GLB 를 받기 위해서다 — 그래야 Meshy 와의 비교가 공정해진다.

  왜 이걸 붙였나: Meshy 는 기계류(지게차·컨베이어·게이트)에서는 좋았지만
  대형 평면(트럭 적재함)에서 6회 전부 구김을 냈다. TRELLIS.2 는 SDF 가 아닌
  field-free 희소 복셀(O-Voxel)이라 평면·판재에서 다른 결과가 나올 여지가 있다.
  "있다"지 "낫다"가 아니다 — 그걸 재려고 만든 스크립트다.

  키는 process.env 에서만 읽는다. 코드에 적지 않고, 로그에도 남기지 않는다.

  사용 (단건):
    node --env-file=.env scripts/assets/trellis.mjs scripts/assets/raw/orbit/e00.png boxtruck

  사용 (배치 — 콜드스타트를 한 번만 낸다):
    node --env-file=.env scripts/assets/trellis.mjs a.png boxtruck b.png reachstacker
*/
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { basename, extname, join, resolve } from 'node:path'

const root = resolve(import.meta.dirname, '../..')
const outDir = join(root, 'public/assets/models')

const KEY = process.env.RUNPOD_API_KEY
const ENDPOINT = process.env.RUNPOD_TRELLIS_ENDPOINT
const API = `https://api.runpod.ai/v2/${ENDPOINT}`

/** 오류 본문은 그대로 흘리지 않는다. 길이를 자르고 키가 섞였으면 지운다. */
function safe(text) {
  const cut = String(text).slice(0, 400)
  return KEY ? cut.split(KEY).join('***') : cut
}

async function call(path, init = {}) {
  const response = await fetch(`${API}${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json', ...(init.headers ?? {}) },
  })
  const text = await response.text()
  if (!response.ok) throw new Error(`${init.method ?? 'GET'} ${path} → ${response.status}\n${safe(text)}`)
  try {
    return JSON.parse(text)
  } catch {
    throw new Error(`${path} 응답이 JSON 이 아니다: ${safe(text)}`)
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function encode(imagePath) {
  const bytes = readFileSync(imagePath)
  const mime = extname(imagePath).toLowerCase() === '.jpg' ? 'image/jpeg' : 'image/png'
  // RunPod 요청 본문에는 상한이 있다. base64 는 원본보다 33% 부푸니 미리 경고한다.
  if (bytes.length > 6 * 1024 * 1024) {
    console.warn(`⚠ ${basename(imagePath)} 가 ${(bytes.length / 1024 / 1024).toFixed(1)} MB 다. 페이로드 상한에 걸릴 수 있다.`)
  }
  console.log(`입력 ${basename(imagePath)} (${(bytes.length / 1024).toFixed(0)} KB)`)
  return `data:${mime};base64,${bytes.toString('base64')}`
}

async function imageTo3D(pairs) {
  const created = await call('/run', {
    method: 'POST',
    body: JSON.stringify({
      input: {
        items: pairs.map(([imagePath, name]) => ({ image_b64: encode(imagePath), name })),
        // Meshy 를 target_polycount 50000 으로 써 왔다. 3만에서는 패널이 휘고 후미가
        // 뭉개졌다는 실측이 있어 같은 값에서 출발한다. 비교의 조건을 맞추는 것이 목적.
        decimation_target: Number(process.env.TRELLIS_POLYCOUNT ?? 50000),
        resolution: Number(process.env.TRELLIS_RESOLUTION ?? 1024),
        texture_size: Number(process.env.TRELLIS_TEXTURE ?? 2048),
        s3_folder: process.env.TRELLIS_S3_FOLDER ?? 'kse/models',
        ...(process.env.AWS_S3_BUCKET ? { s3_bucket: process.env.AWS_S3_BUCKET } : {}),
      },
    }),
  })

  const id = created.id
  if (!id) throw new Error(`작업 ID 를 못 받았다: ${safe(JSON.stringify(created))}`)
  console.log(`작업 ${id} 큐 투입. 콜드스타트 포함 첫 건은 3~5분.`)

  let last = ''
  // 5초 × 360 = 30분. 콜드스타트(모델 15GB 로딩)가 붙는 첫 호출은 오래 걸린다.
  for (let i = 0; i < 360; i += 1) {
    await sleep(5000)
    const task = await call(`/status/${id}`)
    const status = task.status
    if (status !== last) {
      process.stdout.write(`\r  ${status}          `)
      last = status
    }
    if (status === 'COMPLETED') {
      const output = task.output ?? {}
      if (output.error) throw new Error(`워커 오류: ${safe(output.error)}`)
      console.log(`\n  GPU ${output.gpu ?? '?'} / 모델 로딩 ${output.load_seconds ?? '?'}s`)

      const saved = []
      for (const item of output.results ?? []) {
        if (item.error) {
          console.error(`  ✗ ${item.name}: ${safe(item.error)}`)
          continue
        }
        const file = await fetch(item.glb_url)
        if (!file.ok) throw new Error(`GLB 다운로드 실패 ${file.status} — ${item.glb_url}`)
        const buffer = Buffer.from(await file.arrayBuffer())
        mkdirSync(outDir, { recursive: true })
        const target = join(outDir, `${item.name}.glb`)
        writeFileSync(target, buffer)
        console.log(`  저장: public/assets/models/${item.name}.glb (${item.mb} MB / ${item.seconds}s)`)
        saved.push(target)
      }
      if (!saved.length) throw new Error('건진 모델이 없다.')
      return saved
    }
    if (status === 'FAILED' || status === 'CANCELLED' || status === 'TIMED_OUT') {
      throw new Error(`작업 실패(${status}): ${safe(JSON.stringify(task.error ?? task.output ?? task))}`)
    }
  }
  throw new Error('시간 초과 — 작업이 30분 안에 안 끝났다.')
}

const args = process.argv.slice(2)

if (!KEY || !ENDPOINT) {
  console.error('RUNPOD_API_KEY 또는 RUNPOD_TRELLIS_ENDPOINT 가 없다.')
  console.error('  .env 에 두 줄을 넣고 다음처럼 실행:')
  console.error('  node --env-file=.env scripts/assets/trellis.mjs scripts/assets/raw/orbit/e00.png boxtruck')
  process.exit(2)
}
if (args.length < 2 || args.length % 2 !== 0) {
  console.error('사용: node --env-file=.env scripts/assets/trellis.mjs <이미지경로> <모델이름> [<이미지경로> <모델이름> ...]')
  process.exit(2)
}

const pairs = []
for (let i = 0; i < args.length; i += 2) {
  if (!existsSync(args[i])) {
    console.error(`이미지가 없다: ${args[i]}`)
    process.exit(2)
  }
  pairs.push([args[i], args[i + 1]])
}

imageTo3D(pairs).catch((error) => {
  console.error('\n' + error.message)
  process.exit(1)
})
