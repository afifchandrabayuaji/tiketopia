const {
  Transaction,
  Ticket,
  Destination,
  User,
  sequelize,
} = require("../../models");
const { sendTicketEmail } = require("../config/mailer");

// POST /tickets/:ticketId/buy - user membeli tiket
async function buyTicket(req, res) {
  const t = await sequelize.transaction();
  try {
    const { orderDate, quantityAdult, quantityChild } = req.body;
    const qtyAdult = parseInt(quantityAdult, 10) || 0;
    const qtyChild = parseInt(quantityChild, 10) || 0;

    if (qtyAdult + qtyChild < 1) {
      await t.rollback();
      req.flash("error", "Jumlah tiket minimal 1.");
      return res.redirect("back");
    }

    const ticket = await Ticket.findByPk(req.params.ticketId, {
      include: [{ model: Destination, as: "destination" }],
      transaction: t,
    });
    if (!ticket) {
      await t.rollback();
      req.flash("error", "Tiket tidak ditemukan.");
      return res.redirect("/destinations");
    }

    // Harga anak diasumsikan 70% dari harga dewasa (kebijakan sederhana untuk MVP)
    const totalAmount = qtyAdult * ticket.price + qtyChild * Math.round(ticket.price * 0.7);

    const user = await User.findByPk(req.session.user.id, { transaction: t, lock: t.LOCK.UPDATE });
    if (user.balance < totalAmount) {
      await t.rollback();
      req.flash("error", "Saldo Anda tidak mencukupi untuk membeli tiket ini.");
      return res.redirect(`/destinations/${ticket.destinationId}`);
    }

    user.balance -= totalAmount;
    await user.save({ transaction: t });

    const transaction = await Transaction.create(
      {
        userId: user.id,
        ticketId: ticket.id,
        orderDate: orderDate || new Date(),
        quantityAdult: qtyAdult,
        quantityChild: qtyChild,
        totalAmount,
        status: "paid",
      },
      { transaction: t }
    );

    await t.commit();

    // update session balance
    req.session.user.balance = user.balance;

    // Kirim email berisi info tiket (tidak menggagalkan transaksi jika email gagal)
    try {
      await sendTicketEmail({
        to: user.email,
        user,
        transaction,
        ticket,
        destination: ticket.destination,
      });
    } catch (mailErr) {
      console.error("Gagal mengirim email tiket:", mailErr.message);
    }

    req.flash("success", "Pembelian tiket berhasil! E-tiket telah dikirim ke email Anda.");
    res.redirect("/my-orders");
  } catch (err) {
    await t.rollback();
    console.error(err);
    req.flash("error", "Terjadi kesalahan saat memproses pembelian.");
    res.redirect("back");
  }
}

// GET /my-orders - riwayat pesanan user
async function myOrders(req, res) {
  const transactions = await Transaction.findAll({
    where: { userId: req.session.user.id },
    include: [
      {
        model: Ticket,
        as: "ticket",
        include: [{ model: Destination, as: "destination" }],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.render("user/orders", { title: "Pesanan Saya", transactions });
}

module.exports = { buyTicket, myOrders };
