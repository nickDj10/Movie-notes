import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import { useTranslation } from "react-i18next";
import Filter from "./components/Filter";
import SingleCard from "./components/SingleCard";
import FormReusable from "./components/FormReusable";
import { AiOutlineClose } from "react-icons/ai";
import { movieGenres } from "./assets/data/MovieGenreData";

interface MovieGenreProps {
   id: number;
   movie_genre: string;
}

interface FormData {
   id: number;
   movieName: string;
   movieReview: string;
   movieGenre: string[];
}

function HomePage() {
   const { t } = useTranslation();
   const [showUserTermFilter, setShowUserTermFilter] = useState("");
   const [showUserTermSearch, setShowUserTermSearch] = useState("");
   const [selectedGenres, setSelectedGenres] = useState<MovieGenreProps[]>([]);
   const [data, setData] = useState<MovieGenreProps[]>([]);
   const [openModal, setOpenModal] = useState(false);
   const [localStorageData, setLocalStorageData] = useState<FormData[]>([]);

   // -----
   // Data for 'FORM COMPONENT'
   // -----

   const otherFormData = [
      {
         input: {
            type: "text",
            placeholder: `${t("formMoviePlaceholder")}`,
            name: "movieName",
            className: "formContainer__section-input",
         },
         label: {
            className: "formContainer__section-label",
            children: `${t("formMovie")}`,
         },
      },
      {
         label: {
            className: "formContainer__section-label",
            children: `${t("formReview")}`,
         },
         textarea: {
            name: "movieReview",
            className: "formContainer__section-textarea",
         },
      },
      {
         label: {
            className: "formContainer__section-label",
            children: `${t("formGenre")}`,
         },
         select: {
            multiple: true,
            size: 4,
            name: "movieGenre",
            className: "formContainer__section-select",

            options: movieGenres?.map((item) => ({
               value: item.id,
               label: item.movie_genre,
            })),
         },
      },
      {
         button: {
            children: `${t("formSubmitBtn")}`,
            className: "formContainer__section-button",
         },
      },
   ];

   // -----
   // 'FORM' functionality
   // -----

   const handleFormSubmit = useCallback((formData: {}) => {
      const submissionId = Date.now();

      localStorage.setItem(
         `formData_${submissionId}`,
         JSON.stringify(formData)
      );
   }, []);

   // -----
   // Search functionality for 'FILTER COMPONENT'
   // -----

   useEffect(() => {
      setData(() => {
         if (showUserTermFilter.length > 0) {
            return movieGenres.filter((singVal) =>
               singVal.movie_genre
                  .toLowerCase()
                  .includes(showUserTermFilter.toLowerCase())
            );
         } else {
            return movieGenres;
         }
      });
   }, [showUserTermFilter]);

   // SEARCH AND FILTER FUNCTIONALITY

   useEffect(() => {
      const selectedGenresIdString = selectedGenres.map((singleUser) =>
         singleUser.id.toString()
      );

      const filteredData = Object.keys(localStorage)
         .filter((key) => key.startsWith("formData_"))
         .map((key) => {
            const formDataString = localStorage.getItem(key);

            if (formDataString) {
               const formDataObject = JSON.parse(formDataString);
               const id = key.replace("formData_", "");

               const movieName = formDataObject.movieName
                  .toString()
                  .toLowerCase();

               const isMovieNameMatch = movieName.includes(
                  showUserTermSearch.toLowerCase()
               );

               const matchingGenres = formDataObject.movieGenre.map(
                  (genre: string) => genre.toLowerCase()
               );

               const isGenreMatch = selectedGenresIdString.every((genre) =>
                  matchingGenres.includes(genre)
               );
               if (isMovieNameMatch && isGenreMatch) {
                  formDataObject.id = id;
                  return formDataObject;
               } else {
                  return null;
               }
            }

            return null;
         })
         .filter((formData) => formData !== null);

      setLocalStorageData(filteredData);
   }, [showUserTermSearch, selectedGenres]);

   // -----
   // MODAL functionality
   // -----

   const handleToggleModal = useCallback(() => {
      setOpenModal((prevOpenModal) => !prevOpenModal);
   }, []);

   // -----
   // Deleting Card
   // -----

   const handleDeleteNote = useCallback(
      (noteID: number) => {
         const isConfirmed = window.confirm(
            "Are you sure you want to delete this note?"
         );

         if (isConfirmed) {
            const localStorageKey = `formData_${noteID}`;
            localStorage.removeItem(localStorageKey);
            setLocalStorageData((prevData) =>
               prevData.filter((note) => note.id !== noteID)
            );
         }
      },
      [setLocalStorageData]
   );

   return (
      <>
         <main className="home-page">
            {openModal && (
               <div className="home-page__modal">
                  <section className="home-page__modal-form">
                     <header className="home-page__modal-form-heading">
                        <AiOutlineClose
                           onClick={handleToggleModal}
                           className="home-page__modal-form-heading-close"
                        />
                        <h2>{t("formTitle")}</h2>
                     </header>

                     <hr />
                     <FormReusable
                        data={otherFormData}
                        onSubmit={handleFormSubmit}
                     />
                  </section>
               </div>
            )}
            <header className="home-page__heading">
               <h1 className="home-page__heading-title">
                  {t("homePageTitle")}
               </h1>
               <button
                  className="home-page__heading-button"
                  onClick={handleToggleModal}
               >
                  {t("homePageButton")}
               </button>
            </header>
            <section className="home-page__browser">
               <SearchBar
                  searchInputProps={{
                     placeholder: t("searchComponent"),
                     type: "search",
                  }}
                  onSearchInput={(searchValue) => {
                     setShowUserTermSearch(searchValue);
                  }}
               />
               <Filter
                  filterDataList={data}
                  selectedValues={selectedGenres}
                  handleSelectOption={(values) => {
                     setSelectedGenres(values);
                  }}
                  optionKey={"id"}
                  renderOptionView={(value) => {
                     return `${value.movie_genre}`;
                  }}
                  handleUserSearch={(searchInput) => {
                     setShowUserTermFilter(searchInput);
                  }}
                  filterText={`${t("filterText")}`}
               />
            </section>
            <section className="home-page__gallery">
               <h2>{t("homePageGallery")} : </h2>
               <div className="home-page__gallery-notes">
                  {localStorageData?.map((note) => (
                     <SingleCard
                        keyId={note.id}
                        title={note.movieName}
                        content={note.movieReview}
                        tags={note.movieGenre}
                        movieGenreData={movieGenres}
                        key={note.id}
                        deleteNote={handleDeleteNote}
                     />
                  ))}
               </div>
            </section>
         </main>
      </>
   );
}

export default HomePage;
