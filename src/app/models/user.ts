import { Role } from "./Role";

export interface User {
  id: number;
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  lastName2: string;
  token: string;
  role: Role;
}
