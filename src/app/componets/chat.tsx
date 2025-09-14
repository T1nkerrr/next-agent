"use client"
import { useChatStore, uploadMessage } from "../store/chat";
import { useState } from "react";

export function Chat() {

    const [input, setInput] = useState("");

    const sessions = useChatStore(state => state.sessions);
    const currentSessionIndex = useChatStore(state => state.currentSessionIndex);
    const addMessageToSession = useChatStore(state => state.addMessageToSession);
    const sendMessage = useChatStore(state => state.sendMessage);
    const currentSession = sessions[currentSessionIndex];

    const handleSend = () => {
        if (input.trim() === "") return;
        // 确保 currentSession 存在
        if (!currentSession) return;

        const message = {
            id: Date.now().toString(),
            role: "user",
            content: input,
            date: Date.now(),
        };

        addMessageToSession(currentSession.id, message);

        uploadMessage(currentSession, message);

        sendMessage(currentSession.id, message);

        setInput("");
    };


    return (
        <div>
            {/* 显示当前session的消息 */}
            <div>
                {currentSession?.messages && currentSession.messages.map((message) => (
                    <div key={message.id}>
                        <strong>{message.role}:</strong> {message.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="输入消息..."
            />
            <button onClick={handleSend}>发送</button>
        </div>
    )
}
//我要的是当点击session是检索出对应的message 然后显示，
// 而不是事先存好，我要的是把它们存在zustand ，而不是从后端获取，实现基础功能即可