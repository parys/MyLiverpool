import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { RoleGroupService } from "./roleGroup.service";

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        RoleGroupService
        ]
})
export class RoleGroupCoreModule { }