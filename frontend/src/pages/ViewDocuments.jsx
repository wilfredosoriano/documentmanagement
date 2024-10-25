import React, { useState, useEffect, useRef } from 'react';
import DataTableViewDocument from '@/components/DataTables/DataTableViewDocuments';
import PageHeader from '@/components/PageHeader';
import { toast } from '@/components/ui/use-toast';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js/dist/html2pdf.bundle.min';
import MobileRequestTicket from '@/mobile/MobileRequestTicket';
import { format } from 'date-fns';
import axiosInstance from '@/components/Interceptors/axiosInstance';

const ViewDocuments = () => {
    const [data, setData] = useState([]);
    const location = useLocation();
    const { document } = location.state || {};
    const invoiceRef = useRef(null);
    const [documentName, setDocumentName] = useState('');
    const [documentPrice, setDocumentPrice] = useState('');
    const [finalPrice, setFinalPrice] = useState('');
    const [randomNumber, setRandomNumber] = useState('');

    const date = new Date();
    const documentDate = format(date, 'MM/dd/yy');


    useEffect(() => {
        if(document){
            axiosInstance.get(`/documents/title/${document}`)
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching documents', error);
            });
        }
    }, [])

    const handleDelete = (id) => {
        axiosInstance.get(`/documents/${id}`)
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
        axiosInstance.delete('/documents')
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

      const handleClaimConfirm = (documentId, formattedDate, userId, document) => {
       
        setDocumentName(document);
        const generatedRandomNumber = Math.floor(Math.random() * (90000 - 10000)) + 10000;
        setRandomNumber(generatedRandomNumber);

        axiosInstance.get('/titles/getPrice', { params: { document: document } })
            .then(response => {
                setDocumentPrice(response.data.price);
                const finalPrice = response.data.price + 20;
                setFinalPrice(finalPrice);
                
                return axiosInstance.post(`/documents/claim/${documentId}`, { claimableDate: formattedDate });
            })
            .then(response => {
                const { updatedDocument } = response.data;
                setData(prevDocuments => prevDocuments.map(doc => doc._id === updatedDocument._id ? updatedDocument : doc));
                toast({
                    description: `Date has been set on ${formattedDate} for claim.`,
                });

                handleSavePdf(userId, generatedRandomNumber);
            })
            .catch(error => {
                console.error('Error during claim confirm: ', error);
            });
    };    

    //Save the pdf file
    const handleSavePdf = async (userId, randomNumber) => {
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
            const response = await axiosInstance.post('/claimableDocuments/uploadPdf', formData, {
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
        <div className='hidden'>
            <div ref={invoiceRef}>
                <MobileRequestTicket 
                randomNumber={randomNumber}
                documentName={documentName}
                documentPrice={documentPrice}
                finalPrice={finalPrice}
                documentDate={documentDate}
                />
            </div>
        </div>
        </div>
    </div>
  )
}

export default ViewDocuments;