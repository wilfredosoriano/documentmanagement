import React from 'react';
import { GrDocumentTime, GrDocumentVerified, GrDocumentTransfer } from "react-icons/gr";

const OrderTracking = ({ status, claimedDate }) => {
  return (
    <div className='flex flex-col gap-12 relative'>
      <div className='flex flex-row items-start relative'>
        <div className={`rounded-full p-2 mr-5 mt-1 ${status === 'preparing' || status === 'ready to claim' || status === 'claimed' || status === 'approved' ? 'bg-slate-600' : 'bg-slate-300'}`}>
          <GrDocumentTime color='white' size={20}/>
        </div>
        <span className={`w-0.5 ${status === 'ready to claim' || status === 'claimed' ? 'bg-slate-600' : 'bg-slate-300'} h-full absolute top-12 left-4`}></span>
        <div>
          <h1>Preparing</h1>
          <p className='text-sm text-muted-foreground'>The registrar is preparing the document</p>
        </div>
      </div>
      <div className='flex flex-row items-start relative'>
        <div className={`rounded-full p-2 mr-5 mt-2 ${status === 'ready to claim' || status === 'claimed' ? 'bg-slate-600' : 'bg-slate-300'}`}>
          <GrDocumentTransfer color='white' size={20}/>
        </div>
        <span className={`w-0.5 ${status === 'claimed' ? 'bg-slate-600' : 'bg-slate-400'} h-full absolute top-[53px] left-4`}></span>
        <div>
          <h1>Ready To Claim</h1>
          <p className='text-sm text-muted-foreground'>Document is ready to claim</p>
        </div>
      </div>
      <div className='flex flex-row items-start'>
        <div className={`rounded-full p-2 mr-5 mt-3 ${status === 'claimed' ? 'bg-slate-600' : 'bg-slate-300'}`}>
          <GrDocumentVerified color='white' size={20}/>
        </div>
        <div>
          <h1>Claimed</h1>
          <p className='text-sm text-muted-foreground'> {claimedDate ? `Document has been claimed on ${claimedDate}` : 'Please wait until the document to set as claimed' } </p>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking;
