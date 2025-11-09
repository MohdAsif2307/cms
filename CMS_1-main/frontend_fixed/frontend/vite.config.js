import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Improve HMR / file watching reliability across environments (VMs, Docker, WSL)
    hmr: {
      overlay: true,
    },
    watch: {
      // Use polling to ensure changes are detected on filesystems where native
      // watch doesn't work reliably. This has a small CPU cost but makes HMR robust.
      usePolling: true,
      interval: 100,
      // Wait for file writes to finish before triggering reloads
      awaitWriteFinish: {
        stabilityThreshold: 200,
        pollInterval: 100,
      },
    },
  },
})