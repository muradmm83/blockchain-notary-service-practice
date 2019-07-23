class Block {
    constructor(carInfo) {
        this.hash = '';
        this.height = 0;
        this.time = Date.now();
        this.previousHash = '';
        this.body = carInfo;
    }
}

module.exports = Block;