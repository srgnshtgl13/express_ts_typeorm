"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["CHIEFEDITOR"] = "chiefeditor";
    UserRole["EDITOR"] = "editor";
    UserRole["USER"] = "user";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserDTO = /** @class */ (function () {
    function UserDTO() {
    }
    return UserDTO;
}());
exports.UserDTO = UserDTO;
