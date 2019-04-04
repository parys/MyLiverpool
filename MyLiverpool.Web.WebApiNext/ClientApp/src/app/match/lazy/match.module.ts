import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatchEditComponent } from "./match-edit";
import { MatchListComponent } from "./match-list";
import { MatchDetailComponent } from "./match-detail";
import { matchRoutes } from "./match.routes";
import { MatchEventModule } from "@app/matchEvent";
import { MatchPersonModule } from "@app/matchPerson";
import { CommentSharedModule } from "@app/comment";
import { SharedModule } from "@app/shared";
import { MatchCoreModule } from "../core";
import { ClubCoreModule } from "@app/club";
import { StadiumCoreModule } from "@app/stadium";
import { SeasonCoreModule } from "@app/season";
import {
    MatNativeDateModule, MatDatepickerModule, MatAutocompleteModule,
    MatSelectModule, MatSlideToggleModule, MatInputModule, MatTableModule, MatTabsModule
} from "@angular/material";
import { BreadcrumbService } from "@app/shared/breadcrumb";
import { MATCHES_ROUTE, MATCHES_RU, MATCH_RU  } from "@app/+constants";

@NgModule({
    imports: [
        CommentSharedModule,
        SharedModule,
        MatchEventModule,
        RouterModule.forChild(matchRoutes),
        MatchPersonModule,
        MatchCoreModule,
        ClubCoreModule,
        SeasonCoreModule,
        StadiumCoreModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatInputModule,
        MatTabsModule
    ],
    declarations: [
        MatchEditComponent,
        MatchListComponent,
        MatchDetailComponent
    ]
})
export class MatchModule {
    constructor(
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.addFriendlyNameForRouteRegex(`/${MATCHES_ROUTE}`, MATCHES_RU);
        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${MATCHES_ROUTE}/[0-9]+$`, MATCH_RU); 
    }
}  