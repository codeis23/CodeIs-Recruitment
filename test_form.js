const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });

dom.window.addEventListener("load", () => {
    const document = dom.window.document;
    
    // Simulate step 1
    document.getElementById('applicantName').value = "Test User";
    document.getElementById('applicantPhone').value = "9876543210";
    document.getElementById('applicantEmail').value = "test@example.com";
    document.getElementById('applicantUSN').value = "1MS24CS000";
    document.getElementById('applicantBranch').value = "ECE";
    
    // Check next button works
    document.getElementById('formNextBtn').click();
    console.log("Current Step after 1:", dom.window.currentStep);
    
    // Simulate step 2
    document.querySelector('input[name="primaryTrack"][value="ai"]').checked = true;
    document.getElementById('formNextBtn').click();
    console.log("Current Step after 2:", dom.window.currentStep);
    
    // Simulate step 3
    document.getElementById('qProud').value = "Built a web scraper";
    document.getElementById('qGoal').value = "Learn AI";
    
    // We mock fetch to verify payload
    let fetchCalled = false;
    dom.window.fetch = (url, options) => {
        fetchCalled = true;
        console.log("Fetch called with URL:", url);
        for (let [key, value] of options.body.entries()) {
            console.log(key + ":", value);
        }
        return Promise.resolve({ ok: true });
    };
    
    document.getElementById('recruitmentForm').dispatchEvent(new dom.window.Event("submit"));
    
    setTimeout(() => {
        if (fetchCalled) {
            console.log("Form submitted successfully!");
        } else {
            console.log("Form submission failed!");
        }
    }, 500);
});
