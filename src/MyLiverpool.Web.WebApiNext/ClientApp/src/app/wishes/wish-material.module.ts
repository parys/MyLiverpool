import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

const materialModules = [
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule
];

@NgModule({
    imports: [
        CommonModule,
        ...materialModules
    ],
    exports: [
        ...materialModules
    ]
})
export class WishMaterialModule {
}
