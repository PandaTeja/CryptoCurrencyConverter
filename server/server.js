const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors()); // Enable CORS

// API endpoint to fetch the top 100 cryptocurrencies and supported currencies
app.get('/crypto-list', async (req, res) => {
  try {
    // Fetch data from a public API like Coingecko
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    });

    const cryptoList = response.data;
    res.json(cryptoList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint for currency conversion
app.get('/convert', async (req, res) => {
  const { sourceCrypto, amount, targetCurrency } = req.query;

  try {
    // Fetch real-time exchange rates from Coingecko or another public API
    const exchangeRatesResponse = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: sourceCrypto,
        vs_currencies: targetCurrency.toLowerCase(),
      },
    });

    const exchangeRate = exchangeRatesResponse.data[sourceCrypto][targetCurrency.toLowerCase()];
    const convertedAmount = amount * exchangeRate;

    res.json({ convertedAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API endpoint to get a list of supported currencies
app.get('/currencies', async (req, res) => {
  try {
    // Fetch a list of currencies from a public API or a predefined list
    const currencyListResponse = await axios.get('https://api.coingecko.com/api/v3/simple/supported_vs_currencies');
    const currencies = currencyListResponse.data;
    res.json({ currencies });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example endpoint to test additional functionality
app.get('/test-endpoint', (req, res) => {
  res.json({ message: 'This is a test endpoint!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
