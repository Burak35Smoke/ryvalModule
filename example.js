// Gerekli modülleri import et
const weather = require('./modules/weather');
const currency = require('./modules/currency');
const movies = require('./modules/movies');
const db = require('./modules/jsonDb'); // JSON DB modülümüz

// Asenkron işlemleri yönetmek için bir ana fonksiyon
async function main() {
    console.log("--- Hava Durumu Testi ---");
    const ankaraWeather = await weather.getWeather('Ankara');
    if (ankaraWeather) {
        console.log(`Ankara Hava Durumu: ${ankaraWeather.temperature}°C, ${ankaraWeather.description}`);
    }
    const londonWeather = await weather.getWeather('London', 'imperial', 'en'); // Farklı birim ve dil
     if (londonWeather) {
        console.log(`Londra Hava Durumu: ${londonWeather.temperature}°F, ${londonWeather.description}`);
    }
    const nonExistentCity = await weather.getWeather('OlmayanSehir123'); // Hata testi
    if (!nonExistentCity) {
        console.log("Beklendiği gibi, 'OlmayanSehir123' için hava durumu alınamadı.");
    }

    console.log("\n--- Döviz Kuru Testi ---");
    const usdTry = await currency.getExchangeRate('USD', 'TRY');
    if (usdTry) {
        console.log(`1 ${usdTry.base} = ${usdTry.rate} ${usdTry.target} (Son Güncelleme: ${usdTry.last_update})`);
    }
    const eurTry = await currency.getExchangeRate('EUR', 'TRY');
     if (eurTry) {
        console.log(`1 ${eurTry.base} = ${eurTry.rate} ${eurTry.target}`);
    }
    const invalidCurrency = await currency.getExchangeRate('USD', 'XYZ'); // Hata testi
     if (!invalidCurrency) {
        console.log("Beklendiği gibi, 'XYZ' kuru alınamadı.");
    }

    console.log("\n--- Film Bilgisi Testi ---");
    const inceptionInfo = await movies.getMovieInfo('Inception');
    if (inceptionInfo) {
        console.log(`Film: ${inceptionInfo.Title} (${inceptionInfo.Year}), Yönetmen: ${inceptionInfo.Director}, Puan: ${inceptionInfo.imdbRating}`);
    }
     const nonExistentMovie = await movies.getMovieInfo('Bu Film Yoktur Herhalde'); // Hata testi
      if (!nonExistentMovie) {
        console.log("Beklendiği gibi, 'Bu Film Yoktur Herhalde' bulunamadı.");
    }

    console.log("\n--- JSON Veritabanı Testi ---");
    const collection = 'users'; // Kullanıcılar koleksiyonu üzerinde çalışalım

    // 1. Yeni kullanıcı ekle
    console.log("Yeni kullanıcı ekleniyor...");
    const newUser1 = await db.add(collection, { name: 'Ahmet Yılmaz', email: 'ahmet@example.com', age: 30 });
    console.log("Eklendi:", newUser1);
    const newUser2 = await db.add(collection, { name: 'Ayşe Kaya', email: 'ayse@example.com', age: 25 });
    console.log("Eklendi:", newUser2);

    // 2. Tüm kullanıcıları getir
    console.log("\nTüm kullanıcılar:");
    const allUsers = await db.getAll(collection);
    console.log(allUsers);

    // 3. ID ile bir kullanıcı getir
    const userIdToGet = newUser1.id; // Ahmet'in ID'sini al
    console.log(`\nKullanıcı getiriliyor (ID: ${userIdToGet}):`);
    const foundUser = await db.getById(collection, userIdToGet);
    console.log("Bulunan:", foundUser);

    // 4. Bir kullanıcıyı güncelle
    const userIdToUpdate = newUser2.id; // Ayşe'nin ID'sini al
    console.log(`\nKullanıcı güncelleniyor (ID: ${userIdToUpdate}):`);
    const updatedUser = await db.update(collection, userIdToUpdate, { age: 26, city: 'İstanbul' }); // Yaşı güncelle ve şehir ekle
    console.log("Güncellenen:", updatedUser);

    // 5. Güncellenmiş kullanıcıyı tekrar getir
    console.log(`\nGüncellenmiş kullanıcı getiriliyor (ID: ${userIdToUpdate}):`);
    const reFoundUser = await db.getById(collection, userIdToUpdate);
    console.log("Bulunan:", reFoundUser);

    // 6. Bir kullanıcıyı sil
    const userIdToDelete = newUser1.id; // Ahmet'in ID'sini al
    console.log(`\nKullanıcı siliniyor (ID: ${userIdToDelete}):`);
    const deleted = await db.remove(collection, userIdToDelete);
    console.log("Silme başarılı mı?", deleted);

    // 7. Tüm kullanıcıları tekrar getir (Ahmet olmamalı)
    console.log("\nKalan kullanıcılar:");
    const remainingUsers = await db.getAll(collection);
    console.log(remainingUsers);

     // 8. Var olmayan bir koleksiyonu deneme
     console.log("\nVar olmayan 'products' koleksiyonu deneniyor:");
     const products = await db.getAll('products');
     console.log("Products:", products); // Boş dizi dönmeli
     const productAdd = await db.add('products', { name: 'Laptop', price: 1500 });
     console.log("Yeni ürün eklendi:", productAdd);
     const allProducts = await db.getAll('products');
     console.log("Tüm ürünler:", allProducts);


}

// Ana fonksiyonu çalıştır
main().catch(error => {
    console.error("Ana uygulamada beklenmeyen bir hata oluştu:", error);
});
