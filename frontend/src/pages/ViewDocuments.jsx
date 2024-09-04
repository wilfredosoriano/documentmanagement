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
            axios.get(`http://localhost:5000/api/documents/title/${document}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching documents', error);
            });
        }
    }, [])

    const handleDelete = (id) => {
        axios.get(`http://localhost:5000/api/documents/${id}`)
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
        axios.delete('http://localhost:5000/api/documents')
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
        axios.post(`http://localhost:5000/api/documents/claim/${documentId}`, { claimableDate: formattedDate })
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
    <div className='flex-1'>
        <PageHeader />
        <div className='text-xl font-bold'>{document}</div>
        <DataTableViewDocument
            data={data}
            handleDelete={handleDelete}
            handleDeleteAll={handleDeleteAll}
            handleClaimConfirm={handleClaimConfirm}
        />
    </div>
  )
}

export default ViewDocuments;