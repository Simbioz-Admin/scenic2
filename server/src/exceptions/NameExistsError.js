function NameExistsError(message) {
    this.name = 'NameExistsError';
    this.message = message || 'Name already exists';
}
NameExistsError.prototype = Object.create(Error.prototype);
NameExistsError.prototype.constructor = NameExistsError;

module.exports = NameExistsError;