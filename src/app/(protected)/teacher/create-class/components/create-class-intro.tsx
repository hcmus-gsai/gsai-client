const CreateClassIntro = ({
    title,
    step
}:{
    title: string;
    step:number;
}) => {
    return (
        <>
            <p className='text-xl md:text-4xl font-bold mb-[3rem]'>Tạo môn học mới</p>

            <div className="w-full gap-3 flex mb-[2rem]">
                <div className="relative w-8 h-8 md:w-16 md:h-16">
                    <svg 
                        viewBox="0 0 64 64" 
                        className="w-full h-full"
                    >
                        <circle cx="32" cy="32" r="32" fill="#DFF6FF" />
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-base md:text-xl font-bold text-[#1363DF]">{step}</p>
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <p className='text-xl md:text-2xl font-bold text-[#1363DF]'>{title}</p>
                </div>  
            </div>
        </>
    )
}

export default CreateClassIntro;