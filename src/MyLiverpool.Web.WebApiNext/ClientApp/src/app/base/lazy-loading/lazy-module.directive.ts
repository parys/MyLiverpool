import { Directive, Input, OnInit, OnDestroy, NgModuleRef, ViewContainerRef, Injector, NgModuleFactoryLoader, NgModuleFactory, Inject, Compiler } from '@angular/core';
import { LAZY_MODULES, LAZY_MODULES_MAP, ModuleWithRoot } from './lazy-load.map';



@Directive({
    selector: '[loadModule]'
})
export class LoadModuleDirective implements OnInit, OnDestroy {
    @Input('loadModule') moduleName: keyof LAZY_MODULES;
    @Input() type: number;
    @Input() height: number;
    @Input() value: string;

    private moduleRef: NgModuleRef<any>;

    constructor(
        private vcr: ViewContainerRef,
        private injector: Injector,
        private compiler: Compiler,
        private loader: NgModuleFactoryLoader,
        @Inject(LAZY_MODULES_MAP) private modulesMap
    ) { 
        console.log(0);}

    ngOnInit() {
        console.log(1);
        this.loader
            .load(this.modulesMap[this.moduleName])
            .then((moduleFactory: NgModuleFactory<any>) => {
                console.log(123);
                this.moduleRef = moduleFactory.create(this.injector);
                const rootComponent = (moduleFactory.moduleType as ModuleWithRoot).rootComponent;
                console.log(1234);

                const factory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(
                    rootComponent);
                console.log(1235);

                this.vcr.createComponent(factory);
                console.log(1236);
            });

    }

    ngOnDestroy() {
        if (this.moduleRef) {
            this.moduleRef.destroy();
        }
    }
}
