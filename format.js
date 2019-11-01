'use strict'

const fs = require('fs')
const Formatter = require('./Formatter')


const formatter = new Formatter()
const env = 'tests'
const filename = env === 'test' ? 'test.txt' : 'Lopatin.txt'
const out = 'out.txt'
const readStream = fs.createReadStream(filename, { encoding: 'utf8' })
const writeStream = fs.createWriteStream(out)

readStream
    .pipe(formatter)
    .pipe(writeStream)
    .on('close', () => readStream.destroy())
