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
        { id: 10 },
        { id: 11 },
        { id: 12 },
        { id: 13 },
        { id: 14 }
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
        },
        10: {
            type: 6, // for i in range():
            input1: "i",
            input2: "1, n"
        },
        11: {
            type: 7, // if
            input1: "condition",
        },
        12: {
            type: 8, // elif
            input1: "condition"
        },
        13: { // else
            type: 9,
        },
        14: {
            type: 10,
            input1: "i"
        }
    },
}

const BLOCK = {
    type: 1,
    input1: "x",
    input2: "1",
    operator: "<=",
}

const MODEL_BLOCKS = [
    {
        type: 2,
        input1: "count",
        input2: "x,y,z"
    },
    {
        type: 4,
        input1: "num",
    },
    {
        type: 7,
        input1: "cond"
    }, {
        type: 8,
        input1: "cond"
    }, {
        type: 9,
    },
    {
        type: 6,
        input1: "i",
        input2: "1,n+1"
    },
    {
        type: 0,
        input1: "x",
        input2: "1",
        operator: "+=",
    },
    {
        type: 3,
        input1: "x",
        input2: "x + 1",
    },
    {
        type: 1,
        input1: "x",
        input2: "100",
        operator: "<",
    },

    {
        type: 5,
        input1: "x == 0",
        input2: "y == 0",
        operator: "and"
    },

]

const SHORT_TREE = {
    items: [
        {
            id: 0, children: [
                { id: 1 }
            ]
        },
    ],
    inputs: {
        0: {
            type: 6, // for i in range():
            input1: "i",
            input2: "1, 4"
        },
        1: {
            type: 10,
            input1: "i"
        }
    }
}

const SHORT_PROGRAM = {
    items: [
        { id: 0 },
        { id: 1 },
        {
            id: 2, children: [
                {
                    id: 5, children: [
                        { id: 3 }
                    ]
                },
                {
                    id: 6, children: [
                        { id: 7 }
                    ],
                },
                {
                    id: 8, children: [
                        { id: 9 }
                    ]
                }
            ]
        },
        { id: 4 }
    ],
    inputs: {
        0: {
            type: 3,
            input1: "total",
            input2: "0",
        },
        1: {
            type: 3,
            input1: "N",
            input2: "10",
        },
        2: {
            type: 6, // for i in range():
            input1: "i",
            input2: "N"
        },
        3: {
            type: 0,
            input1: "total",
            input2: "i",
            operator: "+=",
        },
        4: {
            type: 10,
            input1: "total"
        },
        5: {
            type: 7,
            input1: "i % 2 == 0"
        },
        6: {
            type: 8,
            input1: "i % 3 == 0"
        },
        7: {
            type: 0,
            input1: "total",
            input2: "3*i",
            operator: "+=",
        },
        8: {
            type: 9
        },
        9: {
            type: 0,
            input1: "total",
            input2: "1",
            operator: "-=",
        }
    }
}
module.exports = { BLOCK, MODEL_BLOCKS, TREE, SHORT_TREE, SHORT_PROGRAM }