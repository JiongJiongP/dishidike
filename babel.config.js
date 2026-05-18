module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        browsers: ['last 3 versions', 'Android >= 4.1', 'ios >= 8']
      }
    }],
    ['@babel/preset-react', {
      runtime: 'automatic'
    }],
    ['@babel/preset-typescript']
  ],
  plugins: [
    ['transform-remove-strict-mode']
  ]
}
