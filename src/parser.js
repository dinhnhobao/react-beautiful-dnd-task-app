const parseBlock = ({ type, input1, input2, operator }) => {
    switch (type) {
        case 0: case 1:
            return [input1, operator, input2].join(" ");
        case 2:
            return `def ${input1}(${input2}):`;
    };
}

