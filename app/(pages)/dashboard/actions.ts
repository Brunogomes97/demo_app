"use server";
import { fetchAPI } from "@/services/api";
import { revalidatePath } from "next/cache";
import { NoteCreateForm, NoteEditForm, NoteResponseData } from "./types";
import { ApiErrorProps } from "@/lib/types";

const baseServerRoute = "notas";
const baseClientRoute = "/dashboard";

export async function createNote(data: NoteCreateForm) {
  try {
    const res = await fetchAPI<NoteResponseData>(baseServerRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.id) {
      const error = res as unknown as ApiErrorProps;
      throw new Error(
        "Ocorreu um erro ao cadastrar os dados " + error?.message,
      );
    }
    //revalidatePath -> Faz o refresh da informação via cache
    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}

export async function updateNote(id: string, data: NoteEditForm) {
  const url = `${baseServerRoute}/${id}`;
  try {
    const res = await fetchAPI<NoteResponseData>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.id) {
      const error = res as unknown as ApiErrorProps;
      throw new Error(
        "Ocorreu um erro ao atualizar os dados " + error?.message,
      );
    }
    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}

export async function removeNote(id: string) {
  try {
    const url = `${baseServerRoute}/${id}`;

    const res = await fetchAPI<NoteResponseData>(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.id) {
      const error = res as unknown as ApiErrorProps;
      throw new Error("Ocorreu um erro ao remover os dados " + error?.message);
    }

    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}


export async function removeManyNotes(ids: string[]) {
  try {
    const url = `${baseServerRoute}`;

    const res = await fetchAPI<NoteResponseData[]>(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });

    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}