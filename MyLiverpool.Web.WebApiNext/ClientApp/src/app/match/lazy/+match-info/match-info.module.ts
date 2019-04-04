//import { NgModule } from "@angular/core";
//import { RouterModule } from "@angular/router";
//import { MatchEventModule } from "@app/matchEvent";
//import { MatchPersonModule } from "@app/matchPerson";
//import { CommentSharedModule } from "@app/comment";
//import { SharedModule } from "@app/shared";
//import { MatchCoreModule } from "../../core";
//import { ClubCoreModule } from "@app/club";
//import { StadiumCoreModule } from "@app/stadium";
//import { SeasonCoreModule } from "@app/season";
//import {
//    MatNativeDateModule, MatDatepickerModule, MatAutocompleteModule,
//    MatSelectModule, MatSlideToggleModule, MatInputModule
//} from "@angular/material";
//import { BreadcrumbService } from "@app/shared/breadcrumb";
//import { MATCHES_ROUTE, MATCHES_RU, MATCH_RU  } from "@app/+constants";

//@NgModule({
//    imports: [
//        CommentSharedModule,
//        SharedModule,
//        MatchEventModule,
//        RouterModule.forChild(),
//        MatchPersonModule,
//        MatchCoreModule,
//        ClubCoreModule,
//        SeasonCoreModule,
//        StadiumCoreModule,
//        MatNativeDateModule,
//        MatDatepickerModule,
//        MatAutocompleteModule,
//        MatSelectModule,
//        MatSlideToggleModule,
//        MatInputModule
//    ],
//    declarations: [
//        MatchInfoComponent
//    ]
//})
//export class MatchModule {
//    constructor(
//        private breadcrumbService: BreadcrumbService
//    ) {
//        this.breadcrumbService.addFriendlyNameForRouteRegex(`^/${MATCHES_ROUTE}/[0-9]+$/info`, "редактирование информации"); 
//    }
//}  