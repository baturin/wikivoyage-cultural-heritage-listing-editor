module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: './src/cultural-editor-2.0.js',
    output: {
        filename: 'cultural-editor-2.0.js'
    },
    devServer: {
        index: '',
        contentBase: 'dist',
        proxy: {
            '**': {
                context: () => true,
                target: 'http://127.0.0.1:8080',
                changeOrigin: true
            }
        },
        port: 9999
    }
};
