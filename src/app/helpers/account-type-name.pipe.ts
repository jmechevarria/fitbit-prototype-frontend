import { Pipe, PipeTransform } from "@angular/core";
import { AccountType } from "../models/AccountType";

@Pipe({ name: "accountTypeName" })
export class AccountTypeNamePipe implements PipeTransform {
  transform(id: number, accountTypes: AccountType[]): string {
    if (accountTypes.length && id) {
      return accountTypes.find(at => {
        return at.id === id;
      }).name;
    }
  }
}
