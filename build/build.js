const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const uglify = require('uglify-js')
const rollup = require('rollup')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const banner =
`/**
  * vue-class-component v${version}
  * (c) 2015-${new Date().getFullYear()} Evan You
  * @license MIT
  */`

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const resolve = _path => path.resolve(__dirname, '../', _path)

build([
  {
    dest: resolve('dist/vue-class-component.js'),
    format: 'umd',
    env: 'development'
  },
  {
    dest: resolve('dist/vue-class-component.min.js'),
    format: 'umd',
    env: 'production'
  },
  {
    dest: resolve('dist/vue-class-component.common.js'),
    format: 'cjs'
  }
].map(genConfig))

function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

function genConfig (opts) {
  const config = {
    entry: resolve('lib/index.js'),
    dest: opts.dest,
    format: opts.format,
    banner,
    moduleName: 'VueClassComponent',
    exports: 'named',
    external: ['vue'],
    globals: {
      vue: 'Vue'
    },
    plugins: []
  }

  if (opts.env) {
    config.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}

function buildEntry (config) {
  const isProd = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then(bundle => {
    const code = bundle.generate(config).code
    if (isProd) {
      var minified = uglify.minify(code, {
        output: {
          preamble: config.banner
        }
      }).code
      return write(config.dest, minified, true)
    } else {
      return write(config.dest, code)
    }
  })
}

function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
