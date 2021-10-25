const TREE = {
    items: [
        { id: 0 },
        {
            id: 1,
            children: [
                { id: 2 },
                {
                    id: 5, children: [
                        { id: 6 }
                    ]
                },
            ]
        },
        { id: 3 },
        { id: 4 },
        { id: 7 },
        { id: 8 },
        { id: 9 },
    ],
    inputs: {
        0: {
            type: 0,
            input1: "x",
            input2: "1",
            operator: "+=",
        },
        1: {
            type: 1,
            input1: "x",
            input2: "1",
            operator: "<=",
        },
        2: {
            type: 0,
            input1: "x",
            input2: "1",
            operator: "+=",
        },
        3: {
            type: 1,
            input1: "x",
            input2: "1",
            operator: ">",
        },
        4: {
            type: 2, // def 
            input1: "count",
            input2: "x,y,z"
        },
        5: {
            type: 1,
            input1: "x",
            input2: "1",
            operator: ">",
        },
        6: {
            type: 1,
            input1: "x",
            input2: "1",
            operator: ">",
        },
        7: {
            type: 3, // assignment
            input1: "x",
            input2: "1",
        },
        8: {
            type: 4, // return
            input1: "x"
        },
        9: {
            type: 5, // and/or
            input1: "x",
            input2: "y",
            operator: "and"
        }
    },
}

const BLOCK = {
    type: 1,
    input1: "x",
    input2: "1",
    operator: "<=",
}
module.exports = { BLOCK, TREE }