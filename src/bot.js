const TelegramApi = require('node-telegram-bot-api');
const MarkupService = require('./utils/markup.service');
const SendingDataService = require('./utils/sending.data.service');

class Bot {
    constructor() {
        this.red = '\x1b[31m%s\x1b[0m';
        this.blue = '\x1b[34m%s\x1b[0m';
        this.MarkupService = new MarkupService();
        this.SendingDataService = new SendingDataService();
        this.bot = new TelegramApi('6090972311:AAFDbiXGlalIugBfcCe_cNRcfEFXdLREqKs', {
            polling: {
                interval: 300,
                autoStart: true,
                params: {
                  timeout: 10
                }
            }
        });
        this.message();
        this.callback();
        this.setMyCommands()
    };

    setMyCommands() {
        this.bot.setMyCommands([
            {command: '/start', description: 'Начальное приветствие'},
        ]);
    };

    callback() {
        this.bot.on('callback_query', msg => {
            const data = msg.data;
            const text = msg.message.text;
            const chatId = msg.message.chat.id;

            this.SendingDataService.dashboard(this.bot, data, chatId);
        });
    };

    message() {
        this.bot.on('message', msg => {
            const text = msg.text;
            const chatId = msg.chat.id;

            if (text === '/start') {
                return this.SendingDataService.getList(this.bot, chatId, 'Возможности', this.MarkupService.opportunities());
            };
            
            return this.bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!)');

        });
    };

    listen() {
        console.log(this.blue, 'Bot has been started!');
    };
};

module.exports = Bot;