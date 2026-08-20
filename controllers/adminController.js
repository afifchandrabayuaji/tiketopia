const { Destination, Transaction, Comment, User, Province } = require("../models");

async function dashboard(req, res) {
  const [totalDestinations, totalTransactions, totalComments, totalUsers, recentTransactions] =
    await Promise.all([
      Destination.count(),
      Transaction.count({ where: { status: "paid" } }),
      Comment.count(),
      User.count({ where: { role: "user" } }),
      Transaction.findAll({
        where: { status: "paid" },
        limit: 5,
        order: [["createdAt", "DESC"]],
        include: [
          { model: User, as: "user", attributes: ["username"] },
        ],
      }),
    ]);

  const revenueResult = await Transaction.sum("totalAmount", { where: { status: "paid" } });

  res.render("admin/dashboard", {
    title: "Dashboard Admin",
    stats: {
      totalDestinations,
      totalTransactions,
      totalComments,
      totalUsers,
      revenue: revenueResult || 0,
    },
    recentTransactions,
  });
}

module.exports = { dashboard };
