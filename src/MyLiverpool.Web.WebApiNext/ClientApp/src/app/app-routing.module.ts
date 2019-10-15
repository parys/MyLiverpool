import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
    ADMIN_ROUTE,
    WISHES_ROUTE,
    NEWS_ROUTE,
    ACCOUNT_ROUTE,
    BLOGS_ROUTE,
    BLOG_CATEGORIES_ROUTE,
    COMMENTS_ROUTE,
    CLUBS_ROUTE,
    FAQ_CATEGORIES_ROUTE,
    FAQ_ITEMS_ROUTE,
    IMAGES_ROUTE,
    INJURIES_ROUTE,
    MATCHES_ROUTE,
    MATERIALS_ROUTE,
    NOTIFICATIONS_ROUTE,
    NEWS_CATEGORIES_ROUTE,
    PERSONS_ROUTE,
    PMS_ROUTE,
    ROLE_GROUPS_ROUTE,
    SEASONS_ROUTE,
    STADIUMS_ROUTE,
    TRANSFERS_ROUTE,
    USERS_ROUTE,
    POLLS_ROUTE,
    WAL_ROUTE,
    FAQ_ROUTE
} from '@constants/routes.constants';

import { MaterialHomeComponent } from '@materials/index';
import { TITLE_RU } from '@constants/ru.constants';
import { HelperType } from '@domain/models';
import { RoleGuard, RolesEnum } from '@base/auth';


const staticPageRoutes: Routes = [
    {
        path: 'clubHistory',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'История клуба', type: HelperType.ClubHistory }
    },
    {
        path: 'copyright',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'О перепечатке информации', type: HelperType.Copyright }
    },
    {
        path: 'rules',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'Правила', type: HelperType.Rules }
    },
    {
        path: 'aboutClub',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'О клубе', type: HelperType.AboutClub }
    },
    {
        path: 'about',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'О нас', type: HelperType.About }
    },
    {
        path: 'job',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'Работа на сайте', type: HelperType.Job }
    },
    {
        path: 'fantasy',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'Фэнтази лиги', type: HelperType.Fantasy }
    },
    {
        path: 'cooperation',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: { title: 'Сотрудничество', type: HelperType.Cooperation }
    },
    {
        path: 'instructions',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: {
            title: 'Инструкции',
            type: HelperType.Instructions,
            roles: [RolesEnum[RolesEnum.AdminStart]]
        },
        canActivate: [RoleGuard]
    },
    {
        path: 'plans',
        loadChildren: () => import('./static-pages/static-pages.module').then(m => m.StaticPagesModule),
        data: {
            title: 'Планы',
            type: HelperType.Plans,
            roles: [RolesEnum[RolesEnum.AdminStart]]
        },
        canActivate: [RoleGuard]
    }
];

