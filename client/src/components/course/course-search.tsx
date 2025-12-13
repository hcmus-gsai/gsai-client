'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Input, Button } from 'antd';
import SearchIcon from '@/../public/shared/SearchIcon.svg';
import { useRouter } from 'next/navigation';
import { useLazySeachCoursesQuery } from '@/store/api/[module]/courseApi';
import { set } from 'better-auth';

interface CourseSearchProps {
  placeholder?: string;
}

const CourseSearch: React.FC<CourseSearchProps> = ({
  placeholder = 'Tìm kiếm môn học ở đây...',
}) => {
  const router = useRouter();

  const [keyword, setKeyword] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [
    triggerSearch,
    { data: searchResult, isFetching },
  ] = useLazySeachCoursesQuery();

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

    // router.push(`/student/courses?query=${encodeURIComponent(keyword)}`);
  };

  return (

    <div className="flex items-center justify-center w-[22.75rem] h-full">
        <div className="relative w-[22.75rem]">
        <div className="flex items-center justify-start w-[18.75rem] h-[3rem]">
            <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
            placeholder={placeholder}
            className="!h-full !w-full !bg-white !rounded-full !font-bold !text-[1rem]"
            />
        </div>

        { showDropdown && searchResult?.data?.length != null && searchResult.data.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg z-50">
            {searchResult.data.map((course) => (
                <div
                key={course.id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                    setShowDropdown(false);
                    setKeyword('');
                    router.push(`/student/courses/${course.id}`);
                }}
                >
                <div className="font-semibold">
                    {course.course_code} - {course.course_name}
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
        <div className="flex items-center justify-center w-[calc(100%-18.75rem)] h-full">
            <Button
            onClick={handleSearch}
            className="!h-[3rem] !w-[3rem] !bg-[var(--color-secondary)] !rounded-full !border-none !flex !items-center !justify-center"
            >
            <Image
                src={SearchIcon}
                alt="Search Icon"
                width={12}
                height={12}
                className="object-cover !w-[2.5rem] !h-auto"
            />
            </Button>
        </div>
    </div>

  );
};

export default CourseSearch;
