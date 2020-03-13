import { IClientAccount } from "./IClientAccount";
import * as moment from "moment";
export class ClientAccount implements IClientAccount {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  lastname2: string;
  height_cm: number;
  weight_kg: number;
  // birthdate: string;
  birthdate: moment.Moment;
  type_id: number;

  constructor(params?) {
    if (params) {
      this.id = params.id;
      this.email = params.email;
      this.firstname = params.firstname;
      this.lastname = params.lastname;
      this.lastname2 = params.lastname2;
      this.height_cm = params.height_cm;
      this.weight_kg = params.weight_kg;
      this.birthdate = params.birthdate;
      this.type_id = params.type_id;
    }
  }

  init(values: IClientAccount) {
    console.log(values);
  }
}
