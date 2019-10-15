import { Routes } from '@angular/router';

import { CALENDAR_RU, STATISTICS_RU, EDITING_RU } from '@constants/ru.constants';
import { EDIT_ROUTE } from '@constants/routes.constants';
import { RoleGuard, RolesEnum } from '@base/auth';

import { SeasonListComponent } from '@seasons/pages/season-list';
import { SeasonEditComponent } from '@seasons/pages/season-edit';
import { SeasonCalendarComponent } from '@seasons/pages/season-calendar';
import { SeasonStatisticsComponent } from '@seasons/pages/season-statistics';

export const seasonRoutes: Routes = [
    { path: '', component: SeasonListComponent, data: { title: 'Список сезонов' } },
    {
        path: ':id',
        children: [
            {
                path: EDIT_ROUTE,
                component: SeasonEditComponent,
                data: {
                    title: EDITING_RU,
                    roles: [RolesEnum[RolesEnum.InfoStart]]
                },
                canActivate: [RoleGuard]
            },
            { path: 'calendar', component: SeasonCalendarComponent, data: { title: CALENDAR_RU } },
            { path: 'statistics', component: SeasonStatisticsComponent, data: { title: STATISTICS_RU } },
        ]
    }
];
