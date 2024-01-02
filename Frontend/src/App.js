import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [cryptoList, setCryptoList] = useState([]);
  const [sourceCrypto, setSourceCrypto] = useState('');
  const [amount, setAmount] = useState('');
  const [targetCurrency, setTargetCurrency] = useState('usd');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [retryAfter, setRetryAfter] = useState(null);

  useEffect(() => {
    // Fetch the list of top 100 cryptocurrencies
    axios.get('https://cryptocurrencyapi.onrender.com/crypto-list')
      .then((response) => {
        setCryptoList(response.data);
        setSourceCrypto(response.data[0]?.id || '');
      })
      .catch((error) => console.error(error));

    // Fetch the list of supported currencies
    axios.get('https://cryptocurrencyapi.onrender.com/currencies')
      .then((response) => {
        setCurrencies(response.data.currencies);
      })
      .catch((error) => console.error(error));
  }, []);

  const handleConvert = () => {
    // If retryAfter is not null, do not make the request
    if (retryAfter !== null) {
      alert(`Too many requests. Please wait for ${retryAfter} seconds before trying again.`);
      return;
    }

    // Perform currency conversion
    axios.get('https://cryptocurrencyapi.onrender.com/convert', {
      params: {
        sourceCrypto,
        amount,
        targetCurrency,
      },
    })
      .then((response) => setConvertedAmount(response.data.convertedAmount))
      .catch((error) => {
        console.error(error);
        if (error.response && error.response.status === 429) {
          // Handle 429 status (Too Many Requests)
          const retryAfterValue = error.response.headers['retry-after'];
          setRetryAfter(retryAfterValue);
        }
      });
  };

  return (
    <div className="App">
      <h1>Crypto Currency Converter</h1>
      <form>
        <label>
          Source Crypto:
          <select value={sourceCrypto} onChange={(e) => setSourceCrypto(e.target.value)}>
            {cryptoList.map((crypto) => (
              <option key={crypto.id} value={crypto.id}>
                {crypto.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <br />
        <label>
          Target Currency:
          <select value={targetCurrency} onChange={(e) => setTargetCurrency(e.target.value)}>
            {currencies.map((currency) => (
              <option key={currency} value={currency}>
                {currency.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="button" onClick={handleConvert} disabled={retryAfter !== null}>
          Convert
        </button>
      </form>
      {convertedAmount !== null && (
        <div>
          <h2>Converted Amount:</h2>
          <p>{targetCurrency.toUpperCase()}  {convertedAmount}</p>
        </div>
      )}
    </div>
  );
}

export default App;
