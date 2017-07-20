import { Routes } from "@angular/router";
import { ForumSectionListComponent } from "./forumSection/index";
import { ForumSubsectionListComponent, ForumSubsectionEditComponent } from "./forumSubsection/index";
import { ForumThemeListComponent, ForumThemeEditComponent } from "./forumTheme/index";
import { RoleGuard } from "../auth/index";

export const forumRoutes: Routes = [
    {
        path: "forum",
        children: [
            { path: "", component: ForumSectionListComponent, data: { title: "Форум" } },
            {
                path: ":id",
                children: [
                    { path: "", component: ForumSubsectionListComponent, data: { title: "Раздел форума" } },
                    {
                        path: "edit",
                        component: ForumSubsectionEditComponent,
                        data: {
                            title: "Создание подраздела",
                            roles: ["newsStart", "infoStart"]
                        },
                        canActivate: [RoleGuard]
                    },
                    {

                        path: "themes/:idTheme",
                        children: [
                            { path: "", component: ForumThemeListComponent, data: { title: "Тема форума" } },
                            {
                                path: "edit",
                                component: ForumThemeEditComponent,
                                data: { title: "Создание темы", roles: ["newsStart"] },
                                canActivate: [RoleGuard]
                            }
                        ]
                    }
                ]
            }
        ]
    }
];