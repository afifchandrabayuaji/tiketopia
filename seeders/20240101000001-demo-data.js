"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const now = new Date();

    // --- Users ---
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await queryInterface.bulkInsert("users", [
      {
        username: "Admin Tiketopia",
        email: "admin@tiketopia.com",
        password: adminPassword,
        role: "admin",
        balance: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        username: "Andi Wijaya",
        email: "andi@example.com",
        password: userPassword,
        role: "user",
        balance: 2000000,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Provinces ---
    await queryInterface.bulkInsert("provinces", [
      { id: 1, name: "Jawa Barat", createdAt: now, updatedAt: now },
      { id: 2, name: "Jawa Timur", createdAt: now, updatedAt: now },
      { id: 3, name: "Bali", createdAt: now, updatedAt: now },
      { id: 4, name: "Jawa Tengah", createdAt: now, updatedAt: now },
    ]);

    // --- Destinations ---
    await queryInterface.bulkInsert("destinations", [
      {
        id: 1,
        name: "Kawah Putih",
        description:
          "Kawah Putih merupakan danau vulkanik yang berada di kawasan Ciwidey, Bandung Selatan.",
        province_id: 1,
        image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
        location: "Ciwidey, Bandung, Jawa Barat",
        altitude: 2430,
        openHours: "07.00 - 17.00 WIB",
        history:
          "Kawah Putih terbentuk dari letusan Gunung Patuha. Letusan terakhir terjadi pada abad ke-10 yang membentuk kawah dan menghasilkan fenomena alam yang indah seperti saat ini.",
        flora: ["Pohon Pinus", "Rasamala", "Edelweiss"],
        fauna: ["Lutung Jawa", "Elang Jawa", "Kijang"],
        unique_facts:
          "Air kawah dapat berubah warna tergantung kadar belerang dan cuaca.\nMerupakan salah satu destinasi paling instagramable di Indonesia.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 2,
        name: "Gunung Bromo",
        description: "Gunung berapi aktif dengan pemandangan matahari terbit yang legendaris.",
        province_id: 2,
        image: "https://images.unsplash.com/photo-1589308454676-32d1c9e91a4b?w=800",
        location: "Probolinggo, Jawa Timur",
        altitude: 2329,
        openHours: "00.00 - 24.00 WIB (sunrise tour dimulai dini hari)",
        history:
          "Gunung Bromo merupakan bagian dari kompleks Pegunungan Tengger yang menjadi tempat suci bagi masyarakat Suku Tengger.",
        flora: ["Edelweiss Jawa", "Cemara Gunung", "Rumput Savana"],
        fauna: ["Rusa Timor", "Elang Jawa", "Ayam Hutan"],
        unique_facts:
          "Setiap tahun diadakan upacara adat Yadnya Kasada oleh Suku Tengger.\nLautan pasir seluas 10 km2 mengelilingi kawah aktifnya.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 3,
        name: "Pantai Kelingking",
        description:
          "Pantai eksotis di Nusa Penida dengan tebing berbentuk menyerupai kepala T-Rex.",
        province_id: 3,
        image: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800",
        location: "Nusa Penida, Bali",
        altitude: 0,
        openHours: "06.00 - 18.00 WITA",
        history:
          "Kelingking Beach dikenal wisatawan sejak sekitar tahun 2015 setelah foto tebingnya viral di media sosial.",
        flora: ["Pohon Kelapa", "Semak Pantai"],
        fauna: ["Burung Camar", "Kepiting Pantai"],
        unique_facts: "Tebingnya menyerupai bentuk kepala dinosaurus T-Rex jika dilihat dari kejauhan.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 4,
        name: "Candi Borobudur",
        description: "Candi Buddha terbesar di dunia dan salah satu situs warisan dunia UNESCO.",
        province_id: 4,
        image: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800",
        location: "Magelang, Jawa Tengah",
        altitude: 265,
        openHours: "06.30 - 17.00 WIB",
        history:
          "Dibangun pada abad ke-8 dan ke-9 pada masa pemerintahan wangsa Syailendra, Candi Borobudur menjadi pusat ziarah umat Buddha.",
        flora: ["Pohon Bodhi", "Kamboja"],
        fauna: ["Burung Kutilang", "Tupai Jawa"],
        unique_facts: "Terdiri dari 2.672 panel relief dan 504 arca Buddha.",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // --- Tickets ---
    await queryInterface.bulkInsert("tickets", [
      { name: "Tiket Masuk Dewasa", destination_id: 1, price: 120000, createdAt: now, updatedAt: now },
      { name: "Tiket Masuk Dewasa", destination_id: 2, price: 150000, createdAt: now, updatedAt: now },
      { name: "Tiket Masuk Dewasa", destination_id: 3, price: 100000, createdAt: now, updatedAt: now },
      { name: "Tiket Masuk Dewasa", destination_id: 4, price: 75000, createdAt: now, updatedAt: now },
    ]);
  },

  async down(queryInterface) {
    // Urutan hapus dibalik supaya tidak melanggar foreign key
    await queryInterface.bulkDelete("tickets", null, {});
    await queryInterface.bulkDelete("destinations", null, {});
    await queryInterface.bulkDelete("provinces", null, {});
    await queryInterface.bulkDelete("users", null, {});
  },
};
