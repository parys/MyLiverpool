﻿import { Routes } from "@angular/router";
import { PmListComponent, PmDetailComponent, PmEditComponent } from "./index";

export const pmRoutes: Routes = [
    { path: "pm/:id/edit", component: PmEditComponent, data: { title: "Написание личного сообщения" } },
    { path: "pm/:id", component: PmDetailComponent, data: { title: "Личное сообщение" } },
    { path: "pm", component: PmListComponent, data: { title: "Личные сообщения" } },
];