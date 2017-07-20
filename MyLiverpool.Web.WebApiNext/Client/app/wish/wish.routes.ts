import { Routes } from "@angular/router";
import { WishListComponent } from "./wish-list.component";
import { WishEditComponent } from "./wish-edit.component";

export const wishRoutes: Routes = [
    {
        path: "wishes", children: [
            { path: "", component: WishListComponent, data: { title: "Пожелания" } },
            { path: ":id/edit", component: WishEditComponent, data: { title: "Создание пожелания" } }
        ]
    }
];