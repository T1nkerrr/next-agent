import { ChatMessage, Mask } from "./mask";
import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { getMaskPreset, getPresetContent } from "./presets";

function uploadMessage(session: ChatSession, message: ChatMessage) {
  return fetch(process.env.NEXT_PUBLIC_API_URL + "/session/message/add?sessionId=" + session.id,
    {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message)
    })
}

export { uploadMessage };

export interface ChatSession {
  id: string;
  topic: string;
  createTime: number;
  lastUpdate: number;
  messages: ChatMessage[];
  mask: Mask;//记录属于哪个面具
}


export interface ChatState {
  sessions: ChatSession[];//用数组存储所有session，方便后续操作
  currentSessionIndex: number;// 当前选中的session，记录一个index存在zustand中
  fetchSessions: () => void;
  deleteSession(sessionId: string): unknown;
  selectSession: (index: number) => void;
  newSession: (mask?: Mask) => void;
  currentSession: () => ChatSession;// 当前选中的session
  addMessageToSession: (sessionId: string, message: ChatMessage) => void;
  sendMessage: (sessionId: string, message: ChatMessage) => void;
  // 添加ai是否在思考的状态标识
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSessionIndex: 0, // 初始化 currentSessionIndex

      // 添加ai的状态和设置方法
      isGenerating: false,
      setIsGenerating: (generating: boolean) => set({ isGenerating: generating }),

      fetchSessions: () => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/session/all")
          .then((res) => res.json())
          .then((serverSessions: ChatSession[]) => {
            // 按创建时间倒序排列（最新的在前面）
            const sortedSessions = serverSessions.sort((a, b) =>
              (b.createTime || 0) - (a.createTime || 0)
            );
            set({ sessions: sortedSessions });
            //set({ sessions: serverSessions });
          })
          .catch(e => {
            console.error(e);
          });
      },


      newSession: (mask?: Mask) => {
        const session: ChatSession = {
          id: Date.now().toString(),
          topic: "New Chat",
          createTime: Date.now(),
          lastUpdate: Date.now(),
          messages: [],
          mask: { id: "", name: "New Chat", context: [], avatar: "" }
        };

        if (mask) {
          session.mask = { ...mask };
          session.topic = mask.name;
        }

        set((state) => ({
          sessions: [session, ...state.sessions],//将新的会话对象添加到状态管理器中会话数组的开头位置。
        }));

        fetch(process.env.NEXT_PUBLIC_API_URL + "/session/add", {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(session)
        })

          .then(() => {

            let systemMessage: ChatMessage | undefined;

            // session创建成功后，检查是否有预制词需要发送
            if (mask) {
              const presetId = getMaskPreset(mask.id);
              if (presetId) {
                const presetContent = getPresetContent(presetId);
                if (presetContent) {
                  // 创建预制词消息
                  systemMessage = {
                    id: Date.now().toString(),
                    role: "system",
                    content: presetContent,
                    date: Date.now()
                  };

                  // 将预制词消息添加到session中
                  get().addMessageToSession(session.id, systemMessage);

                  // 上传预制词消息到后端
                  uploadMessage(session, systemMessage);

                }
              }
            }

            // 关键步骤：重新从后端获取会话数据，确保数据一致性
            setTimeout(() => {
              get().fetchSessions();

              if (systemMessage) {
                setTimeout(() => {
                  get().sendMessage(session.id, systemMessage!);
                }, 100);
              }
            }, 100); // 给一点延迟确保后端处理完成

          })
          .catch(e => {
            console.error(e);
            // showToast("Error:" + e)
          })
      },

      deleteSession: (sessionId: string) => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/session/delete?sessionId=" + sessionId,
          { method: "post" }
        ).then(() => {
          const sessions = get().sessions.slice();
          const index = sessions.findIndex(session => session.id === sessionId);
          if (index !== -1) {
            sessions.splice(index, 1);
            set(() => ({
              sessions,
            }));

            //添加执行删除后跳转到home页面的方法
            window.location.hash = "#/home";
          }
        }).catch(e => {
          console.error(e);
        })
      },
      //在点击session后显示对应的message：
      //首先创建session数组存储所有的session.
      //点击session时使用selectSession方法，将当前点击的session的index保存在currentSessionIndex中。
      //然后使用currentSession方法，根据currentSessionIndex获取当前选中的session，并修正，返回当前选中的session。
      //当用户点击发送时使用addMessageToSession方法，将message添加到当前选中的session中。
      //这样，当用户再次点击session时，会显示对应的message。

      selectSession(index: number) {
        set({
          currentSessionIndex: index,
        });
      },

      currentSession: () => {
        const sessions = get().sessions;
        let index = get().currentSessionIndex;

        if (index < 0 || index >= sessions.length) {
          index = Math.min(sessions.length - 1, Math.max(0, index));
          set(() => ({ currentSessionIndex: index }));
        }

        const session = sessions[index];

        return session;
      },


      // 添加这个方法用于向特定会话添加消息
      addMessageToSession: (sessionId: string, message: ChatMessage) => {
        set(state => {
          const sessions = [...state.sessions];
          const sessionIndex = sessions.findIndex(s => s.id === sessionId);
          if (sessionIndex !== -1) {
            sessions[sessionIndex] = {
              ...sessions[sessionIndex],
              messages: [...sessions[sessionIndex].messages, message],
              lastUpdate: Date.now()
            };
          }
          return { sessions };
        });
      },



      sendMessage: (sessionId: string, message: ChatMessage) => {
        const state = get();
        const session = state.sessions.find(s => s.id === sessionId);

        if (!session) {
          console.error("Session not found:", sessionId);
          return;
        }

        // 设置一个ai正在思考的状态
        get().setIsGenerating(true);

        const request = {
          model: "deepseek-chat",
          messages: session.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          stream: false
        };

        //console.log("Sending request to DeepSeek:", JSON.stringify(request, null, 2));

        // 调用 DeepSeek 接口
        fetch(process.env.NEXT_PUBLIC_OPEN_URL + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + process.env.NEXT_PUBLIC_OPEN_KEY
          },
          body: JSON.stringify(request)
        })
          .then(response => {//响应处理
            if (!response.ok) {
              get().setIsGenerating(false); // 错误时重置状态
              //console.error(`HTTP Error: ${response.status} ${response.statusText}`);
              return response.text().then(text => {
                //console.error("Error response body:", text);
                throw new Error(`HTTP Error: ${response.status} - ${text}`);
              });
            }
            return response.json();
          })
          .then(data => {
            //console.log("API response data:", data);
            // 处理 DeepSeek 的响应
            if (data.choices && data.choices[0]?.message?.content) {
              const aiMessage: ChatMessage = {
                id: Date.now().toString(),
                role: "assistant",
                content: data.choices[0].message.content,
                date: Date.now()
              };

              //添加到 Zustand 状态中
              get().addMessageToSession(sessionId, aiMessage);

              // 同时上传到后端服务器
              uploadMessage(session, aiMessage);
            }
            // 完成后重置状态
            get().setIsGenerating(false);
            //else {
            //console.warn("Unexpected API response format or empty response:", data);
            // }
          })
          .catch(e => {
            console.error("DeepSeek API error:", e);
            // 错误时重置状态
            get().setIsGenerating(false);
          });
      }
    }),
    { name: "chat-session" }
  )
)
