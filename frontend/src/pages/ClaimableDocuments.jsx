import React, { useEffect, useState } from 'react';
import DataTableClaimableDocuments from '@/components/DataTables/DataTableClaimableDocuments';
import PageHeader from '@/components/PageHeader';
import { toast } from '@/components/ui/use-toast';
import axiosInstance from '@/components/Interceptors/axiosInstance';

const ClaimableDocuments = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get('/claimableDocuments')
        .then(response => {
          setData(response.data);
        }).catch(error => {
          console.error('Error fetching documents: ', error);
        });
    },[])

    const handleClaimConfirm = (id, userId, documentTitle, trackingId) => {
      axiosInstance.put(`/claimableDocuments/claimed/${id}`, { userId: userId, document: documentTitle, uniqueId: trackingId })
      .then(response => {
        const { updatedDocument } = response.data;

        setData(prevDocuments => prevDocuments.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));

        toast({
            description: 'Document has been set to claimed.'
        });
      })
      .catch(error => {
        console.error('Error updating status: ', error);
      });
    }

    const handleDelete = (id) => {
      axiosInstance.delete(`/claimableDocuments/${id}`)
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
      axiosInstance.delete('/claimableDocuments')
        .then(() => {
          setData([]);
          toast({
            variant: "destructive",
            description: "Documents has been deleted.",
          });
        })
        .catch(error => {
          console.error('Error deleting document:', error);
        });
    };

  return (
    <div className='flex flex-col max-h-screen'>
        <PageHeader/>
        <div className='mt-20 p-5'>
        <DataTableClaimableDocuments 
          data={data} 
          handleClaimConfirm={handleClaimConfirm}
          handleDelete={handleDelete}
          handleDeleteAll={handleDeleteAll}
        />
        </div>
    </div>
  )
};

export default ClaimableDocuments;