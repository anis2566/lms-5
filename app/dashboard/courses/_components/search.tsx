"use client";

import { usePathname, useRouter } from "next/navigation";
import queryString from "query-string";
import { useState } from "react";

import { PlaceholdersAndVanishInput } from "@/components/aceternity/placeholders-and-vanish-input";

const placeholders = [
  "Search for courses...",
  "Find a course by title or topic",
  "Discover new learning opportunities",
  "What do you want to learn today?",
];

export function Search() {
  const [search, setSearch] = useState<string>("");

  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          search: search,
        },
      },
      { skipEmptyString: true, skipNull: true },
    );

    router.push(url);
  };

  return (
    <div>
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
