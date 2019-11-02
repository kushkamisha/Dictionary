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
        data = data.map(x => x = x.slice(0, x.indexOf('(') === -1 ? undefined : x.indexOf('('))) // remove all after `(`
        data = data.map(x => x = x.slice(0, x.indexOf(')') === -1 ? undefined : x.indexOf(')'))) // remove all after `)`

        data = data.map(x => x.trim())
        data = data.filter(x => !x.includes(' '))
        
        // Remove all symbols which aren't russian letters or hyphen
        data = this.removeSpecialSymbols(data)
    
        // Add stress sign for words with only 1 vowel or letter `ё`
        // (in this case the stress will be always on the letter `ё`)
        data = this.addStressSigns(data)

        data = data.filter(x => x.length > 1)

        // Post processing
        // for (let i = 0; i < data.length; i++) {
        //     if (data[i] === '')
        // }

        // console.log(data.filter(x => !x.includes('́')))

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

    removeSpecialSymbols(data) {
        const letters = new Array(64).fill(0).map((x, i) => String.fromCharCode(i + 1040))
        letters.push(String.fromCharCode(1025)) // Ё
        letters.push(String.fromCharCode(1105)) // ё
        letters.push(String.fromCharCode(45)) // -
        letters.push(String.fromCharCode(769)) //  ́

        const newData = []
        for (let word of data) {
            let line = ''
            for (let letter of word)
                if (letters.includes(letter)) line += letter
            newData.push(line)
        }

        return newData
    }

    addStressSigns(data) {
        const stressSign = '́'
        const newData = []
        for (let word of data) {
            if (!word.includes(stressSign)) {
                if (word.indexOf('ё') !== -1)
                    newData.push(
                        this.insertInPosition(word, stressSign, word.indexOf('ё') + 1)
                    )
                else if (word.indexOf('Ё') !== -1)
                    newData.push(
                        this.insertInPosition(word, stressSign, word.indexOf('Ё') + 1)
                    )
                else if (this.onlyOneVowel(word) !== -1)
                    newData.push(
                        this.insertInPosition(word, stressSign, this.onlyOneVowel(word) + 1)
                    )
                else
                        newData.push(word)
            } else {
                newData.push(word)
            }
        }

        return newData
    }

    insertInPosition(str, symbol, position) {
        return [str.slice(0, position), symbol, str.slice(position)].join('')
    }

    // @returns -1 if more than 1 vowel in the word
    // @returns index of the vowel if only one vowel in the word
    onlyOneVowel(word) {
        const vowels = ['а', 'о', 'и', 'е', 'э', 'ы', 'у', 'ю', 'я',
                        'А', 'О', 'И', 'Е', 'Э', 'Ы', 'У', 'Ю', 'Я']
        let occurences = 0
        let lastIndex = 0

        for (let i = 0; i < word.length; i++) {
            if (vowels.includes(word[i])) {
                ++occurences
                lastIndex = i
            }
        }
        
        return occurences === 1 ? lastIndex : -1
    }
}
