const { Op } = require("sequelize");
const {
  Destination,
  Province,
  Ticket,
  Comment,
  User,
  Transaction,
} = require("../models");

// GET / - Beranda: menampilkan destinasi populer + daftar provinsi
async function showHome(req, res) {
  const destinations = await Destination.findAll({
    include: [{ model: Province, as: "province" }, { model: Ticket, as: "tickets" }],
    limit: 8,
    order: [["createdAt", "DESC"]],
  });

  const provinces = await Province.findAll({
    include: [{ model: Destination, as: "destinations", attributes: ["id"] }],
    order: [["name", "ASC"]],
  });

  res.render("index", {
    title: "Beranda",
    destinations,
    provinces,
  });
}

// GET /destinations - daftar semua destinasi, bisa difilter ?province=
async function listDestinations(req, res) {
  const { province, q } = req.query;
  const where = {};
  const include = [{ model: Province, as: "province" }, { model: Ticket, as: "tickets" }];

  if (q) {
    where.name = { [Op.iLike]: `%${q}%` };
  }
  if (province) {
    include[0].where = { name: province };
  }

  const destinations = await Destination.findAll({ where, include, order: [["name", "ASC"]] });
  const provinces = await Province.findAll({ order: [["name", "ASC"]] });

  res.render("destinations/list", {
    title: "Destinasi Wisata",
    destinations,
    provinces,
    selectedProvince: province || "",
    query: q || "",
  });
}

// GET /destinations/:id - detail destinasi (redirect login jika belum login, sesuai requirement)
async function showDetail(req, res) {
  if (!req.session.user) {
    req.session.redirectTo = req.originalUrl;
    req.flash("error", "Silakan login/daftar untuk melihat detail & membeli tiket.");
    return res.redirect("/login");
  }

  const destination = await Destination.findByPk(req.params.id, {
    include: [
      { model: Province, as: "province" },
      { model: Ticket, as: "tickets" },
      {
        model: Comment,
        as: "comments",
        include: [{ model: User, as: "user", attributes: ["id", "username"] }],
        order: [["createdAt", "DESC"]],
      },
    ],
  });

  if (!destination) {
    req.flash("error", "Destinasi tidak ditemukan.");
    return res.redirect("/destinations");
  }

  // Cek apakah user sudah pernah membeli tiket ke destinasi ini (syarat boleh komen)
  const hasPurchased = await Transaction.findOne({
    where: { userId: req.session.user.id, status: "paid" },
    include: [
      {
        model: Ticket,
        as: "ticket",
        where: { destinationId: destination.id },
      },
    ],
  });

  const avgRating =
    destination.comments.length > 0
      ? (
          destination.comments.reduce((sum, c) => sum + c.rating, 0) /
          destination.comments.length
        ).toFixed(1)
      : null;

  res.render("destinations/detail", {
    title: destination.name,
    destination,
    avgRating,
    canComment: Boolean(hasPurchased),
  });
}

// GET /admin/destinations/new
function showCreateForm(req, res) {
  res.render("admin/destinationForm", {
    title: "Tambah Destinasi",
    destination: null,
    formAction: "/admin/destinations",
    formMethod: "POST",
  });
}

// POST /admin/destinations - CREATE (admin only)
async function createDestination(req, res) {
  try {
    const {
      name,
      description,
      provinceName,
      image,
      location,
      altitude,
      openHours,
      history,
      flora,
      fauna,
      uniqueFacts,
      ticketName,
      ticketPrice,
    } = req.body;

    let province = await Province.findOne({ where: { name: provinceName } });
    if (!province) {
      province = await Province.create({ name: provinceName });
    }

    const destination = await Destination.create({
      name,
      description,
      provinceId: province.id,
      image,
      location,
      altitude: altitude || null,
      openHours,
      history,
      flora: flora ? flora.split(",").map((s) => s.trim()).filter(Boolean) : [],
      fauna: fauna ? fauna.split(",").map((s) => s.trim()).filter(Boolean) : [],
      uniqueFacts,
    });

    if (ticketName && ticketPrice) {
      await Ticket.create({
        name: ticketName,
        destinationId: destination.id,
        price: ticketPrice,
      });
    }

    req.flash("success", "Destinasi wisata berhasil ditambahkan.");
    res.redirect("/admin/destinations");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menambahkan destinasi.");
    res.redirect("/admin/destinations/new");
  }
}

// GET /admin/destinations/:id/edit
async function showEditForm(req, res) {
  const destination = await Destination.findByPk(req.params.id, {
    include: [{ model: Province, as: "province" }, { model: Ticket, as: "tickets" }],
  });
  if (!destination) {
    req.flash("error", "Destinasi tidak ditemukan.");
    return res.redirect("/admin/destinations");
  }
  res.render("admin/destinationForm", {
    title: "Edit Destinasi",
    destination,
    formAction: `/admin/destinations/${destination.id}?_method=PUT`,
    formMethod: "POST",
  });
}

// PUT /admin/destinations/:id - UPDATE (admin only)
async function updateDestination(req, res) {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (!destination) {
      req.flash("error", "Destinasi tidak ditemukan.");
      return res.redirect("/admin/destinations");
    }

    const {
      name,
      description,
      provinceName,
      image,
      location,
      altitude,
      openHours,
      history,
      flora,
      fauna,
      uniqueFacts,
    } = req.body;

    let provinceId = destination.provinceId;
    if (provinceName) {
      let province = await Province.findOne({ where: { name: provinceName } });
      if (!province) province = await Province.create({ name: provinceName });
      provinceId = province.id;
    }

    await destination.update({
      name,
      description,
      provinceId,
      image,
      location,
      altitude: altitude || null,
      openHours,
      history,
      flora: flora ? flora.split(",").map((s) => s.trim()).filter(Boolean) : destination.flora,
      fauna: fauna ? fauna.split(",").map((s) => s.trim()).filter(Boolean) : destination.fauna,
      uniqueFacts,
    });

    req.flash("success", "Destinasi wisata berhasil diperbarui (mis. flora/fauna baru ditambahkan).");
    res.redirect("/admin/destinations");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal memperbarui destinasi.");
    res.redirect(`/admin/destinations/${req.params.id}/edit`);
  }
}

// DELETE /admin/destinations/:id
async function deleteDestination(req, res) {
  try {
    const destination = await Destination.findByPk(req.params.id);
    if (destination) await destination.destroy();
    req.flash("success", "Destinasi berhasil dihapus.");
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menghapus destinasi.");
  }
  res.redirect("/admin/destinations");
}

// GET /admin/destinations - list untuk admin
async function adminListDestinations(req, res) {
  const destinations = await Destination.findAll({
    include: [{ model: Province, as: "province" }, { model: Ticket, as: "tickets" }],
    order: [["createdAt", "DESC"]],
  });
  res.render("admin/destinations", { title: "Kelola Destinasi", destinations });
}

module.exports = {
  showHome,
  listDestinations,
  showDetail,
  showCreateForm,
  createDestination,
  showEditForm,
  updateDestination,
  deleteDestination,
  adminListDestinations,
};
