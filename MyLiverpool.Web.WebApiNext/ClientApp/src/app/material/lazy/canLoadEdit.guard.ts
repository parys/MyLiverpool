import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
    CanLoad,
    Route,
    UrlSegment
} from "@angular/router";
import { LazyLoadingLibraryService } from "@app/editor/lazyLoadingLibrary.service";

@Injectable()
export class CanLoadEditMaterial implements CanLoad {
    constructor(private lazyLoadService: LazyLoadingLibraryService) {}

    canLoad(route: Route, segments: UrlSegment[])
        : Observable<boolean> | Promise<boolean> | boolean {
        return this.lazyLoadService.loadJs("./scripts.js");
    }
}
