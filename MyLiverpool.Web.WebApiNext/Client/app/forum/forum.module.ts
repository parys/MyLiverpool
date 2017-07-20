import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { ForumSectionListComponent, ForumSectionService } from "./forumSection/index";
import * as forumSubsection from "./forumSubsection/index";
import * as forumMessage from "./forumMessage/index";
import * as forumTheme from "./forumTheme/index";
import { forumRoutes } from "./forum.routes";
import { EditorModule } from "../editor/index";
import { SharedModule } from "../shared/index";
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
    imports: [
        CommonModule,
        EditorModule,
        NgxPaginationModule,
        RouterModule.forRoot(forumRoutes),
        SharedModule
    ],
    declarations: [
        forumMessage.ForumMessageAdditionComponent,
        forumSubsection.ForumSubsectionEditComponent,
        forumSubsection.ForumSubsectionListComponent,
        forumTheme.ForumThemeEditComponent,
        forumTheme.ForumThemeListComponent,
        ForumSectionListComponent
    ],
    exports: [
    ],
    providers: [
        forumMessage.ForumMessageService,
        forumSubsection.ForumSubsectionService,
        forumTheme.ForumThemeService,
        ForumSectionService
    ]
})
export class ForumModule { }