const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// replace the value below with the Telegram token you receive from @BotFather
const token = '5683908059:AAGn2Z-BnHzW7TGutJyJZShn-yg1o-R9fXA';
const webAppUrl = 'https://profound-licorice-2e8e83.netlify.app/';

const main = 'https://stoloto.ru/faq';
const gt = 'https://user:KVkb24MSHF@gt.stoloto.ru/faq';

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});

const app = express();
app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'Привет! Я бот Движа. С моей помощью можно учавствовать в движе!\n\nЧем займемся?', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Выбрать движ', web_app: {url: webAppUrl}}],
                    [{text: 'Полезная информация', web_app: {url: main}}],
                    [{text: 'Items sandbox', web_app: {url: webAppUrl + 'items'}}],
                    [{text: 'Форма', web_app: {url: webAppUrl + 'form'}}],
                ]
            }
        });

        // send a message to the chat acknowledging receipt of their message
        // await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
        //     reply_markup: {
        //         keyboard: [
        //             [{text: 'Выбрать движ', web_app: {url: webAppUrl}}],
        //
        //             [{text: 'Заполнить форму', web_app: {url: webAppUrl + 'form'}}]
        //         ]
        //     }
        // });

    }

    if (msg?.web_app_data?.data) {

        try {
            const data = JSON.parse(msg?.web_app_data?.data);



            switch (data?.type) {
                case "FORM": {
                    await bot.sendMessage(chatId, 'Thx for t bot using!!!');
                    await bot.sendMessage(chatId, 'Thx for try!!! your country is: ' + data?.country)
                    await bot.sendMessage(chatId, 'Thx for try!!! your street is: ' + data?.street)
                    await bot.sendMessage(chatId, 'Thx for try!!! your street is: ' + data?.subject)
                    setTimeout( async () => {
                        await bot.sendMessage(chatId, "all messages are sended");
                    }, 3000)
                    break;
                }
                case 'TICKETS': {
                    await bot.sendMessage(chatId, 'Thx for t bot using!!!');
                    await bot.sendMessage(chatId, 'Thx for try!!! your country is: ' + data?.bet_data.coupons.length)
                    await bot.sendMessage(chatId, 'Thx for try!!! your country is: ' + data?.query_id)
                    await bot.sendMessage(chatId, 'Thx for try!!! your country is: ' + JSON.stringify(data).length)
                    setTimeout( async () => {
                        await bot.sendMessage(chatId, "all messages are sended");
                    }, 3000)

                    break;
                }


                default: break;

            }



        } catch (err) {
            console.log(err);
        }


    }
});



app.post('/web-data', async (req, res) => {
    const {queryId, bet_data} = req.body;
    try {
        const tmpString = JSON.stringify(bet_data);


        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму`,
            input_message_content: {
                message_text: `Длина строки:${tmpString.length}=>${tmpString}`
            }
        })
        return res.status(200).json(req.body);
    } catch (e) {
        return res.status(500).json({e})
    }
})

app.post('/web-products', async (req, res) => {
    const {queryId} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму`
            }
        })
        return res.status(200).json(req.body);
    } catch (e) {
        return res.status(500).json({error: e.message})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
