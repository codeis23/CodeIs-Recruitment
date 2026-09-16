const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const filePath = 'file://' + path.resolve('index.html');

  const applicants = [
    {
      name: "UI Tester Alpha", phone: "9876543210", email: "alpha@ui.test", usn: "UI001", branch: "CS", trackValue: "eng", proud: "Automated UI tests", goal: "Ship faster"
    },
    {
      name: "UI Tester Beta", phone: "8765432109", email: "beta@ui.test", usn: "UI002", branch: "EC", trackValue: "ai", proud: "Built a robot", goal: "Hardware rules"
    },
    {
      name: "UI Tester Gamma", phone: "7654321098", email: "gamma@ui.test", usn: "UI003", branch: "IS", trackValue: "design", proud: "Figma master", goal: "Make things pretty"
    }
  ];

  for (const applicant of applicants) {
    console.log(`Testing applicant: ${applicant.name}`);
    await page.goto(filePath);
    
    // Step 1
    await page.fill('#applicantName', applicant.name);
    await page.fill('#applicantPhone', applicant.phone);
    await page.fill('#applicantEmail', applicant.email);
    await page.fill('#applicantUSN', applicant.usn);
    await page.fill('#applicantBranch', applicant.branch);
    await page.click('#formNextBtn');
    
    // Step 2
    await page.check(`input[name="primaryTrack"][value="${applicant.trackValue}"]`);
    await page.click('#formNextBtn');
    
    // Step 3
    await page.fill('#qProud', applicant.proud);
    await page.fill('#qGoal', applicant.goal);
    
    // Submit
    await page.click('#formSubmitBtn');
    
    // Wait for Success Modal
    await page.waitForSelector('#successModal.open', { timeout: 10000 });
    console.log(`Successfully submitted application for: ${applicant.name}`);
  }

  await browser.close();
})();
