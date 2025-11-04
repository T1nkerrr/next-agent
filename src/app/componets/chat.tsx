"use client"
import { useChatStore, uploadMessage } from "../store/chat";
import { useState, useEffect } from "react";
import styles from "./chat.module.scss"
export function Chat() {

    const [input, setInput] = useState("");

    const sessions = useChatStore(state => state.sessions);
    const currentSessionIndex = useChatStore(state => state.currentSessionIndex);
    const addMessageToSession = useChatStore(state => state.addMessageToSession);
    const sendMessage = useChatStore(state => state.sendMessage);
    const currentSession = sessions[currentSessionIndex];
    const { isGenerating } = useChatStore();//添加ai是否在思考的状态标识

    useEffect(() => {
        // 只需要检查会话列表是否为空，如果为空，则跳转到 home 页面
        if (sessions.length === 0) {
            // 使用 react-router-dom 的方式跳转
            window.location.hash = "#/home";
        }
    }, [sessions]);

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

    // 用户可以在输入框按下回车键时发送消息
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // 检查是否按下了 Enter 键且没有按住 Shift 键
        if (e.key === 'Enter' && !e.shiftKey) {
            // 阻止默认行为（避免在 textarea 中添加新行）
            e.preventDefault();
            // 调用发送消息函数
            handleSend();
        }
    };

    //如果chatlist为空，则显示正在跳转的提示
    const hasValidSession = sessions.length > 0;
    if (!hasValidSession) {
        return <div>正在跳转...</div>;
    }

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
                    <div key={message.id}>
                        <div
                            className={`${styles.message} ${message.role === 'user' ? styles.userMessage : styles.aiMessage}`}
                        >
                            <strong>{message.role}:</strong> {message.content}
                        </div>
                        <div className={`${styles.messageDate} ${message.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
                            {new Date(message.date).toLocaleString()}
                        </div>
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
                    onKeyDown={handleKeyDown} // 添加键盘事件处理程序：按下回车键可以发送消息
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