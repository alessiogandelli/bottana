const { Telegraf } = require('telegraf')
const translate = require("deepl");
const  dotenv = require('dotenv');
dotenv.config()


const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => ctx.reply('scrivi qualcosa e traduco in francese'))
bot.on('message',(ctx) => traduci(ctx))
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

function traduci(ctx){
    let id = ctx.message.from.id

    translate({
        free_api: true,
        text: ctx.message.text,
        target_lang: 'FR',
        auth_key: process.env.DEEPL_TOKEN,
      })
      .then(result => {
         // ctx.reply(result.data.translations[0].text);
         bot.telegram.sendMessage(id, ctx.message.text +'\n\n' + result.data.translations[0].text)
      })
      .catch(error => {
          console.error(error)
      });
    
}