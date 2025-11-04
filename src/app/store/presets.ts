import { ChatMessage, Mask } from "./mask";

// 默认上下文模板列表 - 直接使用完整的 Mask 结构（除了 id）
export const defaultMaskTemplates: Omit<Mask, "id">[] = [
  {
    name: "文案写手",
    avatar: "✍️",
    context: [
      {
        id: "context-msg-1",
        role: "system",
        content: "你是一个文案写作助手，在用户给出主题后，请用简洁的语言给出一段文案。",
        date: Date.now()
      }
    ]
  },
  {
    name: "简历写手",
    avatar: "📄",
    context: [
      {
        id: "context-msg-2",
        role: "system",
        content: "你是一个简历写作助手，在用户给出主题后，请用简洁的语言给出一段简历。",
        date: Date.now()
      }
    ]
  },
  {
    name: "代码助手",
    avatar: "💻",
    context: [
      {
        id: "context-msg-3",
        role: "system",
        content: "你是一个代码助手，在用户提出要求后，请用简洁的语言给出一段代码，或者解释",
        date: Date.now()
      }
    ]
  },
  {
    name: "以文搜图",
    avatar: "🖼️",
    context: [
      {
        id: "context-msg-4",
        role: "system",
        content: "你是一个图片搜索助手，在用户给出主题后，请用简洁的语言给出图片链接。",
        date: Date.now()
      }
    ]
  },
  {
    name: "通用助手",
    avatar: "🤖",
    context: [
      {
        id: "context-msg-5",
        role: "system",
        content: "简单介绍一下自己，并欢迎用户。",
        date: Date.now()
      }
    ]
  }
];

// mask到模板的映射关系
export const maskTemplateMap: Record<string, number> = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4
};

// 获取mask对应的模板
export const getMaskTemplate = (maskId: string): Mask | undefined => {
    const templateIndex = maskTemplateMap[maskId];
    if (templateIndex !== undefined && defaultMaskTemplates[templateIndex]) {
        const template = defaultMaskTemplates[templateIndex];
        return {
            ...template,
            id: `template-${maskId}`
        };
    }
    return undefined;
};