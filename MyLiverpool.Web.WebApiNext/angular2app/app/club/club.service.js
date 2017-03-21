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
var index_1 = require("../shared/index");
var ClubService = (function () {
    function ClubService(http, configuration) {
        var _this = this;
        this.http = http;
        this.configuration = configuration;
        this.getAll = function (page) {
            return _this.http.get(_this.actionUrl + ("list/" + page)).map(function (res) { return res.json(); });
        };
        this.getSingle = function (id) {
            return _this.http.get(_this.actionUrl + id).map(function (res) { return res.json(); });
        };
        this.create = function (item) {
            return _this.http.post(_this.actionUrl, JSON.stringify(item)).map(function (res) { return res.json(); });
        };
        this.update = function (id, itemToUpdate) {
            return _this.http
                .put(_this.actionUrl + id, JSON.stringify(itemToUpdate))
                .map(function (res) { return res.json(); });
        };
        this.delete = function (id) {
            return _this.http.delete(_this.actionUrl + id).map(function (res) { return res.json(); });
        };
        this.getByName = function (typed) {
            return _this.http.get(_this.actionUrl + "getClubsByName/" + typed).map(function (res) { return res.json(); });
        };
        this.uploadLogo = function (file, fileName) {
            var formData = new FormData();
            formData.append("uploadFile", file, file.name);
            return _this.http.post(_this.actionUrl + "logo/" + fileName, formData, true).map(function (response) { return response.text(); });
        };
        this.actionUrl = configuration.serverWithApiUrl + "club/";
    }
    return ClubService;
}());
ClubService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [index_1.HttpWrapper, app_constants_1.Configuration])
], ClubService);
exports.ClubService = ClubService;
//# sourceMappingURL=club.service.js.map