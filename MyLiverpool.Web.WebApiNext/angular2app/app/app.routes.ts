﻿import { Routes } from "@angular/router";
import { MaterialListComponent } from "./material";
import { helperRoutes } from "./admin/admin.routes";
import { chatRoutes } from "./chat/chat.routes";
import { materialRoutes } from "./material/material.routes";
import { homeRoutes } from "./home/home.routes";
import { imageRoutes } from "./image/image.routes";
import { roleGroupRoutes } from "./roleGroup/roleGroup.routes";

export const routes: Routes = [
    ...helperRoutes,
    ...chatRoutes,
    ...homeRoutes,
    ...imageRoutes,
    ...materialRoutes,
    ...roleGroupRoutes,
    { path: "", component: MaterialListComponent, data: { title: "MyLFC.ru - Сайт русскоязычных болельщиков ФК \"Ливерпуль\"", type: "Both" } }
];