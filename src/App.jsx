import { useEffect, useRef, useState } from 'react';
import CryptoJS from 'crypto-js';
import './App.css'

function App() {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const resultsEndRef = useRef(null);

    const scrollToBottom = () => {
        resultsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [results]);

    const sendMessage = async () => {
        event.preventDefault();
        if (message) {
            setLoading(true);
            setResults(prevState => [...prevState, { message: message, response: null }]);
            setMessage('')

            try {
                const encryptedMessage = CryptoJS.AES.encrypt(JSON.stringify({ message }), import.meta.env.VITE_SECRET_KEY).toString();
                const requestOptions = {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: encryptedMessage })
                };

                const response = await fetch('https://chatbot-nodejs-zz1a.onrender.com/message', requestOptions);
                const resultJson = await response.json();
                const bytes = CryptoJS.AES.decrypt(resultJson.message, import.meta.env.VITE_SECRET_KEY);
                const decryptedResponse = bytes.toString(CryptoJS.enc.Utf8);
                setResults(prevState => {
                    const newState = [...prevState];
                    newState[newState.length - 1] = { message: message, response: decryptedResponse };
                    return newState;
                });
                setResponse(decryptedResponse);
                setLoading(false);
            } catch (error) {
                console.error('Error:', error);
                setResponse('Error processing request');
                setResults(prevState => {
                    const newState = [...prevState];
                    newState[newState.length - 1] = { message: message, response: 'Değerli hemkarım, çok özür dilerim. Yeniden dene' };
                    return newState;
                });
            }
        }
    };

    return (
        <div className="App">
            <div className='container'>
                <div className="result">
                    {!results.length && <div className='hello'>Salam əziz həmkarım. Nə lazımdır?</div>}
                    {results.length > 0 ? results.map((result, index) => (
                        <div key={index}>
                            <div className='mes'>
                                <div className='request'>
                                    <div className="avatar"></div>
                                    <div>{result.message}</div>
                                </div>
                                <div className='response'>
                                    <div className='response-avatar'>
                                        <img src="/public/sefa.jpg" alt="" />
                                    </div>
                                    {result.response != null ? <div className='result-text' dangerouslySetInnerHTML={{ __html: result.response  }} /> : <div className='load-avatar'></div>}
                                </div>
                            </div>
                        </div>
                    )) : null}
                    <div ref={resultsEndRef} />
                </div>
                <form onSubmit={sendMessage} className='form'>
                    <input className='input' placeholder='Axtar...' value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                    {/* {message && (
                        <img onClick={sendMessage} className='send-btn' src="https://chatbot-psi-nine.vercel.app/public/send.svg" width={20} alt="Send" />
                    )} */}
                    <p style={{ fontSize: '11px' }}>Bu proyekt Fuad Sadıqov və İlkin Rəfiyev tərəfindən Kriptoqrafiya fənni üçün hazırlanmışdır</p>
                </form>
            </div>
        </div>
    );
}

export default App;