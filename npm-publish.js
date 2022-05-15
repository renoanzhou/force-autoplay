const { copyFile } = require('fs/promises')
const util = require('util')
const packageJson = require('./package.json')
const fs = require('fs/promises')
const exec = util.promisify(require('child_process').exec)

function deleteUseless (json, deleteKey) {
  deleteKey.forEach(name => {
    if (json[name]) delete json[name]
  })
}

function replaceUselessPath (json, replaceKey) {
  replaceKey.forEach(name => {
    if (json[name]) json[name] = json[name].replace('dist/', '')
  })
}

deleteUseless(packageJson, ['devDependencies', 'scripts'])
replaceUselessPath(packageJson, ['main', 'module', 'browser', 'typings'])

copyFile('./README.md', './dist/README.md')

fs.writeFile('./dist/package.json', JSON.stringify(packageJson)).then(async () => {
  const { error, stdout, stderr } = await exec('npm publish', {
    cwd: './dist'
  })

  console.log(error, stdout, stderr)
})
