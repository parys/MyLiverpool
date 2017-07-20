import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { SquadList } from "./squad-list.model";
import { PersonService } from "./person.service";
import { PersonType } from "./personType.enum";
import { RolesCheckedService, IRoles } from "../shared/index";

@Component({
    selector: "<squad>",
    templateUrl: "./squad.component.html"
})
export class SquadComponent {
    private sub: Subscription;
    public item: SquadList;
    public roles: IRoles;
    public routeLinks: any[];
    public activeLinkIndex: number = 0;

    constructor(private personService: PersonService,
        private route: ActivatedRoute,
        private rolesChecked: RolesCheckedService) {

    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
        this.routeLinks = [
            { label: "Первая команда", link: "/squad/first" },
            { label: "Академия", link: "/squad/academy" }];
        if (this.route.snapshot.data["type"] === PersonType[PersonType.First]) {
            this.activeLinkIndex = 0;
        } else {
            this.activeLinkIndex = 1;
        }
        this.updateState(PersonType[this.activeLinkIndex].toString());
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    public updateState(type: string): void {
        this.sub = this.personService.getSquad(type).subscribe(data => this.item = data,
            e => console.log(e));
    }
}