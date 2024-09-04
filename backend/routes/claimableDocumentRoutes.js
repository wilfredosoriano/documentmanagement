const express = require('express');
const claimableDocumentModel = require('../models/claimableDocumentModel');
const documentModel = require('../models/documentModel');
const appointmentModel = require('../models/appointmentModel');

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
        documents = await claimableDocumentModel.find();
        documents = documents.filter(doc => isToday(new Date(doc.createdDate)));

    } else {
        documents = await claimableDocumentModel.find();
    }  

    res.json(documents);
    } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch document' });
    }
});

router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const document = await claimableDocumentModel.findById(id);
      res.json(document);
    } catch (error) {
      console.error('Failed fetching document: ', error)
      res.status(500).json({ error: 'Failed to fetch document' });
    }
});

router.put('/claimed/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, document, claimedDate, uniqueId } = req.body;
        
        // Update claimable document
        const claimableDocument = await claimableDocumentModel.findByIdAndUpdate(
            id,
            { status: 'claimed', claimedDate: claimedDate },
            { new: true }
        );

        // Update document status
        const documentStatus = await documentModel.findOne({ uniqueId: uniqueId });

        if (documentStatus) {
            documentStatus.status = 'claimed';
            await documentStatus.save();
        }

        // Update appointment
        const appointmentUserId = await appointmentModel.findOne({ userId: userId, document: document });

        if (!appointmentUserId) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        appointmentUserId.userId = null;
        await appointmentUserId.save();

        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(201).json({ updatedDocument: claimableDocument});

    } catch (error) {
        console.error('Failed to update: ', error);
        res.status(500).json({ error: 'Failed to update the document' });    
    }
});


module.exports = router;