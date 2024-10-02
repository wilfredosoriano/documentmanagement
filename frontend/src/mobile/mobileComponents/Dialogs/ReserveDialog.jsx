import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import axios from 'axios';
import { LoaderCircle } from 'lucide-react';
import React from 'react';
import { LuCheckCircle } from 'react-icons/lu';
import { useToast } from '@/components/ui/use-toast';

export default function ReserveDialog({ isDialogReserve, setIsDialogReserve, isLoading, setIsLoading, documentDetails, user }) {

    const { toast } = useToast();

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

    const handleConfirmReserve = (id, documentTitle) => {
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_API_URL}/appointments/reserve/${id}`, { userId: user.userId, document: documentTitle })
        .then(() => {
          setTimeout(() => {
            setIsDialogReserve(false);
            setIsLoading(false);
            toast({
              title: "Successfully reserved a document.",
              description: DateToday(),
              action: (
                <LuCheckCircle size={20} color='green'/>
              ),
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
    <Dialog open={isDialogReserve} onOpenChange={setIsDialogReserve}>
        <DialogContent className="w-10/12">
          <DialogHeader>
            <DialogTitle>Reserve {documentDetails.title}</DialogTitle>
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
              <Button onClick={() => handleConfirmReserve(documentDetails._id, documentDetails.title)} disabled={isLoading}>
                {isLoading ? (
                  <LoaderCircle className='animate-spin'/>
                ) : (
                  <p>Reserve</p>
                )}
              </Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
};
