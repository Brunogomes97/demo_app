import { ButtonHTMLAttributes, InputHTMLAttributes } from "react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";
import { Icons } from "@/components/icons";

export interface InputProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  inputType?: string;
  regName?: Path<T>;
  register?: UseFormRegister<T>;
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: string;
  isLoading?: boolean;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
