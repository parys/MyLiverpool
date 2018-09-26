import { Component, OnInit } from "@angular/core";
import { SeasonService } from "../../core";
import { Season } from "../../model";

@Component({
    selector: "season-list",
    templateUrl: "./season-list.component.html"
})
export class SeasonListComponent implements OnInit {
    public seasons: Season[];

    constructor(private service: SeasonService) {
    }

    public ngOnInit(): void {     
        this.service.getAllWithoutFilter().subscribe(data => this.seasons = data,
            e => console.log(e));
    }

    public setAsCurrent(index: number): void {
        this.service.setAsCurrent(this.seasons[index].id)
            .subscribe(data => data, e => console.log(e));
    }
}