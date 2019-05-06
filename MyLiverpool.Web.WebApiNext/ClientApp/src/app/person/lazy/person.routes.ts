import { Routes } from '@angular/router';
import { PersonListComponent } from './person-list';
import { StuffListComponent } from './stuff-list';
import { SquadComponent } from './squad';
import { PersonEditComponent } from '../shared/person-edit';
import { RolesEnum, RoleGuard } from '@app/+auth';

export const personRoutes: Routes = [
    {
        path: '',
        component: PersonListComponent,
        data: {
            title: 'Люди',
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: ':id/edit',
        component: PersonEditComponent,
        data: {
            roles: [RolesEnum[RolesEnum.InfoStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'stuff',
        children: [
            { path: '', redirectTo: '/stuff/first', pathMatch: 'full' },
            {
                path: 'first',
                component: StuffListComponent,
                data: {
                    title: 'Тренерский штаб',
                    type: 'First',
                    keywords: 'тренерский штаб ливерпуля, тренер ливерпуля, тренеры первой команды, тренер лфк',
                    description: 'Тренерский штаб Ливерпуля. Тренеры первой команды.',
                    ogType: 'sport'
                }
            },
            {
                path: 'academy', component: StuffListComponent, data: {
                    title: 'Тренерский штаб',
                    type: 'Academy',
                    keywords: 'тренерский штаб ливерпуля, тренер ливерпуля, тренер лфк',
                    description: 'Тренерский штаб Ливерпуля. Тренеры академии ЛФК.',
                    ogType: 'sport'
                }
            },
        ]
    },
    {
        path: 'squad',
        children: [
            { path: '', redirectTo: '/squad/first', pathMatch: 'full' },
            {
                path: 'first', component: SquadComponent, data: {
                    title: 'Состав команды',
                    type: 'First',
                    keywords: 'Состав команды ливерпуля, игроки ливерпуля, футболисты первой команды лфк',
                    description: 'Игроки Ливерпуля. Футболисты ЛФК.',
                    ogType: 'sport'
                }
            },
            {
                path: 'academy', component: SquadComponent, data: {
                    title: 'Состав академии', type: 'Academy',
                    keywords: 'Состав академии ливерпуля, игроки академии ливерпуля, футболисты академии лфк',
                    description: 'Игроки академии Ливерпуля. Футболисты академии Ливерпуля.',
                    ogType: 'sport'
                }
            },
            {
                path: 'loan', component: SquadComponent, data: {
                    title: 'В аренде',
                    type: 'Loan',
                    keywords: 'аренда, игроки ливерпуля, арендованные игроки',
                    description: 'Арендованные игроки ливерпуля. Игроки ливерпуля в аренде.',
                    ogType: 'sport'
                }
            }
        ]
    }
];
