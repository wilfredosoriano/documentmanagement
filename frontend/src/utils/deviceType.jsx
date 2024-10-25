import MobileDetect from 'mobile-detect';

export const getDeviceType = () => {
    const md = new MobileDetect(window.navigator.userAgent);
  
    if(md.mobile()) return 'Mobile';
    return 'Desktop';
};