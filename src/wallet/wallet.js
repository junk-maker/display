const bitcore = require('bitcore-lib');
const mempoolJS = require('@mempool/mempool.js');

class Wallet {
    async sending (recieverAddress, amountToSend, bot, chatId) {
        let inputs = [];
        let inputCount = 0;
        let outputCount = 2;
        let totalAmountAvailable = 0;
        const privateKey = process.env.KEY;
        const transaction = new bitcore.Transaction();
        const satoshiToSend = amountToSend * 100000000;

        const {bitcoin: {addresses}} = mempoolJS({
            hostname: 'mempool.space',
            network: 'testnet'
        });

        const address = process.env.ADDR;
        const addressTxsUtxo = await addresses.getAddressTxsUtxo({address});
        // console.log(addressTxsUtxo)

        for (const value of addressTxsUtxo) {
            // console.log(value)
            const utxo = {};
            utxo.txid = value.txid
            utxo.vout = value.vout
            utxo.address = address
            utxo.script = '76a91468b669125f2e9c2e3fead5248c543a122367fd5888ac'
            utxo.satoshis = value.value

            totalAmountAvailable += utxo.satoshis;
            inputCount += 1;

            inputs.push(utxo);
        };
        
        const transactionSize = inputCount * 180 + outputCount * 34 + 10 - inputCount;
        let fee = transactionSize * 33;
        
        if (totalAmountAvailable - satoshiToSend - fee < 0) {
            return bot.sendMessage(chatId, 'Недостаточно средств');
        };

        transaction.from(inputs);
        transaction.to(recieverAddress, satoshiToSend);
        transaction.change(address);
        transaction.fee(Math.round(fee));
        transaction.sign(privateKey);

        const serializedTransaction = transaction.serialize();
        
        return serializedTransaction;
    };
};

module.exports = Wallet;