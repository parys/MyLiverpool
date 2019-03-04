import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from "../account.service";
import { USER_ID } from "@app/+constants";

@Component({
    selector: "email-confirmation",
    templateUrl: "./confirmEmail.component.html"
})

export class ConfirmEmailComponent implements OnInit, OnDestroy {
    private sub: Subscription;

    constructor(private accountService: AccountService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(params => {
            const id = +params[USER_ID];
            const code = params["code"];
            this.accountService.confirmEmail(id, code)
                .subscribe((data: boolean) => {
                    if (data) {
                        this.router.navigate(["/"]);
                    }
                });
        });
    }

    public ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}