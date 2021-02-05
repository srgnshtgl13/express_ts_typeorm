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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshToken = void 0;
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var RefreshToken = /** @class */ (function () {
    function RefreshToken() {
    }
    __decorate([
        typeorm_1.PrimaryGeneratedColumn("uuid"),
        __metadata("design:type", String)
    ], RefreshToken.prototype, "id", void 0);
    __decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, function (user) { return user.refreshTokens; }, {
            onDelete: "CASCADE",
        }),
        __metadata("design:type", User_1.User)
    ], RefreshToken.prototype, "user", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", String)
    ], RefreshToken.prototype, "jwtId", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], RefreshToken.prototype, "used", void 0);
    __decorate([
        typeorm_1.Column({ default: false }),
        __metadata("design:type", Boolean)
    ], RefreshToken.prototype, "invalidated", void 0);
    __decorate([
        typeorm_1.Column(),
        __metadata("design:type", Date)
    ], RefreshToken.prototype, "expiryDate", void 0);
    __decorate([
        typeorm_1.CreateDateColumn(),
        __metadata("design:type", Date)
    ], RefreshToken.prototype, "creationDate", void 0);
    __decorate([
        typeorm_1.UpdateDateColumn(),
        __metadata("design:type", Date)
    ], RefreshToken.prototype, "updateDate", void 0);
    RefreshToken = __decorate([
        typeorm_1.Entity()
    ], RefreshToken);
    return RefreshToken;
}());
exports.RefreshToken = RefreshToken;
