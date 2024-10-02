const express = require('express');
const appointmentModel = require('../models/appointmentModel');
const documentModel = require('../models/documentModel');
const documentTitleModel = require('../models/documentTitleModel');
const userModel = require('../models/userModel');
const transactionModel = require('../models/transactionModel');

const router = express.Router();

const isToday = (someDate) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
      someDate.getMonth() === today.getMonth() &&
      someDate.getFullYear() === today.getFullYear();
}

router.post('/reserve/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, document } = req.body;

        const user = await userModel.findById({ _id: userId });

        const reserve = await documentTitleModel.findById(id);

        const exist = await appointmentModel.findOne({ userId, document: document });

        if(exist){
            return res.status(400).json({ message: 'You have already reserved this document' });
        }

        //reserve the document
        const reservedDocument = new appointmentModel({
            userId: userId,
            document: reserve.title,
            name: `${user.firstname} ${user.middlename} ${user.lastname}`,
            address: user.address,
        });
        const savedReservation = await reservedDocument.save();

        // Save the transaction to the user history with the appointment ID
        if(savedReservation._id){
            const transactionHistory = new transactionModel({
                uniqueId: savedReservation._id,
                userId: userId,
                document: reserve.title,
            });

            await transactionHistory.save();
        }

        res.status(201).json(savedReservation);

    } catch (error) {
        console.error('Error reserving document: ', error);
        res.status(500).json({ error: 'Failed to reserve document' });
    }
});

router.post('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const appointment = await appointmentModel.findById(id);
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const newDocument = new documentModel({
            uniqueId: appointment._id,
            userId: appointment.userId,
            document: appointment.document,
            name: appointment.name,
            address: appointment.address,
            reservedDate: appointment.reservedDate
        });

        await newDocument.save();

        appointment.status = "approved";
        await appointment.save();

        const transaction = await transactionModel.findOne({ uniqueId: appointment._id });
        
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }
        
        transaction.status = "preparing";
        await transaction.save();

        res.status(201).json({ newDocument, updatedAppointment: appointment });
        
    } catch (error) {
        console.error('Error creating document:', error);
        res.status(500).json({ error: 'Failed to create document' });
    }
});

router.put('/notifications/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await appointmentModel.findByIdAndUpdate(
            id,
            { isRead: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        res.status(200).json({ updatedNotification: notification });

    } catch (error) {
        console.error('Error updating isRead: ', error);
        res.status(500).json({ error: 'Failed to update the isRead' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await appointmentModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment: ', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
});

router.delete('/', async (req, res) => {
    try {
        await appointmentModel.deleteMany();
        res.status(200).json({ message: 'Appointments deleted successfully' });
    } catch (error) {
        console.error('Error deleting all appointments: ', error);
        res.status(500).json({ error: 'Failed to delete all the appointments' });
    }
});
 
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentModel.findById(id);
        res.json(appointment);
    } catch (error) {
        console.error('Error fetching apppointment')
        res.status(500).json({ error: 'Failed to fetch appointment' })
    }
});

router.get('/', async (req, res) => {
    try {
        const { createdDate, reservedDate } = req.query; 
        let documents;

        if (createdDate || reservedDate) {
            documents = await appointmentModel.find();
            documents = documents.filter(doc => 
                (createdDate && isToday(new Date(doc.createdDate))) ||
                (reservedDate && isToday(new Date(doc.reservedDate)))
            );
        } else {
            documents = await appointmentModel.find();
        }
        
        res.json(documents);
        
    } catch (error) {
        console.error('Error fetching appointments: ', error);
        res.status(500).json({ error: 'Documents fetching error' });
    }
});

module.exports = router;