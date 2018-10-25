import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { AccountService } from "./account.service";

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
    //    AccountSigninComponent
    ],
    exports: [
  //      AccountSigninComponent,
    ],
    providers: [
        AccountService
    ]
})
export class AccountCoreModule { }