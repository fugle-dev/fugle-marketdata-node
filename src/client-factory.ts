export interface ClientOptions {
  apiKey?: string;
  bearerToken?: string;
}

export abstract class ClientFactory {
  constructor(protected readonly options: ClientOptions) {
    if (!options.apiKey && !options.bearerToken) {
      throw new TypeError('One of the "apiKey" or "bearerToken" options must be specified');
    }
    if (options.apiKey && options.bearerToken) {
      throw new TypeError('One and only one of the "apiKey" or "bearerToken" options must be specified');
    }
  }
}
