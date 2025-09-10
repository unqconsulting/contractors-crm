'use client'; // Required since we use hooks and event listeners

import { DropdownOption, InputSizeVariant } from '@/app/core/types/types';
import { useState, useRef, useEffect } from 'react';
type DropdownProps = {
  options: DropdownOption[];
  onSelect: (value: string) => void;
  id: string;
  label?: string;
  placeholder?: string;
  className?: string;
  size?: InputSizeVariant;
  setValue?: DropdownOption;
  error?: string;
};

export default function Dropdown({
  options,
  onSelect,
  id,
  label,
  placeholder = 'Select an option',
  className = '',
  size = 'md',
  setValue,
  error,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  );
  const [optionIndex, setOptionIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownListRef = useRef<HTMLUListElement>(null);
  const sizeClasses = {
    sm: 'text-xs max-w-[10rem] w-full',
    md: 'text-sm max-w-[25rem] w-full',
    lg: 'text-base max-w-[50rem] w-full',
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (setValue) {
      setSelectedOption(setValue);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setValue]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' || e.key === 'Tab') {
      setOptionIndex(-1);
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOptionIndex((prevIndex) => {
        const newIndex =
          prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex;
        (dropdownListRef.current?.children[newIndex] as HTMLLIElement)?.focus();
        return newIndex;
      });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setOptionIndex((prevIndex) => {
        const newIndex = prevIndex > 0 ? prevIndex - 1 : prevIndex;

        (dropdownListRef.current?.children[newIndex] as HTMLLIElement)?.focus();
        return newIndex;
      });
    } else if (e.key === 'Enter') {
      if (isOpen && options[optionIndex]) {
        handleSelect(options[optionIndex]);
        (
          dropdownListRef.current?.children[optionIndex] as HTMLLIElement
        )?.blur();
        setIsOpen(false);
      } else {
        setOptionIndex(0);
        setTimeout(() => {
          (dropdownListRef.current?.children[0] as HTMLLIElement)?.focus();
        }, 0);
      }
    }
  };

  const handleSelect = (option: DropdownOption) => {
    setSelectedOption(option);
    if (option.value) onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div className={`mb-4 ${className} ${sizeClasses[size]}`}>
      {label && (
        <label htmlFor={id} className="block text-md mb-1">
          {label}
        </label>
      )}
      <div ref={dropdownRef} onKeyDown={handleKeyDown} className="relative">
        {/* Trigger Button */}
        <button
          id={id}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-foreground ${
            error ? ' border-red-500' : ''
          }`}
        >
          <span
            className={(selectedOption ? '' : 'text-gray-500') + ' truncate'}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-5 h-5 ml-2 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {/* Dropdown Menu */}
        {isOpen && (
          <ul
            ref={dropdownListRef}
            className="absolute z-10 w-full mt-1 max-h-60 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            {options.map((option) => (
              <li
                key={option.value}
                tabIndex={-1} // Make li focusable
                onClick={() => handleSelect(option)}
                className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black cursor-pointer`}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
