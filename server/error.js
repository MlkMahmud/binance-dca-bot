export default class BaseError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}
