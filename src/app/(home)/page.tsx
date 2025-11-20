"use client";

import { useSearchParam } from "@/hooks/use-search-param";
import { useOrganization } from "@clerk/nextjs";
import { usePaginatedQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { DOCUMENTS_PAGE_SIZE } from "../constants/defaults";
import { DocumentsTable } from "./documents-table";
import { Navbar } from "./navbar";
import { TemplatesGallery } from "./templates-gallery";

const Home = () => {
  const [search] = useSearchParam("search");
  const { organization } = useOrganization();
  const { results, status, loadMore } = usePaginatedQuery(
    api.documents.get,
    { search: search || undefined },
    { initialNumItems: DOCUMENTS_PAGE_SIZE }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10 h-16 bg-white p-4">
        <Navbar />
      </div>
      <div className="mt-16">
        <TemplatesGallery />
        <DocumentsTable documents={results} status={status} loadMore={loadMore} />
      </div>
    </div>
  );
};

export default Home;
