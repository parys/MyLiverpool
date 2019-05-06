import { Routes } from '@angular/router';
import { WAL_RU } from '@app/+constants';
import { WalMainComponent } from './wal-main/wal-main.component';
import { HelperType } from '@app/home';

export const walRoutes: Routes = [
    {
        path: '', component: WalMainComponent, data: {
            title: WAL_RU,
            type: HelperType.WalMainInfo,
            keywords: 'фан движение, совместный просмотр матчей, we are liverpool',
            description: 'Международное фанатское движение We are Liverpool. Фан-Движение. We are Liverpool. Совместный просмотр матчей.'
        }
    }
];
