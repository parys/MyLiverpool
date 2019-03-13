import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { PersonEditComponent } from "./person-edit";
import { MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule } from "@angular/material";
import { PersonCoreModule } from "../core";


@NgModule({
    imports: [
        SharedModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule,
        PersonCoreModule
    ],
    declarations: [
        PersonEditComponent
    ],
    exports: [
        PersonEditComponent,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
})
export class PersonEditModule { }