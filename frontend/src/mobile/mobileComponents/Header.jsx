import React, { useEffect, useState } from 'react';
import { LuArrowLeft, LuGraduationCap, LuMenu, LuSearch } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';
import ImageFormat from './ImageFormat';
import axios from 'axios';
import LogOut from '@/components/LogOut';
import { useUser } from '@/components/Contexts/UserProvider';
import ReserveDialog from './Dialogs/ReserveDialog';

export default function Header({ toggleMenu, setFilteredDocuments }) {
  const location = useLocation();
  const [showSearch, setShowSearch] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState([]);
  const [query, setQuery] = useState('');
  const [documents, setDocuments] = useState([]);
  const [documentDetails, setDocumentDetails] = useState('');
  const [isDialogReserve, setIsDialogReserve] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const handleResize = () => {
        if (window.innerWidth > 640) {
            setShowSearch(false);
        }
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [setShowSearch]);

  useEffect(() => {
    const fetchDocuments = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/titles/document-counts`)
      .then(response => {
        setDocuments(response.data);
        if (setFilteredDocuments) {
          setFilteredDocuments(response.data);
        }
      }).catch(error => {
        console.error('Error fetching documents', error);
      })
    };

    fetchDocuments();
  }, []);

  useEffect(() => {
      const results = documents.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()));
      setFilteredItems(results);
      setIsDropdownOpen(query.length > 0 && results.length > 0);
  }, [query, documents]);

  const handleSearch = () => {
    const results = documents.filter(doc => doc.title.toLowerCase().includes(query.toLowerCase()));
    console.log(results);
    setFilteredDocuments(results);
  };

  const handleReserve = (id) => {
    if(!user){
      navigate('/login');
      return;
    }

    axios.get(`http://localhost:5000/api/titles/${id}`)
    .then(response => {
      setDocumentDetails(response.data);
      setIsDialogReserve(true);
      setIsDropdownOpen(false);
    }).catch(error => {
      console.error('Error fetching documents details', error);
    })
  };
  
  const includeSearchbar = '/mobileDocuments';
 
  return (
    <div className='flex justify-between bg-white items-center p-4 border-b fixed top-0 w-full h-[64px] z-50'>
      {!showSearch && (
      <div className='flex flex-row items-center gap-1 cursor-pointer mr-20 max-md:mr-10'>
        <LuGraduationCap size={30} />
        <span>UniForms</span>
      </div>
      )}

      {includeSearchbar === location.pathname && (
      <>
      {showSearch ? (
        <div className='flex flex-row items-center relative w-full rounded-sm border px-2 py-1'>
          <LuArrowLeft
            size={20}
            onClick={() => setShowSearch(false)} 
          />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search...'
            className='h-8 p-2 text-xs duration-300 w-full outline-none'
          />
          {isDropdownOpen && (
            <div className='absolute top-full left-0 w-full mt-1 border bg-white shadow-lg rounded'>
              {filteredItems.length > 0 ? (
                filteredItems.map((doc) => (
                  <div
                    key={doc._id}
                    className='flex flex-row items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-200'
                    onClick={() => handleReserve(doc._id)}
                  >
                    <ImageFormat src={doc.image} className='w-14 h-14 object-cover'/>
                    {doc.title}
                  </div>
                ))
              ) : (
                <div className='px-2 py-1'>No results found.</div>
              )}
            </div>
          )}
          <LuSearch
            size={20}
            className='ml-2 cursor-pointer'
            onClick={() => setShowSearch(false)}
          />
        </div>
      ) : (
        <>

      <div className='relative flex flex-row items-center justify-between w-full gap-1 border max-sm:hidden rounded-sm'>
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search...'
          className='h-8 p-2 text-xs duration-300 w-full outline-none' 
        />
        {isDropdownOpen && (
          <div className='absolute top-full left-0 w-full mt-1 border bg-white shadow-lg rounded'>
            {filteredItems.length > 0 ? (
              filteredItems.map((doc) => (
                <div
                  key={doc._id}
                  className='flex flex-row items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-200'
                  onClick={() => handleReserve(doc._id)}
                >
                  <ImageFormat src={doc.image} className='w-14 h-14 object-cover'/>
                  {doc.title}
                </div>
              ))
            ) : (
              <div className='px-2 py-1'>No results found.</div>
            )}
          </div>
        )}
        <LuSearch size={20} className='m-2 cursor-pointer' onClick={handleSearch}/>
      </div>
      </>
      )}
      </>
      )}

      {!showSearch && (
      <div className='flex flex-row items-center ml-20 max-md:ml-10 justify-between'>
        {includeSearchbar === location.pathname && <LuSearch size={30} className='mr-5 sm:hidden cursor-pointer' onClick={() => setShowSearch(true)}/> } 

        <LogOut />
 
        <button onClick={toggleMenu} className='cursor-pointer hover:bg-slate-100 p-2 mr-4 ml-10 rounded-full max-sm:hidden'>
          <LuMenu size={20} />
        </button>
      </div>
      )} 

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
