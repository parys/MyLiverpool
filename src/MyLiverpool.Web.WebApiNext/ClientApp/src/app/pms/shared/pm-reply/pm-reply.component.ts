import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Pm } from '@domain/models';
import { PmService } from '@pms/pm.service';
import { EditorComponent } from '@editor/index';

@Component({
    selector: 'pm-reply',
    templateUrl: './pm-reply.component.html'
})
export class PmReplyComponent implements OnInit, AfterViewInit {
    public pmReplyForm: FormGroup;
    public id = 0;
    @Input() public userName: string;
    @Input() public userId: number;
    @Input() public title: string;
    @Output() public close = new EventEmitter();
    @ViewChild('mpInput')private elementRef: EditorComponent;

    constructor(private service: PmService,
                private snackBar: MatSnackBar,
                private cd: ChangeDetectorRef,
                private formBuilder: FormBuilder) {
    }

    public ngOnInit(): void {
        this.pmReplyForm = this.formBuilder.group({
            title: [
                this.getTitle(), Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ],
            message: [
                '', Validators.compose([
                    Validators.required,
                    Validators.maxLength(2500)
                ])
            ]
        });
        this.pmReplyForm.valueChanges.subscribe(() => {
            this.cd.detectChanges();
        });
    }

    public onSubmit(): void {
        const model: Pm = this.pmReplyForm.value;
        model.receiverId = this.userId;

        this.service.create(model).subscribe(data => {
                if (data) {
                    this.closeWindow();
                    this.snackBar.open('Сообщение отправлено');
                }
            });
    }

    public closeWindow(): void {
        this.close.emit({});
    }

    public ngAfterViewInit(): void {
        this.elementRef.setFocus();
    }

    private getTitle(): string {
        if (!this.title) {
            return '';
        }
        const match = this.title.match(/\[.*]/);
        if (match) {
            let newValue = parseInt(match[0].substring(1, match[0].length - 1), 10);
            return this.title.replace(/\[.*]/, `[${++newValue}]`);
        } else {
            return `Re[1]: ${this.title}`;
        }
    }
}
