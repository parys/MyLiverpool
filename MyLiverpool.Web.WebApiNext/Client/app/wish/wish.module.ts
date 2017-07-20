import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MdButtonModule } from "@angular/material";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { WishListComponent } from "./wish-list.component";
import { WishEditComponent } from "./wish-edit.component";
import { WishService } from "./wish.service";
import { wishRoutes } from "./wish.routes";
import { NgxPaginationModule } from "ngx-pagination";
import { SharedModule } from "../shared/index";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdButtonModule,
        RouterModule.forRoot(wishRoutes),
        ReactiveFormsModule,
        NgxPaginationModule,
        SharedModule
    ],
    declarations: [
        WishEditComponent,
        WishListComponent
    ],
    exports: [
    ],
    providers: [
        WishService
    ]
})
export class WishModule { }