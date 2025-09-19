"use client"
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/chat";
import { useEffect } from "react";
import styles from "./sidebar.module.scss";
export function ChatList() {
  const { sessions, fetchSessions, deleteSession, selectSession } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Chat List</h1>
      {sessions.map((session, index) => (
        <div key={session.id}
          className={styles.sessionItem}
          onClick={() => {
            // 设置当前会话索引
            selectSession(index);
            navigate("/chat");
          }}>
          <h2>{session.topic}</h2>
          <p>ID: {session.id}</p>
          <p>Created: {session.createTime ? new Date(parseInt(session.createTime.toString()) *
            (session.createTime.toString().length === 10 ? 1000 : 1)).toLocaleString() : 'N/A'}</p>
          <p>Updated: {session.lastUpdate ? new Date(parseInt(session.lastUpdate.toString()) *
            (session.lastUpdate.toString().length === 10 ? 1000 : 1)).toLocaleString() : 'N/A'}</p>
          <p>Topic: {session.topic}</p>
          <p>Mask: {session.mask.id}</p>
          <button
            className={styles.deleteButton}
            onClick={(e) => {
              e.stopPropagation();
              // 添加确认删除对话框
              if (confirm(`确定要删除会话 "${session.topic}" 吗？`)) {
                deleteSession(session.id);
              }
            }}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}