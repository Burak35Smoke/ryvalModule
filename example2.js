// Kullanıcının kendi projesindeki app.js dosyasında:
const path = require('path');
const { createDbInstance } = require('ryvalmodule'); // Sizin paketiniz

// Kullanıcı kendi db dosyasının yolunu belirtir
const myDbPath = path.join(__dirname, 'my-data', 'database.json'); // Veya './database.json' vb.

// Belirtilen yolla bir veritabanı örneği oluşturulur
const db = createDbInstance(myDbPath);

// Artık bu 'db' objesi üzerinden CRUD işlemleri yapılır
async function run() {
    await db.add('users', { name: 'Zeynep', role: 'admin' });
    const users = await db.getAll('users');
    console.log(users);
}
run();
