import { ApolloProvider } from "@apollo/client";
import { client } from "./apollo/client";
import CompteList from "./components/CompteList";
import CreateCompte from "./components/CreateCompte";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import "./App.css";

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center space-y-2">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500 pb-2">
              Bank Dashboard
            </h1>
            <p className="text-gray-500 text-lg">
              Gestion intelligente de vos comptes et transactions
            </p>
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
            <div className="space-y-8">
              <section>
                <CreateCompte />
              </section>
              <section>
                <CompteList />
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <TransactionForm />
              </section>
              <section>
                <TransactionList />
              </section>
            </div>
          </div>
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
