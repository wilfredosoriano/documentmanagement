import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from '../../ui/button';
import { LuImagePlus, LuPlus } from 'react-icons/lu';
import { Textarea } from '../../ui/textarea';
import { Input } from '../../ui/input';
  

const DialogBoxAddDocument = ({ onClick }) => {

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState('');

    const handleAddDocument = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    onClick(formData);

    setTitle('');
    setPrice('');
    setDescription('');
    setImage(null);
    setFileName('');
  }

  return (
    <Dialog>
      <DialogTrigger asChild className='gap-2'>
        <Button><LuPlus size={20}/>Add Document</Button>
      </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
            <DialogDescription>
                This will add new document to the database.
            </DialogDescription>
            </DialogHeader>
            <Input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Textarea type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

            <label className='inline-block cursor-pointer border border-input ring-offset-background rounded-md p-4 bg-background'>
            <span className='text-muted-foreground text-sm flex items-center gap-1'>
              {fileName ? fileName : 'Document photo'}
              {!fileName && <LuImagePlus size={20} />}
            </span>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setImage(e.target.files[0]);
                  setFileName(e.target.files[0].name);
                }
              }}
              className="hidden" />
            </label>
            <DialogFooter>
                <Button onClick={handleAddDocument}>Add Document</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DialogBoxAddDocument;