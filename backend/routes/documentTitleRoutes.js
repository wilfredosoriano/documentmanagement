const express = require('express');
const multer = require('multer');
const documentTitleModel = require('../models/documentTitleModel');
const documentModel = require('../models/documentModel');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/document-counts', async (req, res) => {
  try {
      const documents = await documentModel.aggregate([
          { $group: { _id: "$document", count: { $sum: 1 } } }
      ]);

      const titlesWithCounts = await documentTitleModel.aggregate([
          { 
              $lookup: {
                  from: "documents",
                  localField: "title",
                  foreignField: "document",
                  as: "documents"
              }
          },
          {
              $addFields: {
                  count: { $size: "$documents" }
              }
          },
          {
            $project: {
              documents: 0,
            }
          }
      ]);

      res.json(titlesWithCounts);
      
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
      const { title, price, description } = req.body;
      const image = req.file;

      const imageBase64 = image ? image.buffer.toString('base64') : null;
      
      let newDocument = await documentTitleModel.create({ title, price, description, image: imageBase64 });
      
      newDocument = await documentTitleModel.findByIdAndUpdate(
          newDocument._id,
          { uniqueId: newDocument._id.toString() },
          { new: true }
      );

      res.status(200).json(newDocument);
  } catch (err) {
      console.error('Error adding document title:', err);
      res.status(500).json({ error: 'Failed to add document title' });
  }
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  documentTitleModel.findById(id)
  .then(document => {
      if (!document) {
        return res.status(404).json({ error: 'Document title id not found' });
      }
      res.status(200).json(document);
  })
  .catch(error => {
    console.error('Error fetching document id: ', error);
    res.status(500).json({ error: 'Failed to fetch document id' });
  });
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, price, description } = req.body;


    const updatedDocument = await documentTitleModel.findByIdAndUpdate(
      id,
      { title, price, description },
      { new: true } 
    );

    if (!updatedDocument) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document: ', error);
    res.status(500).json({ error: 'Failed to update document.' }); // Generic error message for internal server errors
  }
});

router.delete('/', async (req, res) => {
  try {
    await documentTitleModel.deleteMany();
    res.status(200).json({ message: 'Titles deleted successfully' });
  } catch (error) {
    console.error('Error deleting titles: ', error);
    res.status(500).json({ error: 'Failed to delete titles' });
  }
});

router.get('/', (req, res) => {
  documentTitleModel.find()
  .then(documents => {
      res.status(200).json(documents);
  })
  .catch(err => {
      console.error('Error fetching document titles:', err);
      res.status(500).json({ error: 'Failed to fetch document titles' });
  })
});

module.exports = router;