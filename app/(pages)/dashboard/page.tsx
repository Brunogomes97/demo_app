import { CreateNoteDialog } from "@/components/dialogs/create-note-dialog";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { fetchAPI } from "@/services/api";
import { columns } from "@/components/tables/products/columns";
import { NotesTable } from "@/components/tables/products/products-table";
import BreadCrumb from "@/components/breadcrumb-page";
import { FetchingProductData, Product } from "./types";

const breadcrumbItems = [{ title: "Notas", link: "/dashboard" }];

const metadata = {
  title: "Meus Produtos",
  description: "Produtos registrados no sistema ",
};
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const page = Number(params.page) || 1;
  const pageLimit = Number(params.limit) || 5;
  const title = params.search || null;

  const offset = (page - 1) * pageLimit;
  const search = title ? `&Name=${title}` : "";
  const type = params.category || "";
  const typeSearch = type ? `&Category=${type}` : "";

  const fetchingRoute = `products/paged/?Offset=${offset.toString()}&Limit=${pageLimit.toString()}${search}${typeSearch}`;

  const response = await fetchAPI<FetchingProductData>(fetchingRoute, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).catch((err) => console.log(err));

  const data = (response?.items as Product[]) || [];
  const total_items = response?.total || 0;
  const pageCount = Math.ceil(total_items / pageLimit) || 1;

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <BreadCrumb items={breadcrumbItems} />
      <div className="flex items-start justify-between">
        <Heading title={metadata.title} description={metadata.description} />
        <CreateNoteDialog />
      </div>
      <Separator />
      <NotesTable
        tableName="produto"
        searchKey="name"
        columns={columns}
        pageNo={page}
        totalItems={total_items}
        data={data}
        pageCount={pageCount}
      />
    </div>
  );
}
