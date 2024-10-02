import React, { useState, useEffect } from 'react';
import DataTableViewDocument from '@/components/DataTables/DataTableViewDocuments';
import PageHeader from '@/components/PageHeader';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';

const ViewDocuments = () => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const { document } = location.state || {};

    useEffect(() => {
        if(document){
            axios.get(`${import.meta.env.VITE_API_URL}/documents/title/${document}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching documents', error);
            });
        }
    }, [])

    const handleDelete = (id) => {
        axios.get(`${import.meta.env.VITE_API_URL}/documents/${id}`)
        .then(() => {
            setData(prevData => prevData.filter(doc => doc._id !== id));
            toast({
                variant: 'destructive',
                description: 'Document has been deleted',
            });
        }).catch(error => {
            console.error('Error deleting document: ',  error);
        });
    };


    const handleDeleteAll = () => {
        axios.delete(`${import.meta.env.VITE_API_URL}/documents`)
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

    const handleClaimConfirm = (documentId, formattedDate) => {
        axios.post(`${import.meta.env.VITE_API_URL}/documents/claim/${documentId}`, { claimableDate: formattedDate })
        .then(response => {
            const { updatedDocument } = response.data;

            setData(prevDocuments => prevDocuments.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));
 
            toast({
            description: `Date has been set on ${formattedDate} for claim.`,
            });
        })
        .catch(error => {
            console.error('Error updating status: ', error);
        });
    };
    
  return (
    <div className='flex flex-col min-h-screen'>
        <PageHeader />
        <div className='mt-20 p-5'>
        <div className='text-xl font-bold'>{document}</div>
        <DataTableViewDocument
            data={data}
            handleDelete={handleDelete}
            handleDeleteAll={handleDeleteAll}
            handleClaimConfirm={handleClaimConfirm}
        />
        </div>
    </div>
  )
}

export default ViewDocuments;