export class ShortenUrlExists extends Error {
  constructor() {
    super('Shorten URL already exists')
  }
}
