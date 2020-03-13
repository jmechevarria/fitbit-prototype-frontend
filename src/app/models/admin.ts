import { User } from "./User";
import { IAdmin } from "./IAdmin";

export class Admin extends User implements IAdmin {
  test: string;
  constructor(params?) {
    super(params);
    this.role_id = 1;
    if (params) this.test = params.test;
  }
}
