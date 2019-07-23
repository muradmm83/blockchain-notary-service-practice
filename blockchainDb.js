const level = require('level');

class BlockchainDb {
    constructor() {
        this.db = level('BlockchainData');
    }

    add(height, block) {
        return this.db.put(height, JSON.stringify(block));
    }

    get(height) {
        return this.db.get(height);
    }

    getNewBlockHeight() {
        return new Promise((resolve, reject) => {
            let newHeight = 1;

            this.db.createReadStream()
                .on('data', () => newHeight++)
                .on('error', err => reject(err))
                .on('end', () => resolve(newHeight));
        });
    }

    getByHash(hash) {
        return new Promise((resolve, reject) => {
            this.db.createReadStream()
                .on('data', data => {
                    const block = JSON.parse(data.value);

                    if (block.hash === hash) {
                        resolve(block);
                    }
                })
                .on('error', err => reject(err))
                .on('end', () => resolve(null));
        });
    }

    getByAddress(wallet) {
        return new Promise((resolve, reject) => {
            let result = [];

            this.db.createReadStream()
                .on('data', data => {
                    const block = JSON.parse(data.value);

                    if (block.body.address === wallet) {
                        result.push(block);
                    }
                })
                .on('error', err => reject(err))
                .on('end', () => resolve(result));
        });
    }
}

module.exports = BlockchainDb;