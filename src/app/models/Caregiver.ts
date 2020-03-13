import { User } from "./User";
import { ICaregiver } from "./ICaregiver";

export class Caregiver extends User implements ICaregiver {
  constructor(params?) {
    super(params);
    this.role_id = 2;
  }
}
