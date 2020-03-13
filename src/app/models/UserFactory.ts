import { IUser } from "./IUser";
import { Admin } from "./Admin";
import { Contact } from "./Contact";
import { Caregiver } from "./Caregiver";
import { User } from "./User";

export class UserFactory {
  constructor() {}

  public static createUser(role_id: number, params?): User {
    if (role_id === 1) {
      return new Admin(params);
    } else if (role_id === 2) {
      return new Caregiver(params);
    } else if (role_id === 3) {
      return new Contact(params);
    }
  }
}
