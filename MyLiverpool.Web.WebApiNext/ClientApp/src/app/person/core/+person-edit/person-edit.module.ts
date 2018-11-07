import { NgModule } from "@angular/core";
import { PersonService } from "../person.service";
import { SharedModule } from "@app/shared";
import { PersonEditComponent } from "./person-edit.component";
import { MatInputModule, MatNativeDateModule, MatDatepickerModule, MatSelectModule } from "@angular/material";


@NgModule({
    imports: [
        SharedModule,
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule
    ],
    declarations: [
        PersonEditComponent
    ],
    exports: [
        PersonEditComponent,
        MatNativeDateModule,
        MatDatepickerModule,
        MatSelectModule
    ],
    providers: [
        PersonService
    ]
})
export class PersonEditModule { }