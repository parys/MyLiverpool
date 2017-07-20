import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditorComponent } from "./editor.component";

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        EditorComponent
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        EditorComponent
    ],
    providers: [
    ]
})
export class EditorModule { }