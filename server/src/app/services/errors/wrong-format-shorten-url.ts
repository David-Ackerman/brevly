export class WrongFormatShortenUrl extends Error {
  constructor() {
    super(
      'Shorten url must be at least 4 characters long and contain only letters, numbers, or dashes'
    )
  }
}
