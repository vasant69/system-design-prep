import { buildSearchIndex } from "@/lib/search-index";
import { SearchPageClient } from "@/components/search/SearchPageClient";

export const metadata = { title: "Search" };

export default function SearchPage() {
  const docs = buildSearchIndex();
  return <SearchPageClient docs={docs} />;
}
