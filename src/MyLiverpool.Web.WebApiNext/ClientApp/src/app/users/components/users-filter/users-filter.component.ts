import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { merge, fromEvent } from 'rxjs';
import { KEYUP } from '@constants/help.constants';
import { DEBOUNCE_TIME } from '@constants/app.constants';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { UserFilters } from '@domain/models';


@Component({
    selector: 'users-filter',
    templateUrl: './users-filter.component.html',
    styleUrls: ['./users-filter.component.scss']
})

export class UsersFilterComponent implements AfterViewInit {

    @Input() isAdminAssistant: boolean;

    @Input() roleGroups: boolean;

    @Output() filterChange: EventEmitter<UserFilters> = new EventEmitter<UserFilters>();

    @ViewChild('roleSelect') roleSelect: MatSelect;
    @ViewChild('userInput') userInput: ElementRef;
    @ViewChild('ipInput') ipInput: ElementRef;

    public ngAfterViewInit(): void {

        merge(this.roleSelect.selectionChange,
            fromEvent(this.userInput.nativeElement, KEYUP),
            fromEvent(this.ipInput.nativeElement, KEYUP)
                .pipe(debounceTime(DEBOUNCE_TIME), distinctUntilChanged()))
            .subscribe((data: any) => {
                const filters = new UserFilters();
                filters.roleGroupId = this.roleSelect.value;
                filters.userName = this.userInput.nativeElement.value;
                filters.ip = this.ipInput.nativeElement.value;
                this.filterChange.emit(filters);
            });
    }
}
