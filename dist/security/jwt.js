"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT = void 0;
var jwt = require("jsonwebtoken");
var uuid_1 = require("uuid");
var RefreshToken_1 = require("../entity/RefreshToken");
var moment = require("moment");
var database_1 = require("../database");
var env_config_1 = require("../config/env.config");
var JWT = /** @class */ (function () {
    function JWT() {
    }
    JWT.generateTokenAndRefreshToken = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var payload, jwtId, token, refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        payload = {
                            id: user.id,
                            email: user.email,
                            role: user.role,
                        };
                        jwtId = uuid_1.v4();
                        token = jwt.sign(payload, this.JWT_SECRET, {
                            expiresIn: "1h",
                            jwtid: jwtId,
                            subject: user.id.toString(),
                        });
                        return [4 /*yield*/, this.generateRefreshTokenForUserAndToken(user, jwtId)];
                    case 1:
                        refreshToken = _a.sent();
                        return [2 /*return*/, { token: token, refreshToken: refreshToken }];
                }
            });
        });
    };
    JWT.generateRefreshTokenForUserAndToken = function (user, jwtId) {
        return __awaiter(this, void 0, void 0, function () {
            var refreshToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        refreshToken = new RefreshToken_1.RefreshToken();
                        refreshToken.user = user;
                        refreshToken.jwtId = jwtId;
                        refreshToken.expiryDate = moment().add(10, "d").toDate();
                        return [4 /*yield*/, database_1.Database.refreshTokenRepository.save(refreshToken)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, refreshToken.id];
                }
            });
        });
    };
    JWT.isTokenValid = function (token) {
        try {
            jwt.verify(token, this.JWT_SECRET, {
                ignoreExpiration: false,
            });
            return true;
        }
        catch (error) {
            return false;
        }
    };
    JWT.getJwtId = function (token) {
        var decodedToken = jwt.decode(token);
        return decodedToken["jti"];
    };
    JWT.isRefreshTokenLinkedToToken = function (refreshToken, jwtId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!refreshToken)
                    return [2 /*return*/, false];
                if (refreshToken.jwtId !== jwtId)
                    return [2 /*return*/, false];
                return [2 /*return*/, true];
            });
        });
    };
    JWT.isRefreshTokenExpired = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!refreshToken)
                    throw new Error("Refresh token does not exist!");
                if (moment().isAfter(refreshToken.expiryDate))
                    return [2 /*return*/, true];
                return [2 /*return*/, false];
            });
        });
    };
    JWT.isRefreshTokenUsedOrInvalidated = function (refreshToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, refreshToken.used || refreshToken.invalidated];
            });
        });
    };
    JWT.getJwtPayloadValueByKey = function (token, key) {
        var decodedToken = jwt.decode(token);
        return decodedToken[key];
    };
    JWT.JWT_SECRET = env_config_1.default.jwtSecret;
    return JWT;
}());
exports.JWT = JWT;
