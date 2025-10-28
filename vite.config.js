import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Look for local certs at ../certs/localhost.pem and localhost-key.pem
const certDir = path.resolve(__dirname, '..', 'certs')
const keyPath = path.join(certDir, 'localhost-key.pem')
const certPath = path.join(certDir, 'localhost.pem')

let httpsConfig = false
if (process.env.USE_HTTPS === 'true' && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
} else if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // enable automatically if certs present
  httpsConfig = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: httpsConfig,
  }
})