const routes: Routes = [
    {
        path: '',
        component: MaterialHomeComponent,

        data: {
            title: TITLE_RU,
            // tslint:disable-next-line:max-line-length
            keywords: 'ливерпуль, liverpool, лфк, фк ливерпуль, liverpool fc, lfc, клуб ливерпуль, ливерпуль фан, сайт ливерпуля, матч ливерпуля, ливерпуль обсуждение',
            // tslint:disable-next-line:max-line-length
            description: 'Сайт футбольного клуба Ливерпуль. FC Liverpool. Новости, матчи, история, таблицы, статистика, статьи, составы. Русскоязычные болельщики.',
        },
        runGuardsAndResolvers: 'always'
    },
    {
        path: ACCOUNT_ROUTE,
        loadChildren: () => import('./accounts/lazy/account.module').then(m => m.AccountModule)
    },
    {
        path: ADMIN_ROUTE,
        loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
    },
    {
        path: BLOGS_ROUTE,
        loadChildren: () => import('./materials/lazy/material.module').then(m => m.MaterialModule)
    },
    {
        path: BLOG_CATEGORIES_ROUTE,
        loadChildren: () => import('./material-categories/lazy/materialCategory.module').then(m => m.MaterialCategoryModule)
    },
    {
        path: COMMENTS_ROUTE,
        loadChildren: () => import('./comments/lazy/comment.module').then(m => m.CommentModule)
    },
    {
        path: CLUBS_ROUTE,
        loadChildren: () => import('./clubs/club.module').then(m => m.ClubModule)
    },
    {
        path: FAQ_ROUTE,
        loadChildren: () => import('./faq/faq.module').then(m => m.FaqModule),
    },
    {
        path: FAQ_CATEGORIES_ROUTE,
        loadChildren: () => import('./faq-categories/lazy/faq-category.module').then(m => m.FaqCategoryModule),
    },
    {
        path: FAQ_ITEMS_ROUTE,
        loadChildren: () => import('./faq-items/faq-item.module').then(m => m.FaqItemModule),
    },
    {
        path: IMAGES_ROUTE,
        loadChildren: () => import('./images/lazy/image.module').then(m => m.ImageModule)
    },
    {
        path: INJURIES_ROUTE,
        loadChildren: () => import('./injuries/lazy/injury.module').then(m => m.InjuryModule)
    },
    {
        path: MATERIALS_ROUTE,
        loadChildren: () => import('./materials/lazy/material.module').then(m => m.MaterialModule)
    },
    {
        path: MATCHES_ROUTE,
        loadChildren: () => import('./matches/match.module').then(m => m.MatchModule)
    },
    {
        path: NEWS_ROUTE,
        loadChildren: () => import('./materials/lazy/material.module').then(m => m.MaterialModule)
    },
    {
        path: NEWS_CATEGORIES_ROUTE,
        loadChildren: () => import('./material-categories/lazy/materialCategory.module').then(m => m.MaterialCategoryModule)
    },
    {
        path: NOTIFICATIONS_ROUTE,
        loadChildren: () => import('./notifications/notification.module').then(m => m.NotificationModule)
    },
    {
        path: PERSONS_ROUTE,
        loadChildren: () => import('./persons/person.module').then(m => m.PersonModule)
    },
    {
        path: PMS_ROUTE,
        loadChildren: () => import('./pms/lazy/pm.module').then(m => m.PmModule)
    },
    {
        path: POLLS_ROUTE,
        loadChildren: () => import('./polls/lazy/poll.module').then(m => m.PollModule)
    },
    {
        path: ROLE_GROUPS_ROUTE,
        loadChildren: () => import('./role-groups/lazy/roleGroup.module').then(m => m.RoleGroupModule)
    },
    {
        path: SEASONS_ROUTE,
        loadChildren: () => import('./seasons/season.module').then(m => m.SeasonModule)
    },
    {
        path: STADIUMS_ROUTE,
        loadChildren: () => import('./stadiums/lazy/stadium.module').then(m => m.StadiumModule)
    },
    {
        path: TRANSFERS_ROUTE,
        loadChildren: () => import('./transfers/transfer.module').then(m => m.TransferModule)
    },
    {
        path: USERS_ROUTE,
        loadChildren: () => import('./users/user.module').then(m => m.UserModule)
    },
    {
        path: WAL_ROUTE,
        loadChildren: () => import('./wal/lazy/wal.module').then(m => m.WalModule)
    },
    {
        path: WISHES_ROUTE,
        loadChildren: () => import('./wishes/wish.module').then(m => m.WishModule)
    },
    ...staticPageRoutes,
    {
        path: 'editPage',
        loadChildren: () => import('./static-pages-editor/static-pages-editor.module').then(m => m.StaticPagesEditorModule)
    },
    { path: '**', redirectTo: '/' }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            onSameUrlNavigation: 'reload',
            initialNavigation: 'enabled',
            anchorScrolling: 'enabled',
            scrollPositionRestoration: 'enabled'
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
