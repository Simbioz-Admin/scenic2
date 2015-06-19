function InvalidPortError(message) {
    this.name = 'InvalidPortError';
    this.message = message || 'Invalid Port';
}
InvalidPortError.prototype = Object.create(Error.prototype);
InvalidPortError.prototype.constructor = InvalidPortError;

module.exports = InvalidPortError;