const FIRST = {
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
        { id: 4 }
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
        }
    },
}

export default FIRST;