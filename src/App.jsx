import { useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');

  const sendMessage = async () => {
    event.preventDefault();
    try {
      const encryptedMessage = CryptoJS.AES.encrypt(message, import.meta.env.VITE_SECRET_KEY).toString();
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: encryptedMessage })
      };
      const response = await fetch('http://localhost:5000/message', requestOptions);
      const resultJson = await response.json();
      const bytes = CryptoJS.AES.decrypt(resultJson.message, import.meta.env.VITE_SECRET_KEY);
      const decryptedResponse = bytes.toString(CryptoJS.enc.Utf8);
      setResponse(decryptedResponse);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error processing request');
    }
  };

  return (
    <div className="App">
      <div>
        <p dangerouslySetInnerHTML={{ __html: response }}></p>
        <form onSubmit={sendMessage} className='form'>
          <input className='input' value={message} onChange={(e) => setMessage(e.target.value)} />
          <button type='submit'>Send</button>
        </form>
      </div>
    </div>
  );
}

export default App;