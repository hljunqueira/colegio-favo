import {
  LayoutDashboard, Layers, GraduationCap, Megaphone, Wallet, Library, DoorOpen, Settings
} from "lucide-react";

export const NAV_GROUPS = [
  {
    label: "Visão geral",
    items: [{ key: "inicio", label: "Dashboard", icon: LayoutDashboard, done: true }],
  },
  {
    label: "Secretaria",
    items: [
      { key: "secretaria", label: "Secretaria Geral", icon: Layers, done: true },
    ],
  },
  {
    label: "Pedagógico",
    items: [
      { key: "pedagogico", label: "Pedagógico Geral", icon: GraduationCap, done: true },
    ],
  },
  {
    label: "Comunicação",
    items: [
      { key: "comunicacao", label: "Comunicação Geral", icon: Megaphone, done: true },
    ],
  },
  {
    label: "Financeiro",
    items: [
      { key: "financeiro", label: "Financeiro Geral", icon: Wallet, done: true },
    ],
  },
  {
    label: "Biblioteca",
    items: [
      { key: "biblioteca", label: "Biblioteca Geral", icon: Library, done: true },
    ],
  },
  {
    label: "Portaria & Saúde",
    items: [
      { key: "portaria_saude", label: "Portaria & Saúde", icon: DoorOpen, done: true },
    ],
  },
  {
    label: "Administração",
    items: [
      { key: "administracao", label: "Administração Geral", icon: Settings, done: true },
    ],
  },
];

export const ALL_ITEMS = NAV_GROUPS.flatMap((g) => g.items);
