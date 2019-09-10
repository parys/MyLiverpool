import { InjectionToken, Type } from '@angular/core';

export type LAZY_MODULES = {
    editor: string;
};

export const lazyMap: LAZY_MODULES = {
    editor: 'src/app/editor/editor.module#EditorModule'
};

export const LAZY_MODULES_MAP = new InjectionToken('LAZY_MODULES_MAP', {
  factory: () => lazyMap
});

export type ModuleWithRoot = Type<any> & {rootComponent: Type<any>};
