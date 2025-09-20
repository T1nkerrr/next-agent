"use client"
import { useChatStore, uploadMessage } from "../store/chat";
import { useState } from "react";
import styles from "./chat.module.scss"

export function Chat() {

    const [input, setInput] = useState("");

    const sessions = useChatStore(state => state.sessions);
    const currentSessionIndex = useChatStore(state => state.currentSessionIndex);
    const addMessageToSession = useChatStore(state => state.addMessageToSession);
    const sendMessage = useChatStore(state => state.sendMessage);
    const currentSession = sessions[currentSessionIndex];
    const { isGenerating } = useChatStore();//添加ai是否在思考的状态标识

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
        <div className={styles.chatContainer}>
            {/* 添加顶部栏显示当前聊天名称 */}
            <div className={styles.chatHeader}>
                <h2>{currentSession?.topic || "新聊天"}</h2>
                {/* - 使用可选链操作符(?.)安全访问currentSession对象的topic属性
                * - 使用逻辑或操作符(||)提供默认值"新聊天"
                * - 通过花括号{ }在JSX中嵌入JavaScript表达式 */}
            </div>
            {/* 显示当前session的消息 */}
            <div className={styles.messagesContainer}>
                {currentSession?.messages && currentSession.messages.map((message) => (
                    <div key={message.id}
                        className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.aiMessage}`}
                    >
                        <strong>{message.role}:</strong> {message.content}
                    </div>
                ))}

                {/* AI 正在思考的提示 */}
                {isGenerating && (
                    <div className={`${styles.message} ${styles.aiMessage}`}>
                        <strong>AI 正在思考中...</strong>
                    </div>
                )}
            </div>

            <div className={styles.messageInput}>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="输入消息..."
                />
                <button
                    onClick={handleSend}
                    disabled={isGenerating}
                >
                    {isGenerating ? '思考中...' : '发送'}
                </button>
            </div>
        </div>
    )
}
//我要的是当点击session是检索出对应的message 然后显示，
// 而不是事先存好，我要的是把它们存在zustand ，而不是从后端获取，先实现基础功能即可