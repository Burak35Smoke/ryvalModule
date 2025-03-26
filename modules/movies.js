const axios = require('axios');
require('dotenv').config();

const API_KEY = process.env.OMDB_API_KEY;
const BASE_URL = 'http://www.omdbapi.com/';

async function getMovieInfo(title) {
     if (!API_KEY) {
        console.error('Hata: OMDb API anahtarı bulunamadı. .env dosyasını kontrol edin.');
        return null;
    }
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                apikey: API_KEY,
                t: title // 's' parametresi ile arama da yapılabilir (search)
            }
        });

        if (response.data && response.data.Response === 'True') {
            // Sadece istediğimiz alanları alalım
            const { Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Awards, imdbRating, imdbID } = response.data;
            return { Title, Year, Rated, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Awards, imdbRating, imdbID };
        } else if (response.data.Response === 'False') {
            console.error(`Film bulunamadı (${title}): ${response.data.Error}`);
            return null;
        } else {
             console.error(`Film bilgisi alınırken bilinmeyen API yanıtı (${title}):`, response.data);
             return null;
        }
    } catch (error) {
        if (error.response) {
            console.error(`Film bilgisi alınırken API hatası (${title}): ${error.response.status}`, error.response.data);
        } else if (error.request) {
            console.error(`Film bilgisi alınırken istek hatası (${title}):`, error.message);
        } else {
            console.error(`Film bilgisi alınırken genel hata (${title}):`, error.message);
        }
        return null;
    }
}

module.exports = { getMovieInfo };
