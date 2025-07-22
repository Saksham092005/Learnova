import React from 'react';
import { assets } from '../../assets/assets';
import logoLearnovo from '../../assets/logo_learnovo.svg';

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between text-left w-full px-8 border-t">


      {/* left side of the page that is logo and copyright text */}
      <div className='flex items-center gap-4'>
        <img  src={logoLearnovo} alt="logo" className="w-40 lg:w-48 cursor-pointer" />
        <div className='hidden md:block h-7 w-px bg-gray-500/60'></div>
        <p className="py-4 text-center text-xs md:text-sm text-gray-500">
          Copyright 2025 © GreatStack. All Right Reserved.
        </p>
      </div>

      
      {/* right side of the page that is social media icons */}
      <div className='flex items-center gap-3 max-md:mt-4'>
        <a href="#">
          <img src={assets.facebook_icon} alt="facebook_icon" />
        </a>
        <a href="#">
          <img src={assets.twitter_icon} alt="twitter_icon" />
        </a>
        <a href="#">
          <img src={assets.instagram_icon} alt="instagram_icon" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;