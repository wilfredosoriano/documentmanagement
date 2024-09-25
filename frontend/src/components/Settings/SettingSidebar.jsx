import React from 'react';

const SettingSidebar = ({ activeSection, onSectionClick }) => {
  return (
    <div className='flex flex-col max-md:flex-row max-md:justify-center gap-1 p-1 rounded-md max-md:bg-muted mb-auto'>
      <div
        className={`px-5 py-2 text-center w-full rounded-md hover:bg-muted max-md:hover:bg-background cursor-pointer ${activeSection === 'profile' ? 'bg-muted max-md:bg-background' : ''}`}
        onClick={() => onSectionClick('profile')}
      >
        Profile
      </div>
      <div
        className={`px-5 py-2 text-center w-full rounded-md hover:bg-muted max-md:hover:bg-background cursor-pointer ${activeSection === 'account' ? 'bg-muted max-md:*:bg-background' : ''}`}
        onClick={() => onSectionClick('account')}
      >
        Account
      </div>
    </div>
  );
};

export default SettingSidebar;
