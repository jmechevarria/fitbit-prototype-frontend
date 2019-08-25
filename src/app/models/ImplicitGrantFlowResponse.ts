import { OAuth2Response } from "./OAuth2Response";

export interface ImplicitGrantFlowResponse extends OAuth2Response {
  access_token: string;
  expires_in: string;
  scope: string;
  state: string;
  token_type: string;
  user_id: string;
}
