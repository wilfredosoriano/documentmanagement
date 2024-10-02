const express = require('express');
const claimableDocumentModel = require('../models/claimableDocumentModel');
const documentModel = require('../models/documentModel');
const appointmentModel = require('../models/appointmentModel');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const router = express.Router();

const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../frontend/src/assets/files')); // Path of folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // original name for the file
    },
});

const upload = multer({ storage });

router.post('/uploadPdf', upload.single('file'), async (req, res) => {

    const { userId } = req.body;

    const user = await userModel.findOne({ _id: userId});

    const filePath = path.join(__dirname, '../../frontend/src/assets/files', req.file.filename);

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: 'wilfredomailer@gmail.com',
        pass: 'ibvxtgdimaxpiusz',
        },
    });

    if (!fs.existsSync(filePath)) {
        return res.status(400).json({ error: 'File not found' });
    }

    try {
        let info = await transporter.sendMail({
            from: 'wilfredomailer@gmail.com',
            to: user.email,
            subject: 'Invoice',
            text: 'Please download and print the attached pdf file and sumbit the printed copy to the registrar to claim your document.',
            attachments: [
                {
                filename: req.file.filename,
                path: filePath,
                },
            ],
        });

            res.status(200).json({ message: 'Email sent successfully', info: info });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email', details: error.message });
        }
});

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
        const { userId, document, uniqueId } = req.body;

        const DateToday = new Date();
        
        // Update claimable document
        const claimableDocument = await claimableDocumentModel.findByIdAndUpdate(
            id,
            { status: 'claimed', claimedDate: DateToday },
            { new: true }
        );

        // Update document status
        const documentStatus = await documentModel.findOne({ uniqueId: uniqueId });

        if (documentStatus) {
            documentStatus.status = 'claimed';
            documentStatus.claimedDate = DateToday;
            await documentStatus.save();
        }

        // Update appointment
        const appointmentUserId = await appointmentModel.findOne({ userId: userId, document: document });

        if (!appointmentUserId) {
            return res.status(404).json({ error: 'Appointment userId not found' });
        }

        appointmentUserId.userId = null;
        await appointmentUserId.save();

        //Update transaction status
        const transaction = await transactionModel.findOne({ uniqueId: documentStatus.uniqueId });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        transaction.status = "claimed";
        transaction.claimedDate = DateToday;
        await transaction.save();

        //Update appointment status
        const appointmentStatus = await appointmentModel.findOne({ _id: documentStatus.uniqueId  });

        if(!appointmentStatus){
            return res.status(404).json({ error: 'Appontment status nnot found' })
        }

        appointmentStatus.status = 'claimed';
        appointmentStatus.claimedDate = DateToday;
        await appointmentStatus.save();

        res.status(201).json({ updatedDocument: claimableDocument});

    } catch (error) {
        console.error('Failed to update: ', error);
        res.status(500).json({ error: 'Failed to update the document' });    
    }
});

//delete data
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await claimableDocumentModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Claimable document deleted successfully' });
    } catch (error) {
        console.error('Error deleting claimable document: ', error);
        res.status(500).json({ error: 'Failed to delete claimable document' });
    }
});

router.delete('/', async (req, res) => {
    try {
        await claimableDocumentModel.deleteMany();
        res.status(200).json({ message: 'Claimable documents deleted successfully' });
    } catch (error) {
        console.error('Error deleting all the claimable documents: ', error);
        res.status(500).json({ error: 'Failed to delete all the claimble documents' });
    }
});

module.exports = router;