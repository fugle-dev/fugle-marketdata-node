import * as fetch from 'isomorphic-fetch';
import * as queryString from 'query-string';

export type RestClientRequest = (endpoint: string, params: Record<string, any>) => Promise<any>;

export interface RestClientOptions {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
  sdkToken?: string;
}

export abstract class RestClient {
  constructor(protected readonly options: RestClientOptions) {}

  /**
   * The prefix every request from this client is built on, fully resolved —
   * host, version segment and product. Endpoints are appended to it.
   *
   * The version segment is chosen by the SDK rather than written by the
   * caller, so this is the only way to see what a client actually resolved to.
   */
  public get baseUrl(): string {
    return this.options.baseUrl;
  }

  protected request = async (endpoint: string, params?: Record<string, any>) => {
    const url = queryString.stringifyUrl({ url: `${this.options.baseUrl}/${endpoint}`, query: params });

    const headers = Object.assign({},
      this.options.apiKey && { 'X-API-KEY': this.options.apiKey },
      this.options.bearerToken && { Authorization: `Bearer ${this.options.bearerToken}` },
      this.options.sdkToken && { 'X-SDK-TOKEN': this.options.sdkToken },
    ) as Record<string, string>;

    return fetch(url, { headers }).then(res => res.json());
  }
}
