import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get API URL from environment variable, fallback to default
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost/api';
        
        // Fetch items
        const itemsResponse = await axios.get(`${apiUrl}/items`);
        setItems(itemsResponse.data);
        
        // Fetch users
        const usersResponse = await axios.get(`${apiUrl}/users`);
        setUsers(usersResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multi-Service Docker Application</h1>
      </header>
      
      <main className="container">
        <section className="card">
          <h2>Users</h2>
          <ul>
            {users.map((user) => (
              <li key={user._id}>
                <strong>{user.name}</strong> - {user.email} ({user.role})
              </li>
            ))}
          </ul>
        </section>
        
        <section className="card">
          <h2>Items</h2>
          <ul>
            {items.map((item) => (
              <li key={item._id}>
                <strong>{item.name}</strong> - ${item.price}
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}

export default App;