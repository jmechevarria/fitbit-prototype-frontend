import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from "@angular/core";
import { DialogService } from "src/app/services/dialog.service";
import { LinkAccountsDialogComponent } from "src/app/components/admin/users-panel/link-accounts-dialog/link-accounts-dialog.component";
import { ConfirmationDialogComponent } from "src/app/widgets/components/confirmation-dialog/confirmation-dialog.component";
import { TranslateService } from "@ngx-translate/core";
import { forkJoin, Subscription } from "rxjs";
import { switchMap, tap, filter } from "rxjs/operators";
import { Role } from "src/app/models/Role";
import { RoleService } from "src/app/services/role.service";
import { MDBModalRef, MDBModalService } from "angular-bootstrap-md";

export interface DialogData {
  clientAccounts: {};
  selected: Array<any>;
}

@Component({
  selector: "users-panel",
  templateUrl: "./users-panel.component.html",
  styleUrls: ["../admin.component.scss", "./users-panel.component.scss"]
})
export class UsersPanelComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];
  modalRef: MDBModalRef;

  @Input()
  users: any;

  @Input()
  clientAccounts: any;

  roles: Role[] = [];

  @Output() deleteUser_EE = new EventEmitter();
  @Output() unlinkFromClientAccount_EE = new EventEmitter();
  @Output() linkToClientAccount_EE = new EventEmitter();

  constructor(
    private dialogService: DialogService,
    private roleService: RoleService,
    private translate: TranslateService,
    private mDBModalService: MDBModalService
  ) {}

  ngOnInit() {
    const sub = this.roleService.get().subscribe(response => {
      if (response) this.roles = response;

      console.log(this.roles);
    });

    this.subscriptions.push(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  deleteUser(id: number) {
    const title$ = this.translate.get("admin.users_panel.dialog.delete_user");
    const user = this.users[id];
    const body$ = this.translate.get(
      "admin.users_panel.dialog.delete_user_body_msg",
      {
        name: `<b>${user.firstname} ${user.lastname} ${
          user.lastname2 ? user.lastname2 : ""
        }</b>`
      }
    );
    const warning$ = this.translate.get("shared.warning");

    const sub = forkJoin([title$, body$, warning$])
      .pipe(
        switchMap(([title, body, warning]) => {
          const bodyText = `<p class='mat-h4'>${body}
          </p><p class='mat-body-strong' color='warn' style="font-style: italic; color: red">${warning}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(
            ConfirmationDialogComponent,
            {
              data: {
                title,
                body: bodyText
              }
            }
          );

          return dialogRef.afterClosed();
        }),
        filter(reply => reply),
        tap(() => {
          this.deleteUser_EE.next(id);
        })
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  unlinkFromClientAccount(userID, clientAccountID) {
    const title$ = this.translate.get(
      "admin.users_panel.dialog.unlink_user_from_client_account"
    );
    const body$ = this.translate.get(
      "admin.users_panel.dialog.unlink_user_from_client_account_body",
      {
        userFullname: `<b>${this.users[userID].fullname}</b>`,
        clientAccountFullname: `<b>${this.clientAccounts[clientAccountID]
          .firstname +
          " " +
          this.clientAccounts[clientAccountID].lastname +
          " " +
          (this.clientAccounts[clientAccountID].lastname2
            ? this.clientAccounts[clientAccountID].lastname2
            : "")}</b>`,
        clientAccountID
      }
    );

    const sub = forkJoin([title$, body$])
      .pipe(
        switchMap(([title, body]) => {
          const bodyText = `<p class='mat-h4'>${body}</p>`;

          const dialogRef = this.dialogService.customDialogComponent(
            ConfirmationDialogComponent,
            {
              data: {
                title,
                body: bodyText
              }
            }
          );

          return dialogRef.afterClosed();
        }),
        filter(reply => reply),
        tap(() => {
          this.unlinkFromClientAccount_EE.next({ userID, clientAccountID });
        })
      )
      .subscribe();

    this.subscriptions.push(sub);
  }

  linkToClientAccount(user) {
    this.modalRef = this.mDBModalService.show(LinkAccountsDialogComponent, {
      backdrop: true,
      keyboard: true,
      focus: true,
      ignoreBackdropClick: false,
      animated: true,
      class: "modal-dialog-scrollable",
      data: {
        title: "notifications_panel.dialog.incident_details.title",
        header: [],
        content: {}
      }
    });

    this.modalRef.content.action.subscribe((selected: any[]) => {
      console.log(selected);
      if (selected && selected.length) {
        const clientAccountsIDs = selected.map(element => element.id);
        this.linkToClientAccount_EE.emit({
          userID: user.id,
          clientAccountsIDs
        });
      }
    });

    const clientAccounts = Object.keys(this.clientAccounts).reduce(
      (acc, key) => {
        if (!user.client_account_ids.includes(parseInt(key)))
          acc[key] = {
            ...this.clientAccounts[key]
          };
        return acc;
      },
      {}
    );

    this.modalRef.content.content.clientAccounts = clientAccounts;

    this.modalRef.content.loading = false;

    console.log(this.modalRef.content);
  }
}
