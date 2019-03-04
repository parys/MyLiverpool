import {
    Component, Input, ChangeDetectionStrategy, Inject, PLATFORM_ID, NgZone, AfterContentInit
} from "@angular/core";
import { isPlatformServer } from "@angular/common";
import { Subscription } from "rxjs";

@Component({
    selector: "ad",
    templateUrl: "ad.component.html",
    styleUrls: ["ad.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AdComponent implements AfterContentInit {
    public name: string = null;
    private sub$: Subscription;
    @Input() blockName: string = "";

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private zone: NgZone) { }

    public ngAfterContentInit(): void {
        this.name = `yandex_rtb_${this.blockName}`;
        this.sub$ = this.zone.onStable.subscribe(() => this.load());
    }

    public load() {
        if (isPlatformServer(this.platformId)) return;
        loadYa();
        if (addAd(this.blockName)) {
            this.sub$.unsubscribe();
        }
    }
}