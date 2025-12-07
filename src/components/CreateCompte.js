import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SAVE_COMPTE } from '../graphql/mutations';
import { GET_ALL_COMPTES } from '../graphql/queries';
import { TypeCompte } from '../graphql/types';

const CreateCompte = () => {
  const [solde, setSolde] = useState('');
  const [type, setType] = useState(TypeCompte.COURANT);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [saveCompte, { loading }] = useMutation(SAVE_COMPTE, {
    refetchQueries: [{ query: GET_ALL_COMPTES }],
    onCompleted: () => {
      setMessage({ text: 'Compte créé avec succès !', type: 'success' });
      setSolde('');
      setType(TypeCompte.COURANT);
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    },
    onError: (error) => {
      setMessage({ text: `Erreur : ${error.message}`, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!solde || parseFloat(solde) < 0) {
      setMessage({ text: 'Veuillez entrer un solde valide', type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
      return;
    }

    try {
      await saveCompte({
        variables: {
          compte: {
            solde: parseFloat(solde),
            type,
          },
        },
      });
    } catch (error) {
      console.error('Erreur lors de la création du compte :', error);
    }
  };

  return (
    <div className="glass-panel p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nouveau Compte</h2>
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
            Solde initial
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={solde}
              onChange={(e) => setSolde(e.target.value)}
              required
              placeholder="0.00"
              className="input-primary pl-8"
              disabled={loading}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Type de compte
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="input-primary appearance-none cursor-pointer"
            disabled={loading}
          >
            <option value={TypeCompte.COURANT}>Compte Courant</option>
            <option value={TypeCompte.EPARGNE}>Compte Épargne</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex justify-center items-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Création...</span>
            </>
          ) : (
            'Créer le compte'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateCompte;