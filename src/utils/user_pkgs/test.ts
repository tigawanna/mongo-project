const repos = [
    'https://api.github.com/repos/angular/angular',
    'https://api.github.com/repos/facebook/react',
    'https://api.github.com/repos/vuejs/vue'
];

Promise.all(repos.map(async (repo) => {
    try {
        const response = await fetch(`${repo}/contents/package.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch package.json for ${repo}`);
        }
        const packageJSON = await response.json();
        console.log(`Package.json for ${repo}: `, packageJSON);
        return packageJSON;
    } catch (error) {
        console.error(error);
        return null;
    }
}))
    .then((results) => {
        console.log('All package.json files fetched:', results);
    })
    .catch((error) => {
        console.error(error);
    });
