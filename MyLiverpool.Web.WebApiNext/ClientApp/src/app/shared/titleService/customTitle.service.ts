import { Injectable } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { TITLE_RU } from "../../+constants/ru.constants";

@Injectable({providedIn: "root"})
export class CustomTitleService {
    private count: number = 0;
    private title: string = TITLE_RU;
    constructor(private titleService: Title) {
 //       console.log("t c");
    }

    public addCount(newCount: number): void {
   //     console.log("t a");
        this.count += newCount;
        this.updateTitle();
    }

    public removeCount(newCount: number): void {
 //       console.log("t r");
        this.count -= newCount;
        this.updateTitle();
    }

    public setTitle(newTitle: string): void {
 //       console.log("t s");
        this.title = newTitle;
        this.updateTitle();
    }

    private updateTitle(): void {
  //      console.log("t u");
        if (this.count !== 0) {
            this.titleService.setTitle(`(${this.count}) ${this.title}`);
        } else {
            this.titleService.setTitle(this.title);
        }
    }
}
