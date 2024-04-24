import { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    const encryptedMessage = CryptoJS.AES.encrypt(message, import.meta.env.VITE_SECRET_KEY).toString();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: message })
    }
    const result = await fetch('http://localhost:5000/message', requestOptions);
    const bytes = CryptoJS.AES.decrypt(result.data.message, import.meta.env.VITE_SECRET_KEY);
    const decryptedResponse = bytes.toString(CryptoJS.enc.Utf8);
    setResponse(decryptedResponse);
  };

  return (
    <div className="App">
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
      <p>Response: {response}</p>
    </div>
  );
}

export default App;