import { Component, OnInit, OnDestroy } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { Image } from "./image.model";
import { ImageService } from "./image.service";

@Component({
    selector: "image-list",
    templateUrl: "./image-list.component.html"
})

export class ImageListComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    items: Image[];
    selectedItem: Image;
    defaultPath: string = "content\\images";
    path: string = this.defaultPath;

    constructor(private service: ImageService, private location: Location, private route: ActivatedRoute) {
    }

    ngOnInit() {
        this.sub = this.route.queryParams.subscribe(params => {
            if (params["path"]) {
                this.path = params["path"];
            }
        this.updateFolder(this.path);
        });
    }

    ngOnDestroy() {
       // this.sub.unsubscribe();
    }

    showDetails(file: Image): void {
        this.selectedItem = file;
    }

    removeSelection(): void {
        this.selectedItem = null;
    }

    goUp(): void {
        this.path = this.path.substring(0, this.path.lastIndexOf("\\"));
        this.updateFolder(this.path);
    }

    updateFolder(path: string) : void {
        this.service
            .get(path)
            .subscribe(data => this.items = data,
            error => console.log(error),
            () => { });

        this.path = path;
        let newUrl = `images?path=${path}`;
        this.location.replaceState(newUrl);
    }
}