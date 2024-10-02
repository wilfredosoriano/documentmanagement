import React, { useState } from 'react';
import Header from './mobileComponents/Header';
import Navigation from './mobileComponents/Navigation';
import DocumentBox from './mobileComponents/DocumentBox';
import axios from 'axios';
import { useUser } from '@/components/Contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import ReserveDialog from './mobileComponents/Dialogs/ReserveDialog';
import { Skeleton } from '@/components/ui/skeleton';


const MobileDocuments = () => {
  const [documentDetails, setDocumentDetails] = useState('');
  const [isDialogReserve, setIsDialogReserve] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const [menuOpen, setMenuOpen] = useState(() => {
    const savedMenuState = localStorage.getItem('menuOpen');
    return savedMenuState ? JSON.parse(savedMenuState) : false;
  });

  const handleReserve = (id) => {
    if(!user){
      navigate('/login');
      return;
    }

    axios.get(`${import.meta.env.VITE_API_URL}/titles/${id}`)
    .then(response => {
      setDocumentDetails(response.data);
      setIsDialogReserve(true);
    }).catch(error => {
      console.error('Error fetching documents details', error);
    })
  };

  return (
    <div>
        <Header toggleMenu={toggleMenu} setFilteredDocuments={setFilteredDocuments} />
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
        <div className={`overflow-auto p-4 mt-[65px] max-sm:mb-16 ${menuOpen ? 'mr-[240px]' : 'mr-[96px] max-sm:mr-0'} `}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {isFetching ? (
              [...Array(filteredDocuments.length)].map((_, index) => (
                <Skeleton key={index} className="h-[250px] w-[500px] rounded-xl" />
              ))
            ) : ( 
              <>
            {filteredDocuments.map((doc) => (
              <DocumentBox
                key={doc._id}
                document={doc.title}
                appointments={doc.count}
                imageUrl={doc.image}
                handleReserve={() => handleReserve(doc._id)}
              />
            ))}
            </>
          )}

          </div>
        </div>

      <ReserveDialog
        isDialogReserve={isDialogReserve}
        setIsDialogReserve={setIsDialogReserve}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        documentDetails={documentDetails}
        user={user}
      />

    </div>
  );
}

export default MobileDocuments;
