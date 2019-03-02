import { Injectable, Inject } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";
import { DOCUMENT } from "@angular/common";

//todo maybe for serverside need to workaround
@Injectable()
export class LazyLoadingLibraryService {
    private loadedLibraries: { [url: string]: ReplaySubject<boolean> } = {};

    constructor( @Inject(DOCUMENT) private readonly document: any) { }

    public loadJs(url: string): Observable<any> {
        if (this.loadedLibraries[url]) {
            return this.loadedLibraries[url].asObservable();
        }
        
        this.loadedLibraries[url] = new ReplaySubject();
        if (this.getTinymce()) {
      //      console.warn("!!! SCRIPT ALREADY LOADED !!!");
            this.loadedLibraries[url].next(true);
            this.loadedLibraries[url].complete();
            return this.loadedLibraries[url].asObservable();
        }
        const script = this.document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onload = () => {
     //       console.warn("!!! SCRIPT LOADED !!!");
            this.loadedLibraries[url].next(true);
            this.loadedLibraries[url].complete();
        };

        this.document.body.appendChild(script);
        return this.loadedLibraries[url].asObservable();
    }

    public getTinymce = () => {
        const w = typeof window !== 'undefined' ? (window as any) : undefined;
        return w && w.tinymce ? w.tinymce : null;
    };
}