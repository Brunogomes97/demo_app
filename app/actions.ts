"use server";
import { cookies } from "next/headers";
import { fetchAPI } from "../services/api";
import { AuthSessionResponse, UserProps } from "@/lib/types";

interface LocalSessionProps {
  user: UserProps | null;
}

///Session Functions
export const getCurrentSession = async (): Promise<LocalSessionProps> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value ?? null;
  if (token === null) {
    return { user: null };
  }

  const result = await getValidatedSessionToken();

  if (!result) {
    return { user: null };
  }
  return result;
};
export async function getValidatedSessionToken(): Promise<AuthSessionResponse | null> {
  try {
    const { user } = await fetchAPI<AuthSessionResponse>(`api/auth/session`, {
      method: "GET",
      credentials: "include",
    });

    return { user };
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function setSessionTokenCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 dias
    path: "/",
  });
}

export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set("access_token", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}
