const express = require('express');
const documentModel = require('../models/documentModel');
const claimableDocumentModel = require('../models/claimableDocumentModel');
const transactionModel = require('../models/transactionModel');

const router = express.Router();

const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear();
}

router.get('/', async (req, res) => {
    try {
      const { date } = req.query;
      let documents;

      if (date) {
        documents = await documentModel.find();
        documents = documents.filter(doc => isToday(new Date(doc.createdDate)));

      } else {
        documents = await documentModel.find();
      }  

      res.json(documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
      res.status(500).json({ error: 'Failed to fetch document' });
    }
})

router.get('/title/:document', async (req, res) => {
  try {
    const { document }  = req.params;
    const documents = await documentModel.find({ document });
    res.json(documents);
  } catch (error) {
    console.error('Failed fetching documents: ', error)
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
})

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const document = await documentModel.findById(id);
    res.json(document);
  } catch (error) {
    console.error('Failed fetching document: ', error)
    res.status(500).json({ error: 'Failed to fetch document' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await documentModel.findByIdAndDelete(id);
    res.status(200).json({ message: 'Document deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

router.delete('/', async (req, res) => {
  try {
    await documentModel.deleteMany();
    res.status(200).json({ message: 'Documents deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

router.post('/claim/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { claimableDate } = req.body;

    const document = await documentModel.findById(id);
    if (!document) {
      res.status(404).json({ error: 'Document not found' });
    }

    const newDocument = new claimableDocumentModel({
      uniqueId: document.uniqueId,
      userId: document.userId,
      document: document.document,
      name: document.name,
      address: document.address,
      claimableDate: claimableDate,
      reservedDate: document.reservedDate
    });

    await newDocument.save();

    document.status = 'ready to claim';
    await document.save();

    const transaction = await transactionModel.findOne({ uniqueId: document.uniqueId });
        
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
    
    transaction.status = "ready to claim";
    await transaction.save();

    res.status(201).json({ newDocument, updatedDocument: document });

  } catch (error) {
    console.error('Error creating document:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

module.exports = router;