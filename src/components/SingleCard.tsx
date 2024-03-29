import React from "react";
import { AiOutlineClose } from "react-icons/ai";

interface SingleCardProps<T, K extends keyof T> {
   title?: T;
   content?: T;
   tags?: T[];
   movieGenreData?: { id: number; movie_genre: string }[];
   keyId: K;
   deleteNote: (noteID: K) => void;
}

function SingleCard<T extends React.ReactNode, K extends keyof T>({
   title,
   content,
   tags,
   keyId,
   deleteNote,
   movieGenreData,
}: SingleCardProps<T, K>) {
   console.log(tags);
   return (
      <div className="singleCard">
         <div className="singleCard__title-section">
            <h3 className="singleCard__title-section-title">{title}</h3>
            <AiOutlineClose
               className="singleCard__title-section-symbol"
               onMouseDown={() => deleteNote(keyId)}
            />
         </div>
         <p className="singleCard__content">{content}</p>

         <ul className="singleCard__tags">
            {tags?.map((singleTag, index) => {
               const matchingMovie = movieGenreData?.find(
                  (singleMovie) => singleMovie.id.toString() === singleTag
               );

               return (
                  <li key={index} className="singleCard__tags-single">
                     {matchingMovie?.movie_genre}
                  </li>
               );
            })}
         </ul>
      </div>
   );
}

export default SingleCard;
