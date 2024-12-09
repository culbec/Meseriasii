"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthMiddleware = createAuthMiddleware;
const utils_1 = require("../utils/utils");
const log = (0, utils_1.getLogger)("AuthMiddleware");
async function createAuthMiddleware(service) {
    return async (ctx, next) => {
        var _a;
        const token = (_a = ctx.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        log("token", token);
        if (!token) {
            ctx.status = 401;
            ctx.body = { message: "Unauthorized" };
            return;
        }
        const decodedToken = service.verifyToken(token);
        log("decodedToken", decodedToken);
        if (!decodedToken || typeof decodedToken === "string") {
            ctx.status = 401;
            ctx.body = { message: "Unauthorized" };
            return;
        }
        const username = decodedToken.username;
        if (!service.checkLoggedIn(token)) {
            ctx.status = 401;
            ctx.body = { message: "Unauthorized" };
            return;
        }
        ctx.state.username = username;
        ctx.state.token = token;
        await next();
    };
}
