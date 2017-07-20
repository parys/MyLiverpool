import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { UserService } from "./user.service";
import { User } from "./user.model";

@Component({
    selector: "user-birthday",
    templateUrl: "./user-birthday.component.html"
})
export class UserBirthdayComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public items: User[];
    public currentUserIndex: number = null;

    constructor(private service: UserService) {
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
        if (this.currentUserIndex === 0) {
            this.currentUserIndex = this.items.length - 1;
        } else {
            this.currentUserIndex -= 1;
        }
    }

    public goToNext(): void {
        if (this.items.length === this.currentUserIndex + 1) {
            this.currentUserIndex = 0;
        } else {
            this.currentUserIndex += 1;
        }
    }

    private parse(list: User[]): void {
        this.items = list;
        if (list.length > 0) {
            this.setRandomIndex();
        }
    }

    private setRandomIndex(): void {
        const rand: number = Math.random() * (this.items.length + 1) - 0.5;
        const intNumber = Math.round(rand);
        this.currentUserIndex = intNumber === this.items.length ? intNumber - 1 : intNumber;
    }
}