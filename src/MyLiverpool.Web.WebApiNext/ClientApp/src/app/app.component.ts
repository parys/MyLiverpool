import {
    Component,
    OnInit,
    ViewEncapsulation,
    PLATFORM_ID,
    Inject,
    ViewChild,
    HostListener,
    ChangeDetectionStrategy,
    HostBinding
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { filter, map } from 'rxjs/operators';

import { CustomTitleMetaService as CustomTitleService } from '@shared/index';


@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
    constructor(private router: Router,
                private activatedRoute: ActivatedRoute,
                private titleService: CustomTitleService,
                @Inject(PLATFORM_ID) private platformId: object
    ) {
    }
    public showAd = true;
    public isDesktop = false;

    @HostBinding('@.disabled')
    public animationsDisabled = true;

    @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;

    @HostListener('window:resize', ['$event'])
    public sizeChange(event: any) {
        this.updateGestureState();
    }

    public ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // This starts up the token refresh preocess for the app
            // this.authService.init()
            //     .subscribe(null,
            //         e => console.warn(e)
            //     );
            this.updateGestureState();
        }

        this.initTitleSubscriber();
    }

    public onAdClose(element: any): void {
        this.showAd = false;
        element.srcElement.parentElement.remove();
    }

    private initTitleSubscriber() {
        this.router.events.pipe(
            filter((event: any) => event instanceof NavigationEnd),
            map(() => {
                let child = this.activatedRoute.firstChild;
                this.sidenav.close();
                while (child) {
                    if (child.firstChild) {
                        child = child.firstChild;
                    } else {
                        return child.snapshot.data;
                    }
                }
                return null;
            })).subscribe((data: any) => {
                if (data.title) {
                    this.titleService.setTitle(data.title);
                }
                this.titleService.updateKeywordsMetaTag(data.keywords || '');
                this.titleService.updateDescriptionMetaTag(data.description || '');
                this.titleService.updateTypeMetaTag(data.ogType || 'website');
                this.titleService.updateOgImageMetaTag('https://mylfc.ru/content/logo34.png');
            });
    }

    private updateGestureState(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
        this.isDesktop = window.innerWidth > 767;
    }
}
