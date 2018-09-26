import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { PersonBirthdayComponent } from "./person-birthday";
import { PersonService } from "./person.service";
import { BestPlayerComponent } from "./best-player";
import { SharedModule } from "@app/shared";


@NgModule({
    imports: [
        SharedModule,
        RouterModule
    ],
    declarations: [
        BestPlayerComponent,
        PersonBirthdayComponent

    ],
    exports: [
        BestPlayerComponent,
        PersonBirthdayComponent
    ],
    providers: [
        PersonService
    ]
})
export class PersonCoreModule { }