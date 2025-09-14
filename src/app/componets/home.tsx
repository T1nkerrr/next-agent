"use client";

import { Routes, Route, HashRouter as Router } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { MaskPage } from "./mask-page";
import {  ChatList } from "./chatlist";
import { Chat } from "./chat";
export default function Home() {
    return (
        <div>
            <Router>
                <div >
                    <Sidebar />
                    <div >
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