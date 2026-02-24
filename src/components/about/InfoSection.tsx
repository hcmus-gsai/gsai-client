interface InfoSectionProps {
    id?: string;
    title: string;
    subtitle?: string;
    content: string | React.ReactNode;
    align?: 'left' | 'center' | 'right';
    className?: string;
    children?: React.ReactNode;
}

export const InfoSection = ({
    id,
    title,
    subtitle,
    content,
    align = 'left',
    className = '',
    children
}: InfoSectionProps) => {
    const alignmentClasses = {
        left: 'text-left items-start',
        center: 'text-center items-center',
        right: 'text-right items-end'
    };

    return (
        <section id={id} className={`w-full py-24 lg:py-32 relative ${className}`}>
            {/* Subtle dividing line for some sections, can be controlled by parent */}

            <div className={`container mx-auto px-6 flex flex-col ${alignmentClasses[align]} relative z-10`}>
                {subtitle && (
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`h-px w-8 bg-accent ${align === 'right' ? 'order-last' : ''}`}></div>
                        <span className="text-secondary text-s font-bold tracking-[0.2em] uppercase">
                            {subtitle}
                        </span>
                        <div className={`h-px w-8 bg-accent ${align === 'left' ? 'order-last' : ''}`}></div>
                    </div>
                )}

                <h2 className="text-4xl md:text-5xl font-bold text-primary mb-8 tracking-tight">
                    {title}
                </h2>

                <div className={`text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
                    {typeof content === 'string' ? <p>{content}</p> : content}
                </div>

                {children && <div className="mt-16 w-full">{children}</div>}
            </div>
        </section>
    );
};
