"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
const zod_1 = require("zod");
const envVariables = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]),
    GH_PAT: zod_1.z.string()
});
envVariables.parse(process.env);
class CustomError extends Error {
    constructor(message, cause) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}
exports.CustomError = CustomError;
