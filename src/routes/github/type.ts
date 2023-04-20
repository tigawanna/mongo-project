

export interface BadDataGitHubError {
    message: string
    documentation_url: string
}

export interface ViewerRepos {
    data: Data 
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


