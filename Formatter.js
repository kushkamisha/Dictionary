'use strict'

const { Transform } = require('stream')

module.exports = class Formatter extends Transform {

    constructor(options = { objectMode: true }) {
        super(options)
    }

    _transform(chunk, encoding, done) {
        // In
        let data = chunk.toString().split('\n')

        // Format
        data = data.map(x => x.replace(/&#769;/g, '́')) // replace apostrophes
        data = data.map(x => x.replace(/&#185;/g, '')) // remove `¹`
        data = data.map(x => x.replace(/&#178;/g, '')) // remove `²`
        data = data.map(x => x.replace(/&#179;/g, '')) // remove `³`
        // remove  `́`
        data = data.filter(x => x !== '') // remove line breaks
        data = data.filter(x => isNaN(x)) // remove numbers
        data = data.filter(x => x[0] !== '-') // lines start with `-`
        // remove all text after a comma (with the comma itself).
        // The exception is if the following word starts with the capital letter => then put it on the next line
        data = this.removeCommas(data)
        // data = data.map(x => x = x.slice(0, x.indexOf(';') === -1 ? undefined : x.indexOf(';'))) // remove all after `;`
        data = data.map(x => x = x.slice(0, x.indexOf('(') === -1 ? undefined : x.indexOf('('))) // remove all after `(`
        data = data.map(x => x = x.slice(0, x.indexOf(')') === -1 ? undefined : x.indexOf(')'))) // remove all after `)`

        data = data.map(x => x.trim())
        data = data.filter(x => !x.includes(' '))
        data = data.map(x => {
            if (!x.includes('́')) {
                
            }
        }) // add stress after `ё`

        // `\`
        // `ё`
        // 

        console.log(data.filter(x => !x.includes('́')))

        // Out
        data = data.join('\n')
        done(null, data)
    }

    // _flush(done) {
    //     done()
    // }

    removeCommas(data) {
        const newData = []
        data.forEach(line => {

            let pushed = false
            if (line.indexOf(',') !== -1) {
                const following = line.slice(line.indexOf(',') + 1).trim()
                if (following !== '') {
                    if (!this.isUpperCase(following[0])) {
                        line = line.slice(0, line.indexOf(','))
                    } else {
                        line.split(',').map(x => newData.push(x.trim()))
                        pushed = true
                    }
                }
            }
            if (pushed)
                pushed = false
            else
                newData.push(line)
        })

        return newData
    }

    isUpperCase(letter) {
        return letter === letter.toUpperCase() && letter !== letter.toLowerCase()
    }
}
