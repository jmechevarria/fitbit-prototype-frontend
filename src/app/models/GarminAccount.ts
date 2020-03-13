import { ClientAccount } from "./ClientAccount";
import { IGarminAccount } from "./IGarminAccount";

export class GarminAccount extends ClientAccount {
  fitbit_app_id: string;
  secret: string;
  constructor(params?) {
    super(params);
    this.type_id = 2;
  }
}
