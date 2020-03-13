import { ClientAccount } from "./ClientAccount";
import { IFitbitAccount } from "./IFitbitAccount";

export class FitbitAccount extends ClientAccount implements IFitbitAccount {
  encoded_id: string;
  secret: string;
  fitbit_app_id: string;
  access_token: string;
  constructor(params?) {
    super(params);
    this.type_id = 1;
    if (params) {
      this.encoded_id = params.encoded_id;
      this.secret = params.secret;
      this.fitbit_app_id = params.fitbit_app_id;
      this.access_token = params.access_token;
    }
  }
}
