// import { ElementRef, EventEmitter, Output, AfterViewInit, Directive } from '@angular/core';
// @Directive({
//    selector: "[deferLoad]"
// })
// export class DeferLoadDirective implements  AfterViewInit {
//    @Output() public deferLoad: EventEmitter<any> = new EventEmitter();

//    private _intersectionObserver?: IntersectionObserver;

//    constructor(
//        private _element: ElementRef
//    ) { }

//    public ngAfterViewInit() {
//       // if (!("IntersectionObserver" in window)) {
//            this.deferLoad.emit();
//            return;
//     //   }
//   //     this._intersectionObserver = new IntersectionObserver(entries => {
//   //         this.checkForIntersection(entries);
//   //     }, {});
//   //     this._intersectionObserver.observe(<Element>(this._element.nativeElement));
//    }

//    private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
//        entries.forEach((entry: IntersectionObserverEntry) => {
//            if (this.checkIfIntersecting(entry)) {
//                this.deferLoad.emit();
//                this._intersectionObserver.unobserve(<Element>(this._element.nativeElement));
//                this._intersectionObserver.disconnect();
//            }
//        });
//    }

//    private checkIfIntersecting(entry: IntersectionObserverEntry) {
//        return entry.isIntersecting && entry.target === this._element.nativeElement;
//    }
// }
