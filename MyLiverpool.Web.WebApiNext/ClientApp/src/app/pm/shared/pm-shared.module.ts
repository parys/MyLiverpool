import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { PmReplyComponent } from "./pm-reply";
import { EditorModule } from "@app/editor";
import { PmCoreModule } from "../core/pm-core.module";
import { MatInputModule } from '@angular/material';

@NgModule({
    imports: [
        SharedModule,
        RouterModule,
        EditorModule,
        PmCoreModule,
        MatInputModule
    ],
    declarations: [
        PmReplyComponent
    ],
    exports: [
        PmReplyComponent
    ]
})
export class PmSharedModule { }