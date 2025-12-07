/**
 * Formate une date pour l'affichage
 * @param {string|number|Date} dateValue - La date à formater
 * @returns {string} - La date formatée
 */
export const formatDate = (dateValue) => {
  if (!dateValue) return 'N/A';

  let date;

  // Si c'est déjà un objet Date
  if (dateValue instanceof Date) {
    date = dateValue;
  }
  // Si c'est un nombre (timestamp)
  else if (typeof dateValue === 'number') {
    date = new Date(dateValue);
  }
  // Si c'est une chaîne de caractères
  else if (typeof dateValue === 'string') {
    // Essayer de parser différents formats
    // Format ISO: "2024-01-15" ou "2024-01-15T10:30:00"
    if (dateValue.includes('-') || dateValue.includes('T')) {
      date = new Date(dateValue);
    }
    // Format timestamp en string
    else if (!isNaN(dateValue)) {
      date = new Date(parseInt(dateValue));
    }
    // Autres formats
    else {
      date = new Date(dateValue);
    }
  }
  else {
    date = new Date(dateValue);
  }

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  // Formater la date
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Formate une date et heure pour l'affichage
 * @param {string|number|Date} dateValue - La date à formater
 * @returns {string} - La date et heure formatées
 */
export const formatDateTime = (dateValue) => {
  if (!dateValue) return 'N/A';

  let date;

  // Si c'est déjà un objet Date
  if (dateValue instanceof Date) {
    date = dateValue;
  }
  // Si c'est un nombre (timestamp)
  else if (typeof dateValue === 'number') {
    date = new Date(dateValue);
  }
  // Si c'est une chaîne de caractères
  else if (typeof dateValue === 'string') {
    // Essayer de parser différents formats
    if (dateValue.includes('-') || dateValue.includes('T')) {
      date = new Date(dateValue);
    }
    else if (!isNaN(dateValue)) {
      date = new Date(parseInt(dateValue));
    }
    else {
      date = new Date(dateValue);
    }
  }
  else {
    date = new Date(dateValue);
  }

  // Vérifier si la date est valide
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  // Formater la date et l'heure
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};