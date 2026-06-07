const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(30000);

  try {
    console.log("Navigating to http://localhost:3000/signup");
    await page.goto('http://localhost:3000/signup', { waitUntil: 'networkidle0' });
    
    console.log("Registering test user...");
    const email = `testuser_${Date.now()}@example.com`;
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard/tools
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    console.log("Logged in successfully. Current URL:", page.url());

    // Create a dummy PDF
    const testPdfPath = path.join(__dirname, 'dummy_test.pdf');
    fs.writeFileSync(testPdfPath, '%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 44 >>\nstream\nBT\n/F1 24 Tf\n100 700 Td\n(Test PDF) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000222 00000 n \n0000000310 00000 n \ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n405\n%%EOF');

    console.log("Navigating to Merge tool...");
    await page.goto('http://localhost:3000/tools/merge', { waitUntil: 'networkidle0' });

    console.log("Uploading file...");
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('.upload-zone button.btn-dark') // The "Choose Files" button
    ]);
    await fileChooser.accept([testPdfPath, testPdfPath]);

    console.log("Waiting for file list to appear...");
    await page.waitForSelector('.file-list');

    console.log("Clicking 'Merge PDF' action button...");
    await page.click('.file-list + div button.btn-dark'); // The action button container

    console.log("Waiting for success state...");
    // The UI should show "Done! Your file is ready."
    await page.waitForSelector('.success-ring', { timeout: 45000 });
    
    console.log("SUCCESS! The frontend tool interaction worked perfectly.");
  } catch (error) {
    console.error("ERROR during frontend interaction test:", error);
  } finally {
    await browser.close();
  }
})();
