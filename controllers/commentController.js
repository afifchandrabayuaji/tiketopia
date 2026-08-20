const { Comment, Transaction, Ticket, User, Destination } = require("../models");

// POST /destinations/:id/comments - CREATE (hanya user yang sudah beli tiket)
async function createComment(req, res) {
  try {
    const destinationId = req.params.id;
    const { content, rating } = req.body;

    const hasPurchased = await Transaction.findOne({
      where: { userId: req.session.user.id, status: "paid" },
      include: [{ model: Ticket, as: "ticket", where: { destinationId } }],
    });

    if (!hasPurchased) {
      req.flash("error", "Anda hanya bisa memberi ulasan untuk destinasi yang sudah pernah Anda beli tiketnya.");
      return res.redirect(`/destinations/${destinationId}`);
    }

    if (!content || content.trim().length === 0) {
      req.flash("error", "Komentar tidak boleh kosong.");
      return res.redirect(`/destinations/${destinationId}`);
    }

    await Comment.create({
      userId: req.session.user.id,
      destinationId,
      content: content.trim(),
      rating: Math.min(5, Math.max(1, parseInt(rating, 10) || 5)),
    });

    req.flash("success", "Ulasan berhasil ditambahkan.");
    res.redirect(`/destinations/${destinationId}#ulasan`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menambahkan ulasan.");
    res.redirect(`/destinations/${req.params.id}`);
  }
}

// PUT /comments/:id - UPDATE (hanya pemilik komentar sendiri)
async function updateComment(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      req.flash("error", "Komentar tidak ditemukan.");
      return res.redirect("back");
    }
    if (comment.userId !== req.session.user.id) {
      req.flash("error", "Anda hanya bisa mengedit komentar milik Anda sendiri.");
      return res.redirect("back");
    }

    const { content, rating } = req.body;
    await comment.update({
      content: content?.trim() || comment.content,
      rating: rating ? Math.min(5, Math.max(1, parseInt(rating, 10))) : comment.rating,
    });

    req.flash("success", "Komentar berhasil diperbarui.");
    res.redirect(`/destinations/${comment.destinationId}#ulasan`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal memperbarui komentar.");
    res.redirect("back");
  }
}

// DELETE /comments/:id - user hanya bisa hapus miliknya sendiri, admin bisa hapus semua
async function deleteComment(req, res) {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      req.flash("error", "Komentar tidak ditemukan.");
      return res.redirect("back");
    }

    const isOwner = comment.userId === req.session.user.id;
    const isAdmin = req.session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      req.flash("error", "Anda tidak berhak menghapus komentar ini.");
      return res.redirect("back");
    }

    const destinationId = comment.destinationId;
    await comment.destroy();

    req.flash("success", "Komentar berhasil dihapus.");
    if (isAdmin && !isOwner) {
      return res.redirect("/admin/comments");
    }
    res.redirect(`/destinations/${destinationId}#ulasan`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Gagal menghapus komentar.");
    res.redirect("back");
  }
}

// GET /admin/comments - admin melihat & moderasi semua komentar
async function adminListComments(req, res) {
  const comments = await Comment.findAll({
    include: [
      { model: User, as: "user", attributes: ["id", "username"] },
      { model: Destination, as: "destination", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
  res.render("admin/comments", { title: "Kelola Komentar", comments });
}

module.exports = { createComment, updateComment, deleteComment, adminListComments };
