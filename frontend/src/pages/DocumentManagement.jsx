import React, { useMemo, useEffect, useState} from 'react';
import DataTableDocument from '@/components/DataTables/DataTableDocument';
import PageHeader from '@/components/PageHeader';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import DialogBoxAddDocument from '@/components/DialogBoxes/DocumentDialogs/DialogBoxAddDocument';
import axiosInstance from '@/components/Interceptors/axiosInstance';

const DocumentManagement = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [data, setData] = useState([]);

useEffect(() => {
  fetchDocumentCounts();
}, []);

const fetchDocumentCounts = () => {
  axiosInstance.get('/titles/document-counts')
  .then(response => {
    const data = response.data;
    setData(data);
  }).catch(error => {
    console.error('Error fetching document counts:', error)
  });
}

  const handleAddDocument = (documentData) => {
    axiosInstance.post('/titles', documentData)
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

  const handleDeleteAll = () => {
    axiosInstance.delete('/titles')
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
    axiosInstance.put(`/titles/${documentData.id}`, documentData)
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
    <div className='flex flex-col max-h-screen'>
      <PageHeader />
      <div className='mt-20 p-5'>
      <DialogBoxAddDocument onClick={handleAddDocument}/>
      <DataTableDocument 
        data={data} 
        handleDeleteAll={handleDeleteAll}
        handleViewDocuments={handleViewDocuments}
        handleOnClikEdit={handleEditDocuments}
      />
      </div>
    </div>
  )
};

export default DocumentManagement;