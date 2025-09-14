"use client"
import { useMaskStore } from "../store/mask";
import { useEffect } from "react";
import { useChatStore } from "../store/chat";
export function MaskPage() {
  const { masks, fetchMasks } = useMaskStore();
  const { newSession,fetchSessions } = useChatStore();

  useEffect(() => {
    fetchMasks();
  }, []);

  return (
    <div>
      <h1>Mask Page</h1>
      {masks.map((mask) => (
        <div key={mask.id}
        onClick={() => {
          newSession(mask);
          fetchSessions();
        }}>
          <h2>{mask.name}</h2>
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
  );
}