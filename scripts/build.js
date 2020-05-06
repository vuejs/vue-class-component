const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const uglify = require('uglify-es')
const rollup = require('rollup')
const replace = require('rollup-plugin-replace')
const babel = require('rollup-plugin-babel')
const version = process.env.VERSION || require('../package.json').version
const banner = `/**
  * vue-class-component v${version}
  * (c) 2015-present Evan You
  * @license MIT
  */`

if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist')
}

const resolve = (_path) => path.resolve(__dirname, '../', _path)

const babelConfigForModern = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        targets: {
          esmodules: true,
        },
      },
    ],
  ],
}

const babelConfigForLegacy = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
      },
    ],
  ],
}

build(
  [
    {
      file: resolve('dist/vue-class-component.global.js'),
      format: 'iife',
      env: 'development',
    },
    {
      file: resolve('dist/vue-class-component.global.prod.js'),
      format: 'iife',
      env: 'production',
      minify: true,
    },
    {
      file: resolve('dist/vue-class-component.cjs.js'),
      format: 'cjs',
    },
    {
      file: resolve('dist/vue-class-component.esm-bundler.js'),
      format: 'esm',
    },
    {
      file: resolve('dist/vue-class-component.esm-browser.js'),
      format: 'esm',
      env: 'development',
    },
    {
      file: resolve('dist/vue-class-component.esm-browser.prod.js'),
      format: 'esm',
      env: 'production',
      minify: true,
    },
  ].map((options) => {
    return {
      config: genConfig(options),
      options,
    }
  })
).catch(() => {
  process.exit(1)
})

function genConfig(opts) {
  const config = {
    input: {
      input: resolve('lib/index.js'),
      external: ['vue'],
      plugins: [
        babel(
          opts.format === 'esm' && typeof opts.env === 'string'
            ? babelConfigForModern
            : babelConfigForLegacy
        ),
        replace({
          __DEV__: opts.env
            ? JSON.stringify(opts.env === 'development')
            : "process.env.NODE_ENV !== 'production'",
        }),
      ],
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueClassComponent',
      exports: 'named',
      globals: {
        vue: 'Vue',
      },
    },
  }

  return config
}

function build(builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    const { config, options } = builds[built]
    return buildEntry(config, options)
      .then(() => {
        built++
        if (built < total) {
          return next()
        }
      })
      .catch((error) => {
        logError(error)
        throw error
      })
  }

  return next()
}

function buildEntry({ input, output }, options) {
  const isMinify = options.minify
  return rollup
    .rollup(input)
    .then((bundle) => bundle.generate(output))
    .then((result) => {
      const { code } = result.output[0]
      if (isMinify) {
        const minified = uglify.minify(code, {
          output: {
            preamble: output.banner,
            ascii_only: true,
          },
        }).code
        return write(output.file, minified, true)
      } else {
        return write(output.file, code)
      }
    })
}

function write(dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report(extra) {
      console.log(
        blue(path.relative(process.cwd(), dest)) +
          ' ' +
          getSize(code) +
          (extra || '')
      )
      resolve()
    }

    fs.writeFile(dest, code, (err) => {
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

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError(e) {
  console.log(e)
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}
