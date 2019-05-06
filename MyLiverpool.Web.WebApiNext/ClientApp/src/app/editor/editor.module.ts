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
        EditorComponent
    ],
    exports: [
        EditorComponent
    ],
    providers: [
        LazyLoadingLibraryService
    ]
})
export class EditorModule { }
