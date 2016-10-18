"use strict";
var index_1 = require("./index");
exports.accountRoutes = [
    { path: "signup", component: index_1.AccountSignupComponent },
    { path: "confirmEmail/:id/:code", component: index_1.ConfirmEmailComponent }
];
//# sourceMappingURL=account.routing.js.map