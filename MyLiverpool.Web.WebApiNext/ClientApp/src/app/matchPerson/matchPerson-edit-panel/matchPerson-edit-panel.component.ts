import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Observable, of } from "rxjs";
import { debounceTime, distinctUntilChanged, switchMap } from "rxjs/operators";
import { MatchPerson } from "../matchPerson.model";
import { MatchPersonType } from "../matchPersonType.model";
import { PersonService, Person, PersonFilters } from "@app/person";
import { MatchPersonService } from "../matchPerson.service";
import { DEBOUNCE_TIME } from "@app/+constants";
import { Pageable } from "@app/shared";

@Component({
    selector: "matchPerson-edit-panel",
    templateUrl: "./matchPerson-edit-panel.component.html"
})

export class MatchPersonEditPanelComponent implements OnInit, AfterViewInit {
    public isEdit: boolean = false;
    public isCreation: boolean = false;
    @Input() public matchId: number;
    @Input() public selectedMatchPerson: MatchPerson;
    @Input() public typeId: number;
    @Input() public currentCount: number;
    @Input() public neededCount: number;
    @Input() public personTypeId: number;
    @Output() public matchPerson = new EventEmitter<MatchPerson>();
    @Output() public exit = new EventEmitter();
    public editMatchPersonForm: FormGroup;
    public persons$: Observable<Person[]>;
    @ViewChild("mpInput") private elementRef: ElementRef;

    public types: MatchPersonType[];

    constructor(private matchPersonService: MatchPersonService,
        private personService: PersonService,
        private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();

        this.matchPersonService.getTypes()
            .subscribe(data => this.types = data);
    }

    public ngAfterViewInit(): void {
        this.focus();
    }

  public enumSelector(definition : any) {
    return Object.keys(definition)
      .map(key => (new MatchPersonType(+key, definition[key])));
  }

    public onSubmit(): void {
        const matchPerson: MatchPerson = this.parseForm();
        if (this.isEdit) {
            this.matchPersonService.update(matchPerson)
                .subscribe(data => this.emitNewPerson(data),
                () => { },
                () => this.checkExit());
        } else {
            this.matchPersonService.create(matchPerson)
                .subscribe(data => this.emitNewPerson(data),
                    () => { },
                    () => this.checkExit());
        }
        this.editMatchPersonForm.get("personId").patchValue("");
        this.editMatchPersonForm.get("personName").patchValue("");
    }

    public setPerson(person: Person): void {
        this.editMatchPersonForm.get("personId").patchValue(person.id);
        this.editMatchPersonForm.get("personName").patchValue(person.russianName);
        this.focus();
    } 

    public selectPerson(id: number) : void {
        this.editMatchPersonForm.get("personId").patchValue(id);
    }

    private emitNewPerson(matchPerson: MatchPerson): void {
        this.matchPerson.emit(matchPerson);
        this.selectedMatchPerson = null;
    }
    
    private parseForm(): MatchPerson {
        const item: MatchPerson = this.editMatchPersonForm.value;
        item.matchId = this.matchId;
        return item;
    }

    private focus(): void {
        this.elementRef.nativeElement.focus();
    }

    private checkExit(): void {
        this.currentCount++;
        if (this.currentCount === this.neededCount && this.neededCount !== 0) {
            this.matchPerson.emit(null);
        }
    }

    private initForm(): void {
        this.editMatchPersonForm = this.formBuilder.group({
            personName: [this.selectedMatchPerson ? this.selectedMatchPerson.personName : "", Validators.required],
            personId: [this.selectedMatchPerson ? this.selectedMatchPerson.personId : "", Validators.required],
            personType: [this.selectedMatchPerson ? this.selectedMatchPerson.personType : this.typeId, Validators.required]
        });
        this.isEdit = this.selectedMatchPerson !== undefined;

        this.persons$ = this.editMatchPersonForm.controls["personName"].valueChanges.pipe(
            debounceTime(DEBOUNCE_TIME),
            distinctUntilChanged(),
            switchMap((value: string) => {
                const filter = new PersonFilters();
                filter.name = value;
                filter.type = this.personTypeId;
                return this.personService.getAll(filter);
            }),
            switchMap((pagingClubs: Pageable<Person>): Observable<Person[]> => {
                return of(pagingClubs.list);
            }));
    }
}