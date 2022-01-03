import React, { useEffect, useState } from 'react';
import './Messages.css';
import Highlight from 'react-highlight';

function Messages({ socket }) {
    const [messages, setMessages] = useState({});

    useEffect(() => {
        const messageListener = (message) => {
            setMessages((prevMessages) => {
                const newMessages = { ...prevMessages };
                newMessages[message.id] = message;
                return newMessages;
            });
        };

        const deleteMessageListener = (messageID) => {
            setMessages((prevMessages) => {
                const newMessages = { ...prevMessages };
                delete newMessages[messageID];
                return newMessages;
            });
        };

        socket.on('message', messageListener);
        socket.on('deleteMessage', deleteMessageListener);
        socket.emit('getMessages');

        return () => {
            socket.off('message', messageListener);
            socket.off('deleteMessage', deleteMessageListener);
        };
    }, [socket]);

    return (
        <div className="message-list">
            {[...Object.values(messages)]
                .sort((a, b) => a.time - b.time)
                .map((message) => {
                    var rows;
                    console.log(message.value.hasOwnProperty("traceback"));
                    // Traceback: error
                    if (message.value.hasOwnProperty("traceback")) { // startsWith("Error")
                        rows = <div>
                            {message.value.traceback}
                        </div>
                    } else {
                        rows = message.value.split('\n')
                            .map((row, i) =>

                                <div key={i}>
                                    {row}
                                </div>
                            );
                    }
                    return (
                        <div
                            key={message.id}
                            className="message-container"
                            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
                        >
                            <span className="user">{message.user.name}</span>
                            <Highlight language="python">
                                {rows}
                            </Highlight>
                            <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
                        </div>
                    )
                }).at(-1)
            }
        </div>
    );
}

export default Messages;