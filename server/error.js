export default class BaseError extends Error {
  constructor(message, name) {
    super(message);
    this.name = name;
  }
}
