// Renders beats.json to audio/beats/<id>.mp3 at a calmer pace, with request stitching across all beats in order.
//   node generate_beats.mjs [--speed 0.86] [id ...]     (no ids = every beat without an mp3; ids = re-render those)
import { readFileSync, existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'
const here = (p) => new URL(p, import.meta.url)
if (existsSync(here('./.env'))) for (const l of readFileSync(here('./.env'), 'utf8').split('\n')) { const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/); if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '') }
const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js')
const client = new ElevenLabsClient()
const VOICE_ID = process.env.VOICE_ID ?? 'LSqvvjzmBAzGUD41A852'
const args = process.argv.slice(2)
let speed = null
const si = args.indexOf('--speed'); if (si >= 0) { speed = parseFloat(args[si + 1]); args.splice(si, 2) }
const beats = JSON.parse(readFileSync(here('./beats.json'), 'utf8'))
mkdirSync(here('./audio/beats/'), { recursive: true })
const only = new Set(args)
for (let i = 0; i < beats.length; i++) {
  const { id, text } = beats[i]
  const out = here(`./audio/beats/${id}.mp3`)
  if (only.size ? !only.has(id) : existsSync(out)) continue
  const audio = await client.textToSpeech.convert(VOICE_ID, { text, modelId: process.env.MODEL_ID ?? 'eleven_v4', previousText: beats[i - 1]?.text, nextText: beats[i + 1]?.text, outputFormat: 'mp3_44100_128', ...(speed ? { voiceSettings: { speed } } : {}) })
  const w = createWriteStream(out); Readable.fromWeb(audio).pipe(w); await finished(w)
  console.log('wrote', id, `(${text.length} chars)`)
}
