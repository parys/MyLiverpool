import { Component } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { PersonService } from "@app/person/core";
import { SquadList, PersonTypeEnum } from "@app/person/model";
import { RolesCheckedService } from "@app/+auth";

@Component({
    selector: "squad",
    templateUrl: "./squad.component.html"
})
export class SquadComponent {
    private sub: Subscription;
    public item: SquadList;
    public routeLinks: any[];
    public activeLinkIndex: number = 0;

    constructor(private personService: PersonService,
        private route: ActivatedRoute,
        private location: Location,
        public roles: RolesCheckedService) {
    }

    public ngOnInit(): void {
        this.routeLinks = [
            { label: "Первая команда", link: "/persons/squad/first" },
            { label: "Академия", link: "/persons/squad/academy" },
            { label: "В аренде", link: "/persons/squad/loan" }];
        if (this.route.snapshot.data["type"] === PersonTypeEnum[PersonTypeEnum.First]) {
            this.activeLinkIndex = 0;
        } else if (this.route.snapshot.data["type"] === PersonTypeEnum[PersonTypeEnum.Academy]) {
            this.activeLinkIndex = 1;
        } else {
            this.activeLinkIndex = 2;
        }
        this.updateState();
    }

    public ngOnDestroy(): void {
        if (this.sub) { this.sub.unsubscribe(); }
    }

    public updateState(): void {
        const type = PersonTypeEnum[this.activeLinkIndex].toString();
        this.sub = this.personService.getSquad(type).subscribe(data => this.item = data,
            e => console.log(e));
    }

    public changeTab(index: any): void {
        this.activeLinkIndex = index;
        this.updateState();
        this.location.go(this.routeLinks[this.activeLinkIndex].link);
    }
}