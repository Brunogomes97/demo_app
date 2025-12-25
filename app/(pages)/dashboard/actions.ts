"use server";
import { fetchAPI } from "@/services/api";
import { revalidatePath } from "next/cache";
import { ApiErrorProps } from "@/lib/types";
import { Product, ProductCreateForm } from "./types";

const baseServerRoute = "products";
const baseClientRoute = "/dashboard";

export async function createProduct(data: ProductCreateForm) {
  try {
    const res = await fetchAPI<Product>(baseServerRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res) {
      const error = res as unknown as ApiErrorProps;
      throw new Error(
        "Ocorreu um erro ao cadastrar os dados " + error?.message
      );
    }
    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}

export async function updateProduct(id: string, data: ProductCreateForm) {
  const url = `${baseServerRoute}/${id}`;
  try {
    const res = await fetchAPI<Product>(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res) {
      const error = res as unknown as ApiErrorProps;
      throw new Error(
        "Ocorreu um erro ao atualizar os dados " + error?.message
      );
    }
    revalidatePath(baseClientRoute);
    return res;
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}

export async function removeProduct(id: string) {
  try {
    const url = `${baseServerRoute}/${id}`;

    const res = await fetchAPI<{ success?: boolean }>(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.success) {
      const error = res as unknown as ApiErrorProps;
      throw new Error("Ocorreu um erro ao remover os dados " + error?.message);
    }

    revalidatePath(baseClientRoute);
  } catch (error: unknown) {
    const err = error as ApiErrorProps;
    throw err;
  }
}
