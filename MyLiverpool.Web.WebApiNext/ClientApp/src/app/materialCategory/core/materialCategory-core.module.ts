import { NgModule } from "@angular/core";
import { SharedModule } from "@app/shared";
import { MaterialCategoryService } from "./materialCategory.service";

@NgModule({
    imports: [
        SharedModule
    ],
    providers: [
        MaterialCategoryService
    ]
})
export class MaterialCategoryCoreModule { }  