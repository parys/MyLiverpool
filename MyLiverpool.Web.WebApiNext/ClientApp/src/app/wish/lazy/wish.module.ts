import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { WishListComponent } from "./wish-list";
import { WishEditComponent } from "./wish-edit";
import { WishService } from "./wish.service";
import { wishRoutes } from "./wish.routes";
import { SharedModule } from "@app/shared";
import { RecaptchaModule } from "@app/shared/modules";

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(wishRoutes),
        RecaptchaModule
    ],
    declarations: [
        WishEditComponent,
        WishListComponent
    ],
    providers: [
        WishService
    ]
})
export class WishModule { }