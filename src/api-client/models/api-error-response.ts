/**
 * Standard API error response model.
 */
export interface ApiErrorResponse {
  message: string;
  error?: any;
  code?: number;
}
