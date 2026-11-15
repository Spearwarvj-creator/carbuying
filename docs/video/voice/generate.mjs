// Renders the clips in ../VOICEOVER_ELEVENLABS.md to audio/<file>.mp3, one request per clip, with request stitching
// (each clip is told what comes before and after, so the tone carries across clip boundaries), the same way the Kurae video was made.
//
//   node generate.mjs --list            show the voices on the account (to find the id of "indi techie")
//   node generate.mjs --dry             show the clips, characters and a cost estimate, spend nothing
//   node generate.mjs                   render every clip that has no mp3 yet
//   node generate.mjs 05-walk 09-ai...  render only these clips (overwrites)
//
// The key is read from ELEVENLABS_API_KEY in the environment or from a .env file next to this script. It is never printed.
import { readFileSync, existsSync, mkdirSync, createWriteStream } from 'node:fs'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

const here = (p) => new URL(p, import.meta.url)
if (existsSync(here('./.env'))) {
  for (const line of readFileSync(here('./.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
}

const VOICE_ID = process.env.VOICE_ID ?? 'LSqvvjzmBAzGUD41A852' // the narration voice used for the Kurae video; confirm with --list
const MODEL = process.env.MODEL_ID ?? 'eleven_v4'

// parse the clips out of the script file
const md = readFileSync(here('../VOICEOVER_ELEVENLABS.md'), 'utf8')
const re = /^### (c\d+)\.[^\n]*`([^`]+)\.mp3`\n\n(?:On screen:[^\n]*\n\n)?(?:About [^\n]*\n\n)?([^\n]+)\n/gm
const clips = []
for (const m of md.matchAll(re)) clips.push({ id: m[1], file: m[2], text: m[3].trim() })
if (!clips.length) throw new Error('No clips found in VOICEOVER_ELEVENLABS.md')

const args = process.argv.slice(2)
const chars = clips.reduce((n, c) => n + c.text.length, 0)

if (args.includes('--dry')) {
  for (const c of clips) console.log(`${c.id}  ${c.file.padEnd(26)} ${String(c.text.length).padStart(5)} chars  ${c.text.split(/\s+/).length} words`)
  console.log(`\n${clips.length} clips, ${chars} characters, about ${Math.round(chars / 5)} words. Voice ${VOICE_ID}, model ${MODEL}.`)
  console.log('Nothing was sent. Credits used = roughly one per character on most plans (check your plan).')
  process.exit(0)
}

if (!process.env.ELEVENLABS_API_KEY) {
  console.error('ELEVENLABS_API_KEY is not set. Put one line in docs/video/voice/.env:  ELEVENLABS_API_KEY=your_key')
  process.exit(1)
}
const { ElevenLabsClient } = await import('@elevenlabs/elevenlabs-js')
const client = new ElevenLabsClient()

if (args.includes('--list')) {
  const { voices } = await client.voices.getAll()
  for (const v of voices) console.log(`${v.voiceId}  ${v.name}  ${v.category ?? ''}`)
  process.exit(0)
}

mkdirSync(here('./audio/'), { recursive: true })
const only = new Set(args)
for (let i = 0; i < clips.length; i++) {
  const { file, text } = clips[i]
  if (only.size ? !only.has(file) : existsSync(here(`./audio/${file}.mp3`))) { if (!only.size) console.log('skip (exists)', file); continue }
  const audio = await client.textToSpeech.convert(VOICE_ID, {
    text,
    modelId: MODEL,
    previousText: clips[i - 1]?.text,
    nextText: clips[i + 1]?.text,
    outputFormat: 'mp3_44100_128',
  })
  const out = createWriteStream(here(`./audio/${file}.mp3`))
  Readable.fromWeb(audio).pipe(out)
  await finished(out)
  console.log('wrote', `audio/${file}.mp3`, `(${text.length} chars)`)
}
