const mix = require('laravel-mix');

mix.js('src/assets/js/app.js', 'public/js')
   .sass('src/assets/sass/app.scss', 'public/css');

// Webpack configuration
mix.webpackConfig({
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    }
});
