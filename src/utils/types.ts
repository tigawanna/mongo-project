import { z } from "zod";

const envVariables = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]),
    GH_PAT:z.string()
})

envVariables.parse(process.env)

declare global {
    namespace NodeJS {
        interface ProcessEnv 
        extends z.infer<typeof envVariables> {}
    }
}
