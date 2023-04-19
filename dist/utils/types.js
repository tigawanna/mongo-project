"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const envVariables = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]),
    GH_PAT: zod_1.z.string()
});
envVariables.parse(process.env);
