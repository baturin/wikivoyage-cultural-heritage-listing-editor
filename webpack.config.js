module.exports = {
    mode: 'none',
    entry: [
        './src/cultural-editor-2.0.js'
    ],
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
    },
    plugins: [],
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    }
};
