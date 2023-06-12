module.exports = {
    client: {
        service: {
            name: 'trello-clone-laravel',
            // URL to the GraphQL API
            url: 'http://127.0.0.1:8000/graphql',
        },
        // Files processed by the extension
        includes: [
            'src/**/*.vue',
            'src/**/*.js',
        ],
    },
}
