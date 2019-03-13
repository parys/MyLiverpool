import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { PmCounterComponent } from "./pm-counter";
import { PmService } from "./pm.service";

@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
        PmCounterComponent
    ],
    exports: [
        PmCounterComponent
    ],
    providers: [
        PmService
    ]
})
export class PmCoreModule { }