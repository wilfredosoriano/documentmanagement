import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LuLayoutDashboard, LuUsers, LuCalendar, LuSettings, LuFolderSync } from "react-icons/lu";
import { GrDocumentVerified, GrDocumentConfig } from "react-icons/gr";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import LogOut from './LogOut';
import { RiGraduationCapFill } from 'react-icons/ri';


const Sidebar = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const ICON_COLOR = '#2A9D90'

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
    <div className='w-96 h-screen p-5 flex flex-col bg-background'>
      <div className='text-xs sm:text-sm md:text-md lg:text-lg p-4 flex items-center gap-1 justify-center cursor-pointer' onClick={goToDashboard}>
        <RiGraduationCapFill size={30} color={ICON_COLOR}/>
        <div className='text-xl font-semibold'>UNIForms</div>
      </div>
      <ul className='mt-6'>
        <li 
          onClick={goToDashboard}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/dashboard') ? 'bg-[#F1F7FF] text-primary' : 'hover:bg-muted'}`}>
          <LuLayoutDashboard size={20} color={ICON_COLOR}/>
          <div>Dashboard</div>
        </li>
        <hr className='my-2'/>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1" className="border-b-0">
            <AccordionTrigger className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/document') || isActive('/claimableDocuments') || isActive('/viewDocuments') ? 'bg-[#F1F7FF] text-primary' : ' hover:bg-muted'}`}>
                <div className='flex items-center gap-3'>
                  <LuFolderSync size={20} color={ICON_COLOR}/>
                  <div>Documents</div>
                </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className='ml-7'>
                <li 
                  onClick={goToDocument}
                  className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/document') || isActive('/viewDocuments') ? 'bg-[#F1F7FF] text-primary' : 'hover:bg-muted'}`}>
                  <GrDocumentConfig size={20} color={ICON_COLOR}/>
                  <div className='text-sm'>Document Management</div>
                </li>
                <li 
                  onClick={goToClaimableDocuments}
                  className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/claimableDocuments') ? 'bg-[#F1F7FF] text-primary' : 'hover:bg-muted'}`}>
                  <GrDocumentVerified size={20} color={ICON_COLOR}/>
                  <div className='text-sm'>Claimable Documents</div>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <li 
          onClick={goToAppointment}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/appointment') ? 'bg-[#F1F7FF] text-primary' : ' hover:bg-muted'}`}>
          <LuCalendar size={20} color={ICON_COLOR}/>
          <div>Appointments</div>
        </li>
        <hr className='my-2'/>
        <li 
          onClick={goToUser}
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/user') ? 'bg-[#F1F7FF] text-primary' : ' hover:bg-muted'}`}>
          <LuUsers size={20} color={ICON_COLOR}/>
          <div>User Management</div>
        </li>
        <hr className='my-2'/>
        <li
          onClick={goToSetting} 
          className={`text-xs sm:text-sm md:text-md lg:text-lg p-4 mb-1 rounded-lg flex items-center gap-3 cursor-pointer ${isActive('/setting') ? 'bg-[#F1F7FF] text-primary' : ' hover:bg-muted'}`}>
          <LuSettings size={20} color={ICON_COLOR}/>
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