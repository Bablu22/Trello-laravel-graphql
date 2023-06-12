const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.extend('graphql', (webpackConfig, options) => {
    // Add GraphQL rules to handle .graphql or .gql files
    webpackConfig.module.rules.push({
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        use: ['graphql-tag/loader'],
    });

    // Add any other necessary rules or modifications to webpackConfig
    // ...

    return webpackConfig;
});

mix.js('resources/js/app.js', 'public/js')
    .vue()
    .postCss('resources/css/app.css', 'public/css', [
        require("tailwindcss"),
    ]);

mix.graphql()

