import {Button} from "antd";
import Image from "next/image";

const CourseCategoryComponent = (
    {
        columns,
        categories,
    }:{
        columns: number,
        categories :{
            id: number;
            name: string;
            image: string;
        }[];
    }
) => {
    return (
        <div className = {`grid gap-x-5 w-[calc(100%-24rem)] h-full`}
             style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}  
        >
            {        categories.map((item) => (
                <div key = {item.id} className = "flex items-center justify-center h-[100px]">
                    <Button className = "!w-full !h-[3.5rem] !p-0 !rounded-full !flex !items-center !justify-center">
                        <Image src = {item.image} alt = {item.name} width = {0} height = {0} className = "object-cover"/>
                        <p className = "text-[1rem] font-bold text-[var(--color-primary)]">{item.name}</p>
                    </Button>
                </div>
            ))}
        </div>
    )
}

export {CourseCategoryComponent};
