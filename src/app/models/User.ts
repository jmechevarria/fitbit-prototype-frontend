import { IUser } from "./IUser";

export class User implements IUser {
  id: number = undefined;
  email: string = undefined;
  username: string = undefined;
  password: string = undefined;
  firstname: string = undefined;
  lastname: string = undefined;
  lastname2: string = undefined;
  role_id: number = undefined;
  receive_emails: boolean = false;
  receive_text_messages: boolean = false;
  constructor(params?: IUser) {
    if (params) {
      this.id = params.id;
      this.email = params.email;
      this.username = params.username;
      this.password = params.password;
      this.firstname = params.firstname;
      this.lastname = params.lastname;
      this.lastname2 = params.lastname2;
      this.role_id = params.role_id;
      this.receive_emails = params.receive_emails;
      this.receive_text_messages = params.receive_text_messages;
    }
  }
}
