import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { PollService } from "./poll.service";
import { pollCoreRoutes } from "./poll.routes";
import { NgxChartsModule } from "@swimlane/ngx-charts";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pollCoreRoutes),
   //     NgxChartsModule
    ],
    declarations: [
    ],
    exports: [
    //    NgxChartsModule
    ],
    providers: [
        PollService
    ]
})
export class PollCoreModule { }