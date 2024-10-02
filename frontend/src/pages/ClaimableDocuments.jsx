import React, { useEffect, useRef, useState } from 'react';
import DataTableClaimableDocuments from '@/components/DataTables/DataTableClaimableDocuments';
import PageHeader from '@/components/PageHeader';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import MobileRequestTicket from '@/mobile/MobileRequestTicket';

const ClaimableDocuments = () => {

    const [data, setData] = useState([]);
    const randomNumber = Math.floor(Math.random() * (90000 - 10000)) + 10000;
    const invoiceRef = useRef(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/claimableDocuments`)
        .then(response => {
          setData(response.data);
        }).catch(error => {
          console.error('Error fetching documents: ', error);
        });
    },[])

    const handleClaimConfirm = (id, userId, documentTitle, trackingId) => {
      axios.put(`${import.meta.env.VITE_API_URL}/claimableDocuments/claimed/${id}`, { userId: userId, document: documentTitle, uniqueId: trackingId })
      .then(response => {
        const { updatedDocument } = response.data;

        setData(prevDocuments => prevDocuments.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));

        toast({
            description: 'Document has been set to claimed.'
        });
        handleSavePdf(userId); 
      })
      .catch(error => {
        console.error('Error updating status: ', error);
      });
    }

    //Save the pdf file
    const handleSavePdf = async (userId) => {
      const element = invoiceRef.current;
      const opt = {
        margin: 0.5,
        filename: `invoice_${randomNumber}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      };
    
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      const formData = new FormData();

      formData.append('userId', userId);
      formData.append('file', pdfBlob, `invoice_${randomNumber}.pdf`);

      try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}claimableDocuments/uploadPdf`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.status === 200) {
          console.log('PDF saved successfully on the server.');
        } else {
          console.error('Error saving PDF.');
        }
      } catch (error) {
        console.error('Error while saving PDF:', error);
      }
    };

    const handleDelete = (id) => {
      axios.delete(`${import.meta.env.VITE_API_URL}/claimableDocuments/${id}`)
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
      axios.delete(`${import.meta.env.VITE_API_URL}/claimableDocuments`)
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
        <div className='hidden'>
            <div ref={invoiceRef}>
                <MobileRequestTicket randomNumber={randomNumber} />
            </div>
        </div>
        </div>
    </div>
  )
};

export default ClaimableDocuments;