import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditorComponent } from './editor.component';
import { LazyLoadingLibraryService } from './lazyLoadingLibrary.service';

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        EditorModule.rootComponent
    ],
    // exports: [
    //     EditorComponent
    // ],
    bootstrap: [EditorModule.rootComponent],

    entryComponents: [
        EditorModule.rootComponent
    ],
    providers: [
        LazyLoadingLibraryService
    ]
})
export class EditorModule {
    static rootComponent = EditorComponent;
}
