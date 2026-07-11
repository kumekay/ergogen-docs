#!/usr/bin/env node
// Doc 3D renderer.
// Runs a config through the local ergogen engine, evaluates the resulting
// OpenJSCAD v1 case scripts, and writes binary STL files for the docs'
// interactive viewer (src/components/StlViewer.js).
//
// Usage:
//   node helpers/render3d.js <config.yaml> <out-dir> [basename] [--only=case1,case2]
//
// Outputs <out-dir>/<basename>.<case>.stl
// Needs @jscad/csg (devDependency of this repo).

const fs = require('fs')
const path = require('path')

const ERGOGEN = process.env.ERGOGEN_PATH || '/home/ku/p/kumekay/ergogen'
const ergogen = require(path.join(ERGOGEN, 'src/ergogen.js'))
const { CSG, CAG } = require('@jscad/csg')

const [, , configPath, outDir, basenameArg, ...rest] = process.argv
if (!configPath || !outDir) {
    console.error('Usage: node helpers/render3d.js <config.yaml> <out-dir> [basename] [--only=a,b]')
    process.exit(1)
}
const basename = basenameArg && !basenameArg.startsWith('--')
    ? basenameArg
    : path.basename(configPath).replace(/\.[^.]+$/, '')
const onlyArg = rest.find(a => a.startsWith('--only='))
const only = onlyArg ? onlyArg.slice('--only='.length).split(',').filter(Boolean) : null

// ergogen case scripts only need these two OpenJSCAD v1 globals (booleans
// are done via CSG methods). Evaluate in the same realm -- a vm context
// would break the CSG library's instanceof Array checks.
const translate = (v, o) => o.translate(v)
const rotate = (v, o) => o.rotateX(v[0]).rotateY(v[1]).rotateZ(v[2])

const toStl = (script) => {
    const solid = new Function('CSG', 'CAG', 'translate', 'rotate', `${script}\n;return main()`)(CSG, CAG, translate, rotate)
    const triangles = solid.toTriangles()
    const buf = Buffer.alloc(84 + triangles.length * 50)
    buf.write('ergogen case', 0, 'ascii')
    buf.writeUInt32LE(triangles.length, 80)
    let o = 84
    for (const t of triangles) {
        const n = t.plane.normal
        buf.writeFloatLE(n.x, o); buf.writeFloatLE(n.y, o + 4); buf.writeFloatLE(n.z, o + 8)
        o += 12
        for (const v of t.vertices) {
            buf.writeFloatLE(v.pos.x, o); buf.writeFloatLE(v.pos.y, o + 4); buf.writeFloatLE(v.pos.z, o + 8)
            o += 12
        }
        o += 2 // attribute byte count = 0
    }
    return buf
}

;(async () => {
    fs.mkdirSync(outDir, { recursive: true })
    const raw = fs.readFileSync(configPath, 'utf8')
    const results = await ergogen.process(raw, { debug: true }, () => {})
    for (const [name, c] of Object.entries(results.cases || {})) {
        if (only && !only.includes(name)) continue
        const file = path.join(outDir, `${basename}.${name}.stl`)
        fs.writeFileSync(file, toStl(c.jscad))
        console.log('wrote', path.relative(process.cwd(), file))
    }
})().catch(e => { console.error('RENDER ERROR:', e.message); process.exit(1) })
