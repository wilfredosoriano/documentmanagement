import { Button } from '@/components/ui/button';
import React from 'react';
import { LuGraduationCap, LuPrinter } from 'react-icons/lu';

const MobileRequestTicket = () => {

    const randomNumber = Math.floor(Math.random() * (90000 - 10000)) + 10000;

    const handlePrint = () => {
        window.print();
    }

  return (
    <div className='m-12 md:m-20 lg:m-32 transition-all'>
        <div id='invoice'>
            <div className='flex flex-row justify-between items-center'>
                <div className=''>
                    <div className='flex flex-row items-center gap-1 cursor-pointer mr-20 max-md:mr-10'>
                        <LuGraduationCap size={30} />
                        <span className='text-sm md:text-md lg:text-lg'>UniForms</span>
                    </div>
                </div>
                <div className='flex flex-col items-start'>
                    <h1 className='text-sm md:text-md lg:text-lg'>INVOICE</h1>
                    <p className='text-sm md:text-md lg:text-lg'>Date: 01/05/2025</p>
                    <p className='text-sm md:text-md lg:text-lg'>Invoice no. {randomNumber}</p>
                </div>
            </div>
            <div className='mt-20'>
                <h1 className='font-bold text-sm md:text-md lg:text-lg'>Bill To: </h1>
                <h3 className='text-sm md:text-md lg:text-lg'>Urdaneta City University</h3>
                <p className='text-sm md:text-md lg:text-lg'>San Vicente West, Urdaneta, Pangasinan</p>
            </div>
        <hr className='bg-primary h-1 my-4'/>
        <div>
            <h1 className='mb-8'>Document Name: </h1>
            <div className='flex flex-row justify-between'>
                <h1 className='font-bold text-sm md:text-md lg:text-lg'>Transcript of Records</h1>
                <h1 className='text-sm md:text-md lg:text-lg'>800.00</h1>
            </div>
        </div>
        <div className='my-16 flex flex-col items-end'>
            <p className='mb-5 text-sm md:text-md lg:text-lg'>Precessing fee: 20.00</p>
            <div className='flex items-end gap-1'>
                <p>Total:</p>
                <p className='font-bold text-sm md:text-md lg:text-lg'>820.00</p>
            </div>
        </div>
            <p className='text-center text-xs md:text-sm lg:text-md print:hidden'>Note: Please print this invoice and submit the printed copy to the registrar to claim the document.</p>
        </div>
        <div className='flex justify-end mt-10'>
            <Button onClick={handlePrint} className='print:hidden'>
                <LuPrinter size={20}/>
            </Button>
        </div>
    </div>
  )
}

export default MobileRequestTicket;