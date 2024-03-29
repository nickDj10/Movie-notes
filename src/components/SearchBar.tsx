import React, { useState, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";

interface SearchBarProps {
   onSearchInput: (search: string) => void;
   clearSearch?: boolean;
   searchInputProps: React.InputHTMLAttributes<HTMLInputElement>;
}

function SearchBar({
   onSearchInput,
   clearSearch,
   searchInputProps,
}: SearchBarProps) {
   const [searchTerm, setSearchTerm] = useState("");
   const debounce = useDebounce(searchTerm, 300);

   useEffect(() => {
      onSearchInput(debounce);
   }, [debounce]);

   function handleSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
      setSearchTerm(event.target.value);
   }

   useEffect(() => {
      setSearchTerm("");
   }, [clearSearch]);

   return (
      <input
         className="searchBar__default"
         onChange={handleSearchChange}
         value={searchTerm}
         {...searchInputProps}
      />
   );
}

export default SearchBar;
