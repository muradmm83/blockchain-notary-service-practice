const express = require('express')
const hex2ascii = require('hex2ascii');

const Mempool = require('./mempool');
const Blockchain = require('./blockchain');

const mempool = new Mempool();
const blockchain = new Blockchain();
const app = express();

const decodeBlock = block => {
    block.body.carInfo.plateNumberDecoded = hex2ascii(block.body.carInfo.plateNumber);
    return block;
}

app.use(express.json());

app.post('/requestValidation', (req, res) => {
    let { address } = req.body;

    if (address) {
        res.json(mempool.addRequestValidation(address));
    }
    else {
        res.status(400).end();
    }
});

app.post('/message-signature/validate', (req, res) => {
    const { address, signature } = req.body;

    if (address && signature) {
        res.json(mempool.validateRequestByWallet(address, signature));
    }
    else {
        res.status(400);
    }
});

app.post('/block', async (req, res) => {
    try {

        const { address, carInfo } = req.body;

        if (address && carInfo) {
            if (mempool.verifyAddressRequest(address)) {
                let block = await blockchain.addBlock(
                    {
                        address,
                        carInfo
                    });

                block.body.carInfo.plateNumberDecoded = hex2ascii(block.body.carInfo.plateNumber);

                res.json(block);
            } else {
                res.status(401).end();
            }

        }
        else {
            res.status(400).end();
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json();
    }
});

app.get('/block/:height', async (req, res) => {
    try {
        res.json(decodeBlock(await blockchain.getBlock(req.params.height)));
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.get('/cars/hash::hash', async (req, res) => {
    try {
        res.json(decodeBlock(await blockchain.getBlockByHash(req.params.hash)));
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.get('/cars/address::address', async (req, res) => {
    try {
        const blocks = (await blockchain.getBlocksByAddress(req.params.address)).map(b => decodeBlock(b));
        res.json(blocks);
    }
    catch (err) {
        console.log(err);
        res.status(500).end();
    }
});

app.listen(8000, () => console.log('Server is up & running'));