import { Request } from "express";
import { DecodedPackageJson, ViewerRepos } from "./user_pkgs/types";

export interface IPkgRepo{
    id: string;
    name: string;
    nameWithOwner: string;
}

export interface PkgsRequest extends Request {
    pkgs?: IPkgRepo[];
    pkgs_json_promises?:DecodedPackageJson[]
}
