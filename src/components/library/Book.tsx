import React from 'react';

interface BookProps {
  image: string;
  name: string;
}

export const Book: React.FC<BookProps> = ({ image, name }) => {
  return (
    <div className="mb-4 ml-auto mr-auto flex h-auto w-[240px] flex-col shadow-lg">
      <div className="h-[350px] w-full">
        <img src={image} alt="book" />
      </div>
      <div className="ml-auto mr-auto flex w-full justify-between">
        <div className="flex font-bold">{name}</div>
        <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
