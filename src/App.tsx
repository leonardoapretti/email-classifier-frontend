import React from "react";

const App: React.FC = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-dark rounded-2xl p-8 shadow-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-accent mb-2">
              Classificador Inteligente de Emails
            </h1>
            <p className="text-secondary text-lg">
              Automatize a classificação e resposta de emails corporativos
            </p>
          </div>

          <footer className="mt-12 text-center text-secondary text-sm">
            Desenvolvido por Leonardo dos Anjos Pretti
          </footer>
        </div>
      </div>
    </div>
  );
};

export default App;
