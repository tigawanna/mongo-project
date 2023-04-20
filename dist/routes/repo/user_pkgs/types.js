"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = exports.pkgTypesArr = void 0;
exports.pkgTypesArr = ["React+Vite", "React+Relay", "Rakkasjs", "Nextjs", "Nodejs", "Others"];
// export type IMostFaveDeps = `${typeof mostFaveDepsList[number]}`;
class CustomError extends Error {
    constructor(message, cause) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}
exports.CustomError = CustomError;
