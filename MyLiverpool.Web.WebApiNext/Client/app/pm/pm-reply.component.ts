import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Pm } from "./pm.model";
import { PmService } from "./pm.service";

@Component({
    selector: "pm-reply",
    templateUrl: "./pm-reply.component.html"
})
export class PmReplyComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public pmReplyEditForm: FormGroup;
    id: number = 0;
    @Input() public userName: string;
    @Input() public userId: number;
    @Input() public title: string;
    @Output() public close = new EventEmitter();

    constructor(private service: PmService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router) {
    }

    public ngOnInit(): void {
        this.pmReplyEditForm = this.formBuilder.group({
            'title': [
                this.getTitle(), Validators.compose([
                    Validators.required,
                    Validators.maxLength(50)
                ])
            ],
            'message': [
                "", Validators.compose([
                    Validators.required,
                    Validators.maxLength(2500)
                ])
            ]
        });

        //this.sub = this.route.params.subscribe(params => {
        //this.id = +params["id"];
        //if (this.id > 0) {
        //    this.service
        //        .GetSingle(this.id)
        //        .subscribe(data => this.editForm.patchValue(data),
        //        error => console.log(error),
        //        () => console.log("success get  news"));
        //}
        //});
        //this.getUsername();
    }

    public ngOnDestroy(): void {
        //  this.sub.unsubscribe();
    }

    public onSubmit(): void {
        const model: Pm = this.pmReplyEditForm.value;
        model.receiverId = this.userId;

        this.sub = this.service.create(model).subscribe(data => {
                if (data) {
                    this.closeWindow();
                }
            },
            error => console.log(error),
            () => {
            });
    }

    public closeWindow(): void {
        this.close.emit({});
    }

    private getTitle(): string {
        if (!this.title) {
            return "";
        }
        const match = this.title.match(/\[.*]/);
        if (match) {
            let newValue = parseInt(match[0].substring(1, match[0].length - 1));
            return this.title.replace(/\[.*]/, `[${++newValue}]`);
        } else {
            return `Re[1]: ${this.title}`;
        }
    }
}