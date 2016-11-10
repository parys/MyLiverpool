var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { PmService } from "./pm.service";
export var PmDetailComponent = (function () {
    function PmDetailComponent(pmService, route) {
        this.pmService = pmService;
        this.route = route;
    }
    PmDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.params.subscribe(function (params) {
            var id = +params["id"];
            _this.pmService.GetSingle(id)
                .subscribe(function (data) { return _this.parse(data); }, function (error) { return console.log(error); }, function () { });
        });
    };
    PmDetailComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    PmDetailComponent.prototype.parse = function (item) {
        this.item = item;
    };
    PmDetailComponent = __decorate([
        Component({
            selector: "pm-detail",
            template: require("./pm-detail.component.html")
        }), 
        __metadata('design:paramtypes', [PmService, ActivatedRoute])
    ], PmDetailComponent);
    return PmDetailComponent;
}());
//# sourceMappingURL=pm-detail.component.js.map