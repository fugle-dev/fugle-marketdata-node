import * as fetch from 'isomorphic-fetch';
import * as queryString from 'query-string';

export type RestClientRequest = (endpoint: string, params: Record<string, any>) => Promise<any>;

export interface RestClientOptions {
  baseUrl: string;
  apiKey?: string;
  bearerToken?: string;
}

export abstract class RestClient {
  constructor(protected readonly options: RestClientOptions) {}

  protected request = async (endpoint: string, params?: Record<string, any>) => {
    const url = queryString.stringifyUrl({ url: `${this.options.baseUrl}/${endpoint}`, query: params });

    const headers = Object.assign({},
      this.options.apiKey && { 'X-API-KEY': this.options.apiKey },
      this.options.bearerToken && { Authorization: `Bearer ${this.options.bearerToken}` },
    ) as Record<string, string>;

    return fetch(url, { headers }).then(res => res.json());
  }
}
