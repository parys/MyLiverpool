import { Component, OnInit } from "@angular/core";   
import { ActivatedRoute } from "@angular/router";   
import { MaterialCategory } from "./materialCategory.model";
import { MaterialCategoryService } from "./materialCategory.service";
import { MaterialType } from "./materialType.enum";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "materialCategory-list",
    templateUrl: "./materialCategory-list.component.html"
})

export class MaterialCategoryListComponent implements OnInit {
    public roles: IRoles;
    public items: MaterialCategory[];
    public type: MaterialType;

    constructor(private service: MaterialCategoryService, 
        private rolesChecked: RolesCheckedService,
        route: ActivatedRoute) {
        if (route.snapshot.data["type"] === MaterialType[MaterialType.News]) { 
            this.type = MaterialType.News;
        } else {
            this.type = MaterialType.Blogs;
        }
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();          
        this.service
            .getAll(this.type)
            .subscribe(data => this.parsePageable(data),
            error => console.log(error));
    }

    private parsePageable(model: MaterialCategory[]): void {
        this.items = model; 
    }

    public delete(index: number): void {
        this.service.delete(this.items[index].id).subscribe(data => data,
            error => console.log(error));//todo add modal
        this.items.splice(index, 1);
    }
}