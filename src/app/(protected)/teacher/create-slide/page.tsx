'use client';
import '@ant-design/v5-patch-for-react-19';

import { FooterSection } from "@/components/guest/ui/guest";
import { CourseDisplaySection } from "@/components/teacher/course-display";

import { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';

interface Slide {
    id: number;
    title: string;
    voice: string;
    content: string;
    audioFile : File | null;
    audioUrl: string | null;
    isGenerating: boolean;
}

interface VoicePickerModalProps {
    value: string;
    onChange: (value: string) => void;
    // voices: Voice[];
}

const voice_options = ["leonas","lnthanh","ngvanduc","ngvanhau"]

const initialSlide : Slide[] = [
  { id: 1, title: "Slide 1", content: "Nội dung slide 1", voice: "leonas", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 2, title: "Slide 2", content: "Nội dung slide 2", voice: "lnthanh", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 3, title: "Slide 3", content: "Nội dung slide 3", voice: "ngvanduc", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 4, title: "Slide 4", content: "Nội dung slide 4", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 5, title: "Slide 5", content: "Nội dung slide 5", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 6, title: "Slide 6", content: "Nội dung slide 6", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 7, title: "Slide 7", content: "Nội dung slide 7", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 8, title: "Slide 8", content: "Nội dung slide 8", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 9, title: "Slide 9", content: "Nội dung slide 9", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
  { id: 10, title: "Slide 10", content: "Nội dung slide 10", voice: "ngvanhau", audioFile: null, audioUrl: null, isGenerating: false },
]

// const VoicePickerModal = ({value, onChange, voices}:VoicePickerModalProps) => {

// }

export default function SlideList() {
    
    const [slides, setSlides] = useState<Slide[]>(initialSlide);

    const fileInputRef = useRef<{[key: number]:HTMLInputElement | null}>({});

    const updateSlide = ({id, fields}:{id: number, fields: Partial<Slide>}) =>{
        setSlides(
            prev => prev.map(slide => slide.id === id ? {...slide, ...fields}:slide)
        )
    }

    const handleGenerateVoice = async (slideId: number)=>{
        // updateSlide(id, {isGenerating:true});
        //Generate voice for slide hook here
        // updateSlide(slideId, {isGenerating:false, audioUrl:"#generated"})
    };

    const handleAudioUpload = (id: number, file: File)=>{
        const objectUrl = URL.createObjectURL(file);
        updateSlide({id, fields:{audioFile:file, audioUrl:objectUrl}});
    };
    
    const [thumbnail, setThumbnail] = useState<{file: File; url: string}|null>(null);
    const [voiceSample, setVoiceSample] = useState<{file:File; url:string}|null>(null);
    const [textPrompt, setTextPrompt] = useState('');
    const [slideFile, setSlideFile]= useState<File|null>(null);

    const thumbnailRef = useRef<HTMLInputElement>(null);
    const voiceRef = useRef<HTMLInputElement>(null);
    const slideRef = useRef<HTMLInputElement>(null);

    const handleThumbnailUpload = (file: File) => {
        if (!file){
            return;
        }
        const url = URL.createObjectURL(file);
        setThumbnail({file, url});
    }
    const handleVoiceUpload = (file:File)=>{
        if (!file){
            return;
        }
        const url = URL.createObjectURL(file);
        setVoiceSample({file, url});
    }

    return (
        <section className="w-full flex flex-col items-center justify-center mt-[5rem] mb-[10rem]">
            <div className = "w-[var(--global-width)] px-4 mt-[2.5rem]">
                <h1 className = "text-center text-2xl font-bold text-[var(--color-secondary)] mb-8 tracking-wide ">
                    Điền đầy đủ thông tin của Giọng nói, hình ảnh, slide trước khi tạo bài giảng
                </h1>

                <div className = "grid grid-cols-1 md:grid-cols-2 md:grid-rows-3 gap-4">
                    <div className="md:row-span-2 group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
                        <div className = "flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.8"/>
                                    <path d="M3 17l4-4 3 3 4-5 7 6" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Hình ảnh đại diện</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">JPG, PNG, WEBP</p>
                            </div>
                            {thumbnail && (
                                <button
                                    onClick = {()=> setThumbnail(null)}
                                    className = "ml-auto hover:text-red-400 transition-colors"
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                        </div>

                        <input
                            type = "file" accept = "image/*"
                            ref = {thumbnailRef} className = "hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleThumbnailUpload(f); }}
                        />

                        {thumbnail ?(
                            <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden cursor-pointer" onClick={() => thumbnailRef.current?.click()}>
                                <img src={thumbnail.url} alt="thumbnail" className="w-full h-full object-contain"/>
                                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">Đổi ảnh</span>
                                </div>
                            </div>
                        ):(
                            <label
                                htmlFor="upload-img-trigger"
                                onClick={() => thumbnailRef.current?.click()}
                                className ="w-full h-87 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-500/20 rounded-lg py-7 cursor-pointer hover:border-blue-400/50 transition-all"
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xs text-slate-400">Kéo thả hoặc <span className="text-blue-400 font-medium">chọn file</span></span>
                            </label>
                        )}
                    </div>

                    <div className="group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="#60a5fa"/>
                                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            </div>
                            <div>
                            <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Đăng ký giọng nói</p>
                            <p className="text-[11px] text-slate-500 mt-0.5">MP3, WAV, M4A — mẫu giọng của bạn</p>
                            </div>
                            {voiceSample && (
                            <button
                                onClick={() => setVoiceSample(null)}
                                className="ml-auto text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                            )}
                        </div>

                        <input 
                            type = "file" accept = "audio/*"
                            ref = {voiceRef} className = "hidden"
                            onChange = {(e)=>{const f = e.target.files?.[0]; if (f) handleVoiceUpload(f);}}
                        />
                        {voiceSample ? (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 bg-blue-500/10 rounded-lg px-3 py-2">
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="text-blue-400 shrink-0">
                                    <path d="M9 18V5l12-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                    <circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/>
                                    <circle cx="18" cy="16" r="3" stroke="currentColor" strokeWidth="1.8"/>
                                    </svg>
                                    <span className="text-xs text-blue-300 truncate">{voiceSample.file.name}</span>
                                </div>
                                <audio controls className="w-full h-8 rounded" src={voiceSample.url}/>
                                <button
                                    onClick={() => voiceRef.current?.click()}
                                    className="w-full text-xs text-slate-500 hover:text-blue-400 transition-colors text-center py-1"
                                >
                                    Đổi file khác
                                </button>
                            </div>
                        ) : (
                            <label
                                onClick={() => voiceRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-500/20 rounded-lg py-7 cursor-pointer hover:border-blue-400/50 transition-all"
                                >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xs text-slate-400">Kéo thả hoặc <span className="text-blue-400 font-medium">chọn file</span></span>
                            </label>
                        )}
                    </div>

                    <div className="group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
                        <div className = "flex items-center gap-2.5 mb-4">
                            <div className = "w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Script giọng nói</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Prompt định hướng nội dung</p>
                            </div>
                            {textPrompt && (
                                <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    {prompt.length} ký tự
                                </span>
                            )}
                        </div>
                        <textarea
                            className="w-full min-h-[108px] border border-blue-500/15 rounded-lg text-sm px-3.5 py-3 resize-none outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 placeholder-slate-600 leading-relaxed transition bg-transparent"
                            placeholder="VD: Bài giảng về trí tuệ nhân tạo bằng ngôn ngữ đa phương thức..."
                            value={textPrompt}
                            onChange={(e) => setTextPrompt(e.target.value)}
                        />
                    </div>

                    <div className="md:col-span-2 group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
                        <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="3" width="20" height="14" rx="2" stroke="#60a5fa" strokeWidth="1.8"/>
                                <path d="M8 21h8M12 17v4" stroke="#60a5fa" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Tải Slide</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">PDF, PPTX</p>
                            </div>
                            {slideFile && (
                            <button
                                onClick={() => setSlideFile(null)}
                                className="ml-auto text-slate-500 hover:text-red-400 transition-colors"
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                            )}
                        </div>

                        <input 
                            type = "file" accept = ".pdf,.pptx"
                            ref = {slideRef} className = "hidden"
                            onChange = {(e)=>{const f = e.target.files?.[0]; if (f) setSlideFile(f);}}
                        />
                        {slideFile ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center shrink-0">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase">
                                        {slideFile.name.split('.').pop()}
                                    </span>
                                    </div>
                                    <div className="min-w-0">
                                    <p className="text-xs font-medium text-[var(--color-secondary)] truncate">{slideFile.name}</p>
                                    <p className="text-[11px] text-slate-500">{(slideFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => slideRef.current?.click()}
                                    className="w-full text-xs text-slate-500 hover:text-blue-400 transition-colors text-center py-1"
                                >
                                    Đổi file khác
                                </button>
                            </div>
                        ) : (
                            <label
                                onClick={() => slideRef.current?.click()}
                                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-500/20 rounded-lg py-7 cursor-pointer hover:border-blue-400/50 transition-all"
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xs text-slate-400">Kéo thả hoặc <span className="text-blue-400 font-medium">chọn file</span></span>
                                <span className="text-[11px] text-slate-500">PDF · PPTX — tối đa 50MB</span>
                            </label>
                        )}
                    </div>
                </div>

                

                
            </div>
            <div className = "w-[var(--global-width)] px-4 mt-[2.5rem]">
                <h1 className = "text-center text-2xl font-bold text-[var(--color-secondary)] mb-8 tracking-wide ">
                    Danh sách slide bài giảng
                </h1>
                <div className = "hidden lg:block rounded-xl overflow-hidden border border-blue-500/20 py-2">
                    <div className="hidden lg:grid grid-cols-[130px_1fr_210px_150px] gap-4 px-5 py-3 text-center">
                    <div className="text-sm  font-medium border-r border-slate-400">STT</div>

                        <div className="text-sm font-medium border-r border-slate-400">Nội dung</div>

                        <div className="text-sm  font-medium border-r border-slate-400">Tạo giọng nói</div>

                        <div className="text-sm  font-medium">Tải Audio</div>
                    </div>
                </div>
                <div className = "divide-y divide-[var(--color-secondary)] rounded-xl py-4">
                    {slides.map((slide)=>(
                        <div
                            key = {slide.id}
                            className = "grid grid-cols-1 md:grid-cols-[130px_1fr_210px_150px] gap-4 px-5 py-5 first:rounded-tl-xl first:rounded-tr-xl first:border-t last:rounded-bl-xl last:rounded-br-xl last:border-b border-l border-r border-blue-500/20 hover:bg-blue-500/5 transition-colors items-center "
                        >
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-24 h-16 rounded-lg bg-[var(--color-secondary)] border border-dashed border-blue-500/30 flex items-center justify-center text-blue-500 hover:border-blue-400/60 hover:text-blue-400 transition-colors cursor-pointer">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="14" rx="2" stroke="white" strokeWidth="1.5" />
                                    <path d="M3 17l4-4 3 3 4-5 7 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <span className="text-xs font-medium text-[var(--color-primary)]">{slide.title}</span>
                            </div>

                            <div>
                                <textarea
                                    className = "w-full min-h-[90px]  border border-blue-500/20 rounded-lg  text-sm px-3.5 py-3 resize-y outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 placeholder-slate-600 leading-relaxed transition"
                                    value = {slide.content}
                                    onChange = {(e)=>updateSlide({id: slide.id, fields: {content: e.target.value}})}
                                    placeholder="Nhập nội dung slide..."
                                />
                            </div>

                            <div className = "flex flex-col gap-2.5">
                                <select
                                    className = "border border-blue-500/20 rounded-lg text-sm px-3 py-2.5 outline-none focus:border-indigo-500/50 cursor-pointer transition"
                                    value = {slide.voice}
                                    onChange = {(e)=>updateSlide({id: slide.id, fields: {voice: e.target.value}})}
                                >
                                    {voice_options.map((v) => (
                                        <option key={v} value={v} className = "text-[var(--color-primary)]">{v}</option>
                                    ))}
                                </select>

                                <button
                                    onClick = {()=>handleGenerateVoice(slide.id)}
                                    disabled={slide.isGenerating}
                                    className = "flex items-center justify-center gap-2 bg-secondary hover:bg-secondary/80 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 px-4 rounded-lg shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                                >
                                    {slide.isGenerating ? (
                                        <svg className="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="10" />
                                        </svg>
                                        ) : (
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="currentColor" />
                                            <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    )}
                                    {slide.isGenerating ? "Đang tạo..." : "Tạo giọng nói"}
                                </button>
        
                                {slide.audioUrl === "#generated" && (
                                    <p className="text-xs text-blue-400 text-center font-medium">Đã tạo giọng nói</p>
                                )}
                                {slide.audioUrl && slide.audioUrl !== "#generated" && (
                                    <audio controls className="w-full h-8 rounded" src={slide.audioUrl} />
                                )}
                            </div>

                            <div className = "flex justify-center">
                                <input
                                    type = "file"
                                    accept = "audio/*"
                                    ref={(el) => { fileInputRef.current[slide.id] = el; }}
                                    className = "hidden"
                                    onChange = {(e)=>{
                                        const file = e.target.files?.[0];
                                        if (file) handleAudioUpload(slide.id, file)
                                    }}
                                />
                                <button
                                    onClick={() => fileInputRef.current[slide.id]?.click()}
                                    className="cursor-pointer flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-sm text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-150 whitespace-nowrap"
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    {slide.audioFile ? slide.audioFile.name.slice(0, 10) + "…" : "Tải Audio"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>            
        </section>
    )


}