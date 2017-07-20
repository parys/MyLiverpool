import { Routes } from "@angular/router";
import { MaterialCategoryListComponent } from "./materialCategory-list.component";
import { MaterialCategoryEditComponent } from "./materialCategory-edit.component";
import { RoleGuard } from "../auth/index";

export const materialCategoryRoutes: Routes = [
    {
        path: "newsCategories",
        children: [
            { path: "", component: MaterialCategoryListComponent, data: { title: "Категории новостей", type: "News" } },
            {
                path: ":id/edit",
                component: MaterialCategoryEditComponent,
                data: { title: "Создание категории новостей", roles: ["newsFull"], type: "News" },
                canActivate: [RoleGuard]
            }
        ]
    },
    {
        path: "blogCategories",
        children: [
            { path: "", component: MaterialCategoryListComponent, data: { title: "Категории блогов", type: "Blog" } },
            {
                path: ":id/edit",
                component: MaterialCategoryEditComponent,
                data: { title: "Создание категории блогов", roles: ["blogFull"], type: "Blog" },
                canActivate: [RoleGuard]
            }
        ]
    }
];