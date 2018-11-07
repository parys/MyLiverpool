import { Component } from "@angular/core";
import { MatDialogRef } from "@angular/material";

@Component({
    selector: "material-guard-dialog.component",
    templateUrl: "./material-guard-dialog.component.html"
})
export class MaterialGuardDialogComponent {
    constructor(public dialogRef: MatDialogRef<MaterialGuardDialogComponent, boolean>) { }
}