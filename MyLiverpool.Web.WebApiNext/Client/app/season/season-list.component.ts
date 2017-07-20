import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { SeasonService } from "./season.service";
import { Season } from "./season.model";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "<season-list>",
    templateUrl: "./season-list.component.html"
})
export class SeasonListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public roles: IRoles;
    public seasons: Season[];

    constructor(private service: SeasonService,
    private rolesChecked: RolesCheckedService) {
        
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();        
        this.sub = this.service.getAll().subscribe(data => this.seasons = data,
            error => console.log(error));
    }

    public ngOnDestroy(): void {
        if(this.sub) { this.sub.unsubscribe(); }
    }
}