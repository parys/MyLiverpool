import { Routes } from "@angular/router";
import { MaxiChatComponent } from "./index";

export const chatRoutes: Routes = [
    { path: "chat", component: MaxiChatComponent, data: { title: "Чат-флудилка" } },
];