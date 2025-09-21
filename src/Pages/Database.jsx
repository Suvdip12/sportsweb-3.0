import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  push,
  onValue,
  update,
  remove
} from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCtk0fpRD64Kn8yJrS9HqpwV89Q0KcVSf8",
  authDomain: "try-firebase-6d461.firebaseapp.com",
  databaseURL: "https://try-firebase-6d461-default-rtdb.firebaseio.com",
  projectId: "try-firebase-6d461",
  storageBucket: "try-firebase-6d461.appspot.com",
  messagingSenderId: "37166835775",
  appId: "1:37166835775:web:f4721b39cbc2535850f08a"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function KeyManager() {
  const [entries, setEntries] = useState({});
  const [form, setForm] = useState({ name: '', url: '', keyId: '', key: '' });

  useEffect(() => {
    const keysRef = ref(db, 'keys/');
    onValue(keysRef, snapshot => {
      setEntries(snapshot.val() || {});
    });
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    push(ref(db, 'keys/'), form);
    setForm({ name: '', url: '', keyId: '', key: '' });
  };

  const handleUpdate = id => {
    const newName = prompt("New Name");
    const newUrl = prompt("New URL");
    const newKeyId = prompt("New Key ID");
    const newKey = prompt("New Key");

    if (newName) update(ref(db, 'keys/' + id), { name: newName });
    if (newUrl) update(ref(db, 'keys/' + id), { url: newUrl });
    if (newKeyId) update(ref(db, 'keys/' + id), { keyId: newKeyId });
    if (newKey) update(ref(db, 'keys/' + id), { key: newKey });
  };

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      remove(ref(db, 'keys/' + id));
    }
  };
  return (
    <div style={styles.container}>
      <h1 className='text-black'>Key Manager</h1>
      <form onSubmit={handleSubmit}>
        <input id="name" value={form.name} onChange={handleChange} placeholder="Name" required style={styles.input} />
        <input id="url" value={form.url} onChange={handleChange} placeholder="URL" required type="url" style={styles.input} />
        <input id="keyId" value={form.keyId} onChange={handleChange} placeholder="Key ID" required style={styles.input} />
        <input id="key" value={form.key} onChange={handleChange} placeholder="Key" required style={styles.input} />
        <button type="submit" style={styles.button}>Save</button>
      </form>
   <div>
        {Object.entries(entries).length > 0 ? (
          Object.entries(entries).map(([id, item]) => (
            <div key={id} style={styles.item}>
              <strong>Name:</strong> {item.name}<br />
              <strong>URL:</strong> <a href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a><br />
              <strong>Key ID:</strong> {item.keyId}<br />
              <strong>Key:</strong> {item.key}<br />
              <button onClick={() => handleUpdate(id)} style={{ ...styles.button, backgroundColor: '#ed5210' }}>Update</button>
              <button onClick={() => handleDelete(id)} style={{ ...styles.button, backgroundColor: '#dc3545', marginLeft: '10px' }}>Delete</button>
            </div>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f2f5',
    textAlign: 'center',
    padding: '20px'
  },
  input: {
    width: '80%',
    padding: '10px',
    margin: '8px 0',
    border: '1px solid #ccc',
    borderRadius: '5px'
  },
  button: {
    margin: '10px',
    padding: '10px 15px',
    border: 'none',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  item: {
    background: '#53a1eeff',
    padding: '10px',
    borderRadius: '5px',
    margin: '10px auto',
    width: '80%'
  }
};