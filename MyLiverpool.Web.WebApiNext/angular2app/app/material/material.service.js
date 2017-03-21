"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var app_constants_1 = require("../app.constants");
var materialType_enum_1 = require("../materialCategory/materialType.enum");
var httpWrapper_1 = require("../shared/httpWrapper");
var MaterialService = (function () {
    function MaterialService(http, configuration) {
        var _this = this;
        this.http = http;
        this.configuration = configuration;
        this.getAll = function (filters) {
            return _this.http.get(_this.actionUrl + "list/" + encodeURIComponent(JSON.stringify(filters))).map(function (res) { return res.json(); });
        };
        this.getSingle = function (id) {
            return _this.http.get(_this.actionUrl + id).map(function (res) { return res.json(); });
        };
        this.create = function (item, type) {
            return _this.http.post("" + _this.actionUrl + materialType_enum_1.MaterialType[type] + "/", JSON.stringify(item)).map(function (res) { return res.json(); });
        };
        this.update = function (id, itemToUpdate) {
            return _this.http
                .put(_this.actionUrl + id, JSON.stringify(itemToUpdate))
                .map(function (res) { return res.json(); });
        };
        this.delete = function (id) {
            return _this.http.delete(_this.actionUrl + id).map(function (res) { return res.json(); });
        };
        this.addView = function (id) {
            return _this.http.get(_this.actionUrl + "addView/" + id).map(function (res) { return res.json(); });
        };
        this.activate = function (id) {
            return _this.http.get(_this.actionUrl + "activate/" + id).map(function (res) { return res.json(); });
        };
        this.actionUrl = configuration.serverWithApiUrl + "material/";
    }
    return MaterialService;
}());
MaterialService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [httpWrapper_1.HttpWrapper, app_constants_1.Configuration])
], MaterialService);
exports.MaterialService = MaterialService;
//# sourceMappingURL=material.service.js.map