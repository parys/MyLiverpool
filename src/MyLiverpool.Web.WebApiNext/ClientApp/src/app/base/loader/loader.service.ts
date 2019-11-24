import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from './loaderState.model';

@Injectable()
export class LoaderService {
    private loaderSubject = new Subject<LoaderState>();
    public loaderState = this.loaderSubject.asObservable();

    public show() {
        this.loaderSubject.next({show: true} as LoaderState);
    }
    public hide() {
        this.loaderSubject.next({show: false} as LoaderState);
    }
}
