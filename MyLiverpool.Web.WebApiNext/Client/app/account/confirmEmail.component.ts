import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { Router, ActivatedRoute } from "@angular/router";
import { AccountService } from "./account.service";

@Component({
    selector: "email-confirmation",
    template: "<span [hidden]='!result'>Ваш адрес электронной почты успешно подтвержден. Можете войти и быть как дома.</span>"
})

export class ConfirmEmailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    result: boolean = false;

    constructor(private accountService: AccountService, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit(): void {
        this.sub = this.route.queryParams.subscribe(params => {
            let id = +params["userId"];
            let code = params["code"];
            this.accountService.confirmEmail(id, code)
                .subscribe(data => this.result = data,
                error => console.log(error),
                () => {
                    if (this.result) {
                        // this.router.navigate(["/news"]);
                    }
                });
        });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}