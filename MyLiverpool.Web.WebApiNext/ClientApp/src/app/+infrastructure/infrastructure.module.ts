import { NgModule } from "@angular/core";
import { HttpWrapperModule } from "@app/+httpWrapper";
import { BaseRestService } from "./base-rest.service";

@NgModule({
    imports: [
        HttpWrapperModule
    ],
    providers: [
        BaseRestService
    ]
})
export class InfrastructureModule { }  