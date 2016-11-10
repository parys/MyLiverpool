var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { Configuration } from "../app.constants";
import { HttpWrapper } from "../shared/httpWrapper";
export var WishService = (function () {
    function WishService(http, configuration) {
        var _this = this;
        this.http = http;
        this.configuration = configuration;
        this.GetAll = function () {
            return _this.http.get(_this.actionUrl + "list/").map(function (res) { return res.json(); });
        };
        this.GetSingle = function (id) {
            return _this.http.get(_this.actionUrl + id).map(function (res) { return res.json(); });
        };
        this.Create = function (item) {
            return _this.http.post(_this.actionUrl, JSON.stringify(item)).map(function (res) { return res.json(); });
        };
        this.Update = function (id, itemToUpdate) {
            return _this.http
                .put(_this.actionUrl + id, JSON.stringify(itemToUpdate))
                .map(function (res) { return res.json(); });
        };
        this.Delete = function (id) {
            return _this.http.delete(_this.actionUrl + id).map(function (response) { return response.json(); });
        };
        this.GetTypes = function () {
            return _this.http.get(_this.actionUrl + "types/").map(function (res) { return res.json(); });
        };
        this.actionUrl = configuration.ServerWithApiUrl + "wish/";
    }
    WishService = __decorate([
        Injectable(), 
        __metadata('design:paramtypes', [HttpWrapper, Configuration])
    ], WishService);
    return WishService;
}());
//# sourceMappingURL=wish.service.js.map