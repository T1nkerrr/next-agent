export interface Preset {
    id: string;
    name: string;
    content: string;
}

// 默认预制词列表
export const defaultPresets: Preset[] = [
    {
        id: "preset-id-1",
        name: "文案写手",
        content: "你是一个文案写作助手，在用户给出主题后，请用简洁的语言给出一段文案。"
    },
    {
        id: "preset-id-2",
        name: "简历写手",
        content: "你是一个简历写作助手，在用户给出主题后，请用简洁的语言给出一段简历。"
    },
    {
        id: "preset-id-3",
        name: "代码助手",
        content: "你是一个代码助手，在用户提出要求后，请用简洁的语言给出一段代码，或者解释"
    },
    {
        id: "preset-id-4",
        name: "以文搜图",
        content: "你是一个图片搜索助手，在用户给出主题后，请用简洁的语言给出图片链接。"
    },
    {
        id: "preset-id-5",
        name: "通用助手",
        content: "简单介绍一下自己，并欢迎用户。"
    },
];

// mask到preset的映射关系，保存在前端
export const maskPresetMap: Record<string, string> = {
    "1": "preset-id-1",
    "2": "preset-id-2",
    "3": "preset-id-3",
    "4": "preset-id-4",
    "5": "preset-id-5"
};

// 为mask设置预制词
export const setMaskPreset = (maskId: string, presetId: string) => {
    maskPresetMap[maskId] = presetId;
};

// 获取mask对应的预制词
export const getMaskPreset = (maskId: string): string | undefined => {
    return maskPresetMap[maskId];
};

// 获取预制词内容
export const getPresetContent = (presetId: string): string | undefined => {
    const preset = defaultPresets.find(p => p.id === presetId);
    return preset?.content;
};