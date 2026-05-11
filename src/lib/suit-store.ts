"use client";

import { create } from "zustand";

export type SuitPart =
  | "helmet"
  | "chest"
  | "arms"
  | "forearms"
  | "hands"
  | "legs"
  | "boots"
  | "reactor"
  | "back"
  | "shoulders";

export type WeaponSystem = "pulse" | "rail" | "micro" | "arc";
export type ArmorUpgrade = "stealth" | "kinetic" | "flight" | "nanoweave";
export type AssistantMode = "tactical" | "diagnostic" | "cinematic";

export type SuitColors = Record<SuitPart, string>;

const defaultColors: SuitColors = {
  helmet: "#e11d48",
  chest: "#b91c1c",
  arms: "#f97316",
  forearms: "#c2410c",
  hands: "#94a3b8",
  legs: "#111827",
  boots: "#0f172a",
  reactor: "#67e8f9",
  back: "#475569",
  shoulders: "#facc15"
};

const palettes = [
  "#e11d48",
  "#f97316",
  "#facc15",
  "#67e8f9",
  "#22c55e",
  "#94a3b8",
  "#f8fafc",
  "#111827"
];

const weapons: WeaponSystem[] = ["pulse", "rail", "micro", "arc"];
const upgrades: ArmorUpgrade[] = ["stealth", "kinetic", "flight", "nanoweave"];

type SavePayload = {
  selectedPart: SuitPart;
  colors: SuitColors;
  weapon: WeaponSystem;
  upgrade: ArmorUpgrade;
  assistantMode: AssistantMode;
  armorDensity: number;
  reactorOutput: number;
  shieldBias: number;
};

type SuitState = SavePayload & {
  rotationEnabled: boolean;
  saveStatus: string;
  setSelectedPart: (part: SuitPart) => void;
  setPartColor: (part: SuitPart, color: string) => void;
  setWeapon: (weapon: WeaponSystem) => void;
  setUpgrade: (upgrade: ArmorUpgrade) => void;
  setAssistantMode: (mode: AssistantMode) => void;
  setArmorDensity: (value: number) => void;
  setReactorOutput: (value: number) => void;
  setShieldBias: (value: number) => void;
  toggleRotation: () => void;
  resetSuit: () => void;
  randomizeSuit: () => void;
  saveSuit: () => void;
  hydrateSavedSuit: () => void;
};

const baseSuit: SavePayload = {
  selectedPart: "chest",
  colors: defaultColors,
  weapon: "pulse",
  upgrade: "flight",
  assistantMode: "tactical",
  armorDensity: 72,
  reactorOutput: 84,
  shieldBias: 58
};

function randomItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomColors(): SuitColors {
  return {
    helmet: randomItem(palettes),
    chest: randomItem(palettes),
    arms: randomItem(palettes),
    forearms: randomItem(palettes),
    hands: randomItem(palettes),
    legs: randomItem(palettes),
    boots: randomItem(palettes),
    reactor: randomItem(palettes),
    back: randomItem(palettes),
    shoulders: randomItem(palettes)
  };
}

function createPayload(state: SuitState): SavePayload {
  return {
    selectedPart: state.selectedPart,
    colors: state.colors,
    weapon: state.weapon,
    upgrade: state.upgrade,
    assistantMode: state.assistantMode,
    armorDensity: state.armorDensity,
    reactorOutput: state.reactorOutput,
    shieldBias: state.shieldBias
  };
}

export const useSuitStore = create<SuitState>((set, get) => ({
  ...baseSuit,
  rotationEnabled: true,
  saveStatus: "Unsaved build",
  setSelectedPart: (selectedPart) => set({ selectedPart }),
  setPartColor: (part, color) =>
    set((state) => ({
      colors: {
        ...state.colors,
        [part]: color
      },
      saveStatus: "Unsaved changes"
    })),
  setWeapon: (weapon) => set({ weapon, saveStatus: "Unsaved changes" }),
  setUpgrade: (upgrade) => set({ upgrade, saveStatus: "Unsaved changes" }),
  setAssistantMode: (assistantMode) => set({ assistantMode }),
  setArmorDensity: (armorDensity) =>
    set({ armorDensity, saveStatus: "Unsaved changes" }),
  setReactorOutput: (reactorOutput) =>
    set({ reactorOutput, saveStatus: "Unsaved changes" }),
  setShieldBias: (shieldBias) =>
    set({ shieldBias, saveStatus: "Unsaved changes" }),
  toggleRotation: () =>
    set((state) => ({ rotationEnabled: !state.rotationEnabled })),
  resetSuit: () =>
    set({
      ...baseSuit,
      colors: { ...defaultColors },
      saveStatus: "Factory baseline restored"
    }),
  randomizeSuit: () =>
    set({
      selectedPart: randomItem([
        "helmet",
        "chest",
        "arms",
        "forearms",
        "hands",
        "legs",
        "boots",
        "reactor",
        "back",
        "shoulders"
      ]),
      colors: randomColors(),
      weapon: randomItem(weapons),
      upgrade: randomItem(upgrades),
      armorDensity: Math.floor(48 + Math.random() * 48),
      reactorOutput: Math.floor(58 + Math.random() * 40),
      shieldBias: Math.floor(35 + Math.random() * 55),
      saveStatus: "Randomized build"
    }),
  saveSuit: () => {
    const payload = createPayload(get());
    window.localStorage.setItem("x42-suit", JSON.stringify(payload));
    set({
      saveStatus: `Saved ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })}`
    });
  },
  hydrateSavedSuit: () => {
    const saved = window.localStorage.getItem("x42-suit");
    if (!saved) {
      return;
    }

    try {
      const payload = JSON.parse(saved) as SavePayload;
      set({
        ...payload,
        colors: {
          ...defaultColors,
          ...(payload.colors ?? {})
        },
        saveStatus: "Recovered saved build"
      });
    } catch {
      window.localStorage.removeItem("x42-suit");
    }
  }
}));
