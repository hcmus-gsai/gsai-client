const CreateClassIntro = ({
    title,
    step
}:{
    title: string;
    step:number;
}) => {
    return (
        <>
            <p className='text-4xl font-bold mb-[3rem]'>Tạo môn học mới</p>

            <div className="w-full gap-3 flex mb-[2rem]">
                <div className="relative w-[4rem] h-auto">
                    <svg height="4rem" width="4rem" >
                        <circle r="2rem" cx="2rem" cy="2rem" fill="#DFF6FF" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-xl font-bold text-[#1363DF]">{step}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <p className='text-2xl font-bold text-[#1363DF]'>{title}</p>
                </div>  
            </div>
        </>
    )
}

export default CreateClassIntro;