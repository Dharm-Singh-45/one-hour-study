module.exports = {
  launch: {
    headless: process.env.HEADLESS === 'false' ? false : true, // Default: true (headless mode)
    slowMo: process.env.SLOWMO ? parseInt(process.env.SLOWMO) : 100, // Default: 100ms delay to see actions
    devtools: process.env.HEADLESS === 'false',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  },
  // Server configuration - uncomment if you want jest-puppeteer to start the server automatically
  // Note: If the server is already running, comment out the server section
  // server: {
  //   command: 'npm run dev',
  //   port: 3000,
  //   launchTimeout: 30000,
  //   debug: false,
  // },
}

