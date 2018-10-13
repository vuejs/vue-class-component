const fs = require('fs')
const spawn = require('child_process').spawn

run('tsc -w -p .')
run('webpack --config test/webpack.config.js --watch')

fs.watch('test/test.build.js', () => {
  run('mocha --reporter min test/test.build.js')
})

function run (command) {
  const [name, ...args] = command.split(' ')
  spawn(`node_modules/.bin/${name}`, args, {
    shell: true,
    stdio: 'inherit'
  })
}
