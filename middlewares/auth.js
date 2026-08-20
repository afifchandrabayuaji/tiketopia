// Menyimpan destinasi/URL yang dituju agar setelah login user diarahkan kembali ke sana
function isLoggedIn(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  req.session.redirectTo = req.originalUrl;
  req.flash("error", "Silakan login terlebih dahulu untuk melanjutkan.");
  return res.redirect("/login");
}

function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  }
  req.flash("error", "Halaman ini hanya bisa diakses oleh admin.");
  return res.redirect("/");
}

function isGuest(req, res, next) {
  if (req.session && req.session.user) {
    return res.redirect("/");
  }
  return next();
}

// Menyisipkan data user & flash message ke semua view tanpa perlu ditulis di tiap controller
function injectLocals(req, res, next) {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
}

module.exports = { isLoggedIn, isAdmin, isGuest, injectLocals };
