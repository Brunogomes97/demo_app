import { NavItem } from "@/components/types";

export const noteTypes = [
  "Pessoal",
  "Trabalho",
  "Estudo",
  "Ideia",
  "Lembrete",
  "Para fazer",
  "Meeting",
];
export const noteTypeObjectFormat = {
  Pessoal: "personal",
  Trabalho: "work",
  Estudo: "study",
  Ideia: "ideia",
  Lembrete: "reminder",
  "Para fazer": "todo",
  Meeting: "meeting",
}
export const noteTypeObjectFormatReverse = {
  personal: "Pessoal",
  work: "Trabalho",
  study: "Estudo",
  ideia: "Ideia",
  reminder: "Lembrete",
  todo: "Para fazer",
  meeting: "Meeting",
}


export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard",
  },


];
