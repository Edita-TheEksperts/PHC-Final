import React, { createContext, useState } from "react";

// Krijo kontekstin
export const FormContext = createContext();

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    region: "",
    name: "",
    vorname: "",
    email: "",
    questions: "",
    cv: null,
    certificates: null,
    // Shto të dhëna për Form-Page-3 dhe Form-Page-4
    selectedTopics: [], // Për temat e zgjedhura
    additionalQuestion: "", // Për pyetjen shtesë
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
