﻿import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormControl, FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { NewsService } from "./news.service";
import { News } from "./news.model";
import { NewsCategoryService } from "../newsCategory/index";
import { RolesCheckedService, IRoles } from "../shared/index";
import { NewsCategory } from "../newsCategory/newsCategory.model";

@Component({
    selector: "news-edit",
    template: require("./news-edit.component.html")
})

export class NewsEditComponent implements OnInit, OnDestroy {
    editForm: FormGroup;
    private sub: Subscription;
    id: number;
    categories: NewsCategory[];
    roles: IRoles;
    item: News = new News();

    constructor(private newsService: NewsService,
        private newsCategoryService: NewsCategoryService,
        private route: ActivatedRoute,
        private router: Router,
        private rolesChecked: RolesCheckedService,
        private formBuilder: FormBuilder) {
    }
                                                             
    ngOnInit() {
        this.roles = this.rolesChecked.checkRoles();
        this.initForm();
        this.sub = this.route.params.subscribe(params => {
            let id = +params["id"];
            if (id > 0) {
                this.newsService.getSingle(id)
                    .subscribe(data => this.parse(data),
                        error => console.log(error),
                        () => {});
            }
        });
        this.newsCategoryService.getAll()
            .subscribe(data => this.parseCategories(data),
            error => console.log(error),
            () => { });

    }

    cli() {
        console.log(this.editForm.value);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    changeMessage(event) {
        console.log(123);
        console.log(event);
    }

    onSubmit() {
        let newsItem = this.parseForm();
        if (this.id > 0) {
            this.newsService.update(this.id, newsItem)
                .subscribe(data => console.log(data.id),//this.router.navigate(["/news", data.id]),
                error => console.log(error),
                    () => {});
        } else {
            this.newsService.create(newsItem)
                .subscribe(data => console.log(data.id),//this.router.navigate(["/news", data.id]),
                error => console.log(error),
                    () => {});
        }
    }

    updateImage(path: string) {
        this.editForm.patchValue({ photo: path });
    }

    private parse(data: News): void {
        this.id = data.id;
        this.editForm.patchValue(data);
        this.item = data;
    }

    private parseForm(): News {
        let item = new News();
        item.id = this.id;
        item.categoryId = this.editForm.controls["categoryId"].value;
        item.title = this.editForm.controls["title"].value;
        item.brief = this.editForm.controls["brief"].value;
        item.message = this.editForm.controls["message"].value;
        item.source = this.editForm.controls["source"].value;
        item.photo = this.editForm.controls["photo"].value;
        item.pending = this.editForm.controls["pending"].value;
        item.canCommentary = this.editForm.controls["canCommentary"].value;
        item.onTop = this.editForm.controls["onTop"].value;

        return item;
    }

    private initForm(): void {
        this.editForm = this.formBuilder.group({
            'categoryId': ["", Validators.compose([
                Validators.required])],
            'title': ["", Validators.compose([
                Validators.required])],
            'brief': ["", Validators.compose([
                Validators.required])],
            'message': ["", Validators.compose([
                Validators.required])],
            'source': ["", Validators.compose([])],
            'photo': ["", Validators.compose([
                Validators.required])],
            'canCommentary': ["true", Validators.compose([
                Validators.required])],
            'onTop': ["false", Validators.compose([
                Validators.required])],
            'pending': ["true", Validators.compose([
                Validators.required])]
        });
    }

    private parseCategories(items: NewsCategory[]) {
        this.categories = items;
    }
}