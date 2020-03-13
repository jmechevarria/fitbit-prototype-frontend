import * as moment from "moment";
export interface IClientAccount {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  lastname2?: string;
  height_cm: number;
  weight_kg: number;
  birthdate: moment.Moment;
  type_id: number;
}
