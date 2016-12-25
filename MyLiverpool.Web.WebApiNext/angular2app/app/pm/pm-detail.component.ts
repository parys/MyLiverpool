﻿import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Pm } from "./pm.model";
import { PmService } from "./pm.service";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "pm-detail",
    template: require("./pm-detail.component.html")
})

export class PmDetailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    item: Pm;
    roles: IRoles;

    constructor(private pmService: PmService,
        private rolesChecked: RolesCheckedService,
        private route: ActivatedRoute) { }

    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        this.sub = this.route.params.subscribe(params => {
            let id = +params["id"];
            this.pmService.getSingle(id)
                .subscribe(data => this.parse(data),
                error => console.log(error),
                () => {});
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    private parse(item: Pm): void {
        this.item = item;
    }
}