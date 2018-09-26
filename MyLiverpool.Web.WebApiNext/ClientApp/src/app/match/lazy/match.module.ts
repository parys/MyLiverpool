import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MatchEditComponent } from "./match-edit";
import { MatchListComponent } from "./match-list";
import { MatchDetailComponent } from "./match-detail";
import { matchRoutes } from "./match.routes";
import { MatchEventModule } from "@app/matchEvent";
import { MatchPersonModule } from "@app/matchPerson";
import { CommentCoreModule } from "@app/comment";
import { SharedModule } from "@app/shared";
import { MatchCoreModule } from "../core";
import { ClubCoreModule } from "@app/club";
import { StadiumCoreModule } from "@app/stadium";
import { SeasonCoreModule } from "@app/season";
import { MatNativeDateModule, MatDatepickerModule } from "@angular/material";

@NgModule({
    imports: [
        CommentCoreModule,
        SharedModule,
        MatchEventModule,
        RouterModule.forChild(matchRoutes),
        MatchPersonModule,
        MatchCoreModule,
        ClubCoreModule,
        SeasonCoreModule,
        StadiumCoreModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    declarations: [
        MatchEditComponent,
        MatchListComponent,
        MatchDetailComponent
    ]
})
export class MatchModule { }  