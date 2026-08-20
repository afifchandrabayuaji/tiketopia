require("dotenv").config();
const bcrypt = require("bcryptjs");
const { sequelize, User, Province, Destination, Ticket } = require("../models");

async function seed() {
  try {
    await sequelize.sync({ force: true }); // WARNING: reset semua tabel

    // --- Users ---
    const adminPassword = await bcrypt.hash("admin123", 10);
    const userPassword = await bcrypt.hash("user123", 10);

    await User.create({
      username: "Admin Tiketopia",
      email: "admin@tiketopia.com",
      password: adminPassword,
      role: "admin",
      balance: 0,
    });

    await User.create({
      username: "Andi Wijaya",
      email: "andi@example.com",
      password: userPassword,
      role: "user",
      balance: 2000000,
    });

    // --- Provinces ---
    const jabar = await Province.create({ name: "Jawa Barat" });
    const jatim = await Province.create({ name: "Jawa Timur" });
    const bali = await Province.create({ name: "Bali" });
    const jateng = await Province.create({ name: "Jawa Tengah" });

    // --- Destinations ---
    const kawahPutih = await Destination.create({
      name: "Kawah Putih",
      description:
        "Kawah Putih merupakan danau vulkanik yang berada di kawasan Ciwidey, Bandung Selatan.",
      provinceId: jabar.id,
      image:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      location: "Ciwidey, Bandung, Jawa Barat",
      altitude: 2430,
      openHours: "07.00 - 17.00 WIB",
      history:
        "Kawah Putih terbentuk dari letusan Gunung Patuha. Letusan terakhir terjadi pada abad ke-10 yang membentuk kawah dan menghasilkan fenomena alam yang indah seperti saat ini.",
      flora: ["Pohon Pinus", "Rasamala", "Edelweiss"],
      fauna: ["Lutung Jawa", "Elang Jawa", "Kijang"],
      uniqueFacts:
        "Air kawah dapat berubah warna tergantung kadar belerang dan cuaca.\nMerupakan salah satu destinasi paling instagramable di Indonesia.",
    });
    await Ticket.create({ name: "Tiket Masuk Dewasa", destinationId: kawahPutih.id, price: 120000 });

    const bromo = await Destination.create({
      name: "Gunung Bromo",
      description: "Gunung berapi aktif dengan pemandangan matahari terbit yang legendaris.",
      provinceId: jatim.id,
      image:
        "https://images.unsplash.com/photo-1589308454676-32d1c9e91a4b?w=800",
      location: "Probolinggo, Jawa Timur",
      altitude: 2329,
      openHours: "00.00 - 24.00 WIB (sunrise tour dimulai dini hari)",
      history:
        "Gunung Bromo merupakan bagian dari kompleks Pegunungan Tengger yang menjadi tempat suci bagi masyarakat Suku Tengger.",
      flora: ["Edelweiss Jawa", "Cemara Gunung", "Rumput Savana"],
      fauna: ["Rusa Timor", "Elang Jawa", "Ayam Hutan"],
      uniqueFacts:
        "Setiap tahun diadakan upacara adat Yadnya Kasada oleh Suku Tengger.\nLautan pasir seluas 10 km2 mengelilingi kawah aktifnya.",
    });
    await Ticket.create({ name: "Tiket Masuk Dewasa", destinationId: bromo.id, price: 150000 });

    const kelingking = await Destination.create({
      name: "Pantai Kelingking",
      description: "Pantai eksotis di Nusa Penida dengan tebing berbentuk menyerupai kepala T-Rex.",
      provinceId: bali.id,
      image:
        "https://images.unsplash.com/photo-1573790387438-4da905039392?w=800",
      location: "Nusa Penida, Bali",
      altitude: 0,
      openHours: "06.00 - 18.00 WITA",
      history:
        "Kelingking Beach dikenal wisatawan sejak sekitar tahun 2015 setelah foto tebingnya viral di media sosial.",
      flora: ["Pohon Kelapa", "Semak Pantai"],
      fauna: ["Burung Camar", "Kepiting Pantai"],
      uniqueFacts: "Tebingnya menyerupai bentuk kepala dinosaurus T-Rex jika dilihat dari kejauhan.",
    });
    await Ticket.create({ name: "Tiket Masuk Dewasa", destinationId: kelingking.id, price: 100000 });

    const borobudur = await Destination.create({
      name: "Candi Borobudur",
      description: "Candi Buddha terbesar di dunia dan salah satu situs warisan dunia UNESCO.",
      provinceId: jateng.id,
      image:
        "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800",
      location: "Magelang, Jawa Tengah",
      altitude: 265,
      openHours: "06.30 - 17.00 WIB",
      history:
        "Dibangun pada abad ke-8 dan ke-9 pada masa pemerintahan wangsa Syailendra, Candi Borobudur menjadi pusat ziarah umat Buddha.",
      flora: ["Pohon Bodhi", "Kamboja"],
      fauna: ["Burung Kutilang", "Tupai Jawa"],
      uniqueFacts: "Terdiri dari 2.672 panel relief dan 504 arca Buddha.",
    });
    await Ticket.create({ name: "Tiket Masuk Dewasa", destinationId: borobudur.id, price: 75000 });

    console.log("✅ Seed data berhasil dibuat.");
    console.log("   Admin login: admin@tiketopia.com / admin123");
    console.log("   User login : andi@example.com / user123");
    process.exit(0);
  } catch (err) {
    console.error("❌ Gagal seed data:", err);
    process.exit(1);
  }
}

seed();
