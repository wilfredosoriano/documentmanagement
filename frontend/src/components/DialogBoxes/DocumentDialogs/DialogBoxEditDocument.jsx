import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import axios from 'axios';
  

const DialogBoxEditDocument = ({ onClick, isOpen, onClose, documentId }) => {
  const [documentTitle, setDocumentTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if(documentId) {
      axios.get(`http://localhost:5000/api/titles/${documentId}`)
      .then(response => {
        const document = response.data;
        setDocumentTitle(document.title);
        setPrice(document.price);
        setDescription(document.description);
      })
      .catch(error => {
        console.error('Error fetching titles: ', error);
      })
    }
  }, [documentId])

  const handleEditDocument = (e) => {
    e.preventDefault();

    const documentData = {
      id: documentId,
      title: documentTitle,
      price: parseFloat(price),
      description: description,
    };

    //console.log(documentData);

    onClick(documentData); 

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
                This will edit the document details from the database.
            </DialogDescription>
            </DialogHeader>
            <Input type="text" placeholder="Document Title" value={documentTitle} onChange={(e) => setDocumentTitle(e.target.value)} />
            <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Textarea type="text" placeholder="Document Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <DialogFooter>
                <Button onClick={handleEditDocument}>Edit Document</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DialogBoxEditDocument;