import { useNavigate } from "react-router-dom";
export function Sidebar() {

    const navigate = useNavigate();
    return (
        <div>
            <div onClick={() => navigate("/chatlist")}>
                Sidebar
            </div>
            <button onClick={() => navigate("/")}>新建聊天</button>
        </div>
    )
}