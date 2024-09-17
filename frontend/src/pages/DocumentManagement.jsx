import React, { useMemo, useEffect, useState} from 'react';
import DataTableDocument from '@/components/DataTables/DataTableDocument';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DialogBoxAddDocument from '@/components/DialogBoxes/DocumentDialogs/DialogBoxAddDocument';

const DocumentManagement = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

useEffect(() => {
  fetchDocumentCounts();
}, []);

const fetchDocumentCounts = () => {
  fetch('http://localhost:5000/api/titles/document-counts')
  .then(response => response.json())
  .then(data => setData(data))
  .catch(error => console.error('Error fetching document counts:', error));
}

  const handleAddDocument = (documentData) => {
    axios.post('http://localhost:5000/api/titles', documentData)
      .then(response => {
        const newDocument = response.data;
        setData(prevData => [...prevData, newDocument]);
        toast({
          description: "Document added successfully.",
        });
      })
      .catch(error => {
        console.error('Error adding document:', error);
        toast({
          description: "Error adding document.",
        });
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/titles/${id}`)
      .then(() => {
        setData(prevData => prevData.filter(doc => doc._id !== id));
        toast({
          variant: "destructive",
          description: "Document has been deleted.",
        });
      })
      .catch(error => {
        console.error('Error deleting document:', error);
      });
  };

  const handleDeleteAll = () => {
    axios.delete('http://localhost:5000/api/titles')
      .then(() => {
        setData([]);
        toast({
          variant: "destructive",
          description: "Document has been deleted.",
        });
      })
      .catch(error => {
        console.error('Error deleting document:', error);
      });
  };

  const handleEditDocuments = (documentData) => {
    axios.put(`http://localhost:5000/api/titles/${documentData.id}`, documentData)
      .then(response => {
        const updatedDocument = response.data;
        setData(prevData => prevData.map(doc => (doc._id === updatedDocument._id ? updatedDocument : doc)));
        toast({
          description: "Document edited successfully.",
        });

        fetchDocumentCounts();
      })
      .catch(error => {
        console.error('Error updating document: ', error);
        toast({
          description: "Error updating document.",
        });
      });
  };  

  const handleViewDocuments = (document) => {
    navigate('/viewDocuments', { state: { document} });
  };

  return (
    <div className='flex-1'>
      <PageHeader />
      <DialogBoxAddDocument onClick={handleAddDocument}/>
      <DataTableDocument 
        data={data} 
        handleDelete={handleDelete} 
        handleDeleteAll={handleDeleteAll}
        handleViewDocuments={handleViewDocuments}
        handleOnClikEdit={handleEditDocuments}
      />
    </div>
  )
};

export default DocumentManagement;