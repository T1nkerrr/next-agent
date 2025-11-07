export function AvatarPicker({ onEmojiClick }: { onEmojiClick: (emoji: string) => void }) {
  const emojis = ["✍️", "📄", "💻", "🖼️", "🤖"];
  return (
    <div style={{ display: "flex", gap: "10px", padding: "8px" }}>
      {emojis.map(emoji => (
        <span 
          key={emoji} 
          onClick={() => onEmojiClick(emoji)}
          style={{ fontSize: "24px", cursor: "pointer" }}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}

export function Avatar({ avatar }: { avatar?: string }) {
  return (
    <div style={{ 
      fontSize: "1.8em", 
      width: "2.5em", 
      height: "2.5em", 
      borderRadius: "50%", 
      background: "#eaeaea",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      {avatar}
    </div>
  );
}