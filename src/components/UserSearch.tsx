import { useState } from 'react';
import axios from 'axios';

const UserSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const apiUrl = import.meta.env.VITE_API_URL;
  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get(`${apiUrl}/users/search?query=${query}`);
      setResults(res.data.users);
    } catch (err) {
      console.error('Search failed', err);
    }
  };

  return (
    <div style={{ padding: '10px', maxWidth: '600px'}}>
      <input
        type="text"
        placeholder="Search by username, name or location"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
      />
      <button onClick={handleSearch} style={{ padding: '8px 16px' }}>
        Search
      </button>

      {results.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4>Search Results:</h4>
          <ul>
            {results.map((user) => (
              <li key={user._id}>
                <strong>{user.login}</strong> - {user.name || 'N/A'} - {user.location || 'Unknown'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserSearch;
