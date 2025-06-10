import axios from 'axios';

export const getCommandes = () => {
  return axios.get('/api/commandes/');
};
