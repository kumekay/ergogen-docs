#!/usr/bin/env node
// Doc visualization renderer.
// Runs a config through the local ergogen engine and writes themed SVGs
// (white padded background, readable strokes) for embedding in the docs.
//
// Usage:
//   node helpers/render.js <config.yaml> <out-dir> [basename] [--only=demo,outlineName,...]
//
// Outputs <out-dir>/<basename>.demo.svg and <out-dir>/<basename>.<outline>.svg

const fs = require('fs')
const path = require('path')

const ERGOGEN = process.env.ERGOGEN_PATH || '/home/ku/p/kumekay/ergogen'
const ergogen = require(path.join(ERGOGEN, 'src/ergogen.js'))

const [, , configPath, outDir, basenameArg, ...rest] = process.argv
if (!configPath || !outDir) {
    console.error('Usage: node helpers/render.js <config.yaml> <out-dir> [basename] [--only=a,b]')
    process.exit(1)
}
const basename = basenameArg && !basenameArg.startsWith('--')
    ? basenameArg
    : path.basename(configPath).replace(/\.[^.]+$/, '')
const onlyArg = rest.find(a => a.startsWith('--only='))
const only = onlyArg ? onlyArg.slice('--only='.length).split(',').filter(Boolean) : null

// Add a white rounded background and recolor strokes so the diagram is legible
// on both light and dark documentation backgrounds.
const themeSvg = (svg, pad = 6) => {
    const m = svg.match(/viewBox="([\d.\- ]+)"/)
    if (!m) return svg
    let [x, y, w, h] = m[1].trim().split(/\s+/).map(Number)
    x -= pad; y -= pad; w += pad * 2; h += pad * 2
    // widen the viewBox and drop the fixed mm width/height so it scales in a container
    svg = svg.replace(/viewBox="[\d.\- ]+"/, `viewBox="${x} ${y} ${w} ${h}"`)
    svg = svg.replace(/\swidth="[^"]*"/, ' width="100%"')
    svg = svg.replace(/\sheight="[^"]*"/, '')
    // ergogen strokes default to #000; keep them but guarantee a light backdrop
    const bg = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="#ffffff"/>`
    svg = svg.replace(/(<svg[^>]*>)/, `$1${bg}`)
    return svg
}

const write = (name, svg) => {
    const file = path.join(outDir, `${basename}.${name}.svg`)
    fs.writeFileSync(file, themeSvg(svg))
    console.log('wrote', path.relative(process.cwd(), file))
}

;(async () => {
    fs.mkdirSync(outDir, { recursive: true })
    const raw = fs.readFileSync(configPath, 'utf8')
    const results = await ergogen.process(raw, { debug: true, svg: true }, () => {})

    const want = n => !only || only.includes(n)

    if (results.demo && results.demo.svg && want('demo')) {
        write('demo', results.demo.svg)
    }
    for (const [name, out] of Object.entries(results.outlines || {})) {
        if (out.svg && want(name)) write(name, out.svg)
    }
})().catch(e => { console.error('RENDER ERROR:', e.message); process.exit(1) })
