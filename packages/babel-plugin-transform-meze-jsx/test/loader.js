var fs = require('fs-promise')

var babel = require('babel-core')
var transform = require('../lib/transform').default

var test = require('tape')

function testFixture (testName, transformedCode, expectedCode) {
  // console.log('=============')
  // console.log(testName)
  // console.log(transformedCode)
  // console.log(expectedCode)
  // console.log('=============')
  test(testName, t => {
    t.equal(
      transformedCode(),
      expectedCode
    )
    t.end()
  })
}

function testThrows (testName, fn, expectedError) {
  // console.log(testName)
  // console.log(transformedCode)
  // console.log(expectedError)
  test(testName, t => {
    t.throws(fn, expectedError)
    t.end()
  })
}

function transformFileContent (source) {
  var result = babel.transform(source, {
    comments: true,
    // We're assuming es2015, as it's, well, 2016 already
    presets: [
      ['es2015', { modules: false }]
    ],
    plugins: [
      transform,
      'transform-runtime'
    ]
  }).code
  return result
}

function getTestNameFromFixture (fixtureFolder) {
  return fixtureFolder
    .match(/(^|\/)([^\/]+)$/i)
    .pop()
    .replace(/-/gi, ' ')
}

function fileBufferToKey (buffer, key) {
  var obj = {}
  obj[key] = buffer.toString()
  return obj
}

function getExpectation (fixtureFolder) {
  return fs.exists(`${fixtureFolder}/expected.js`)
    .then(exists => {
      return (exists
       ? fs.readFile(`${fixtureFolder}/expected.js`)
          .then(buffer => fileBufferToKey(buffer, 'expected'))
       : fs.readJson(`${fixtureFolder}/options.json`)
          .then(opts => Promise.resolve(opts))
      )
    })
}

function isValidTestFolderName (fixtureFolder) {
  return !!fixtureFolder.match(/^[a-zA-Z\-]+$/)
}

function loadFixture (fixtureFolder) {
  // read the code from this file
  return Promise.all(
    [
      fs.readFile(`${fixtureFolder}/actual.js`),
      getExpectation(fixtureFolder)
    ]
  ).then(function ([actual, expected]) {
    return {
      fixtureFolder,
      actual: actual.toString(),
      expected
    }
  })
  .catch(e => {
    console.log(e)
  })
}

function createTest (res) {
  var { fixtureFolder, actual, expected } = res
  var testName = getTestNameFromFixture(fixtureFolder)
  var transformedCode = () => {
    // use our plugin to transform the source
    return transformFileContent(actual)
  }

  if (expected.expected) {
    testFixture(
      testName,
      transformedCode,
      expected.expected
    )
    return Promise.resolve(testName)
  } else if (expected.throws) {
    testThrows(
      testName,
      transformedCode,
      expected.throws
    )
    return Promise.resolve(testName)
  }
  return Promise.reject(testName)
}

function loadTestFixtures (fixturePath, files) {
  return Promise.all(files
    .filter(folder => folder.match(/^\-/) === null)
    .map(function (folder) {
      return isValidTestFolderName(folder)
        ? loadFixture(`${fixturePath}/${folder}`)
        : Promise.resolve(false)
    })
  )
}

module.exports = function (fixturePath) {
  return fs.readdir(fixturePath)
    .then(files => loadTestFixtures(fixturePath, files))
    .then(loadedFixtures => Promise.all(loadedFixtures
        .filter(files => files)
        .map(fixtures => createTest(fixtures))
    ))
}
