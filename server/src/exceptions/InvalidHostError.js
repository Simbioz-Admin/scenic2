function InvalidHostError(message) {
    this.name = 'InvalidHostError';
    this.message = message || 'Invalid Host';
}
InvalidHostError.prototype = Object.create(Error.prototype);
InvalidHostError.prototype.constructor = InvalidHostError;

module.exports = InvalidHostError;