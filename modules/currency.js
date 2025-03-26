const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.EXCHANGERATE_API_KEY;
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/`; // API'nizin URL yapısına göre değiştirin

async function getExchangeRate(baseCurrency = 'USD', targetCurrency = 'TRY') {
    if (!API_KEY) {
        console.error('Hata: ExchangeRate API anahtarı bulunamadı. .env dosyasını kontrol edin.');
        return null;
    }
    try {
        const url = `${BASE_URL}${baseCurrency.toUpperCase()}`;
        const response = await axios.get(url);

        if (response.data && response.data.result === 'success' && response.data.conversion_rates) {
            const rate = response.data.conversion_rates[targetCurrency.toUpperCase()];
            if (rate) {
                return {
                    base: baseCurrency.toUpperCase(),
                    target: targetCurrency.toUpperCase(),
                    rate: rate,
                    last_update: new Date(response.data.time_last_update_unix * 1000).toLocaleString(),
                };
            } else {
                console.error(`Hata: Hedef para birimi (${targetCurrency}) API yanıtında bulunamadı.`);
                return null;
            }
        } else {
            console.error('Hata: API yanıtı beklenildiği gibi değil.', response.data);
            return null;
        }
    } catch (error) {
         if (error.response) {
            console.error(`Döviz kuru alınırken API hatası (${baseCurrency}->${targetCurrency}): ${error.response.status} - ${error.response.data['error-type'] || error.response.data.message}`);
        } else if (error.request) {
            console.error(`Döviz kuru alınırken istek hatası (${baseCurrency}->${targetCurrency}):`, error.message);
        } else {
            console.error(`Döviz kuru alınırken genel hata (${baseCurrency}->${targetCurrency}):`, error.message);
        }
        return null;
    }
}

module.exports = { getExchangeRate };
