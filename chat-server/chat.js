const uuidv4 = require('uuid').v4;
const fs = require('fs');

const { PythonShell } = require('python-shell');

const messages = new Set();
const users = new Map();
const { getRandomString } = require('./utils');
const defaultUser = {
    id: 'anon',
    name: 'Anonymous',
};

const messageExpirationTimeMS = 5 * 60 * 1000;

class Connection {
    constructor(io, socket) {
        this.socket = socket;
        this.io = io;

        socket.on('getMessages', () => this.getMessages());
        socket.on('message', (value) => this.handleMessage(value));
        socket.on('disconnect', () => this.disconnect());
        socket.on('connect_error', (err) => {
            console.log(`connect_error due to ${err.message}`);
        });
    }

    sendMessage(message) {
        this.io.sockets.emit('message', message);
    }

    getMessages() {
        messages.forEach((message) => this.sendMessage(message));
    }

    handleMessage(value) {
        const message = {
            id: uuidv4(),
            user: users.get(this.socket) || defaultUser,
            value,
            time: Date.now()
        };

        console.log(`message ${JSON.stringify(message)} received`);

        let messageContent = message.value;

        // messageContent = `print(i)`; // for error handling
        const FILE_DIRECTORY = './files';
        if (!fs.existsSync(FILE_DIRECTORY)) { // create directory if not exists
            fs.mkdirSync(FILE_DIRECTORY);
            console.log("Created directory to store files");
        }

        const FILENAME = `${getRandomString()}.py`
        const filePath = FILE_DIRECTORY + "/" + FILENAME;

        fs.writeFileSync(filePath, messageContent, function (err) {
            if (err) return console.log('Error in writing file', err);
            console.log(`File ${FILENAME} has been saved`);
        });

        let result = null;

        let outside_this = this;
        PythonShell.run(filePath, null, function (err, results) {
            if (err) {
                // console.log("Error in running python script", err, typeof err);
                // console.log(error.Error);
                // console.log('Traceback', err.traceback, typeof err.traceback);
                message.value = err; // mutate the message received
            } else {
                // results is an array consisting of messages collected during execution
                console.log('results: %j', results);
                message.value = results.join('\n');
            }
            console.log(`Adding ${JSON.stringify(message)} to messages`);

            messages.add(message);
            outside_this.sendMessage(message);
            // remove Python file after execution
            fs.unlink(filePath, (err) => { // asyncronous remove
                if (err) {
                    console.error(err);
                    return
                }
            })
        });

        setTimeout(
            () => {
                messages.delete(message);
                this.io.sockets.emit('deleteMessage', message.id);
            },
            messageExpirationTimeMS,
        );
    }

    disconnect() {
        users.delete(this.socket);
    }
}

function chat(io) {
    io.on('connection', (socket) => {
        new Connection(io, socket);
    });
};

module.exports = chat;