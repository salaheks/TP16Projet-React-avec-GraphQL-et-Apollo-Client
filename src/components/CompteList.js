import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_COMPTES } from "../graphql/queries";
import { formatDate } from "../utils/dateFormatter";

const CompteList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_COMPTES);

  if (loading) return (
    <div className="glass-panel p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
      <p className="text-gray-500 font-medium">Chargement de vos comptes...</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel p-8 text-center">
      <div className="text-red-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <p className="text-red-600 font-medium">Une erreur est survenue</p>
      <p className="text-gray-400 text-sm mt-1">{error.message}</p>
    </div>
  );

  return (
    <div className="glass-panel p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Vos Comptes</h2>
        <button
          onClick={() => refetch()}
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {data.allComptes.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500">Aucun compte actif</p>
          <p className="text-sm text-gray-400 mt-1">Créez votre premier compte pour commencer</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.allComptes.map((compte) => (
            <div
              key={compte.id}
              className="group relative bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 hover:border-indigo-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${compte.type === 'COURANT'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-emerald-50 text-emerald-700'
                    }`}>
                    {compte.type === 'COURANT' ? 'Compte Courant' : 'Compte Épargne'}
                  </span>
                  <p className="text-xs text-gray-400 mt-2 font-mono">ID: {compte.id}</p>
                </div>
                <div className="text-3xl font-bold text-gray-800 tracking-tight">
                  {compte.solde.toFixed(2)} <span className="text-lg text-gray-400 font-normal">€</span>
                </div>
              </div>

              <div className="flex items-center text-xs text-gray-400 pt-4 border-t border-gray-50">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Ouvert le {formatDate(compte.dateCreation)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompteList;