import { RestClientRequest } from '../../client';

export interface RestStockCorporateActionsListingApplicantsParams {
  start_date?: string;
  end_date?: string;
  sort?: 'asc' | 'desc';
}

export interface ListingApplicant {
  symbol: string;
  name: string;
  exchange: string;
  applicationDate: string;
  chairman: string;
  capitalAtApplication: number | null;
  reviewCommitteeDate: string | null;
  boardApprovalDate: string | null;
  contractApprovalDate: string | null;
  listedDate: string | null;
  underwriter: string | null;
  underwritingPrice: number | null;
  remarks: string;
}

export interface RestStockCorporateActionsListingApplicantsResponse {
  start_date: string;
  end_date: string;
  sort: string;
  data: ListingApplicant[];
}

export const listingApplicants = (request: RestClientRequest, params?: RestStockCorporateActionsListingApplicantsParams) => {
  return request('corporate-actions/listing-applicants', params ?? {}) as Promise<RestStockCorporateActionsListingApplicantsResponse>;
}
