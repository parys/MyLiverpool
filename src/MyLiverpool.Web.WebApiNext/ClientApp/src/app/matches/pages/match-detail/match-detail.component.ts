import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { BehaviorSubject, Subscription, interval } from 'rxjs';
import { map } from 'rxjs/operators';

import { Match, MatchEvent, MatchEventType } from '@domain/models';
import { RolesCheckedService } from '@base/auth';
import { CustomTitleMetaService } from '@shared/index';

import { MatchService } from '@matches/match.service';
import { SignalRService } from '@base/signalr';

@Component({
    selector: 'match-detail',
    templateUrl: './match-detail.component.html',
    styleUrls: ['./match-detail.component.scss']
})
export class MatchDetailComponent implements OnInit, OnDestroy {
    private sub$: Subscription;
    private sub2: Subscription;
    public item: Match;
    public countDown$: BehaviorSubject<string>;

    constructor(private router: Router,
                private matchService: MatchService,
                public roles: RolesCheckedService,
                private title: CustomTitleMetaService,
                @Inject(PLATFORM_ID) private platformId: object,
                private signalR: SignalRService,
                private route: ActivatedRoute) {
        this.sub2 = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.init();
            }
        });
    }

    public ngOnInit(): void {
        this.init();
    }

    public ngOnDestroy(): void {
        if (this.sub$) { this.sub$.unsubscribe(); }
        if (this.sub2) { this.sub2.unsubscribe(); }
    }

    public pin(id?: number): void {
        this.matchService.pin(id).subscribe((data: boolean) => data);
    }

    private init(): void {
        const id = this.route.snapshot.params.id;
        if (id) {
            this.matchService.getSingle(id)
                .subscribe((data: Match) => {
                    this.item = data;
                    const title = `${this.item.homeClubName} ${this.item.scoreHome
                        ? this.item.scoreHome + '-' + this.item.scoreAway
                        : '-'} ${this.item.awayClubName}`;
                    this.title.setTitle(title);
                    this.title.updateDescriptionMetaTag(
                        `${title}. Результат матча Ливерпуля. Составы команд. События матча. Обсуждение матча.`);
                    this.title.updateKeywordsMetaTag(
                        `${title}, ${data.awayClubName}, ${data.homeClubName}, ${data.typeName}, ${data.stadiumName
                        }, составы команд, события`
                    );
                    if (isPlatformBrowser(this.platformId)) {
                        if (!data.scoreHome) {
                            this.countDown$ =
                                new BehaviorSubject<string>(this.updateTimeRemaining(this.item.dateTime));
                            this.sub$ = interval(1000).pipe(
                                    map(() => this.countDown$.next(this.updateTimeRemaining(this.item.dateTime)))
                                )
                                .subscribe();
                        }
                    }
                    this.signalR.matchEvent.subscribe((me: MatchEvent) => {
                        if (me.matchId !== id) {
                            return;
                        }
                        if (me.type === 1
                            || me.type === 2
                            || me.type === 4  ) {

                            }
                    });
                });
        }
    }

    private updateTimeRemaining(endtime: Date): string {
        const t = Date.parse(endtime.toString()) - Date.parse(new Date().toString());
        const seconds = Math.floor((t / 1000) % 60);
        const minutes = Math.floor((t / 1000 / 60) % 60);
        const hours = Math.floor((t / (1000 * 60 * 60)) % 24);
        const days = Math.floor(t / (1000 * 60 * 60 * 24));
        if (t < 0 && this.sub$) {
            this.sub$.unsubscribe();
            return 'Матч начался!';
        }
        return `${days}д:${hours}ч:${minutes}м:${seconds}с`;
    }
}
