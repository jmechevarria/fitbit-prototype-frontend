import { User } from "./User";
import { IContact } from "./IContact";

export class Contact extends User implements IContact {
  constructor(params?) {
    super(params);
    this.role_id = 3;
  }
}
