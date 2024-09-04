import React from 'react';

const SettingSidebar = ({ activeSection, onSectionClick }) => {
  return (
    <div className='flex flex-col gap-1 p-5'>
      <div
        className={`px-5 py-2 rounded-md mr-32 w-full hover:bg-muted cursor-pointer ${activeSection === 'profile' ? 'bg-muted' : ''}`}
        onClick={() => onSectionClick('profile')}
      >
        Profile
      </div>
      <div
        className={`px-5 py-2 rounded-md mr-32 w-full hover:bg-muted cursor-pointer ${activeSection === 'account' ? 'bg-muted' : ''}`}
        onClick={() => onSectionClick('account')}
      >
        Account
      </div>
    </div>
  );
};

export default SettingSidebar;
