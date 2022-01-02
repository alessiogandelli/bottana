const translate = require("deepl");

let a  = 'gatto'


translate({
    free_api: true,
    text: a,
    target_lang: 'FR',
    auth_key: process.env.DEEPL_TOKEN,
    // All optional parameters available in the official documentation can be defined here as well.
  })
  .then(result => {
      console.log(text + '\n\n'+result.data.translations[0].text);
  })
  .catch(error => {
      console.error(error)
  });

