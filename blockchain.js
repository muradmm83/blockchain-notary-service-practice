const sha = require('crypto-js/sha256');

const BlockchainDb = require('./blockchainDb');
const Block = require('./block');

class Blockchain {
    constructor() {
        this.db = new BlockchainDb();
    }

    async init() {
        let currentHeight = await this.db.getNewBlockHeight();

        if (currentHeight == 1) { // empty block, should add genese block
            await this.addBlock({
                plateNumber: 'Geneses block'
            })
        }
    }

    async getBlock(height) {
        return JSON.parse(await this.db.get(height));
    }

    async addBlock(body) {
        let newBlock = new Block({
            ...body,
            plateNumber: Buffer.from(body.plateNumber).toString('hex')
        });
        newBlock.height = await this.db.getNewBlockHeight();

        if (newBlock.height > 1) { // at least there is one previous block
            let block = await this.getBlock(newBlock.height - 1);
            newBlock.previousHash = block.hash;
        }

        newBlock.hash = sha(JSON.stringify(newBlock)).toString();

        await this.db.add(newBlock.height, newBlock);
    }

    async getBlockByHash(hash) {
        return await this.db.getByHash(hash);
    }
}

module.exports = Blockchain;