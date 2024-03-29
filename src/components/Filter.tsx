import React, { useState, useRef, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import { useTranslation } from "react-i18next";
import { FiX } from "react-icons/fi";
import { IoCaretForwardOutline } from "react-icons/io5";

interface FilterProps<T> {
   filterDataList: T[];
   selectedValues: T[];
   handleSelectOption: (value: T[]) => void;
   handleUserSearch: (value: string) => void;
   optionKey: keyof T;
   renderOptionView: (value: T) => React.ReactNode;
   filterText: string;
}

function Filter<T>({
   filterDataList,
   selectedValues,
   handleSelectOption,
   optionKey,
   renderOptionView,
   handleUserSearch,
   filterText,
}: FilterProps<T>) {
   const [displayFilter, setDisplayFilter] = useState(false);
   const [userSearchValue, setUserSearchValue] = useState("");
   const [clearSearch, setClearSearch] = useState(false);
   const { t } = useTranslation();
   const filterRef = useRef<HTMLDivElement | null>(null);

   function onSelectHandler(singOpt: T) {
      if (
         selectedValues.find(
            (selectedOption) => selectedOption[optionKey] === singOpt[optionKey]
         )
      ) {
         handleSelectOption(
            selectedValues.filter(
               (value) => value[optionKey] !== singOpt[optionKey]
            )
         );
      } else {
         handleSelectOption([...selectedValues, singOpt]);
      }
      setUserSearchValue("");
      setClearSearch(!clearSearch);
   }

   const handleOutsideClick = useCallback((event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (filterRef.current && !filterRef.current.contains(target)) {
         setDisplayFilter(false);
      }
   }, []);

   useEffect(() => {
      window.addEventListener("mousedown", handleOutsideClick);
      return () => {
         window.removeEventListener("mousedown", handleOutsideClick);
      };
   }, [handleOutsideClick]);

   useEffect(() => {
      handleUserSearch(userSearchValue);
   }, [userSearchValue]);

   return (
      <section className="filter" ref={filterRef}>
         {displayFilter ? (
            <div className="filter-container">
               <div className="filter-container__display">
                  {selectedValues?.map((singVal) => {
                     return (
                        <span
                           className="filter-container__display-pills"
                           key={singVal[optionKey] as React.Key}
                        >
                           {renderOptionView(singVal)}
                           <FiX
                              onClick={() => onSelectHandler(singVal)}
                              className="filter-container__display-pills-close"
                           />
                        </span>
                     );
                  })}

                  <SearchBar
                     searchInputProps={{
                        placeholder: t("searchFilter"),
                        className:
                           selectedValues.length > 0
                              ? "filter-container__display-search"
                              : "filter-container__display-search-empty",
                        autoFocus: true,
                        type: "search",
                     }}
                     onSearchInput={(searchValue) => {
                        setUserSearchValue(searchValue);
                     }}
                     clearSearch={clearSearch}
                  />
               </div>
               <nav className="filter-container__options">
                  <ul className="filter-container__options-list">
                     {filterDataList
                        ?.filter(
                           (singVal) =>
                              !selectedValues.some(
                                 (selectedOption) =>
                                    selectedOption[optionKey] ===
                                    singVal[optionKey]
                              )
                        )
                        .map((singVal) => (
                           <li
                              key={singVal[optionKey] as React.Key}
                              className="filter-container__options-list-item"
                              onClick={() => onSelectHandler(singVal)}
                           >
                              <IoCaretForwardOutline />{" "}
                              {renderOptionView(singVal)}
                           </li>
                        ))}
                  </ul>
               </nav>
            </div>
         ) : (
            <div
               className="filter-container__display"
               onClick={() => {
                  setDisplayFilter(true);
               }}
            >
               {selectedValues.length > 0 ? (
                  selectedValues.map((singVal) => {
                     return (
                        <span
                           className="filter-container__display-pills"
                           key={singVal[optionKey] as React.Key}
                        >
                           {renderOptionView(singVal)}
                           <FiX
                              onClick={() => onSelectHandler(singVal)}
                              className="filter-container__display-pills-close"
                           />
                        </span>
                     );
                  })
               ) : (
                  <span className="filter-container__display-empty">
                     {filterText}
                  </span>
               )}
            </div>
         )}
      </section>
   );
}

export default Filter;
