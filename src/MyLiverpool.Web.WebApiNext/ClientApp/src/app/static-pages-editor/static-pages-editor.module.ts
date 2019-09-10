import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '@shared/index';
import { staticPagesEditorRoutes } from '@static-pages-editor/static-pages-editor.routes';
import { PageEditorComponent } from '@static-pages-editor/page-editor';
import { StaticPagesEditorService } from '@static-pages-editor/static-pages-editor.service';
import { LoadModuleDirective } from '@base/lazy-loading/lazy-module.directive';

@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(staticPagesEditorRoutes),
    ],
    declarations: [
        PageEditorComponent,
        LoadModuleDirective,
    ],
    providers: [
        StaticPagesEditorService
    ]
})
export class StaticPagesEditorModule {
    constructor(
    ) {
    }
}
