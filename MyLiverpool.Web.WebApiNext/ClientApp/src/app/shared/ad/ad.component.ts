import { Component, Input, OnInit, ChangeDetectionStrategy, Inject, PLATFORM_ID, NgZone } from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
    selector: "ad",
    templateUrl: "ad.component.html",
    styleUrls: ["ad.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdComponent implements OnInit {
    public name: string = null;
    private sub$: Subscription;
    @Input() blockName: string = "";

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zone: NgZone) { }

    ngOnInit(): void {
        this.name = `yandex_rtb_${this.blockName}`;
        this.sub$ = this.zone.onStable.subscribe(() => this.ololo());
    }

    public ololo() {
        if (isPlatformServer(this.platformId)) return;
        loadYa();
        console.log(`yandex_rtb_${ this.blockName}`);
        if (addAd(this.blockName)) {
            this.sub$.unsubscribe();
        }
    }
}