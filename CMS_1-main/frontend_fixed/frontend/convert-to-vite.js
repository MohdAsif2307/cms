import fs from 'fs'
import path from 'path'

const root = process.cwd()

// --- Utility helpers ---
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

function moveFile(oldPath, newPath) {
  if (fs.existsSync(oldPath)) {
    ensureDir(path.dirname(newPath))
    fs.renameSync(oldPath, newPath)
    console.log(`✅ Moved: ${oldPath} → ${newPath}`)
  }
}

function removeFile(filePath) {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { recursive: true, force: true })
    console.log(`🗑️ Removed: ${filePath}`)
  }
}

// --- Step 1: Ensure root structure ---
const srcDir = path.join(root, 'src')
ensureDir(srcDir)

// --- Step 2: Move index.html to root ---
const oldIndexHTML = path.join(root, 'public', 'index.html')
const newIndexHTML = path.join(root, 'index.html')
if (fs.existsSync(oldIndexHTML)) moveFile(oldIndexHTML, newIndexHTML)

// --- Step 3: Remove CRA-specific files ---
;[
  'src/setupTests.js',
  'src/reportWebVitals.js',
  'src/serviceWorker.js',
  'public/manifest.json',
  'public/favicon.ico'
].forEach(removeFile)

// --- Step 4: Create or fix vite.config.js ---
const viteConfig = `
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
})
`
fs.writeFileSync(path.join(root, 'vite.config.js'), viteConfig.trim())
console.log('⚙️ Created vite.config.js')

// --- Step 5: Fix package.json ---
const pkgPath = path.join(root, 'package.json')
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))

  // Remove CRA scripts
  delete pkg.scripts?.start
  delete pkg.scripts?.eject
  delete pkg.scripts?.test

  // Add Vite scripts
  pkg.scripts = {
    ...pkg.scripts,
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  }

  // Remove CRA deps
  if (pkg.dependencies?.['react-scripts']) delete pkg.dependencies['react-scripts']

  // Add Vite deps
  pkg.devDependencies = {
    ...pkg.devDependencies,
    vite: '^5.0.0',
    '@vitejs/plugin-react': '^4.0.0',
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2))
  console.log('📦 Updated package.json for Vite')
}

// --- Step 6: Create basic index.html if missing ---
if (!fs.existsSync(newIndexHTML)) {
  const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React + Vite</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`
  fs.writeFileSync(newIndexHTML, html.trim())
  console.log('🧱 Created new index.html')
}

console.log('\n✅ Conversion complete!')
console.log('👉 Next steps:')
console.log('   npm install')
console.log('   npm run dev')
