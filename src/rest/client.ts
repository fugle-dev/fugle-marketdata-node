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
    endpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;

    const url = queryString.stringifyUrl({
      url: this.options.baseUrl + endpoint,
      query: params,
    });

    const headers: Record<string, string> = {};
    if (this.options.apiKey) headers['X-API-KEY'] = this.options.apiKey;
    if (this.options.bearerToken) headers['Authorization'] = `Bearer ${this.options.bearerToken}`;

    return fetch(url, { headers }).then(res => res.json());
  }
}
