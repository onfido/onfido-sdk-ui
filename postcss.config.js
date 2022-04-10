import customMedia from 'postcss-custom-media'
import autoprefixer from 'autoprefixer'
import url from 'postcss-url'

module.exports = {
  plugins: [
    customMedia({
      importFrom: `${__dirname}/src/components/Theme/custom-media.css`,
    }),
    autoprefixer(),
    url({ url: 'inline' }),
  ],
}
