export interface ClientOptions {
  apiKey?: string;
  sdkToken?: string;
  bearerToken?: string;
  baseUrl?: string;
}

export abstract class ClientFactory {
  constructor(
    protected readonly options: ClientOptions,
  ) {
    const { apiKey, bearerToken, sdkToken } = options;
    const tokenCount = [apiKey, bearerToken, sdkToken].filter(Boolean).length;

    if (tokenCount === 0) {
      throw new TypeError(
        'One of the "apiKey", "bearerToken", or "sdkToken" options must be specified'
      );
    }

    if (tokenCount > 1) {
      throw new TypeError(
        'Only one of the "apiKey", "bearerToken", or "sdkToken" options must be specified'
      );
    }
  }
}
