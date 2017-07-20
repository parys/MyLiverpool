import { Routes } from "@angular/router";
import { MaterialListComponent } from "./material/index";
import { accountRoutes } from "./account/account.routes";
import { helperRoutes } from "./admin/admin.routes";
import { chatRoutes } from "./chat/chat.routes";
import { clubRoutes } from "./club/club.routes";
import { materialCategoryRoutes } from "./materialCategory/materialCategory.routes";
import { materialRoutes } from "./material/material.routes";
import { userRoutes } from "./user/user.routes";
import { pmRoutes } from "./pm/pm.routes";
import { homeRoutes } from "./home/home.routes";
import { imageRoutes } from "./image/image.routes";
import { materialCommentRoutes } from "./materialComment/materialComment.routes";
import { matchRoutes } from "./match/match.routes";
import { seasonRoutes } from "./season/season.routes";
import { stadiumRoutes } from "./stadium/stadium.routes";
import { roleGroupRoutes } from "./roleGroup/roleGroup.routes";

export const routes: Routes = [
    ...accountRoutes,
    ...helperRoutes,
    ...chatRoutes,
    ...clubRoutes,
    ...homeRoutes,
    ...imageRoutes,
    ...matchRoutes,
    ...materialCommentRoutes,
    ...materialCategoryRoutes,
    ...materialRoutes,
    ...pmRoutes,
    ...roleGroupRoutes,
    ...seasonRoutes,
    ...stadiumRoutes,
    ...userRoutes,
    { path: "", component: MaterialListComponent, data: { title: "MyLFC.ru - Сайт русскоязычных болельщиков ФК \"Ливерпуль\"", breadcrumb: "Главная", type: "Both" } }
];