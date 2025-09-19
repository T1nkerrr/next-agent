"use client";

import { Routes, Route, HashRouter as Router } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { MaskPage } from "./mask-page";
import { ChatList } from "./chatlist";
import { Chat } from "./chat";
import styles from "./home.module.scss";
export default function Home() {
    return (
        <div>
            <Router>
                <div className={styles.container}>
                    <div className={styles.sidebar}>
                        <Sidebar />
                    </div>
                    <div className={styles.content}>
                        <Routes>
                            <Route path="/" element={<MaskPage />} />
                            <Route path="/home" element={<MaskPage />} />
                            <Route path="/chatlist" element={<ChatList />} />
                            <Route path="/chat" element={<Chat />} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </div>
    );
}