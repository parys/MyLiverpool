import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PersonService } from "../person.service";
import { SharedModule } from "@app/shared";
import { PersonEditComponent } from "./person-edit.component";
import { MatInputModule, MatNativeDateModule, MatDatepickerModule } from "@angular/material";


@NgModule({
    imports: [
        SharedModule,
    //    RouterModule.forChild(personEditRoutes),
        MatInputModule,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    declarations: [
        PersonEditComponent
    ],
    exports: [
        PersonEditComponent,
        MatNativeDateModule,
        MatDatepickerModule
    ],
    providers: [
        PersonService
    ]
})
export class PersonEditModule { }