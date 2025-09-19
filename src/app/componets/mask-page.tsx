"use client"
import { useMaskStore } from "../store/mask";
import { useEffect } from "react";
import { useChatStore } from "../store/chat";
import { useNavigate } from "react-router-dom";
import styles from "./mask-page.module.scss";
export function MaskPage() {
  const { masks, fetchMasks } = useMaskStore();
  const { newSession, fetchSessions, sessions, selectSession } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMasks();
  }, []);

  const handleMaskClick = (mask: any) => {
    // 查找是否已存在该mask的session
    const sessionIndex = sessions.findIndex(session => session.mask.id === mask.id);
    //使用 sessions 数组的 findIndex 方法查找第一个 session.mask.id 等于 mask.id 的会话索引，
    // 并将结果存储在 sessionIndex 变量中。如果未找到匹配项，则 sessionIndex 为 -1。

    if (sessionIndex >= 0) {
      // 如果存在，直接跳转
      selectSession(sessionIndex);
      navigate("/chat");
    } else {
      // 如果不存在，创建新的并跳转
      newSession(mask);
      setTimeout(() => {
        fetchSessions();
        setTimeout(() => {
          const newIndex = useChatStore.getState().sessions.findIndex(s => s.mask.id === mask.id);
          if (newIndex >= 0) {
            selectSession(newIndex);
            navigate("/chat");
          }
        }, 100);
      }, 100);
    }
  };

  return (
    <div className={styles.maskPage}>
      <h1 className={styles.header}>Mask Page</h1>
      <div className={styles.maskList}>
        {masks.map((mask) => (
          <div key={mask.id}
            className={styles.maskItem}
            onClick={() => {
              handleMaskClick(mask)
            }}>
            <h2 className={styles.maskName}>{mask.name}</h2>
            <p>Avatar: {mask.avatar}</p>
            <div>
              Context:
              {mask.context.map((message, index) => (
                <div key={index}>
                  {message.role}: {message.content}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}