import { Routes } from "@angular/router";
import { CommentListComponent } from "./comment-list";
import { COMMENTS_RU } from "@app/+constants/ru.constants";

export const commentRoutes: Routes = [
    { path: "", component: CommentListComponent, data: { title: COMMENTS_RU } },
];