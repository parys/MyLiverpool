import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Subscription } from "rxjs";
import { PersonService } from "../person.service";
import { Person } from "@app/person/model";

@Component({
    selector: "person-birthday",
    templateUrl: "./person-birthday.component.html",
    styleUrls: ["./person-birthday.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonBirthdayComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public items: Person[];
    public currentPersonIndex: number = null;

    constructor(private service: PersonService,
        private cd: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        this.sub = this.service.getBirthdays()
            .subscribe(data => this.parse(data),
            e => console.log(e),
            () => {
                this.cd.markForCheck();
            });
    }

    public ngOnDestroy(): void {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }

    public goToPrevious(): void {
        if (this.currentPersonIndex === 0) {
            this.currentPersonIndex = this.items.length - 1;
            this.cd.markForCheck();
        } else {
            this.currentPersonIndex -= 1;
            this.cd.markForCheck();
        }
    }

    public goToNext(): void {
        if (this.items.length === this.currentPersonIndex + 1) {
            this.currentPersonIndex = 0;
            this.cd.markForCheck();
        } else {
            this.currentPersonIndex += 1;
            this.cd.markForCheck();
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