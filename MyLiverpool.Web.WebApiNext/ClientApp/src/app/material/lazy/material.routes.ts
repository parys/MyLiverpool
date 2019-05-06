import { Routes } from '@angular/router';
import { MaterialDetailComponent } from './material-detail';
import { MaterialListComponent } from '../core';
import { EDIT_ROUTE } from '@app/+constants/';
import { CanLoadEditMaterial } from './canLoadEdit.guard';

export const materialRoutes: Routes = [
    {
        path: '',
        component: MaterialListComponent
    },
    {
        path: ':id',
        children: [
            {
                path: '',
                component: MaterialDetailComponent,
                data: {
                    ogType: 'article'
                }
            },
            {
                path: EDIT_ROUTE,
                //loadChildren: async () => {
                //    const { MaterialEditModule } = await import('./+material-edit/material-edit.module');
                //    return MaterialEditModule;
                //},
                loadChildren: () => {
                    return import('./+material-edit/material-edit.module').then(m => m.MaterialEditModule);
                },
                canLoad: [CanLoadEditMaterial]
            }
        ]
    }
];
