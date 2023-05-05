const Wallet = require('../wallet/wallet');
const MarkupService = require('./markup.service');

class SendingDataService {
    constructor() {
        this.Wallet = new Wallet();
        this.MarkupService = new MarkupService();
    };

    getList(bot, chatId, title, array) {
        bot.sendMessage(chatId, title, {
            reply_markup: {
                inline_keyboard: array.map(val => ([
                    {text: val.text, callback_data: val.callback_data}
                ]))
            }
        });
    };

    async getSendingBtc(bot, chatId) {
        return bot.sendMessage(chatId, await this.Wallet.sending('mv4rnyY3Su5gjcDNzbMLKBQkBicCtHUtFB', 0.0001, bot, chatId));
    };

    dashboard(bot, type, chatId) {
        switch(type) {
            case 'sending': return this.getSendingBtc(bot, chatId);
            default: return bot.sendMessage(chatId, 'The type is not available');
        };
    };
};

module.exports = SendingDataService;