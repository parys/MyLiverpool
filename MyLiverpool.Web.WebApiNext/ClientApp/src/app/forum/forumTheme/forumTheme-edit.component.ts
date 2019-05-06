import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ForumTheme } from './forumTheme.model';
import { ForumSubsectionService, ForumSubsection } from '../forumSubsection';
import { ForumThemeService } from './forumTheme.service';

@Component({
    selector: 'forumTheme-edit',
    templateUrl: './forumTheme-edit.component.html'
})
export class ForumThemeEditComponent implements OnInit, OnDestroy {
    editForm: FormGroup;
    id = 0;
    private sub: Subscription;
    forumSubsections: ForumSubsection[];

    constructor(private service: ForumThemeService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private subsectionService: ForumSubsectionService) {
    }

    ngOnInit(): void {
        this.editForm = this.formBuilder.group({
            subsectionId: ['', Validators.required],
            name: ['', Validators.required],
            description: ['', Validators.required]
        });
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            if (this.id > 0) {
                this.service
                    .getSingle(this.id)
                    .subscribe(data => this.editForm.patchValue(data),
                    error => console.log(error));
            }
        });
        this.subsectionService.getAll()
            .subscribe(data => this.forumSubsections = data,
            error => console.log(error),
            () => { });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

    onSubmit(): void {
        const model = new ForumTheme();
        model.id = this.id;
        model.subsectionId = this.editForm.controls['subsectionId'].value;
        model.name = this.editForm.controls['name'].value;
        model.description = this.editForm.controls['description'].value;

        let res: any;
        if (this.id > 0) {
            const result = this.service.update(this.id, model).subscribe(data => res = data);
        } else {
            const result = this.service.create(model).subscribe(data => res = data);
        }
        if (res !== null) {

        }
    }
}
