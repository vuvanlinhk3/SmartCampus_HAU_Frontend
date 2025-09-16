import React from 'react';
import { UNIVERSITY_NAME } from '../../utils/constants';

export default function Header(): JSX.Element {
  return (
    <header className="w-full bg-[#005DAA] py-4 px-6 shadow-sm">
      <div className="flex items-center">
        <div className="w-10 h-10 border-2 border-white m-1">
          <img src="/logo_truong.jpg" alt="Logo trường" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-white font-bold text-lg md:text-xl">
          {UNIVERSITY_NAME}
        </h1>
      </div>
    </header>
  );
}
