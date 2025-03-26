const fs = require('fs').promises; // Asenkron dosya işlemleri için
const path = require('path');

// Veritabanı dosyasının yolu (proje kök dizinindeki data klasörü altında)
const dbPath = path.join(__dirname, '..', 'data', 'db.json');

// Yardımcı fonksiyon: Veritabanı dosyasını okur
async function readDb() {
    try {
        // Dosyanın var olup olmadığını kontrol et (isteğe bağlı ama iyi pratik)
        try {
            await fs.access(dbPath);
        } catch (accessError) {
            // Dosya yoksa boş bir obje ile oluştur
            console.log('db.json bulunamadı, yeni dosya oluşturuluyor...');
            await writeDb({}); // Boş obje yaz
            return {}; // Boş obje döndür
        }

        const data = await fs.readFile(dbPath, 'utf-8');
        return JSON.parse(data); // JSON string'ini objeye çevir
    } catch (error) {
        // Okuma veya parse hatası durumunda
        console.error('Veritabanı okunurken/parse edilirken hata oluştu:', error);
        // Hata durumunda boş bir obje döndürerek uygulamanın devam etmesini sağlayabiliriz
        // veya hatayı yukarı fırlatabiliriz: throw error;
        return {}; // Veya null döndürerek hatayı çağıran yerde yönetebilirsiniz
    }
}

// Yardımcı fonksiyon: Veritabanı dosyasına yazar
async function writeDb(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2); // Okunabilir formatta JSON'a çevir (2 boşluklu girinti)
        await fs.writeFile(dbPath, jsonData, 'utf-8');
    } catch (error) {
        console.error('Veritabanına yazılırken hata oluştu:', error);
        // Hatayı yukarı fırlat: throw error;
    }
}

// --- CRUD Operasyonları ---

/**
 * Belirtilen koleksiyondaki tüm verileri getirir.
 * @param {string} collectionName - Koleksiyonun adı (örn: 'users', 'products')
 * @returns {Promise<Array>} Koleksiyondaki öğelerin dizisi veya hata durumunda boş dizi.
 */
async function getAll(collectionName) {
    const db = await readDb();
    return db[collectionName] || [];
}

/**
 * Belirtilen koleksiyonda ID'ye göre bir öğe getirir.
 * @param {string} collectionName - Koleksiyonun adı.
 * @param {string|number} id - Aranacak öğenin ID'si.
 * @returns {Promise<object|null>} Bulunan öğe veya bulunamazsa null.
 */
async function getById(collectionName, id) {
    const items = await getAll(collectionName);
    // ID'ler string veya number olabilir, esnek karşılaştırma yapalım (==)
    // Strict karşılaştırma (===) isterseniz id tipini standardize etmeniz gerekir.
    return items.find(item => item.id == id) || null;
}

/**
 * Belirtilen koleksiyona yeni bir öğe ekler. Otomatik ID atar.
 * @param {string} collectionName - Koleksiyonun adı.
 * @param {object} newItemData - Eklenecek öğenin verileri (id alanı olmadan).
 * @returns {Promise<object>} Eklenen öğe (ID ile birlikte).
 */
async function add(collectionName, newItemData) {
    const db = await readDb();
    if (!db[collectionName]) {
        db[collectionName] = []; // Koleksiyon yoksa oluştur
    }

    const newItem = {
        ...newItemData,
        id: Date.now().toString() // Basit bir unique ID (daha iyisi için uuid kütüphanesi kullanılabilir)
        // createdAt: new Date().toISOString() // İsteğe bağlı: Oluşturma tarihi
    };

    db[collectionName].push(newItem);
    await writeDb(db);
    return newItem;
}

/**
 * Belirtilen koleksiyondaki bir öğeyi ID'sine göre günceller.
 * @param {string} collectionName - Koleksiyonun adı.
 * @param {string|number} id - Güncellenecek öğenin ID'si.
 * @param {object} updatedData - Yeni veriler (id alanı içerebilir veya içermeyebilir).
 * @returns {Promise<object|null>} Güncellenen öğe veya bulunamazsa null.
 */
async function update(collectionName, id, updatedData) {
    const db = await readDb();
    if (!db[collectionName]) {
        return null; // Koleksiyon yok
    }

    const itemIndex = db[collectionName].findIndex(item => item.id == id);
    if (itemIndex === -1) {
        return null; // Öğe bulunamadı
    }

    // Mevcut öğeyi güncelle, ID'yi koru
    const updatedItem = {
        ...db[collectionName][itemIndex], // Önceki verileri koru
        ...updatedData,                 // Yeni verilerle üzerine yaz
        id: db[collectionName][itemIndex].id // ID'nin değişmediğinden emin ol
        // updatedAt: new Date().toISOString() // İsteğe bağlı: Güncelleme tarihi
    };

    db[collectionName][itemIndex] = updatedItem;
    await writeDb(db);
    return updatedItem;
}

/**
 * Belirtilen koleksiyondaki bir öğeyi ID'sine göre siler.
 * @param {string} collectionName - Koleksiyonun adı.
 * @param {string|number} id - Silinecek öğenin ID'si.
 * @returns {Promise<boolean>} Silme başarılı ise true, öğe bulunamazsa false.
 */
async function remove(collectionName, id) {
    const db = await readDb();
    if (!db[collectionName]) {
        return false; // Koleksiyon yok
    }

    const initialLength = db[collectionName].length;
    // ID'si eşleşmeyenleri filtreleyerek yeni bir dizi oluştur
    db[collectionName] = db[collectionName].filter(item => item.id != id);

    if (db[collectionName].length < initialLength) {
        // Eğer eleman sayısı azaldıysa silme başarılıdır
        await writeDb(db);
        return true;
    } else {
        // Eleman sayısı değişmediyse öğe bulunamamıştır
        return false;
    }
}

module.exports = {
    getAll,
    getById,
    add,
    update,
    remove
    // readDb, writeDb // İsterseniz bunları da export edebilirsiniz ama genellikle iç kullanım içindir.
};
