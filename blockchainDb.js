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
                .on('end', () => resolve(newHeight))
        });
    }
}

module.exports = BlockchainDb;