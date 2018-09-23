import { Component, OnInit, Input } from "@angular/core";
import { MatDialog, MatSnackBar } from "@angular/material";
import { DeleteDialogComponent } from "@app/shared";
import { RolesCheckedService } from "@app/+auth";
import { MatchPersonService } from "../matchPerson.service";
import { MatchPerson } from "../matchPerson.model";

@Component({
    selector: "matchPerson-panel",
    templateUrl: "./matchPerson-panel.component.html",
    styleUrls: ["./matchPerson-panel.component.scss"]
})
export class MatchPersonPanelComponent implements OnInit {
    private matchPersons: MatchPerson[] = [];
    @Input() public matchId: number;
    @Input() public isHome: boolean;
    public isEdit: boolean = false;
    public selectedMatchPerson: MatchPerson;
    public selectedIndex: number;
    public selectedType: number;
    public homeTeam: MatchPerson[] = [];
    public homeBench: MatchPerson[] = [];
    public homeCoach: MatchPerson;
    public homeInjury: MatchPerson[] = [];
    public homeBan: MatchPerson[] = [];
    public awayTeam: MatchPerson[] = [];
    public awayBench: MatchPerson[] = [];
    public awayCoach: MatchPerson;
    public awayInjury: MatchPerson[] = [];
    public awayBan: MatchPerson[] = [];
    public mainRef: MatchPerson;
    public assistantRef: MatchPerson[] = [];
    public additionalRef: MatchPerson[] = [];
    public fourthRef: MatchPerson;

    constructor(private matchPersonService: MatchPersonService,
        public roles: RolesCheckedService,
        private snackBar: MatSnackBar,
        private dialog: MatDialog) {
    }

    public ngOnInit(): void {
        this.matchPersonService.getForMatch(this.matchId)
            .subscribe(data => this.parsePersons(data),
            e => console.log(e));
    }

    public addMatchPerson(typeId: number = null): void {
        this.isEdit = true;
        this.selectedType = typeId;
    }

    public cancelMatchPersonEdit(stayEdit: boolean = false): void {
        this.selectedMatchPerson = null;
        this.isEdit = stayEdit;
        this.selectedIndex = null;
        this.selectedType = null;
    }

  public updateMatchPerson(person: MatchPerson) {
    console.log(person);
        if (this.selectedIndex) {
            this.matchPersons[this.selectedIndex] = person;
            this.selectedMatchPerson = person;
        } else {
            this.matchPersons.push(person);
        }

        this.cancelMatchPersonEdit(true);
        this.parsePersons(this.matchPersons);
    }

    public selectMatchPerson(person: MatchPerson): void {
        this.selectedMatchPerson = person;
        this.selectedIndex = this.matchPersons.indexOf(person);
        this.isEdit = true;
    }

    public showDeleteModal(person: MatchPerson): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(person);
            }
        }, e => console.log(e));
    }


    private delete(person: MatchPerson): void {
        let result: boolean;
        this.matchPersonService.delete(this.matchId, person.personId)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.matchPersons.splice(this.matchPersons.indexOf(person), 1);
                        this.parsePersons(this.matchPersons);
                        this.snackBar.open("Удалено");
                    } else {
                        this.snackBar.open("Ошибка удаления");
                    }
                }
            );
    }

    private parsePersons(persons: MatchPerson[]): void {
        this.homeCoach = persons.filter(x => x.personType === (this.isHome ? 5 : 6))[0];
        this.awayCoach = persons.filter(x => x.personType === (this.isHome ? 6 : 5))[0];
        this.homeTeam = persons.filter(x => x.personType === (this.isHome ? 1 : 3));
        this.awayTeam = persons.filter(x => x.personType === (this.isHome ? 3 : 1));
        this.homeBench = persons.filter(x => x.personType === (this.isHome ? 2 : 4));
        this.awayBench = persons.filter(x => x.personType === (this.isHome ? 4 : 2));
        this.homeBan = persons.filter(x => x.personType === (this.isHome ? 12 : 14));
        this.awayBan = persons.filter(x => x.personType === (this.isHome ? 14 : 12));
        this.homeInjury = persons.filter(x => x.personType === (this.isHome ? 11 : 13));
        this.awayInjury = persons.filter(x => x.personType === (this.isHome ? 13 : 11));
        this.mainRef = persons.filter(x => x.personType === 7)[0];
        this.assistantRef = persons.filter(x => x.personType === 8);
        this.additionalRef = persons.filter(x => x.personType === 10);
        this.fourthRef = persons.filter(x => x.personType === 9)[0];

        this.matchPersons = persons;
    }
}