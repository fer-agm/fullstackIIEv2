// Karma + Jasmine (+ webpack/babel para compilar JSX). Cobertura con karma-coverage.
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', 'webpack'],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-coverage',
    ],

    // Un solo punto de entrada: carga todos los *.spec.js(x) de src/tests
    files: ['src/tests/index.cjs'],
    preprocessors: { 'src/tests/index.cjs': ['webpack'] },

    webpack: {
      mode: 'development',
      devtool: false,
      resolve: { extensions: ['.js', '.jsx'] },
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: { chrome: '100' } }],
                  ['@babel/preset-react', { runtime: 'automatic' }],
                ],
                // Instrumenta el código de la app para medir cobertura (no los tests)
                plugins: [['istanbul', { exclude: ['src/tests/**', '**/*.spec.*'] }]],
              },
            },
          },
        ],
      },
    },

    client: { jasmine: { timeoutInterval: 10000 } },

    reporters: ['spec', 'coverage'],
    coverageReporter: {
      dir: 'coverage',
      reporters: [{ type: 'html' }, { type: 'text' }, { type: 'text-summary' }, { type: 'lcovonly' }],
    },
    specReporter: { suppressPassed: false, suppressSkipped: true },

    browsers: ['ChromeHeadlessCI'],
    customLaunchers: {
      // --no-sandbox permite correr como root (CI/contenedores)
      ChromeHeadlessCI: { base: 'ChromeHeadless', flags: ['--no-sandbox', '--disable-gpu'] },
    },
    singleRun: true,
  });
};
