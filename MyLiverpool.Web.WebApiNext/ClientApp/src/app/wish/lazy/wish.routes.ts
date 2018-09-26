import { Routes } from "@angular/router";
import { WishListComponent } from "./wish-list";
import { WishEditComponent } from "./wish-edit";
import { WISHES_RU, CREATION_RU } from "@app/+constants";

export const wishRoutes: Routes = [
    { path: "", component: WishListComponent, data: { title: WISHES_RU } },
    { path: ":id/edit", component: WishEditComponent, data: { title: `${CREATION_RU} ${WISHES_RU}` } }
];