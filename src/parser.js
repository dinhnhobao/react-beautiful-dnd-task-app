import { FIRST } from './constants';

const parseBlock = ({ type, input1, input2, operator }) => {
    switch (type) {
        case 0: case 1:
            return [input1, operator, input2].join(" ");
        case 2:
            return `def ${input1}(${input2}):`;
    };
}

const parseTree = ({ items, inputs, indent }) => {
    if (items == undefined) {
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

        let childBlocks = parseTree({
            items: items[i].children,
            inputs: inputs,
            indent: indent + 4
        });

        result = result.concat(childBlocks);
    }

    return JSON.parse(JSON.stringify(result)); // deep copy
}

// console.log(parseBlock({
//     type: 1,
//     input1: "x",
//     input2: "1",
//     operator: "<=",
// }));


console.log(parseTree({
    items: FIRST.items,
    inputs: FIRST.inputs,
    indent: 0
}))
module.exports = { parseBlock }