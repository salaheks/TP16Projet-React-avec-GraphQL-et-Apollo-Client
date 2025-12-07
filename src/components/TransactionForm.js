import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_TRANSACTION } from '../graphql/mutations';
import { GET_ALL_COMPTES, GET_ALL_TRANSACTIONS } from '../graphql/queries';
import { TypeTransaction } from '../graphql/types';

const TransactionForm = () => {
  const [compteId, setCompteId] = useState('');
  const [type, setType] = useState(TypeTransaction.DEPOT);
  const [montant, setMontant] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const { data: comptesData } = useQuery(GET_ALL_COMPTES);

  const [addTransaction, { loading }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [
      { query: GET_ALL_TRANSACTIONS },
      { query: GET_ALL_COMPTES },
    ],
    onCompleted: () => {
      setMessage({ text: 'Transaction ajoutée avec succès !', type: 'success' });
      setCompteId('');
      setType(TypeTransaction.DEPOT);
      setMontant('');
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ text: `Erreur : ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!compteId) {
      setMessage({ text: 'Veuillez sélectionner un compte', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    if (!montant || parseFloat(montant) <= 0) {
      setMessage({ text: 'Veuillez entrer un montant valide', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    try {
      await addTransaction({
        variables: {
          transactionRequest: {
            compteId,
            type,
            montant: parseFloat(montant),
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la transaction :', error);
    }
  };

  return (
    <div className="glass-panel p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-100 rounded-xl text-purple-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nouvelle Transaction</h2>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-100'
            : 'bg-red-50 text-red-700 border border-red-100'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Compte source
          </label>
          <select
            value={compteId}
            onChange={(e) => setCompteId(e.target.value)}
            required
            className="input-primary appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value="">Sélectionnez un compte</option>
            {comptesData?.allComptes.map((compte) => (
              <option key={compte.id} value={compte.id}>
                Compte {compte.id} • {compte.type} • {compte.solde.toFixed(2)} €
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="input-primary appearance-none cursor-pointer"
              disabled={loading}
            >
              <option value={TypeTransaction.DEPOT}>Dépôt (+)</option>
              <option value={TypeTransaction.RETRAIT}>Retrait (-)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Montant
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                required
                placeholder="0.00"
                className="input-primary pl-8"
                disabled={loading}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !comptesData?.allComptes.length}
          className="btn-primary flex justify-center items-center gap-2"
        >
          {loading ? 'Traitement...' : 'Valider la transaction'}
        </button>

        {!comptesData?.allComptes.length && (
          <p className="text-sm text-gray-500 text-center bg-gray-50 p-3 rounded-lg">
            ⚠️ Créez d'abord un compte pour pouvoir effectuer des transactions
          </p>
        )}
      </form>
    </div>
  );
};

export default TransactionForm;