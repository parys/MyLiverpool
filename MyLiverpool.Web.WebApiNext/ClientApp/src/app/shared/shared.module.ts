import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DeleteDialogComponent } from "./delete-dialog";
import {
    MatButtonModule, MatDialogModule, MatExpansionModule, MatCardModule,
    MatIconModule, MatMenuModule, MatProgressBarModule,
    MatSnackBarModule, MatTooltipModule, MatPaginatorModule, MatPaginatorIntl,
    MAT_SNACK_BAR_DEFAULT_OPTIONS, MatBadgeModule,
    ErrorStateMatcher, ShowOnDirtyErrorStateMatcher, MatSidenavModule
} from "@angular/material";
import { LoaderComponent, LoaderService } from "./loader";
import { BearerInterceptor } from "./interceptors";
import { CustomDatePipe, SafePipe } from "./pipes";
import { BreadcrumbComponent } from "./breadcrumb";
import { NgxPaginationModule } from "ngx-pagination";
//import { DeferLoadDirective } from "./lazy";
import { AdComponent } from "./ad";

import { getRussianPaginatorIntl } from './intl/russian-paginator-intl';
import { SignalRModule } from "@app/+signalr";
import { StorageModule, StorageService } from "@app/+storage";
import { AuthModule } from "@app/+auth";
//import { DeferLoadDirective } from "./lazy/defer-load.directive";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        SignalRModule,
        StorageModule,
        AuthModule, //todo temporary?

        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule,
        MatProgressBarModule,
        MatSnackBarModule,
        MatPaginatorModule,
        MatTooltipModule,
        MatSidenavModule

    ],
    declarations: [
        DeleteDialogComponent,
        LoaderComponent,
        CustomDatePipe,
        SafePipe,
        BreadcrumbComponent,
     //   DeferLoadDirective,
        AdComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,

        DeleteDialogComponent,
        LoaderComponent, 
        CustomDatePipe,
        SafePipe,
        BreadcrumbComponent,
        AdComponent,

        MatBadgeModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatExpansionModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatSidenavModule
    ],
    providers: [
        LoaderService,
        { provide: HTTP_INTERCEPTORS, useClass: BearerInterceptor, multi: true, deps: [StorageService, LoaderService] },
        { provide: MatPaginatorIntl, useValue: getRussianPaginatorIntl() },
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } },
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher }
    ],
    entryComponents: [
        DeleteDialogComponent
    ]
})
export class SharedModule { }  