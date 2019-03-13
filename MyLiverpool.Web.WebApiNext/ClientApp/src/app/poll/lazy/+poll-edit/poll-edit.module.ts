import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "@app/shared";
import { pollEditRoutes } from "./poll-edit.routes";
import { PollCoreModule } from "../../core/poll-core.module";
import { PollEditComponent } from "./poll-edit.component";
import { MatInputModule } from '@angular/material';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(pollEditRoutes),
        PollCoreModule,
        MatInputModule
      //  ImageCoreModule
    ],
    declarations: [
        PollEditComponent
    ],
    providers: [
    ]
})
export class PollEditModule { }