"use client"
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/chat";
import { useEffect } from "react";
export function ChatList() {
  const { sessions, fetchSessions, deleteSession,selectSession } = useChatStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div>
      <h1>Chat List</h1>
      {sessions.map((session,index) => (
        <div key={session.id}
          onClick={() => {
            // 设置当前会话索引
            selectSession(index);
            navigate("/chat");
          }}>
          <h2>{session.topic}</h2>
          <p>ID: {session.id}</p>
          <p>Created: {session.createTime}</p>
          <p>Updated: {session.updateTime}</p>
          <p>Topic: {session.topic}</p>
          <p>Mask: {session.mask.id}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteSession(session.id);
            }}>
            删除
          </button>
        </div>
      ))}
    </div>
  );
}