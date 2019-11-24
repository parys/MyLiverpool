import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { LoaderService } from './loader.service';
import { LoaderState } from './loaderState.model';
@Component({
    selector: 'http-loader',
    templateUrl: 'loader.component.html',
    styleUrls: ['loader.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements OnInit {
    public show = false;
    constructor(
        private cd: ChangeDetectorRef,
        private loaderService: LoaderService
    ) { }

    public ngOnInit() {
        this.loaderService.loaderState
            .subscribe((state: LoaderState) => {
                this.show = state.show;
                this.cd.markForCheck();
            });
    }
}
