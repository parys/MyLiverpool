import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { Title, DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { Router, ActivatedRoute } from "@angular/router";
import { MdDialog, MdSnackBar } from '@angular/material';
import { Subscription } from "rxjs/Subscription";
import { MaterialService } from "./material.service";
import { Material } from "./material.model";                
import { MaterialType } from "../materialCategory/materialType.enum";                
import { RolesCheckedService, IRoles, LocalStorageService, DeleteDialogComponent } from "../shared/index";
import { MaterialActivateDialogComponent } from "./material-activate-dialog.component";

@Component({
    selector: "material-detail",
    templateUrl: "./material-detail.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class MaterialDetailComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    public item: Material;
    public roles: IRoles;
    public body: SafeHtml;
    public type: MaterialType;
    
    constructor(private service: MaterialService,
        private route: ActivatedRoute,
        private cd: ChangeDetectorRef,
        private localStorage: LocalStorageService,
        private rolesChecked: RolesCheckedService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private titleService: Title,
        private snackBar: MdSnackBar,
        private dialog: MdDialog) {
    }

    public ngOnInit(): void {
        this.roles = this.rolesChecked.checkRoles();
        this.sub = this.route.params.subscribe(params => {
            if (+params["id"] === 0) {
                this.router.navigate(["/"]); //bug temporary workaround
            } else {
                this.service.getSingle(+params["id"])
                    .subscribe(data => this.parse(data),
                        error => console.log(error));
            }
        });
    }

    public ngOnDestroy(): void {
        if(this.sub) this.sub.unsubscribe();
    }
    

    public showActivateModal(): void {
        let dialogRef = this.dialog.open(MaterialActivateDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.activate();
            }
        }, e => console.log(e));
    }

    public showDeleteModal(): void {
        let dialogRef = this.dialog.open(DeleteDialogComponent);
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.delete();
            }
        }, e => console.log(e));
    }

    public sanitizeByHtml(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }

    public getShortLink(url: string): string {
        if (!url) {
            return "";
        }
        if (url.indexOf("http://") === -1 && url.indexOf("https://") === -1) {
            url = `http://${url}`;
        }
        return new URL(url).hostname;
    }

    public sanitizeByUrl(text: string): SafeHtml {
        return this.sanitizer.bypassSecurityTrustResourceUrl(text);
    }

    private activate() : void {
        let result: boolean;
        
        this.service.activate(this.item.id)
            .subscribe(res => result = res,
            e => console.log(e),
            () => {
                if (result) {
                    this.item.pending = false;
                    this.snackBar.open("Материал успешно активирован", null, { duration: 5000 });
                } else {
                    this.snackBar.open("Материал НЕ БЫЛ активирован", null, { duration: 5000 });
                }
            });
    }

    private delete(): void {
        let result: boolean;
        this.service.delete(this.item.id)
            .subscribe(res => result = res,
                e => console.log(e),
                () => {
                    if (result) {
                        this.router.navigate([`/${MaterialType[this.type].toLowerCase()}`]);
                    } else {
                        this.snackBar.open("Ошибка удаления", null, {duration: 2000});
                    }
                }
            );
    }

    private parse(item: Material): void {
        this.item = item;
        this.body = this.sanitizeByHtml(item.message);
        this.titleService.setTitle(item.title);
        this.addView();
        this.cd.markForCheck();
        this.cd.detectChanges();
    }

    private addView(): void {
        if (this.localStorage.tryAddViewForMaterial(this.item.id)) {
            this.service.addView(this.item.id).subscribe(data => data, e => console.log(e));
            this.item.reads += 1;
        }
    }
}