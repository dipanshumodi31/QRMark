export default defineConfig({
  base: '/',
  // Add this plugin
  plugins: [
    {
      name: 'cname-inject',
      closeBundle: () => {
        const fs = require('fs');
        fs.writeFileSync('dist/CNAME', 'www.qrmark.app');
      }
    }
  ]
});
