import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuLayoutDashboard, LuUsers, LuCalendar, LuSettings, LuGraduationCap, LuFolderSync } from "react-icons/lu";
import { GrDocumentVerified, GrDocumentConfig } from "react-icons/gr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LogOut from './LogOut';


const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const goToDashboard = () => {
    navigate('/dashboard');
  }

  const goToDocument = () => {
    navigate('/document');
  }

  const goToAppointment = () => {
    navigate('/appointment');
  }

  const goToUser = () => {
    navigate('/user');
  }

  const goToSetting = () => {
    navigate('/setting');
  }

  const goToClaimableDocuments = () => {
    navigate('/claimableDocuments');
  }
  
  const isActive = (path) => location.pathname === path;

  return (
    <div className='w-96 h-screen p-5 flex flex-col'>
      <div className='text-xs sm:text-sm md:text-md lg:text-lg p-4 flex items-center gap-1 justify-center cursor-pointer' onClick={goToDashboard}>
        <LuGraduationCap size={30}/>
        <div className='text-xl'>UNIForms</div>
      </div>
      <ul className='mt-6'>
        <li 
          onClick={goToDashboard}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/dashboard') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
          <LuLayoutDashboard size={20}/>
          <div>Dashboard</div>
        </li>
        <hr className='my-2'/>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/document') || isActive('/claimableDocuments') || isActive('/viewDocuments') ? 'bg-primary text-primary-foreground' : ' hover:bg-muted'}`}>
                <div className='flex items-center gap-3'>
                  <LuFolderSync size={20}/>
                  <div>Documents</div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className='ml-7'>
                <li 
                  onClick={goToDocument}
                  className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/document') || isActive('/viewDocuments') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <GrDocumentConfig size={20}/>
                  <div className='text-sm'>Document Management</div>
                </li>
                <li 
                  onClick={goToClaimableDocuments}
                  className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/claimableDocuments') ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}>
                  <GrDocumentVerified size={20}/>
                  <div className='text-sm'>Claimable Documents</div>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <li 
          onClick={goToAppointment}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/appointment') ? 'bg-primary text-primary-foreground' : ' hover:bg-muted'}`}>
          <LuCalendar size={20}/>
          <div>Appointments</div>
        </li>
        <hr className='my-2'/>
        <li 
          onClick={goToUser}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/user') ? 'bg-primary text-primary-foreground' : ' hover:bg-muted'}`}>
          <LuUsers size={20}/>
          <div>User Management</div>
        </li>
        <hr className='my-2'/>
        <li
          onClick={goToSetting} 
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/setting') ? 'bg-primary text-primary-foreground' : ' hover:bg-muted'}`}>
          <LuSettings size={20}/>
          <div>Settings</div>
        </li>
      </ul>
      <div className='mt-auto'>
        <LogOut/>
      </div>
    </div>
  )
};

export default Sidebar;