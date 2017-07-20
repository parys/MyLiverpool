import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { PersonService } from "./person.service";
import { Person } from "./person.model";

@Component({
    selector: "person-birthday",
    templateUrl: "./person-birthday.component.html"
})
export class PersonBirthdayComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public items: Person[];
    public currentPersonIndex: number = null;

    constructor(private service: PersonService) {
    }

    public ngOnInit(): void {
        this.sub = this.service.getBirthdays()
            .subscribe(data => this.parse(data),
                error => console.log(error));
    }

    public ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public goToPrevious(): void {
        if (this.currentPersonIndex === 0) {
            this.currentPersonIndex = this.items.length - 1;
        } else {
            this.currentPersonIndex -= 1;
        }
    }

    public goToNext(): void {
        if (this.items.length === this.currentPersonIndex + 1) {
            this.currentPersonIndex = 0;
        } else {
            this.currentPersonIndex += 1;
        }
    }

    private parse(list: Person[]): void {
        this.items = list;
        if (list.length > 0) {
            this.setRandomIndex();
        }
    }

    private setRandomIndex(): void {
        const rand: number = Math.random() * (this.items.length + 1) - 0.5;
        const intNumber: number = Math.round(rand);
        this.currentPersonIndex = intNumber === this.items.length ? intNumber - 1 : intNumber;
    }
}