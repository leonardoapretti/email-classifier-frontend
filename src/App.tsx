import React from "react";
import { EmailForm } from "./components/Form";
import { Toaster } from "sonner";

const App: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4 mx-auto max-w-xl">
      <EmailForm />
      <Toaster richColors position="top-center" /> {/* Sonner Toaster */}{" "}
    </div>
  );
};

export default App;
