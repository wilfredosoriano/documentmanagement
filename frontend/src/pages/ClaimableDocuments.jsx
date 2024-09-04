import React, { useEffect, useState } from 'react';
import DataTableClaimableDocuments from '@/components/DataTables/DataTableClaimableDocuments';
import PageHeader from '@/components/PageHeader';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const ClaimableDocuments = () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/claimableDocuments')
        .then(response => {
          setData(response.data);
        }).catch(error => {
          console.error('Error fetching documents: ', error);
        });
    },[])

    const handleClaimConfirm = (id, userId, documentTitle, formatDate, trackingId) => {
      axios.put(`http://localhost:5000/api/claimableDocuments/claimed/${id}`, { userId: userId, document: documentTitle, claimedDate: formatDate, uniqueId: trackingId })
      .then(response => {
        const { updatedDocument } = response.data;

        setData(prevDocuments => prevDocuments.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));

        toast({
            description: 'Document has been set to claimed.'
        }) 
      })
      .catch(error => {
        console.error('Error updating status: ', error);
      });
    }

  return (
    <div className='flex-1'>
        <PageHeader/>
        <DataTableClaimableDocuments data={data} handleClaimConfirm={handleClaimConfirm}/>
    </div>
  )
};

export default ClaimableDocuments;