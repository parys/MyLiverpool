import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const materialModules = [
    MatBadgeModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
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
export class LayoutMaterialModule {
}
