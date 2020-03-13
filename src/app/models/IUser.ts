export interface IUser {
  // token: string;
  id: number;
  username: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  lastname2: string;
  role_id: number;
  receive_emails: boolean;
  receive_text_messages: boolean;
}
