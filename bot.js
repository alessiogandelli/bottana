const { Telegraf } = require('telegraf')
const translate = require("deepl");
const database = require('./database');
const dotenv = require('dotenv');
const { getCollection } = require('./database');
dotenv.config()

const bot = new Telegraf(process.env.BOT_TOKEN)



async function main(){

    await startdb();
    await new Promise(r => setTimeout(r, 2000));
    database.getCollection('users').createIndex({username:1}, {unique:true})

    bot.start((ctx) => startbot(ctx))
    bot.command('/francese', (ctx) => setLanguage(ctx, "FR"))
    bot.command('/spagnolo', (ctx) => setLanguage(ctx, "ES"))
    bot.command('/inglese', (ctx) => setLanguage(ctx, "EN-GB"))
    bot.command('/cinese', (ctx) => setLanguage(ctx, "ZH"))
    bot.command('/giapponese', (ctx) => setLanguage(ctx, "JA"))
    bot.command('/portoghese', (ctx) => setLanguage(ctx, "PT-BR"))
    bot.command('/russo', (ctx) => setLanguage(ctx, "RU"))
    bot.command('/tedesco', (ctx) => setLanguage(ctx, "DE"))


    bot.on('message',(ctx) => traduci(ctx))
    bot.launch()
    
    // Enable graceful stop
    process.once('SIGINT', () => bot.stop('SIGINT'))
    process.once('SIGTERM', () => bot.stop('SIGTERM'))
}



function startbot(ctx){
    ctx.reply('che lingua vuoi tradurre? /francese /inglese /cinese /giapponese /portoghese /russo /tedesco /spagnolo') 


}


async function startdb(){
    await database.connect()
}


async function setLanguage(ctx, lang){
    ctx.reply('hai scelto '+ lang)

    try {
        await database.getCollection('users').updateOne({'username': ctx.message.from.username},{$set:{'lingua': lang}}, {upsert: true})

    } catch (error) {
        ctx.reply('probabilmente sei gia registrato')
    }
}




async function traduci(ctx){
    let id = ctx.message.from.id

    lingua = (await database.getCollection('users').findOne({'username':ctx.message.from.username}))?.lingua

    if(!lingua){
        ctx.reply('non hai selezionato una lingua')
    }else{
        
        translate({
            free_api: true,
            text: ctx.message.text,
            target_lang: lingua,
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

    
}


main()