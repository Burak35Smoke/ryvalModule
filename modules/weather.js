const axios = require('axios');
require('dotenv').config(); // .env dosyasını yükle

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';

async function getWeather(city, units = 'metric', lang = 'tr') {
    if (!API_KEY) {
        console.error('Hata: OpenWeatherMap API anahtarı bulunamadı. .env dosyasını kontrol edin.');
        return null;
    }
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: units, // metric: Celsius, imperial: Fahrenheit
                lang: lang    // Dil kodu (tr, en vb.)
            }
        });
        // Sadece gerekli bilgileri döndürelim
        const data = response.data;
        return {
            city: data.name,
            temperature: data.main.temp,
            feels_like: data.main.feels_like,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
        };
    } catch (error) {
        if (error.response) {
            // API'den gelen hata
            console.error(`Hava durumu alınırken API hatası (${city}): ${error.response.status} - ${error.response.data.message}`);
        } else if (error.request) {
            // İstek yapıldı ama cevap alınamadı
            console.error(`Hava durumu alınırken istek hatası (${city}):`, error.message);
        } else {
            // Başka bir hata
            console.error(`Hava durumu alınırken genel hata (${city}):`, error.message);
        }
        return null;
    }
}

module.exports = { getWeather };
