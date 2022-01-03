import React, { useEffect, useState } from 'react';
import './Messages.css';

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
                    const rows = message.value.split('\n')
                        .map((row, i) =>
                            <div>
                                <div key={i}>{row}haha</div>
                                <br></br>
                            </div>
                        );
                    return (
                        <div
                            key={message.id}
                            className="message-container"
                            title={`Sent at ${new Date(message.time).toLocaleTimeString()}`}
                        >
                            <span className="user">{message.user.name}</span>
                            {rows}
                            <span className="date">{new Date(message.time).toLocaleTimeString()}</span>
                        </div>
                    )
                })
            }
        </div>
    );
}

export default Messages;