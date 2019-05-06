import { Routes } from '@angular/router';
import { SEASONS_ROUTE } from '@app/+constants';

export const seasonCoreRoutes: Routes = [
    {
        path: SEASONS_ROUTE,
        loadChildren: async () => {
            const { SeasonModule } = await import('../lazy/season.module');
            return SeasonModule;
        }
    }
];
