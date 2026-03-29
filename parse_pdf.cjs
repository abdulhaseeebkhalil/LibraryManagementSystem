const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('Complete_Library_Management_Backend.docx.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('backend_reqs.txt', data.text);
    console.log("Extraction complete.");
}).catch(function(err) {
    console.error("Error reading PDF:", err);
});
