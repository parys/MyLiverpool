import { Routes } from "@angular/router";
import { StaticPageComponent } from "./static-page";
import { HelperType } from "@app/admin";
import { RoleGuard, RolesEnum } from "@app/+auth";

export const homeRoutes: Routes = [
    {
        path: "clubHistory",
        component: StaticPageComponent,
        data: { title: "История клуба", type: HelperType.ClubHistory }
    },
    {
        path: "copyright",
        component: StaticPageComponent,
        data: { title: "О перепечатке информации", type: HelperType.Copyright }
    },
    { path: "rules", component: StaticPageComponent, data: { title: "Правила", type: HelperType.Rules } },
    { path: "aboutClub", component: StaticPageComponent, data: { title: "О клубе", type: HelperType.AboutClub } },
    { path: "about", component: StaticPageComponent, data: { title: "О нас", type: HelperType.About } },
    { path: "job", component: StaticPageComponent, data: { title: "Работа на сайте", type: HelperType.Job } },
    { path: "fantasy", component: StaticPageComponent, data: { title: "Фэнтази лиги", type: HelperType.Fantasy } },
    { path: "cooperation", component: StaticPageComponent, data: { title: "Сотрудничество", type: HelperType.Cooperation } },
    {
        path: "instructions",
        component: StaticPageComponent,
        data: {
            title: "Инструкции",
            type: HelperType.Instructions,
            roles: [RolesEnum[RolesEnum.AdminStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: "plans",
        component: StaticPageComponent,
        data: {
            title: "Планы",
            type: HelperType.Plans,
            roles: [RolesEnum[RolesEnum.AdminStart]]
        },
        canActivate: [RoleGuard]
    }
];