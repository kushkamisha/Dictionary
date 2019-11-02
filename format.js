'use strict'

const fs = require('fs')
const Formatter = require('./Formatter')


const formatter = new Formatter()
const filename = 'data/original/Lopatin.txt'
const out = 'data/processed/Lopatin.txt'
const readStream = fs.createReadStream(filename, { encoding: 'utf8' })
const writeStream = fs.createWriteStream(out)

readStream
    .pipe(formatter)
    .pipe(writeStream)
    .on('close', () => readStream.destroy())
