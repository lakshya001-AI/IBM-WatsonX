const mongoose = require('mongoose');

const ibmSchema = new mongoose.Schema({
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: String, required: true },
    dueDate: { type: String, required: true },
    clientName: { type: String, required: true },
    invoiceDescription: { type: String, required: true },
    invoiceAmount: { type: String, required: true },
    paymentLink: { type: String, required: true },
    paymentStatus: { type: String, required: true },
});

const ibmModel = mongoose.model('ibmModel', ibmSchema);

module.exports = ibmModel;
