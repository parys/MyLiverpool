import { Routes } from '@angular/router';
import { PollListComponent } from './poll-list/poll-list.component';
import { PollDetailComponent } from './poll-detail/poll-detail.component';

export const pollRoutes: Routes = [
    { path: '', component: PollListComponent, data: { title: 'Опросы' } },
    {
        path: ':id',
        children: [
            { path: '', component: PollDetailComponent, data: { title: 'Опрос' } },
            {
                path: 'edit',
                loadChildren: async () => {
                    const { PollEditModule } = await import('./+poll-edit/poll-edit.module');
                    return PollEditModule;
                }
            }
        ]
    }
];
