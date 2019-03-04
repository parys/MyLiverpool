import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { Pm } from "../../model";
import { PmService } from "../../core";
import { Subscription } from "rxjs";
import { EDIT_ROUTE, PMS_ROUTE } from "../../../+constants/routes.constants";

@Component({
    selector: "pm-list",
    templateUrl: "./pm-list.component.html"
})

export class PmListComponent implements OnInit, OnDestroy {
    private sub$: Subscription;
    public received: Pm[];
    public sent: Pm[];

    constructor(private pmService: PmService,
        private router: Router) {
        this.sub$ = this.router.events.subscribe((e: any) => {
            if (e instanceof NavigationEnd) {
                this.init();
            }
        });
    }

    public ngOnInit(): void {
        this.init();
    }

    public ngOnDestroy(): void {
        if(this.sub$) this.sub$.unsubscribe();
    }

    private parse(model: any): void {
        this.received = model.received;
        this.sent = model.sent;
    }

    public delete(index: number): void {
        //this.newsCategoryService.Delete(this.items[index].id).subscribe(data => data,
        //    error => console.log(error),
        //    () => console.log("success remove categoryu"));
        //this.items.splice(index, 1);
    }

    public writePm(): void {           
        this.router.navigate([PMS_ROUTE, 0, EDIT_ROUTE]);  
    }

    private init(): void {
        this.pmService
            .getAll()
            .subscribe(data => this.parse(data));
    }
}