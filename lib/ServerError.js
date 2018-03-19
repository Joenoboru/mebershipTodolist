// Custom Error Types
function ServerError(message, code) {
  this.name = 'ServerError';
  this.statusCode = code || 400;
  this.errorMessage = message || 'Unknown Error';
  this.stack = (new Error()).stack;
}
ServerError.prototype = Object.create(Error.prototype);
ServerError.prototype.constructor = ServerError;

module.exports = ServerError;