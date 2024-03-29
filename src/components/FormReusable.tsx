import React, { useState } from "react";

interface UserDataFormProps<FormData> {
   data: {
      input?: React.InputHTMLAttributes<HTMLInputElement>;
      label?: React.LabelHTMLAttributes<HTMLLabelElement>;
      button?: React.ButtonHTMLAttributes<HTMLButtonElement>;
      textarea?: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
      select?: {
         options: React.OptionHTMLAttributes<HTMLOptionElement>[];
      } & React.SelectHTMLAttributes<HTMLSelectElement>;
   }[];
   onSubmit: (formData: FormData) => void;
   onError?: (error: unknown) => void;
}

function ReusableForm<FormData>({
   data,
   onSubmit,
   onError,
}: UserDataFormProps<FormData>) {
   const [formData, setFormData] = useState<FormData>({} as FormData);

   function handleFieldChange(
      e: React.ChangeEvent<
         HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
   ) {
      const { name, value } = e.target;
      const targetElement = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(
         targetElement?.selectedOptions || []
      ).map((option) => option.value);

      const newValue = selectedOptions.length > 0 ? selectedOptions : [value];

      setFormData((prevFormData) => ({
         ...prevFormData,
         [name]: newValue,
      }));
   }

   function submitForm(e: React.FormEvent<HTMLFormElement>) {
      try {
         const missingFormElements = data.filter((element) => {
            const fieldName =
               element.input?.name ||
               element.select?.name ||
               element.textarea?.name;
            const fieldValue = formData[fieldName as keyof FormData];

            return (
               ((element.input || element.textarea) && !fieldValue) ||
               (element.select &&
                  (!fieldValue || (fieldValue as string[]).length === 0))
            );
         });

         if (missingFormElements.length > 0) {
            throw new Error("Please fill in all required fields");
         }

         onSubmit(formData);
      } catch (error) {
         e.preventDefault();
         if (onError) {
            onError(error);
         } else {
            console.error("Form submission error:", error);
            window.alert((error as Error).message || "An error occurred");
         }
      }
   }

   return (
      <form onSubmit={submitForm} className="formContainer">
         {data?.map((formElement, index) => (
            <div key={index} className="formContainer__section">
               {formElement.label && <label {...formElement.label} />}
               {formElement.input && (
                  <input
                     {...formElement.input}
                     value={
                        (formData[
                           formElement.input?.name as keyof FormData
                        ] as string) || ""
                     }
                     onChange={handleFieldChange}
                  />
               )}
               {formElement.textarea && (
                  <textarea
                     {...formElement.textarea}
                     value={
                        (formData[
                           formElement.textarea?.name as keyof FormData
                        ] as string) || ""
                     }
                     onChange={handleFieldChange}
                  />
               )}
               {formElement.select && (
                  <select
                     {...formElement.select}
                     value={
                        (formData[
                           formElement.select?.name as keyof FormData
                        ] as string[]) || []
                     }
                     onChange={handleFieldChange}
                  >
                     {formElement.select.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>
               )}
               {formElement.button && (
                  <button {...formElement.button} type="submit" />
               )}
            </div>
         ))}
      </form>
   );
}
export default ReusableForm;
