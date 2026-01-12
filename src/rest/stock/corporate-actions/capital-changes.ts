import { RestClientRequest } from '../../client';

export interface RestStockCorporateActionsCapitalChangesParams {
  start_date?: string;
  end_date?: string;
  sort?: 'asc' | 'desc';
}

export interface CapitalReductionRaw {
  previousClose?: number;
  referencePrice?: number;
  limitUpPrice?: number;
  limitDownPrice?: number;
  openingReferencePrice?: number;
  exrightReferencePrice?: number;
  reason?: string;
  sharesPerThousand?: number;
  refundPerShare?: number;
  cashIncreaseRatioAfterReduction?: number;
  subscriptionPrice?: number;
}

export interface ParValueChangeRaw {
  previousClose?: number;
  referencePrice?: number;
  limitUpPrice?: number;
  limitDownPrice?: number;
  openingReferencePrice?: number;
  splitRatio?: number;
  parValueBefore?: number;
  parValueAfter?: number;
}

export interface EtfSplitOrMergeRaw {
  previousClose?: number;
  referencePrice?: number;
  limitUpPrice?: number;
  limitDownPrice?: number;
  openingReferencePrice?: number;
  splitRatio?: number;
  splitType?: string;
}

export interface CapitalReductionChange {
  symbol: string;
  name: string;
  actionType: 'capital_reduction';
  resumeDate: string;
  haltDate: string;
  exchange: string;
  raw: CapitalReductionRaw;
}

export interface ParValueChange {
  symbol: string;
  name: string;
  actionType: 'par_value_change';
  resumeDate: string;
  haltDate: string;
  exchange: string;
  raw: ParValueChangeRaw;
}

export interface EtfSplitOrMergeChange {
  symbol: string;
  name: string;
  actionType: 'etf_split_or_merge';
  resumeDate: string;
  haltDate: string;
  exchange: string;
  raw: EtfSplitOrMergeRaw;
}

export type CapitalChange = CapitalReductionChange | ParValueChange | EtfSplitOrMergeChange;

export interface RestStockCorporateActionsCapitalChangesResponse {
  start_date: string;
  end_date: string;
  sort: string;
  data: CapitalChange[];
}

export const capitalChanges = (request: RestClientRequest, params?: RestStockCorporateActionsCapitalChangesParams) => {
  return request('corporate-actions/capital-changes', params ?? {}) as Promise<RestStockCorporateActionsCapitalChangesResponse>;
}
