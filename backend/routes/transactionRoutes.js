const express = require('express');
const transactionModel = require('../models/transactionModel');

const router = express.Router();

router.get('/', (req, res) => {
    transactionModel.find()
    .then(transactions => {
        res.status(200).json(transactions);
    })
    .catch(error => {
        console.error('Error fetching transactions: ', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    })
});

router.get('/status/:id', async (req, res) => {
    try {
    const { id } = req.params;

        const transaction = await transactionModel.findById(id);
        res.json(transaction);

    } catch (error) {
        console.error('Failed fetching transaction: ', error)
        es.status(500).json({ error: 'Failed to fetch transaction' });
    }
});

module.exports = router;