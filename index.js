// index.js

const weatherApi = require('./modules/weather');
const currencyApi = require('./modules/currency');
const moviesApi = require('./modules/movies');
const jsonDatabase = require('./modules/jsonDb'); // Dikkat: jsonDb'nin kullanımıyla ilgili notlara bak

module.exports = {
    // Fonksiyonları daha anlaşılır isimlerle gruplayarak export edebiliriz
    weather: {
        get: weatherApi.getWeather
    },
    currency: {
        getRate: currencyApi.getExchangeRate
    },
    movies: {
        getInfo: moviesApi.getMovieInfo
    },
    // jsonDb modülünü doğrudan export etmek yerine, belki bir fabrika fonksiyonu sunmak daha iyi olabilir
    // veya kullanıcının path'i vermesini sağlamak (aşağıdaki nota bak)
    jsonDb: jsonDatabase
};
