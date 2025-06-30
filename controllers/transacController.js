// controllers/transactionController.js


const PDFDocument = require('pdfkit'); 
const Transaction = require('../models/Transaction');
const User = require('../models/User');

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user
    const {
      type,
      status,
      payGateway,
      from,
      to,
      minAmount,
      maxAmount,
      contact,
      referenceId,
      groupId,
      sortBy = 'createdOn',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const filters = { user: userId };

    if (type) filters.type = type.toUpperCase(); // DEBIT/CREDIT
    if (status) filters.status = status;
    if (payGateway) filters.payGateway = payGateway;
    if (referenceId) filters.referenceId = referenceId;
    if (groupId) filters.groupId = groupId;

    if (from || to) {
      filters.createdOn = {};
      if (from) filters.createdOn.$gte = new Date(from);
      if (to) filters.createdOn.$lte = new Date(to);
    }

    if (minAmount || maxAmount) {
      filters.amount = {};
      if (minAmount) filters.amount.$gte = parseFloat(minAmount);
      if (maxAmount) filters.amount.$lte = parseFloat(maxAmount);
    }

    if (contact) {
      const matchedUser = await User.findOne({ contact });
      if (matchedUser) {
        filters.$or = [
          { sender: matchedUser._id },
          { receiver: matchedUser._id }
        ];
      } else {
        return res.status(404).json({ error: 'No user found with that contact' });
      }
    }

    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filters)
      .sort({ [sortBy]: order === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sender', 'firstname lastname contact')
      .populate('receiver', 'firstname lastname contact');

    const total = await Transaction.countDocuments(filters);

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
      transactions
    });

  } catch (err) {
    console.error('Transaction filtering error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
};


exports.exportPDF = async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Transaction.find({ user: userId }).lean();

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Transaction History', { align: 'center' });
    doc.moveDown();

    transactions.forEach(txn => {
      doc.fontSize(12).text(`Ref: ${txn.referenceId}`);
      doc.text(`Type: ${txn.type}`);
      doc.text(`Amount: ₹${txn.amount}`);
      doc.text(`Status: ${txn.status}`);
      doc.text(`Date: ${txn.createdOn.toDateString()}`);
      doc.moveDown();
    });

    doc.end();

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to export PDF' });
  }
};

