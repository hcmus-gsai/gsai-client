'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Input, Button } from 'antd';
import SearchIcon from '@/../public/shared/SearchIcon.svg';
import { useRouter } from 'next/navigation';
import { useLazySearchCoursesQuery } from '@/store/api/[module]/courseApi';
import { set } from 'better-auth';
import { InputRef } from 'antd/es/input/Input';
import { CloseOutlined } from '@ant-design/icons';
interface CourseSearchProps {
  placeholder?: string;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  placeholder = 'Tìm kiếm môn học ở đây...',
}) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const inputRef = useRef<InputRef>(null);
  const wrapperRef= useRef<HTMLDivElement>(null);

  const [triggerSearch,{ data: searchResult, isFetching }] = useLazySearchCoursesQuery();

  // Debounce search (500ms)
  useEffect(() => {
    if (!keyword.trim()) {
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);

    const timeout = setTimeout(() => {
      triggerSearch({
        name: keyword,
        page: 1,
        limit: 20,
      });
    }, 500);

    return () => clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)){
          setShowDropdown(false);
          setMobileExpanded(false);
          setKeyword('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileExpanded) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [mobileExpanded]);

  


  // Handle search button click or enter key press
  const handleSearch = () => {
    if (!keyword.trim()) {
      setShowDropdown(false);
      return;
    }

    triggerSearch({
      name: keyword,
      page: 1,
      limit: 20,
    });

  };

  const handleCollapse = () => {
    setMobileExpanded(false);
    setShowDropdown(false);
    setKeyword('');
  }

  return (

    // <div className="flex items-center justify-center w-[22.75rem] h-full">
    //   <div className="relative w-[22.75rem]">
    //     <div className="flex items-center justify-start w-[18.75rem] h-[3rem]">
    //       <Input
    //         ref = {inputRef}
    //         value={keyword}
    //         onChange={(e) => setKeyword(e.target.value)}
    //         onPressEnter={handleSearch}
    //         placeholder={placeholder}
    //         className="!h-full !w-full !bg-white !rounded-full !text-[1rem]"
    //       />
    //     </div>

    //     {showDropdown && searchResult?.data?.length != null && searchResult.data.length > 0 && (
    //       <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
    //         {searchResult.data.map((course) => (
    //           <div
    //             key={course.id}
    //             className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
    //             onClick={() => {
    //               setShowDropdown(false);
    //               setKeyword('');
    //               router.push(`/student/courses/${course.id}`);
    //             }}
    //           >
    //             <div className="font-semibold">
    //               {course.course_code} - {course.course_name}
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     )}
    //   </div>
    //   <div className="flex items-center justify-center w-[calc(100%-18.75rem)] h-full">
    //     <Button
    //       onClick={() => {
    //         inputRef.current?.focus();
    //         handleSearch();
    //       }}

    //       className="!h-[3rem] !w-[3rem] !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
    //       icon = {
    //         <Image
    //         src={SearchIcon}
    //         alt="Search Icon"
    //         width={12}
    //         height={12}
    //         className="object-cover !w-[1.5rem] !h-auto"
    //       />
    //       }
    //     />
    //   </div>
    // </div>

    <div ref={wrapperRef} className="relative flex items-center justify-end w-full">
 
      {/* ── DESKTOP (sm+): luôn hiện full search bar ── */}
      <div className="hidden sm:flex items-center h-12 gap-2 w-full">
        <Input
          ref={inputRef}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onPressEnter={handleSearch}
          placeholder={placeholder}
          className="!h-full !flex-1 !min-w-0 !bg-white !rounded-full !text-base"
        />
        <Button
          onClick={() => { inputRef.current?.focus(); handleSearch(); }}
          className="!h-12 !w-12 !flex-shrink-0 !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
          icon={
            <Image src={SearchIcon} alt="Search" width={20} height={20}
              className="object-contain !w-5 !h-auto" />
          }
        />
      </div>
 
      {/* ── MOBILE (< sm): collapsed icon → expanded overlay ── */}
      <div className="flex sm:hidden items-center">
 
        {/* Icon search — chỉ hiện khi chưa expand */}
        {!mobileExpanded && (
          <Button
            onClick={() => setMobileExpanded(true)}
            className="!h-10 !w-10 !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
            icon={
              <Image src={SearchIcon} alt="Search" width={18} height={18}
                className="object-contain !w-[1.125rem] !h-auto" />
            }
          />
        )}
 
        {/* Expanded: full-width input overlay trên navbar */}
        {mobileExpanded && (
          <div className="fixed inset-x-0 top-0 z-40 h-20 bg-white border-b border-gray-200 shadow-md flex items-center px-3 gap-2">
            <Input
              ref={inputRef}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              placeholder={placeholder}
              className="!h-11 !flex-1 !min-w-0 !bg-gray-50 !rounded-full !text-base"
            />
            <Button
              onClick={() => { inputRef.current?.focus(); handleSearch(); }}
              className="!h-11 !w-11 !flex-shrink-0 !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
              icon={
                <Image src={SearchIcon} alt="Search" width={18} height={18}
                  className="object-contain !w-[1.125rem] !h-auto" />
              }
            />
            {/* Nút đóng */}
            <Button
              onClick={handleCollapse}
              className="!h-11 !w-11 !flex-shrink-0 !rounded-full !border-none !flex !items-center !justify-center !bg-gray-100 hover:!bg-gray-200"
              icon={<CloseOutlined className="text-gray-600 text-base" />}
            />
          </div>
        )}
      </div>
 
      {/* ── Dropdown kết quả (dùng chung cả 2 chế độ) ── */}
      {showDropdown && searchResult?.data?.length != null && searchResult.data.length > 0 && (
        <div className={`
          bg-white rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto border border-gray-100
          ${mobileExpanded
            // mobile expanded: gắn dưới overlay navbar
            ? 'fixed inset-x-3 top-[5.25rem]'
            // desktop: dropdown bình thường dưới input
            : 'absolute top-full left-0 right-0 mt-2'
          }
        `}>
          {searchResult.data.map((course) => (
            <div
              key={course.id}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 last:border-none"
              onClick={() => {
                setShowDropdown(false);
                setMobileExpanded(false);
                setKeyword('');
                router.push(`/student/courses/${course.id}`);
              }}
            >
              <p className="font-semibold text-sm text-gray-800 truncate">
                {course.course_code} - {course.course_name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>

  );
};



export default CourseSearch;