import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { seasonCoreRoutes } from "./season-core.routes";
import { SeasonService } from "./season.service";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(seasonCoreRoutes)
    ],
    exports: [
        RouterModule
        ],
    providers: [
        SeasonService
    ]
})
export class SeasonCoreModule { }