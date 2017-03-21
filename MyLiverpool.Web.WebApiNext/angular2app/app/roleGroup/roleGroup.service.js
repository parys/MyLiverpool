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
var httpWrapper_1 = require("../shared/httpWrapper");
var RoleGroupService = (function () {
    function RoleGroupService(http, configuration) {
        var _this = this;
        this.http = http;
        this.configuration = configuration;
        this.getAll = function () {
            return _this.http.get(_this.actionUrl).map(function (res) { return res.json(); });
        };
        this.actionUrl = configuration.serverWithApiUrl + "roleGroup/";
    }
    return RoleGroupService;
}());
RoleGroupService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [httpWrapper_1.HttpWrapper, app_constants_1.Configuration])
], RoleGroupService);
exports.RoleGroupService = RoleGroupService;
//# sourceMappingURL=roleGroup.service.js.map