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

  // 将统一码字符串（如 "1f916"）转换为真实 emoji
  function unifiedToEmoji(unified: string): string {
    try {
      // 处理可能的连字符分隔格式（如 "1f916" 或 "1f468-200d-1f469-200d-1f467"）
      const codePoints = unified.split('-').map(hex =>
        parseInt(hex, 16)
      );

      // 使用 fromCodePoint 将码点转换为实际字符
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      console.error("Emoji 转换失败:", unified, e);
      return "❓"; // 转换失败时显示问号 emoji
    }
  }

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
      }, 100);
      setTimeout(() => {
        const newIndex = useChatStore.getState().sessions.findIndex(s => s.mask.id === mask.id);
        if (newIndex >= 0) {
          selectSession(newIndex);
          navigate("/chat");
        }
      }, 300);// 增加到300ms给fetchSessions更多时间，防止创建聊天后，可能没有跳转到对应页面
    }
  };

  return (
    <div className={styles.maskPage}>
      <h1 className={styles.header}>选择一个角色新建对话</h1>
      <div className={styles.maskList}>
        {masks.map((mask) => (
          <div
            key={mask.id}
            className={styles.maskItem}
            onClick={() => handleMaskClick(mask)}
          >
            <div className={styles.avatar}>
              {mask.avatar && unifiedToEmoji(mask.avatar)}
            </div>
            <h2 className={styles.maskName}>{mask.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}