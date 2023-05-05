class MarkupService {
    opportunities() {
        return [
            {text: 'Отправка', callback_data: 'sending'},
        ];
    };
};


module.exports = MarkupService;