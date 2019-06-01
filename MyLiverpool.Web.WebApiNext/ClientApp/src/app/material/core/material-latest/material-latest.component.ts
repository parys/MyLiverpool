import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { MaterialService } from "../material.service";
import { MaterialActivateDialogComponent } from "../material-activate-dialog";
import { Material } from "../../model";
import { DeleteDialogComponent, PagedList } from "@app/shared";
import { RolesCheckedService } from "@app/+auth";
import { CustomTitleMetaService as CustomTitleService } from "@app/shared";
import { TITLE_RU } from "@app/+constants";

@Component({
    selector: "material-latest",
    templateUrl: "./material-latest.component.html",
    styleUrls: ["./material-latest.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialLatestComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private navigationSubscription: Subscription;
    public items: Material[];
    public page: number = 1;
    public totalItems: number;
    public categoryId: number;

    constructor(private router: Router,
        private materialService: MaterialService,
        private cd: ChangeDetectorRef,
        public roles: RolesCheckedService,
        
        private snackBar: MatSnackBar,
        private titleService: CustomTitleService,
        private dialog: MatDialog) {
        this.navigationSubscription = this.router.events.subscribe((e: any) => {
            // If it is a NavigationEnd event re-initalise the component
            if (e instanceof NavigationEnd) {
                this.update();
            }
        });
    }

    public showActivateModal(index: number): void {
        const dialogRef = this.dialog.open(MaterialActivateDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activate(index);
            }
        });
    }

    public showDeleteModal(index: number): void {
        const dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete(index);
            }
        });
    }

    public ngOnInit(): void {
        this.titleService.setTitle(TITLE_RU);
    }

    public ngOnDestroy(): void {
        if(this.sub) this.sub.unsubscribe();
        if(this.navigationSubscription) this.navigationSubscription.unsubscribe();
    }
    
    private activate(index: number): void {
        const news: Material = this.items[index];
        this.materialService.activate(news.id)
            .subscribe(res => {
                    if (res) {
                        news.pending = false;
                        this.snackBar.open("Материал активирован");
                    } else {
                        this.snackBar.open("Материал НЕ активирован");
                    }
                },
                () => {},
                () => this.cd.markForCheck());
    }

    private delete(index: number): void {
        this.materialService.delete(this.items[index].id)
            .subscribe(res => {
                if (res) {
                    this.items.splice(index, 1);
                } else {
                    this.snackBar.open("Ошибка удаления");
                }
            },
            () => { },
            () => this.cd.markForCheck());
    }

    private parsePageable(pageable: PagedList<Material>): void {
        this.items = pageable.results;
        this.page = pageable.currentPage;
        this.totalItems = pageable.rowCount;
    }

    private update(): void {
        this.sub = this.materialService
            .getLatest()
            .subscribe(data => this.parsePageable(data),
                () => {},
                () => this.cd.markForCheck());
    }
}