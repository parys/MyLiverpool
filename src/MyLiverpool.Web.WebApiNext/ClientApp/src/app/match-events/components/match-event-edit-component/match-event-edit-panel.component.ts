import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { MatchEventService } from '@match-events/matchEvent.service';
import { MatchEvent, MatchEventType } from '@domain/models';

@Component({
    selector: 'match-event-edit-panel',
    templateUrl: './match-event-edit-panel.component.html',
})

export class MatchEventEditPanelComponent implements OnInit {
    public id = 0;
    @Input() public matchId: number;
    @Input() public seasonId: number;
    @Input() public selectedEvent: MatchEvent;
    @Input() public isOur: boolean;
    @Output() public matchEvent = new EventEmitter<MatchEvent>();
    public editMatchEventForm: FormGroup;

    public types: MatchEventType[];

    constructor(private matchEventService: MatchEventService,
                private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.initForm();

        this.matchEventService.getTypes()
            .subscribe(data => this.types = data);
    }

    public onSubmit(): void {
        const matchEvent: MatchEvent = this.parseForm();
        if (this.id > 0) {
            this.matchEventService.update(this.id, matchEvent)
                .subscribe(data => this.emitNewEvent(matchEvent));
        } else {
            this.matchEventService.create(matchEvent)
                .subscribe((data: number) => {
                    matchEvent.id = data;
                    this.emitNewEvent(matchEvent);
                });
        }
    }

    public selectPerson(id: number) {
        this.editMatchEventForm.controls.personId.patchValue(id);
    }

    private emitNewEvent(event: MatchEvent): void {
        event.personName = this.editMatchEventForm.get('personName').value;
        this.matchEvent.emit(event);
    }

    private parseForm(): MatchEvent {
        const item: MatchEvent = this.editMatchEventForm.value;
        item.id = this.id;
        item.matchId = this.matchId;
        item.seasonId = this.seasonId;
        return item;
    }

    private initForm(): void {
        this.editMatchEventForm = this.formBuilder.group({
            personName: [this.selectedEvent ? this.selectedEvent.personName : ''],
            personId: [this.selectedEvent ? this.selectedEvent.personId : '', Validators.required],
            type: [this.selectedEvent ? this.selectedEvent.type : '', Validators.required],
            minute: [this.selectedEvent ? this.selectedEvent.minute : '', Validators.required],
            isOur: [this.selectedEvent ? this.selectedEvent.isOur : this.isOur]
        });
        this.id = this.selectedEvent ? this.selectedEvent.id : 0;
    }
}
