import { BadDataGitHubError, ViewerRepos } from "./type"

export async function getViewerRepos(viewer_token: string) {
    // console.log("viewerr token  === ", viewer_token)
    const query = `
    query($first: Int!) {
    viewer {
    repositories(first:$first,isFork: false, orderBy: {field: PUSHED_AT, direction: DESC}) {
      nodes {
        id
        name
        nameWithOwner
      }
    }
  }
}
`
    try {
        const response = await fetch('https://api.github.com/graphql', {
            method: 'POST',
            headers: {

                "Authorization": `bearer ${viewer_token}`,
                "Content-Type": "application/json",
                "accept": "application/vnd.github.hawkgirl-preview+json"
            },
            body: JSON.stringify({
                query,
                variables: {
                    first: 50
                },
                // operationName,
            }),
        })
        const data = await response.json() as unknown as ViewerRepos
        console.log("all user repositories ===== ", data)

        if("message" in data){
            console.log("error fetching viewer repos  ==> ", data)
            throw data
        }

        return data

    } catch (err) {
        console.log("error fetching viewer repos  ==> ", err)
        return err as BadDataGitHubError
    }
}
