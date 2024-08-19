/** @type {import('next').NextConfig} */
// eslint-disable-next-line no-undef
module.exports = {
  reactStrictMode: false, // Desativa o React Strict Mode
  images: {
    domains: ['picsum.photos', 'localhost', '15.229.209.248']
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(pdf)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next',
            outputPath: 'static/media',
            name: '[name].[ext]',
            esModule: false
          }
        }
      ]
    })

    return config
  }
}
