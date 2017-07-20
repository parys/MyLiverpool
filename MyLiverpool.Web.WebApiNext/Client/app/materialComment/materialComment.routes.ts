import { Routes } from "@angular/router";
import { MaterialCommentListComponent } from "./index";

export const materialCommentRoutes: Routes = [
    {
        path: "materialComments",
        children: [
            { path: "", component: MaterialCommentListComponent, data: { title: "Комментарии" } },
            //{
            //    path: "list",
            //    children: [
            //        {
            //            path: "",
            //            component: MaterialCommentListComponent,
            //            data: { title: "Комментарии" }
            //        }, //todo need to refactor to query params
            //        {
            //            path: ":page",
            //            children: [
            //                { path: "", component: MaterialCommentListComponent, data: { title: "Комментарии" } },
            //                {
            //                    path: ":categoryId",
            //                    component: MaterialCommentListComponent,
            //                    data: { title: "Комментарии" }
            //                }
            //            ]
            //        }
            //    ]
            //}
        ]
    }
];