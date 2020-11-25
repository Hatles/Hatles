// Include node fs (file stream) and https modules
const fs = require('fs');
const fetch = require('node-fetch');

const defaultData = {
  USERNAME: 'Hatles'
};

async function getSlipAdvice() {
  const response = await fetch('https://api.adviceslip.com/advice');
  const data = await response.json();
  return data['slip']['advice'];
  // return data.slip.advice;
}

async function getReadmeData() {
  const slipAdvice = await getSlipAdvice();
  return {
    ...defaultData,
    SLIP_ADVICE: slipAdvice
  };
}

const templateFile = 'src/README.template.md';
const readmeFile = 'README.md';

function updateReadme(data) {

  // Update README using FS
  fs.readFile(templateFile, 'utf-8', (err, template) => {
    if (err) {
      throw err;
    }

    // Replace text using regex: "I'm writing: ...replace... ![Build"
    // Regex101.com is a lifesaver!
    let result = template;
    Object.keys(data).forEach(key => {
      result = result.replace(new RegExp('<' + key + '>',"g"), data[key]);
    });

    // Write the new README
    fs.writeFile(readmeFile, result, 'utf-8', (err) => {
      if (err) {
        throw err;
      }

      console.log('README update complete.');
    });
  });
}

// Call the function


(async () => {
  const data = await getReadmeData();
  updateReadme(data);
})();
