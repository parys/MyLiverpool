﻿import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StadiumListComponent } from "./stadium-list.component";
import { StadiumEditComponent } from "./stadium-edit.component";
import { StadiumService } from "./stadium.service";
import { stadiumRoutes } from "./stadium.routes";
import { SharedModule } from "../shared/index";
import { MdInputModule, MdButtonModule } from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        MdButtonModule,
        MdInputModule,
        ReactiveFormsModule,
        RouterModule.forRoot(stadiumRoutes),
        SharedModule
    ],
    declarations: [
        StadiumEditComponent,
        StadiumListComponent,
    ],
    exports: [],
    providers: [
        StadiumService
    ]
})
export class StadiumModule { }