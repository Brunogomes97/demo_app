import Header from "@/components/layout/Header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Gestão de Notas",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex h-full my-0 mx-auto max-w-[1556px]">
        <main className="w-full pt-16">{children}</main>
      </div>
    </>
  );
}
