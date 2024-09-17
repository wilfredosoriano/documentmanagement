import React from 'react';

const SettingSidebar = ({ activeSection, onSectionClick }) => {
  return (
    <div className='flex flex-col max-md:flex-row max-md:justify-center gap-1 p-5'>
      <div
        className={`px-5 py-2 text-center w-full rounded-md hover:bg-muted cursor-pointer ${activeSection === 'profile' ? 'bg-muted' : ''}`}
        onClick={() => onSectionClick('profile')}
      >
        Profile
      </div>
      <div
        className={`px-5 py-2 text-center w-full rounded-md hover:bg-muted cursor-pointer ${activeSection === 'account' ? 'bg-muted' : ''}`}
        onClick={() => onSectionClick('account')}
      >
        Account
      </div>
    </div>
  );
};

export default SettingSidebar;
