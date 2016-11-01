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
var forms_1 = require("@angular/forms");
var common_1 = require("@angular/common");
var materialComment_model_1 = require("./materialComment.model");
var materialComment_service_1 = require("./materialComment.service");
var index_1 = require("../shared/index");
var ng2_bootstrap_1 = require("ng2-bootstrap/ng2-bootstrap");
var MaterialCommentDetailComponent = (function () {
    //  selectedItemIndex: number = undefined;
    //  @ViewChild("deleteModal") deleteModal: ModalDirective;
    function MaterialCommentDetailComponent(materialCommentService, location, rolesChecked, formBuilder) {
        this.materialCommentService = materialCommentService;
        this.location = location;
        this.rolesChecked = rolesChecked;
        this.formBuilder = formBuilder;
    }
    MaterialCommentDetailComponent.prototype.ngOnInit = function () {
        this.roles = this.rolesChecked.checkedRoles;
        this.commentForm = this.formBuilder.group({
            'message': ["", forms_1.Validators.compose([
                    forms_1.Validators.required])]
        });
    };
    MaterialCommentDetailComponent.prototype.showAddCommentModal = function (index) {
        this.addCommentModal.show();
    };
    MaterialCommentDetailComponent.prototype.hideModal = function () {
        console.log(this.commentForm.controls["message"].value);
        this.addCommentModal.hide();
        this.deleteModal.hide();
    };
    MaterialCommentDetailComponent.prototype.showDeleteModal = function (index) {
        this.deleteModal.show();
    };
    MaterialCommentDetailComponent.prototype.addComment = function (value) {
        var _this = this;
        var comment = new materialComment_model_1.MaterialComment();
        comment.message = this.commentForm.controls["message"].value;
        comment.materialId = this.materialId;
        comment.parentId = this.item.id;
        this.materialCommentService.create(comment)
            .subscribe(function (data) {
            _this.item.children.push(data);
            _this.commentForm.controls["message"].patchValue("");
            _this.commentForm.controls["message"].updateValueAndValidity();
            _this.addCommentModal.hide();
        }, function (error) { return console.log(error); }, function () { });
    };
    MaterialCommentDetailComponent.prototype.delete = function () {
        var _this = this;
        var result;
        this.materialCommentService.delete(this.item.id)
            .subscribe(function (res) { return result = res; }, function (e) { return console.log(e); }, function () {
            if (result) {
                _this.item.children.forEach(function (x) {
                    if (_this.parent) {
                        x.parentId = _this.parent.id;
                        _this.parent.children.push(x);
                    }
                    else {
                        x.parentId = undefined;
                    }
                });
                _this.item = undefined;
                // this.items.splice(this.selectedItemIndex, 1);
                _this.hideModal();
            }
        });
    };
    MaterialCommentDetailComponent.prototype.edit = function () {
        //  this.materialCommentService.delete(this.items[index].id).subscribe(data => data,
        //      error => console.log(error),
        //    () => console.log("success remove categoryu"));
        //this.items.splice(index, 1);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', materialComment_model_1.MaterialComment)
    ], MaterialCommentDetailComponent.prototype, "item", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MaterialCommentDetailComponent.prototype, "deep", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MaterialCommentDetailComponent.prototype, "canCommentary", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MaterialCommentDetailComponent.prototype, "materialId", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', materialComment_model_1.MaterialComment)
    ], MaterialCommentDetailComponent.prototype, "parent", void 0);
    __decorate([
        core_1.ViewChild("addCommentModal"), 
        __metadata('design:type', ng2_bootstrap_1.ModalDirective)
    ], MaterialCommentDetailComponent.prototype, "addCommentModal", void 0);
    __decorate([
        core_1.ViewChild("deleteModal"), 
        __metadata('design:type', ng2_bootstrap_1.ModalDirective)
    ], MaterialCommentDetailComponent.prototype, "deleteModal", void 0);
    MaterialCommentDetailComponent = __decorate([
        core_1.Component({
            selector: "materialComment-detail",
            templateUrl: "app/materialComment/materialComment-detail.component.html"
        }), 
        __metadata('design:paramtypes', [materialComment_service_1.MaterialCommentService, common_1.Location, index_1.RolesCheckedService, forms_1.FormBuilder])
    ], MaterialCommentDetailComponent);
    return MaterialCommentDetailComponent;
}());
exports.MaterialCommentDetailComponent = MaterialCommentDetailComponent;
//# sourceMappingURL=materialComment-detail.component.js.map