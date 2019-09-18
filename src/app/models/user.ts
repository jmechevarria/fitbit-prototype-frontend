// import { Role } from "./Role";

export interface User {
  token: string;
  data: {
    id: number;
    email: string;
    username: string;
    fullname: string;
    roleID: number;
  };
}
