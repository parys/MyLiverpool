import { NgModule, LOCALE_ID } from "@angular/core";
import { Title, BrowserModule } from "@angular/platform-browser";
//import { WorkerAppModule } from "@angular/platform-webworker";
import { RouterModule } from "@angular/router";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { routes } from "./app.routes";
import { ForumModule } from "./forum/index";
import { Configuration } from "./app.constants";
import * as material from "./material/index";
import { EditorModule } from "./editor/index";
import * as materialCategory from "./materialCategory/index";
import * as auth from "./auth/index";
import * as account from "./account/index";
import * as chat from "./chat/index";
import * as club from "./club/index";
import * as home from "./home/index";
import * as image from "./image/index";
import * as match from "./match/index";
import { PersonModule } from "./person/index";
import * as roleGroup from "./roleGroup/index";
import * as season from "./season/index";
import { SharedModule } from "./shared/index";
import * as user from "./user/index";
import * as pm from "./pm/index";
import { StadiumModule } from "./stadium/index";
import { WishModule } from "./wish/index";
import * as materialComment from "./materialComment/index";
import { Ng2AutoCompleteModule } from "ng2-auto-complete";
import * as admin from "./admin/index";
import { NgxPaginationModule } from "ngx-pagination";
import { ReCaptchaModule } from "angular2-recaptcha";
import { Ng2BreadcrumbModule, BreadcrumbService } from "ng2-breadcrumb/ng2-breadcrumb";
import { BreadcrumbComponent } from "./shared/breadcrumb.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as angMaterial from '@angular/material';
import { TransferHttpModule } from '../modules/transfer-http/transfer-http.module';

@NgModule({
    imports: [
        EditorModule,
        HttpModule,
        ForumModule,
        angMaterial.MdAutocompleteModule,
        angMaterial.MdButtonModule,
        angMaterial.MdCardModule,
        angMaterial.MdDatepickerModule,
        angMaterial.MdDialogModule,
        angMaterial.MdInputModule,
        angMaterial.MdMenuModule,
        angMaterial.MdNativeDateModule,
        angMaterial.MdSnackBarModule,
        angMaterial.MdSelectModule,
        angMaterial.MdSlideToggleModule,
        angMaterial.MdTabsModule,
        Ng2AutoCompleteModule,
        Ng2BreadcrumbModule.forRoot(),
        NgxPaginationModule,
        PersonModule,
        RouterModule.forRoot(routes),
        ReCaptchaModule,
        SharedModule,
        StadiumModule,
        WishModule,
    //    WorkerAppModule

        TransferHttpModule, // Our Http TransferData method
    ],
    declarations: [
        account.AccountSigninComponent,
        account.AccountSignupComponent,
        account.ChangePasswordComponent,
        account.ConfirmEmailComponent,
        account.ForgotPasswordComponent,
        account.ResetPasswordComponent,
        account.UnconfirmedEmailComponent,
        BreadcrumbComponent,
        chat.MaxiChatComponent,
        chat.MiniChatComponent,
        club.ClubEditComponent,
        club.ClubListComponent,
        home.StaticPageComponent,
        home.NavbarComponent,
        home.SidebarLeftComponent,
        home.SidebarRightComponent,
        image.ImageAdditionComponent,
        image.ImageDetailComponent,
        image.ImageListComponent,
        match.MatchEditComponent,
        match.MatchListComponent,
        match.MatchCalendarComponent,
        materialCategory.MaterialCategoryEditComponent,
        materialCategory.MaterialCategoryListComponent,
        materialComment.MaterialCommentDetailComponent,
        materialComment.MaterialCommentListComponent,
        materialComment.MaterialCommentSectionComponent,
        materialComment.LastCommentsComponent,
        pm.PmCounterComponent,
        pm.PmDetailComponent,
        pm.PmEditComponent,
        pm.PmListComponent,
        pm.PmReplyComponent,
        roleGroup.RoleGroupListComponent,
        season.SeasonCalendarComponent,
        season.SeasonEplTableComponent,
        season.SeasonEditComponent,
        season.SeasonListComponent,
        AppComponent,
        admin.EplTableComponent,
        admin.PageEditorComponent,
        material.MaterialListComponent,
        material.MaterialDetailComponent,
        material.MaterialEditComponent,
        material.MaterialActivateDialogComponent,
        user.UserBirthdayComponent,
        user.UserDetailComponent,
        user.UserListComponent,
        user.UserEditComponent,
        user.UserConfigComponent,
        user.UserOnlineCounterComponent
    ], // components and directives
  //  bootstrap: [
   //     AppComponent], // root component
entryComponents: [
 material.MaterialActivateDialogComponent,
],
    providers: [// services  
        auth.AuthService,
        auth.RoleGuard,
        auth.UnSignedGuard,
        account.AccountService,
        account.AccountValidators,
        BreadcrumbService,
        chat.ChatMessageService,
        club.ClubService,
        image.ImageService,
        match.MatchService,
        materialCategory.MaterialCategoryService,
        materialComment.MaterialCommentService,
        pm.PmService,
        roleGroup.RoleGroupService,
        season.SeasonService,
        admin.AdminService,
        { provide: LOCALE_ID, useValue: "ru-RU" },
        Configuration,
        material.MaterialService,
        Title,
        user.UserService
    ]
})
export class AppModule { }