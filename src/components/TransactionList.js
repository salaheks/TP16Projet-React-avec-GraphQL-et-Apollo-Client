import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_TRANSACTIONS } from '../graphql/queries';
import { formatDateTime } from '../utils/dateFormatter';

const TransactionList = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_TRANSACTIONS);

  if (loading) return (
    <div className="glass-panel p-8 text-center">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
      <p className="text-gray-500 font-medium">Chargement des transactions...</p>
    </div>
  );

  if (error) return (
    <div className="glass-panel p-8 text-center">
      <div className="text-red-500 mb-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <p className="text-red-600 font-medium">Impossible de charger l'historique</p>
      <p className="text-gray-400 text-sm mt-1">{error.message}</p>
    </div>
  );

  return (
    <div className="glass-panel p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Dernières Transactions</h2>
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

      {data.allTransactions.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500">Aucune transaction récente</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {data.allTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${transaction.type === 'DEPOT'
                    ? 'bg-green-50 text-green-600'
                    : 'bg-red-50 text-red-600'
                  }`}>
                  {transaction.type === 'DEPOT' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {transaction.type === 'DEPOT' ? 'Dépôt sur compte' : 'Retrait du compte'}
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    Compte #{transaction.compte.id} • {formatDateTime(transaction.date)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className={`block text-lg font-bold ${transaction.type === 'DEPOT' ? 'text-green-600' : 'text-red-600'
                  }`}>
                  {transaction.type === 'DEPOT' ? '+' : '-'} {transaction.montant.toFixed(2)} €
                </span>
                <span className="text-xs text-gray-400">
                  Solde: {transaction.compte.solde.toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionList;