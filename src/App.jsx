import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // Test de connexion à votre API Django
    axios.get('http://localhost:8000/api/test/') // Adaptez l'URL selon vos routes
      .then(response => {
        setData(response.data);
        console.log('Connexion Django réussie !', response.data);
      })
      .catch(error => {
        console.error('Erreur connexion:', error);
      });
  }, []);

  return (
    <div>
      <h1>React + Django</h1>
      {data ? (
        <p>Connexion réussie : {JSON.stringify(data)}</p>
      ) : (
        <p>En attente de connexion...</p>
      )}
    </div>
  );
}

export default App;