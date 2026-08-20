const bcrypt = require("bcryptjs");
const { User } = require("../models");

function showLogin(req, res) {
  res.render("auth/login", { title: "Masuk" });
}

function showRegister(req, res) {
  res.render("auth/register", { title: "Daftar" });
}

async function register(req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password) {
      req.flash("error", "Semua field wajib diisi.");
      return res.redirect("/register");
    }
    if (password !== confirmPassword) {
      req.flash("error", "Konfirmasi password tidak cocok.");
      return res.redirect("/register");
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      req.flash("error", "Email sudah terdaftar. Silakan login.");
      return res.redirect("/login");
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashed,
      role: "user",
      balance: 1000000, // saldo simulasi awal supaya user bisa langsung coba beli tiket
    });

    req.flash("success", "Registrasi berhasil! Silakan login.");
    return res.redirect("/login");
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat registrasi.");
    return res.redirect("/register");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      req.flash("error", "Email atau password salah.");
      return res.redirect("/login");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      req.flash("error", "Email atau password salah.");
      return res.redirect("/login");
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      balance: user.balance,
    };

    const redirectTo = req.session.redirectTo;
    delete req.session.redirectTo;

    req.flash("success", `Selamat datang kembali, ${user.username}!`);
    if (user.role === "admin") {
      return res.redirect(redirectTo || "/admin/dashboard");
    }
    return res.redirect(redirectTo || "/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat login.");
    return res.redirect("/login");
  }
}

function logout(req, res) {
  req.session.destroy(() => {
    res.redirect("/login");
  });
}

module.exports = { showLogin, showRegister, register, login, logout };
