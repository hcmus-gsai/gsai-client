'use client'

import React from 'react';
import Image from 'next/image';

import QuizIcon from '@/../public/shared/QuizIcon.svg';
import CreateClassEdit from '@/../public/teacher/createClassEdit.svg';
import CreateClassTrashRed from '@/../public/teacher/createClassTrashRed.svg';

import { Quiz } from '@/type/createClass.type';

type Props = {
    quizs: Quiz[];
    chapterIndex: number;
    onEdit: (quiz: Quiz) => void;
    onDelete: (createdAt: number) => void;
};

const CreateClassQuizList: React.FC<Props> = ({ quizs, chapterIndex, onEdit, onDelete }) => {
    const chapterQuizs = quizs
        .filter((quiz) => quiz.chapter === chapterIndex)
        .sort((a, b) => a.createdAt - b.createdAt);

    if (chapterQuizs.length === 0) {
        return (
            <div className="py-8 text-center text-gray-400 italic bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                Chưa có quiz cho chương này
            </div>
        );
    }

    return (
        <div className="mb-4 flex flex-col gap-3 py-4">
            {chapterQuizs.map((item) => (
                <div key={item.createdAt} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                        <div className="bg-gray-50 p-2 rounded-lg">
                            <Image src={QuizIcon} alt="icon" width={24} height={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1D3557]">{item.quizName}</h4>
                            <p className="text-sm text-gray-400">Quiz • {item.duration} phút • Hạn nộp: {item.expiredDate} ngày</p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Image
                            src={CreateClassEdit}
                            alt="edit"
                            width={20}
                            height={20}
                            className="cursor-pointer hover:opacity-70"
                            onClick={() => onEdit(item)}
                        />
                        <Image
                            src={CreateClassTrashRed}
                            alt="delete"
                            width={20}
                            height={20}
                            className="cursor-pointer hover:opacity-70"
                            onClick={() => onDelete(item.createdAt)}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CreateClassQuizList;
