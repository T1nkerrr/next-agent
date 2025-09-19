import { useNavigate } from "react-router-dom";
import { ChatList } from "./chatlist";
import styles from "./sidebar.module.scss";

export function Sidebar() {

    const navigate = useNavigate();

    return (
        <div className={styles.sidebar}>
            <button
                className={styles.newChatButton}
                onClick={() => navigate("/")}
            >
                新建聊天
            </button>
            <div className={styles.chatListContainer}>
                <ChatList />
            </div>
        </div>
    )
}