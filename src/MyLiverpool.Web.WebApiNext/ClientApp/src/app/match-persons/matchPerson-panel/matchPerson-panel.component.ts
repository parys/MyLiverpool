import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RolesCheckedService } from '@base/auth';
import { MatchPerson } from '@domain/models';

import { MatchPersonService } from '@match-persons/match-person.service';
import { SignalRService } from '@base/signalr';
import { ObserverComponent } from '@domain/base';

@Component({
    selector: 'match-person-panel',
    templateUrl: './matchPerson-panel.component.html',
    styleUrls: ['./matchPerson-panel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchPersonPanelComponent extends ObserverComponent implements OnInit {
    @Input() public matchId: number;
    @Input() public isHome: boolean;
    public isEdit = false;
    public selectedMatchPerson: MatchPerson;
    public selectedType: number;

    public persons: Record<number, MatchPerson[]>;
    public currentCount: number;
    public neededCount: number;
    public personTypeId: number;

    constructor(private matchPersonService: MatchPersonService,
                public roles: RolesCheckedService,
                private signalR: SignalRService,
                private cd: ChangeDetectorRef) {
        super();
    }

    public ngOnInit(): void {
        const sub$ = this.matchPersonService.getMatchPersons(this.matchId)
            .subscribe(data => this.persons = data, null, () => this.cd.markForCheck());
        this.subscriptions.push(sub$);

        const sub2$ = this.signalR.matchPerson.subscribe((mp: MatchPerson) => {
            this.updateMatchPerson(mp);
        });
        this.subscriptions.push(sub2$);
    }

    public addMatchPerson(typeId: number = null, currentCount: number = 0, neededCount: number = 0, personTypeId: number = null): void {
        this.isEdit = true;
        this.selectedType = typeId;
        this.currentCount = currentCount;
        this.neededCount = neededCount;
        this.personTypeId = personTypeId;
    }

    public cancelMatchPersonEdit(): void {
        this.selectedMatchPerson = null;
        this.isEdit = false;
     //   this.selectedIndex = null;
        this.selectedType = null;
    }

    public updateMatchPerson(person: MatchPerson) {
        this.persons[person.type].push(person);
        this.cd.markForCheck();
    }

    public onClose() {
        this.cancelMatchPersonEdit();
    }

    public onSelectPerson(person: MatchPerson): void {
        this.selectedMatchPerson = person;
     //   this.selectedIndex = this.matchPersons.indexOf(person);
        this.isEdit = true;
    }

    public trackByFn(index: number, item: MatchPerson) {
        if (!item) { return null; }
        return item.personId;
    }

    private findWithAttr(array: any, attr: string | number, value: any) {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
}
