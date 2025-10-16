const express = require('express');
const app = express();
const cors = require('cors');
const connectMongoDB = require('./MongoDB/connectMongoDB');
const ibmModel = require('./MongoDB/schema');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
require('dotenv').config();

connectMongoDB();

app.use(cors());
app.use(express.json());

/**
 * Swagger/OpenAPI setup
 */
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "IBM Watson Orchestrate API",
            version: "1.0.0",
            description: "API for creating and fetching invoices"
        },
    },
    apis: ["./index.js"], // Swagger reads this file
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get("/openapi.json", (req, res) => res.json(openapiSpecification));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Test route
 *     responses:
 *       200:
 *         description: Returns a welcome message
 */
app.get("/", (req, res) => {
    res.send("Hello this is IBM Watson Orchestrate API's backend");
});

/**
 * @swagger
 * /api/create-invoice:
 *   post:
 *     summary: Create a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               invoiceNumber:
 *                 type: string
 *               invoiceDate:
 *                 type: string
 *               dueDate:
 *                 type: string
 *               clientName:
 *                 type: string
 *               invoiceDescription:
 *                 type: string
 *               invoiceAmount:
 *                 type: number
 *               paymentLink:
 *                 type: string
 *               paymentStatus:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invoice created successfully
 *       500:
 *         description: Error creating invoice
 */
app.post('/api/create-invoice', async (req, res) => {
    try {
        const newInvoice = new ibmModel(req.body);
        await newInvoice.save(); // save to DB
        res.status(200).send({ message: "Invoice created successfully", newInvoice });
    } catch (error) {
        console.log("Error in creating invoice", error);
        res.status(500).send({ message: "Error in creating invoice", error });
    }
});

/**
 * @swagger
 * /api/get-all-invoices:
 *   get:
 *     summary: Get all invoices
 *     responses:
 *       200:
 *         description: Returns all invoices
 *       500:
 *         description: Error fetching invoices
 */
app.get('/api/get-all-invoices', async (req, res) => {
    try {
        const allInvoices = await ibmModel.find({});
        res.status(200).send({ message: "All invoices fetched successfully", allInvoices });
    } catch (error) {
        console.log("Error in fetching all invoices", error);
        res.status(500).send({ message: "Error in fetching all invoices", error });
    }
});

/**
 * @swagger
 * /api/get-invoice-by-id/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Returns invoice details
 *       500:
 *         description: Error fetching invoice
 */
app.get("/api/get-invoice-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const invoiceDetails = await ibmModel.findById(id);
        res.status(200).send({ message: "Invoice details fetched successfully", invoiceDetails });
    } catch (error) {
        console.log("Error in fetching invoice details by id", error);
        res.status(500).send({ message: "Error in fetching invoice details by id", error });
    }
});

/**
 * @swagger
 * /api/get-invoice-by-clientName/{clientName}:
 *   get:
 *     summary: Get invoice by client name
 *     parameters:
 *       - in: path
 *         name: clientName
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the client
 *     responses:
 *       200:
 *         description: Returns invoice details for a client
 *       500:
 *         description: Error fetching invoice
 */
app.get("/api/get-invoice-by-clientName/:clientName", async (req, res) => {
    try {
        const { clientName } = req.params;
        const invoiceDetailsByClientName = await ibmModel.find({ clientName });
        res.status(200).send({ message: "Invoice details fetched successfully", invoiceDetailsByClientName });
    } catch (error) {
        console.log("Error in fetching invoice details by client name", error);
        res.status(500).send({ message: "Error in fetching invoice details by client name", error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
