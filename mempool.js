const bitcoinMessage = require('bitcoinjs-message');

const TimeoutRequestsWindowTime = 5 * 60 * 1000;
const TimeoutValidRequestsWindowTime = 30 * 60 * 1000;

class Mempool {
    constructor() {
        this.requests = [];
        this.timeoutRequest = [];
        this.validRequests = [];
        this.timeoutValidRequests = [];
    }

    calculateTimeLeft(windowTime, requestTime) {
        let timeElapse = Date.now().toString().slice(0, -3) - requestTime;
        return (windowTime / 1000) - timeElapse;
    }

    addRequestValidation(wallet) {
        if (!this.requests[wallet]) {
            const now = Date.now();

            this.requests[wallet] = {
                walletAddress: wallet,
                requestTimeStamp: now,
                message: `${wallet}:${now}:carInfo`,
            };

            this.timeoutRequest[wallet] = setTimeout(() => delete this.request[wallet], TimeoutRequestsWindowTime);
        }

        this.requests[wallet].validationWindow = this.calculateTimeLeft(TimeoutRequestsWindowTime, this.requests[wallet].requestTimeStamp);

        return this.requests[wallet];
    }

    validateRequestByWallet(wallet, signature) {
        const now = Date.now().toString().slice(0, -3);
        const request = this.requests[wallet];

        // check if request is not in validateRequests
        if (request) {
            clearTimeout(this.timeoutRequest[wallet]); // remove timout
            delete this.requests[wallet];

            this.validRequests[wallet] = {
                registerStar: true,
                status: {
                    address: request.walletAddress,
                    requestTimeStamp: now,
                    message: request.message,
                    validationWindow: this.calculateTimeLeft(TimeoutValidRequestsWindowTime, now)
                }
            };

            this.timeoutValidRequests[wallet] = setTimeout(() => delete this.validRequests[wallet], TimeoutValidRequestsWindowTime);
        }

        // calculate validation window & message verification
        if(this.validRequest[wallet]) {
            this.validRequests[wallet].staus.validationWindow = this.calculateTimeLeft(TimeoutValidRequestsWindowTime, now);
            this.validRequests[wallet].status.messageSignature = bitcoinMessage.verify(this.validRequests[wallet].status.message, wallet, signature);

            return this.validRequests[wallet];
        }

        return null;
    }

    verifyAddressRequest(wallet) {
        return this.validRequests[wallet];
    }
}

module.exports = Mempool;