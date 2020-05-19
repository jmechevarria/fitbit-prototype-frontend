import { Pipe, PipeTransform } from "@angular/core";
import { Role } from "../models/Role";
@Pipe({ name: "roleName" })
export class RoleNamePipe implements PipeTransform {
  transform(id: number, roles: Role[]): string {
    if (id && roles.length) {
      return roles.find((r) => r.id === id).name;
    }
  }
}
