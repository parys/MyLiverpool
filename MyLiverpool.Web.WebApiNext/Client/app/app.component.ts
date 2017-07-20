import { Component, OnInit, ViewEncapsulation, Renderer2, Inject } from '@angular/core';  
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { REQUEST } from "app/shared/constants/request";
import { Observable } from "rxjs/Observable"
import { RolesCheckedService } from "./shared/roles-checked.service";
import { IRoles } from "./shared/roles.interface";
import { AuthService } from "./auth/auth.service";
import { IAuthStateModel } from "./auth/models/auth-state-model";
import { BreadcrumbService } from "ng2-breadcrumb/ng2-breadcrumb";

@Component({
    selector: "app",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit {
    public roles: IRoles;
   // public isRoot: boolean = false;
    private authState$: Observable<IAuthStateModel>;

    constructor(private router: Router,
        private rolesChecked: RolesCheckedService,
        private authService: AuthService,
        private activatedRoute: ActivatedRoute,
        private titleService: Title,
        private renderer: Renderer2,
        private breadcrumbService: BreadcrumbService,
      @Inject(REQUEST) private request: any
    ) {                
      console.log(`What's our REQUEST Object look like?`);
      console.log(`The Request object only really exists on the Server, but on the Browser we can at least see Cookies`);
      console.log(this.request);
        this.roles = this.rolesChecked.checkRoles();
        this.initTitleSubscriber();
        this.setUpBreadcrumbs();

    }

    public ngOnInit(): void {
        this.authState$ = this.authService.state$;
        // This starts up the token refresh preocess for the app
        this.authService.init()
            .subscribe(
                () => { console.info('Startup success'); },
                error => console.warn(error)
            );
    }

    private initTitleSubscriber() {
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route: ActivatedRoute) => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter((route: ActivatedRoute) => route.outlet === "primary")
            .mergeMap((route: ActivatedRoute) => route.data)
            .subscribe((event) => {
                this.renderer.setProperty(document.body, "scrollTop", 0);
                this.titleService.setTitle(event["title"]);
               // this.isRoot = (event["title"] === "MyLFC.ru - Сайт русскоязычных болельщиков \"Ливерпуля\"");
            });
        /* todo research
        this.router.events
            .filter(event => event instanceof NavigationEnd)
            .map(() => this.activatedRoute)
            .map((route: ActivatedRoute) => {
                while (route.firstChild) route = route.firstChild;
                return route;
            })
            .filter((route: ActivatedRoute) => route.outlet === "primary")
            .mergeMap((route: ActivatedRoute) => route.fragment)
            .subscribe((event) => {
                if (event) {
                    this.renderer.setProperty(document.body, "scrollTop", 0);
                }
            }); */
    }

    private setUpBreadcrumbs(): void {
        //this.breadcrumbService.addFriendlyNameForRoute("/", "Главная");

        this.breadcrumbService.addFriendlyNameForRoute("/forum", "Форум");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/forum/[0-9]+$", "Подсекция");
        this.breadcrumbService.hideRouteRegex("^/forum/[0-9]+/themes$");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/forum/[0-9]+/themes/[0-9]+$", "Тема");
        
        this.breadcrumbService.addFriendlyNameForRouteRegex("/news", "Новости");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/news/[0-9]+$", "Новость"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/news/[0-9]+/edit$", "Редактирование");
        this.breadcrumbService.addFriendlyNameForRouteRegex("/newsCategories", "Категории новостей");
        this.breadcrumbService.hideRouteRegex("^/newsCategories/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/blog/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/newsCategories/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/blogs", "Блоги");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/blogs/[0-9]+$", "Блог"); // this.breadcrumbService.addCallbackForRouteRegex("^/blog/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/blogs/[0-9]+/edit$", "Редактирование");
        this.breadcrumbService.addFriendlyNameForRouteRegex("/blogCategories", "Категории блогов");
        this.breadcrumbService.hideRouteRegex("^/blogCategories/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/blog/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/blogCategories/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRoute("/clubHistory", "История клуба");
        this.breadcrumbService.addFriendlyNameForRoute("/aboutClub", "О клубе");
        this.breadcrumbService.addFriendlyNameForRoute("/squad", "Состав");
        this.breadcrumbService.addFriendlyNameForRoute("/squad/first", "Первая команда");
        this.breadcrumbService.addFriendlyNameForRoute("/squad/academy", "Академия");

        this.breadcrumbService.addFriendlyNameForRoute("/seasons", "Сезоны");
        this.breadcrumbService.addFriendlyNameForRoute("/seasons/calendar", "Календарь");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/season/[0-9]+$", "Сезон");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/season/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRoute("/players", "Игроки");
        this.breadcrumbService.addFriendlyNameForRoute("/players/statistics", "Статистика");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/users", "Пользователи");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/users/[0-9]+$", "Пользователь");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/users/[0-9]+/settings$", "Настройки");
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/users/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRoute("/rules", "Правила");

        this.breadcrumbService.addFriendlyNameForRoute("/roleGroups", "Группы и роли");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/wishes", "Пожелания");
        this.breadcrumbService.hideRouteRegex("^/wishes/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/wishes/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/matches", "Матчи");
        this.breadcrumbService.hideRouteRegex("^/matches/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/matches/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/clubs", "Клубы");
        this.breadcrumbService.hideRouteRegex("^/clubs/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/clubs/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/persons", "Люди");
        this.breadcrumbService.hideRouteRegex("^/persons/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/persons/[0-9]+/edit$", "Редактирование");
        this.breadcrumbService.addFriendlyNameForRoute("/stuff", "Тренерский штаб");
        this.breadcrumbService.addFriendlyNameForRoute("/stuff/first", "Первая команда");
        this.breadcrumbService.addFriendlyNameForRoute("/stuff/academy", "Академия");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/images", "Изображения");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/materialComments", "Комментарии");

        this.breadcrumbService.addFriendlyNameForRouteRegex("/pms", "Личные сообщения");

        this.breadcrumbService.addFriendlyNameForRoute("/signup", "Регистрация");
        this.breadcrumbService.addFriendlyNameForRouteRegex("/confirmEmail", "Подтверждение пароля");
        this.breadcrumbService.addFriendlyNameForRoute("/forgotPassword", "Восстановление забытого пароля");
        this.breadcrumbService.addFriendlyNameForRoute("/unconfirmedEmail", "Ваша почта не подтверждена");
        this.breadcrumbService.addFriendlyNameForRouteRegex("/resetPassword", "Сброс пароля");
        this.breadcrumbService.addFriendlyNameForRoute("/changePassword", "Изменение пароля");


        this.breadcrumbService.addFriendlyNameForRoute("/transfers", "Трансферы");
        this.breadcrumbService.addFriendlyNameForRoute("/transfers/current", "Текущие");
        this.breadcrumbService.hideRouteRegex("^/transfers/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("^/transfers/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRoute("/stadiums", "Стадионы");
        this.breadcrumbService.hideRouteRegex("^/stadiums/[0-9]+$"); // this.breadcrumbService.addCallbackForRouteRegex("^/news/[0-9]+$", this.getTitle);
        this.breadcrumbService.addFriendlyNameForRouteRegex("/stadiums/[0-9]+/edit$", "Редактирование");

        this.breadcrumbService.addFriendlyNameForRoute("/chat", "Чат");
        this.breadcrumbService.addFriendlyNameForRoute("/job", "Работа на сайте");

        this.breadcrumbService.addFriendlyNameForRoute("/editPage", "Редактирование страницы");
        this.breadcrumbService.hideRouteRegex("^/editPage/[0-9]+$"); 
    }   

    getTitle(id: string = null): string {
        return "123";
    }
}