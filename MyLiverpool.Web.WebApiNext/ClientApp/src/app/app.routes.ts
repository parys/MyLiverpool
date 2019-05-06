import { Routes } from '@angular/router';
import { MaterialListComponent } from './material';
import { homeRoutes } from './home/home.routes';
import {
    ADMIN_ROUTE,
    WISHES_ROUTE,
    NEWS_ROUTE,
    ACCOUNT_ROUTE,
    BLOGS_ROUTE,
    BLOG_CATEGORIES_ROUTE,
    COMMENTS_ROUTE,
    CLUBS_ROUTE,
    IMAGES_ROUTE,
    INJURIES_ROUTE,
    MATCHES_ROUTE,
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
    TITLE_RU,
    WAL_ROUTE
} from '@app/+constants';

export const routes: Routes = [
    ...homeRoutes,
    {
        path: 'editPage',
        loadChildren: async () => {
            const { StaticPageModule } = await import('./staticPage/staticPage.module');
            return StaticPageModule;
        }
    },
    {
        path: ACCOUNT_ROUTE,
        loadChildren: async () => {
            const { AccountModule } = await import('./account/lazy/account.module');
            return AccountModule;
        }
    },
    {
        path: ADMIN_ROUTE,
        loadChildren: async () => {
            const { AdminModule } = await import('./admin/lazy/admin.module');
            return AdminModule;
        }
    },
    {
        path: BLOGS_ROUTE,
        loadChildren: async () => {
            const { MaterialModule } = await import('./material/lazy/material.module');
            return MaterialModule;
        }
    },
    {
        path: BLOG_CATEGORIES_ROUTE,
        loadChildren: async () => {
            const { MaterialCategoryModule } = await import('./materialCategory/lazy/materialCategory.module');
            return MaterialCategoryModule;
        }
    },
    {
        path: COMMENTS_ROUTE,
        loadChildren: async () => {
            const { CommentModule } = await import('./comment/lazy/comment.module');
            return CommentModule;
        }
    },
    {
        path: CLUBS_ROUTE,
        loadChildren: async () => {
            const { ClubModule } = await import('./club/lazy/club.module');
            return ClubModule;
        }
    },
    {
        path: IMAGES_ROUTE,
        loadChildren: async () => {
            const { ImageModule } = await import('./image/lazy/image.module');
            return ImageModule;
        }
    },
    {
        path: INJURIES_ROUTE,
        loadChildren: async () => {
            const { InjuryModule } = await import('./injury/lazy/injury.module');
            return InjuryModule;
        }
    },
    {
        path: MATCHES_ROUTE,
        loadChildren: async () => {
            const { MatchModule } = await import('./match/lazy/match.module');
            return MatchModule;
        }
    },
    {
        path: NEWS_ROUTE,
        loadChildren: async () => {
            const { MaterialModule } = await import('./material/lazy/material.module');
            return MaterialModule;
        }
    },
    {
        path: NEWS_CATEGORIES_ROUTE,
        loadChildren: async () => {
            const { MaterialCategoryModule } = await import('./materialCategory/lazy/materialCategory.module');
            return MaterialCategoryModule;
        }
    },
    {
        path: NOTIFICATIONS_ROUTE,
        loadChildren: async () => {
            const { NotificationModule } = await import('./notification/lazy/notification.module');
            return NotificationModule;
        }
    },
    {
        path: PERSONS_ROUTE,
        loadChildren: async () => {
            const { PersonModule } = await import('./person/lazy/person.module');
            return PersonModule;
        }
    },
    {
        path: PMS_ROUTE,
        loadChildren: async () => {
            const { PmModule } = await import('./pm/lazy/pm.module');
            return PmModule;
        }
    },
    {
        path: POLLS_ROUTE,
        loadChildren: async () => {
            const { PollModule } = await import('./poll/lazy/poll.module');
            return PollModule;
        }
    },
    {
        path: ROLE_GROUPS_ROUTE,
        loadChildren: async () => {
            const { RoleGroupModule } = await import('./roleGroup/lazy/roleGroup.module');
            return RoleGroupModule;
        }
    },
    {
        path: SEASONS_ROUTE,
        loadChildren: async () => {
            const { SeasonModule } = await import('./season/lazy/season.module');
            return SeasonModule;
        }
    },
    {
        path: STADIUMS_ROUTE,
        loadChildren: async () => {
            const { StadiumModule } = await import('./stadium/lazy/stadium.module');
            return StadiumModule;
        }
    },
    {
        path: TRANSFERS_ROUTE,
        loadChildren: async () => {
            const { TransferModule } = await import('./transfer/lazy/transfer.module');
            return TransferModule;
        }
    },
    {
        path: USERS_ROUTE,
        loadChildren: async () => {
            const { UserModule } = await import('./user/lazy/user.module');
            return UserModule;
        }
    },
    {
        path: WAL_ROUTE,
     //   loadChildren: () => import("./wal/lazy/wal.module").then(m => m.WalModule)
        loadChildren: async () => {
            const { WalModule } = await import('./wal/lazy/wal.module');
            return WalModule;
        }
    },
    {
        path: WISHES_ROUTE,
     //   loadChildren: () => import("./wish/lazy/wish.module").then(m => m.WishModule)
        loadChildren: async () => {
            const { WishModule } = await import('./wish/lazy/wish.module');
            return WishModule;
        }
    },
    {
        path: '',
        component: MaterialListComponent,

        data: {
            title: TITLE_RU,
            keywords: 'ливерпуль, liverpool, лфк, фк ливерпуль, liverpool fc, lfc, клуб ливерпуль, ливерпуль фан, сайт ливерпуля, матч ливерпуля, ливерпуль обсуждение',
            description: 'Сайт футбольного клуба Ливерпуль. FC Liverpool. Новости, матчи, история, таблицы, статистика, статьи, составы. Русскоязычные болельщики.',

        },
        runGuardsAndResolvers: 'always'
    }
];
