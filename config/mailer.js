const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  secure: false, // true untuk port 465, false untuk port lain (STARTTLS)
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

/**
 * Mengirim email berisi informasi tiket yang baru dibeli user.
 * @param {Object} params
 * @param {string} params.to - email tujuan
 * @param {Object} params.user - data user pembeli
 * @param {Object} params.transaction - data transaksi
 * @param {Object} params.ticket - data tiket
 * @param {Object} params.destination - data destinasi
 */
async function sendTicketEmail({ to, user, transaction, ticket, destination }) {
  const totalTiket = transaction.quantityAdult + transaction.quantityChild;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background:#14532d; padding: 20px; text-align:center;">
        <h1 style="color:#ffffff; margin:0; font-size: 22px;">🏔️ Tiketopia</h1>
        <p style="color:#bbf7d0; margin:4px 0 0;">E-Tiket Anda</p>
      </div>
      <div style="padding: 24px;">
        <p>Halo <strong>${user.username}</strong>,</p>
        <p>Terima kasih telah melakukan pembelian tiket di Tiketopia. Berikut adalah informasi tiket Anda:</p>
        <table style="width:100%; border-collapse: collapse; margin-top: 12px;">
          <tr>
            <td style="padding:8px 0; color:#555;">Kode Transaksi</td>
            <td style="padding:8px 0; text-align:right; font-weight:bold;">TRX-${String(transaction.id).padStart(6, "0")}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Destinasi</td>
            <td style="padding:8px 0; text-align:right; font-weight:bold;">${destination.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Nama Tiket</td>
            <td style="padding:8px 0; text-align:right;">${ticket.name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Tanggal Kunjungan</td>
            <td style="padding:8px 0; text-align:right;">${new Date(transaction.orderDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Jumlah Tiket</td>
            <td style="padding:8px 0; text-align:right;">${transaction.quantityAdult} Dewasa, ${transaction.quantityChild} Anak (${totalTiket} tiket)</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Total Pembayaran</td>
            <td style="padding:8px 0; text-align:right; font-weight:bold;">Rp${Number(transaction.totalAmount).toLocaleString("id-ID")}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#555;">Status</td>
            <td style="padding:8px 0; text-align:right; color:#16a34a; font-weight:bold;">${transaction.status.toUpperCase()}</td>
          </tr>
        </table>
        <p style="margin-top:20px; font-size: 13px; color:#666;">
          Tiket ini sah untuk satu kali kunjungan. Harap tunjukkan e-tiket ini saat masuk lokasi.
        </p>
        <p style="margin-top: 20px;">Salam hangat,<br/>Tim Tiketopia</p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.MAIL_USER,
    to,
    subject: `E-Tiket Tiketopia - ${destination.name} (TRX-${String(transaction.id).padStart(6, "0")})`,
    html,
  });
}

module.exports = { transporter, sendTicketEmail };
