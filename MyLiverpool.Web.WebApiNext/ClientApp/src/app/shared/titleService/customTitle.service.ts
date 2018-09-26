import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TITLE_RU } from "../../+constants/ru.constants";

@Injectable({providedIn: "root"})
export class CustomTitleService {
    private count: number = 0;
    private title: string = TITLE_RU;
    constructor(private titleService: Title) {
    }

    public addCount(newCount: number): void {
        this.count += newCount;
        this.updateTitle();
    }

    public removeCount(newCount: number): void {
        this.count -= newCount;
        this.updateTitle();
    }

    public setTitle(newTitle: string): void {
        this.title = newTitle;
        this.updateTitle();
    }

    private updateTitle(): void {
        if (this.count !== 0) {
            this.titleService.setTitle(`(${this.count}) ${this.title}`);
        } else {
            this.titleService.setTitle(this.title);
        }
    }
}
