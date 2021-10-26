const { TREE, BLOCK } = require('./constants');
const fs = require('fs');

const parseBlock = ({ type, input1, input2, operator }) => {
    switch (type) {
        case 0: case 1: case 5:
            return [input1, operator, input2].join(" ");
        case 3:
            return [input1, "=", input2].join(" ");
        case 2:
            return `def ${input1}(${input2}):`;
        case 4:
            return `return ${input1}`
        case 6:
            return `for ${input1} in range(${input2}):`
        case 7:
            return `if (${input1}):`
        case 8:
            return `elif (${input1}):`
        case 9:
            return `else:`
    };
}

const parseTree = ({ items, inputs }) => {
    return parseTreeHelper({ items, inputs, indent: 0 });
}

const parseTreeHelper = ({ items, inputs, indent }) => {
    if (items === undefined) {
        return [];
    }

    let result = [];
    for (let i = 0; i < items.length; i++) {
        let item = items[i];

        result.push({
            indent: indent,
            command: item['id'],
            command: parseBlock(inputs[item['id'].toString()]),
        });

        let childBlocks = parseTreeHelper({
            items: items[i].children,
            inputs: inputs,
            indent: indent + 4
        });

        result = result.concat(childBlocks);
    }

    return JSON.parse(JSON.stringify(result)); // deep copy
}

const saveToFile = (parsedTree) => {
    var result = '';
    for (let i = 0; i < parsedTree.length; i++) {
        result += String.fromCharCode(160).repeat(parsedTree[i].indent) + parsedTree[i].command;
        result += '\n';
    }

    const FILE_DIRECTORY = './files';
    if (!fs.existsSync(FILE_DIRECTORY)) { // create directory if not exists
        fs.mkdirSync(FILE_DIRECTORY);
    }

    const FILENAME = `${getRandomString()}.py`

    fs.writeFile(FILE_DIRECTORY + "/" + FILENAME, result, function (err) {
        if (err) return console.log(err);
        console.log(`File ${FILENAME} has been saved`);
    });
}

const getRandomString = () => { // returns a random string of length 5
    return Math.random().toString(36).substr(2, 5);
}

// console.log(parseBlock(BLOCK));
// console.log(parseTree(TREE));
console.log(saveToFile(parseTree(TREE)));
module.exports = { parseBlock, parseTree }