import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Mask = {
  id: string;
  avatar: string;
  name: string;
  context: ChatMessage[];
};

export type ChatMessage = {
  id: string;
  role: string;
  content: string;
  date: number;
};

interface MaskStore {
  masks: Mask[];
  fetchMasks: () => void;
}

export const useMaskStore = create<MaskStore>()(
  persist(
    (set, get) => ({
      masks: [],

      fetchMasks: () => {

        //if (get().masks.length > 0) return;

        fetch(process.env.NEXT_PUBLIC_API_URL + "/mask/all")
          .then((res) => res.json())
          .then((serverMasks: Mask[]) => {
            set({ masks: serverMasks });
          })
          .catch(e => {
            console.error(e);
          });
      }
    }),
    {
      name: "mask-storage",
    }
  ))