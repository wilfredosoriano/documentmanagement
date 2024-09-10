import React, { useState } from 'react';
import Header from './mobileComponents/Header';
import Navigation from './mobileComponents/Navigation';
import DocumentBox from './mobileComponents/DocumentBox';
import axios from 'axios';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/components/Contexts/UserProvider';
import { useNavigate } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';


const MobileDocuments = () => {
  const { toast } = useToast();
  const [documentDetails, setDocumentDetails] = useState('');
  const [isDialogReserve, setIsDialogReserve] = useState(false);
  const [filteredDcouments, setFilteredDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  const [menuOpen, setMenuOpen] = useState(() => {
    const savedMenuState = localStorage.getItem('menuOpen');
    return savedMenuState ? JSON.parse(savedMenuState) : false;
  });

  const DateToday = () => {
      const currentDate = new Date();

      const dateOptions = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
      };
      const formattedDate = currentDate.toLocaleDateString('en-US', dateOptions);
  
      const timeOptions = { 
          hour: 'numeric', 
          minute: 'numeric', 
          hour12: true 
      };
      const formattedTime = currentDate.toLocaleTimeString('en-US', timeOptions);
  
      return `${formattedDate} at ${formattedTime}`;
    }

  const handleReserve = (id) => {
    if(!user){
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:5000/api/titles/${id}`)
    .then(response => {
      setDocumentDetails(response.data);
      setIsDialogReserve(true);
    }).catch(error => {
      console.error('Error fetching documents details', error);
    })
  };

  const handleConfirmReserve = (id, documentTitle) => {
    setIsLoading(true);
    axios.post(`http://localhost:5000/api/appointments/reserve/${id}`, { userId: user.userId, document: documentTitle })
    .then(() => {
      setTimeout(() => {
        setIsDialogReserve(false);
        setIsLoading(false);
        toast({
          title: "Successfully reserved a document.",
          description: DateToday(),
        });
      }, 3000);
    }).catch(error => {
      if(error.response && error.response.status === 400){
        setIsDialogReserve(false);
        setIsLoading(false);
        toast({
          title: "Reservation Error",
          variant: 'destructive',
          description: "You have already reserved this document.",
        });
      } else {
      console.error('Failed to reserve document: ', error);
      }
    })
  };

  

  return (
    <div>
        <Header toggleMenu={toggleMenu} setFilteredDocuments={setFilteredDocuments} />
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
        <div className={`overflow-auto p-4 mt-[65px] max-sm:mb-16 ${menuOpen ? 'mr-[240px]' : 'mr-[96px] max-sm:mr-0'} `}>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredDcouments.map((doc) => (
              <DocumentBox
                key={doc._id}
                document={doc.title}
                appointments={doc.count}
                imageUrl={doc.image}
                handleReserve={() => handleReserve(doc._id)}
              />
            ))}
          </div>
        </div>

      <Dialog open={isDialogReserve} onOpenChange={setIsDialogReserve}>
        <DialogContent className="w-10/12">
          <DialogHeader>
            <DialogTitle>Reserve a document</DialogTitle>
            <DialogDescription>
              Are you sure you want to reserve the selected document?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex max-sm:flex-row max-sm:gap-2 max-sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
              <Button onClick={() => handleConfirmReserve(documentDetails._id, documentDetails.title)}>
                {isLoading ? (
                  <LoaderCircle className='animate-spin'/>
                ) : (
                  <p>Reserve</p>
                )}
              </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MobileDocuments;
