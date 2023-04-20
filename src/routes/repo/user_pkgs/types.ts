export interface ViewerRepos {
    data: Data | BadDataGitHubError
}

export interface Data {
    viewer: Viewer
}

export interface Viewer {
    repositories: Repositories
}

export interface Repositories {
    totalCount: number
    nodes: Node[]
}

export interface Node {
    id: string
    name: string
    nameWithOwner: string
}


export interface BadDataGitHubError {
    message: string
    documentation_url: string
}




// response from querying package.json of a repository
export interface RepoRawPKGJSON {
    name: string;
    path: string;
    sha: string;
    size: number;
    url: string;
    html_url: string;
    git_url: string;
    download_url: string;
    type: string;
    content: string;
    encoding: string;
    _links: RepoRawPKGJSONLinks;
}

export interface RepoRawPKGJSONLinks {
    self: string;
    git: string;
    html: string;
}


export type KeyStringObject = { [key: string]: string }

export interface RequiredDecodedPackageJson {
    name: string
    private?: boolean
    version: string
    type?: string
    scripts: KeyStringObject
    dependencies: KeyStringObject
    devDependencies: KeyStringObject
    [key: string]: any | undefined;

}

export type DecodedPackageJson = (RequiredDecodedPackageJson & {
    favdeps?: string[],
    pkg_type?: TPkgType
}) | BadDataGitHubError

export type PlainDecodedPackageJson = (RequiredDecodedPackageJson & {
    favdeps: string[],
    pkg_type: TPkgType
}) 
export type DecodedPackageJsonList = (RequiredDecodedPackageJson)


export type DepsComBo = "React + Vite" | "React" | "Vite" | "Rakkasjs" | "Nextjs" | "Nodejs"

export interface Packageinfo {
    name: string;
    version: string;
    type?: string;
    scripts: Record<string, string> | undefined;
    dependencies: Record<string, string> | undefined;
    devDependencies: Record<string, string> | undefined;
}


export interface TPkgObjValue {
    name: string;
    dependencies: Set<string>
    // devDependencies:string[]
    count: number;
}

export type TPkgObjs = { [key in DepsComBo]: TPkgObjValue }

export type TPkgType = "React+Vite" | "React+Relay" | "Rakkasjs" | "Nextjs" | "Nodejs" | "Others"

export const pkgTypesArr = ["React+Vite" , "React+Relay","Rakkasjs", "Nextjs", "Nodejs","Others"] as const

export type TPkgTypeObj = { [key in typeof pkgTypesArr[number]]:
    {
    name: string|null; 
    dependencies:string[];
    count: number
    } }



// export type IMostFaveDeps = `${typeof mostFaveDepsList[number]}`;

export class CustomError extends Error {
    cause?: Error;
    constructor(message: string, cause?: Error) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.cause = cause;
    }
}
