import { readFileSync, writeFileSync } from "fs"

const file = "packages/opencode/script/build.ts"
let src = readFileSync(file, "utf8")

const oldLine = '  await $`gh release upload v${Script.version} ./dist/*.zip ./dist/*.tar.gz --clobber --repo ${process.env.GH_REPO}`'

const newLines = [
  '  const archives = Object.keys(binaries).map(key =>',
  '    `./dist/${key}${key.includes("linux") ? ".tar.gz" : ".zip"}`,',
  '  )',
  '  await $`gh release upload v${Script.version} ${archives} --clobber --repo ${process.env.GH_REPO}`',
].join("\n")

if (!src.includes(oldLine)) {
  console.log("Pattern not found in build.ts, skipping patch")
  process.exit(0)
}

src = src.replace(oldLine, newLines)
writeFileSync(file, src)
console.log("build.ts patched successfully")
