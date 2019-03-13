import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule, BreadcrumbService } from "@app/shared";
import { pollRoutes } from "./poll.routes";
import { PollCoreModule } from "../core";
import { PollListComponent } from "./poll-list";
import { PollDetailComponent } from "./poll-detail";
import { POLLS_ROUTE } from "@app/+constants";
import { MatInputModule } from '@angular/material';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pollRoutes),
        PollCoreModule,
        MatInputModule
    ],
    declarations: [
        PollListComponent,
        PollDetailComponent
    ]
})
export class PollModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRoute(`/${POLLS_ROUTE}`, "Опросы");
        this.breadcrumbService.addFriendlyNameForRoute(`^/${POLLS_ROUTE}/[0-9]+$`, "Опрос");
    }
}