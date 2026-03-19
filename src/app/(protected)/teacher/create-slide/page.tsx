'use client';
import '@ant-design/v5-patch-for-react-19';


import { useState, useEffect, useRef } from 'react';
import {pdfjs} from 'react-pdf';
import { 
    useAudioTranscribeMutation,
    useGetRegisterVoiceQuery,
    useRegisterVoiceMutation,
    useCreateVideoGenJobMutation,
    useUploadVoiceMutation,
    useUploadSlideMutation,
    useStartGenerationMutation
 } from '@/store/api/[module]/genVideoApi';

import { useCloneVoiceMutation } from '@/store/api/[module]/voiceApi';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Slide {
    id: number;
    title: string;
    voice: string;
    content: string;
    audioFile : File | null;
    audioUrl: string | null;
    isGenerating: boolean;
    slideImageUrl: string | null;
}

interface VideoGeneration {
    id: string;
    slide: File | null;
    audios: File[];
}

const videoGen: VideoGeneration = { id: "", slide: null, audios: [] };

interface VoicePickerModalProps {
    value: string;
    onChange: (value: string) => void;
    // voices: Voice[];
}

const makeEmptySlides = (count: number): Slide[] => 
    Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Slide ${i + 1}`,
    content: '',
    voice: 'leonas',
    audioFile: null,
    audioUrl: null,
    isGenerating: false,
    slideImageUrl: null,
  }));

export default function SlideList() {
    
    const [slides, setSlides] = useState<Slide[]>(makeEmptySlides(3));

    const fileInputRef = useRef<{[key: number]:HTMLInputElement | null}>({});

    const updateSlide = ({id, fields}:{id: number, fields: Partial<Slide>}) =>{
        setSlides(
            prev => prev.map(slide => slide.id === id ? {...slide, ...fields}:slide)
        )
    }



    const handleAudioUpload = (id: number, file: File)=>{
        const objectUrl = URL.createObjectURL(file);
        updateSlide({id, fields:{audioFile:file, audioUrl:objectUrl}});
    };
    
    const [thumbnail, setThumbnail] = useState<{file: File; url: string}|null>(null);
    const [voiceSample, setVoiceSample] = useState<{file:File; url:string}|null>(null);
    const [isRecordingVoice, setIsRecordingVoice] = useState(false);
    const [recordingError, setRecordingError] = useState('');
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [transcribeHint, setTranscribeHint] = useState('');
    const [textPrompt, setTextPrompt] = useState('');
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [registerVoiceName, setRegisterVoiceName] = useState('');
    const [registerVoiceError, setRegisterVoiceError] = useState('');
    const [registerVoiceHint, setRegisterVoiceHint] = useState('');
    const [slideFile, setSlideFile]= useState<File|null>(null);
    const [registeredVoices, setRegisteredVoices] = useState<Array<{ voice_name: string; audio_url: string }>>([]);
    const [selectedRegisteredVoice, setSelectedRegisteredVoice] = useState('');
    
    const [isParsingSlide, setIsParsingSlide] = useState(false);
    const [previewSlide, setPreviewSlide] = useState<{url:string; title: string}|null >(null);
    const [createVideoHint, setCreateVideoHint] = useState('');
    const [isCreateVideoHintVisible, setIsCreateVideoHintVisible] = useState(false);


    const thumbnailRef = useRef<HTMLInputElement>(null);
    const voiceRef = useRef<HTMLInputElement>(null);
    const slideRef = useRef<HTMLInputElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);

    // AI API
    const [transcribeAudio] = useAudioTranscribeMutation();
    const [registerVoice, { isLoading: isRegisteringVoice }] = useRegisterVoiceMutation();

    // VIDEO GENERATION API
    const [createJob] = useCreateVideoGenJobMutation();
    const [uploadVoices] = useUploadVoiceMutation();
    const [uploadSlide] = useUploadSlideMutation();
    const [startGeneration] = useStartGenerationMutation();

    const { data, isLoading, error, refetch } = useGetRegisterVoiceQuery();
    useEffect(() => {
        if (data) {
            setRegisteredVoices(data);
            if (data.length > 0) {
                const firstVoiceName = data[0].voice_name;
                setSelectedRegisteredVoice(firstVoiceName);
                setSlides((prev) =>
                    prev.map((slide) => ({
                        ...slide,
                        voice: data.some((voice) => voice.voice_name === slide.voice)
                            ? slide.voice
                            : firstVoiceName,
                    }))
                );
            }
        }
    }, [data]);

    const [cloneVoice] = useCloneVoiceMutation();
    
    

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
        setRecordingError('');
        setVoiceSample({file, url});
    }

    const handleStartRecording = async () => {
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            setRecordingError('Trình duyệt không hỗ trợ ghi âm trực tiếp.');
            return;
        }

        try {
            setRecordingError('');
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaStreamRef.current = stream;

            const recorder = new MediaRecorder(stream);
            recordedChunksRef.current = [];

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
                const file = new File([audioBlob], `recorded-voice-${Date.now()}.webm`, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);

                setVoiceSample({ file, url });
                setIsRecordingVoice(false);

                mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
                mediaStreamRef.current = null;
                mediaRecorderRef.current = null;
            };

            recorder.start();
            mediaRecorderRef.current = recorder;
            setIsRecordingVoice(true);
        } catch {
            setRecordingError('Không thể truy cập microphone. Vui lòng cấp quyền và thử lại.');
            setIsRecordingVoice(false);
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const handleTranscribeByAI = async () => {
        if (!voiceSample) {
            setTranscribeHint('Vui lòng tải hoặc ghi âm giọng nói trước khi dùng AI Transcribe.');
            return;
        }

        setTranscribeHint('');
        setIsTranscribing(true);

        // Placeholder cho API transcribe thật.
        setTimeout(async () =>{
            try {
                const res = await transcribeAudio({ audioFile: voiceSample.file }).unwrap();
                setTextPrompt(res.transcript);
            } catch {
                setTranscribeHint('Có lỗi xảy ra khi transcribe. Vui lòng thử lại.');
            } finally {
                setIsTranscribing(false);
            }
            setIsTranscribing(false);
        }, 900);
    };

    const normalizeVoiceName = (name: string) => name.trim().toLocaleLowerCase();

    const isVoiceNameDuplicated = (name: string) => {
        const normalized = normalizeVoiceName(name);
        return registeredVoices.some((voice) => normalizeVoiceName(voice.voice_name) === normalized);
    };

    const handleOpenRegisterVoiceModal = () => {
        if (!voiceSample || !textPrompt.trim()) {
            setRegisterVoiceHint('Vui lòng tải giọng nói và nhập/transcribe văn bản trước khi đăng ký.');
            return;
        }

        const baseName = voiceSample.file.name.replace(/\.[^/.]+$/, '') || 'voice';
        setRegisterVoiceName(baseName);
        setRegisterVoiceError('');
        setRegisterVoiceHint('');
        setIsRegisterModalOpen(true);
    };

    const handleCloseRegisterVoiceModal = () => {
        if (isRegisteringVoice) {
            return;
        }

        setIsRegisterModalOpen(false);
        setRegisterVoiceError('');
    };

    const handleConfirmRegisterVoice = async () => {
        if (!voiceSample) {
            setRegisterVoiceError('Vui lòng tải hoặc ghi âm giọng nói trước.');
            return;
        }

        const trimmedName = registerVoiceName.trim();
        if (!trimmedName) {
            setRegisterVoiceError('Vui lòng nhập tên giọng nói.');
            return;
        }

        if (isVoiceNameDuplicated(trimmedName)) {
            setRegisterVoiceError('Đã đăng ký tên này. Vui lòng chọn tên khác.');
            return;
        }

        if (!textPrompt.trim()) {
            setRegisterVoiceError('Vui lòng nhập hoặc AI transcribe văn bản trước khi đăng ký.');
            return;
        }

        setRegisterVoiceError('');

        try {
            const res = await registerVoice({
                voice_name: trimmedName,
                audio_file: voiceSample.file,
                audio_transcript: textPrompt.trim(),
            }).unwrap();

            setIsRegisterModalOpen(false);
            setSelectedRegisteredVoice(trimmedName);
            setRegisterVoiceHint(res.message || 'Đăng ký giọng nói thành công.');

            try {
                await refetch();
            } catch {
                setRegisteredVoices((prev) => [
                    ...prev,
                    { voice_name: trimmedName, audio_url: voiceSample.url },
                ]);
            }
        } catch (err: any) {
            const apiMessage =
                err?.data?.message ||
                err?.error ||
                'Đăng ký giọng nói thất bại. Vui lòng thử lại.';
            setRegisterVoiceError(Array.isArray(apiMessage) ? apiMessage[0] : apiMessage);
        }
    };
    
    const handleSlideFileUpload = async (file:File) => {
        if (!file){
            return;
        }


        setSlideFile(file);

        if(!file.name.endsWith('.pdf')) {
            return;
        }

        setIsParsingSlide(true);

        try  {

            const arrayBuffer = await file.arrayBuffer();
            const pdf =  await pdfjs.getDocument({data: arrayBuffer}).promise;
            const n_pages = pdf.numPages;


            const newSlides: Slide[] = [];

            for (let pageIdx = 1; pageIdx <= n_pages; pageIdx++) {
                const page = await pdf.getPage(pageIdx);
                const viewport = page.getViewport({scale:1.5});

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                const ctx = canvas.getContext('2d')!;
                await page.render({ canvas:canvas, canvasContext: ctx, viewport }).promise;

                const imageUrl = canvas.toDataURL('image/jpeg', 0.85);

                newSlides.push({
                    id: pageIdx,
                    title :  `Slide ${pageIdx}`,
                    content: '',
                    voice: '',
                    audioFile: null,
                    audioUrl: null,
                    isGenerating: false,
                    slideImageUrl: imageUrl,
                });

            }
            setSlides(newSlides);
            videoGen.slide = file;
        }

        catch (err) {
            console.error('Lỗi parser PDF ở client', err);
        }
        finally {
            setIsParsingSlide(false)
        }   
    }

    const handleGenerateVoice = async (slideId: number, slideContent: string, slideVoice: string)=>{
        if (!slideContent.trim() || !slideVoice.trim()){
            return;
        }

        const res = await cloneVoice({
            text: slideContent,
            voice_name: slideVoice,
        }).unwrap();

        updateSlide({id: slideId, fields:{audioUrl: res.cloned_audio_url}});
        
    };

    const hasSlides = slides.length > 0;
    const allSlidesHaveAudio = slides.every((slide) => Boolean(slide.audioFile || slide.audioUrl?.trim()));
    const canCreateVideo = hasSlides && allSlidesHaveAudio;

    const showCreateVideoHint = (message: string) => {
        setCreateVideoHint(message);
        setIsCreateVideoHintVisible(true);
    };

    const handleCreateVideo = async () => {
        if (!hasSlides) {
            showCreateVideoHint('Cần có ít nhất 1 slide để tạo video bài giảng.');
            return;
        }

        if (!allSlidesHaveAudio) {
            showCreateVideoHint('Mọi slide đều phải có âm thanh đi kèm trước khi tạo video.');
            return;
        }

        setCreateVideoHint('');
        setIsCreateVideoHintVisible(false);

        const urlToFile = async (url: string, filename: string): Promise<File> => {
            const res = await fetch(url);
            const blob = await res.blob();
            return new File([blob], filename, { type: blob.type });
        };

        const audioFiles = await Promise.all(
            slides.map(async (slide, index) => {
                if (slide.audioFile) return slide.audioFile;
                if (slide.audioUrl) {
                    return await urlToFile(slide.audioUrl, `audio-${slide.id || index}.mp3`)
                }

                return new File([], `empty-${index}.mp3`);
            })
        );

        videoGen.audios = audioFiles;

        // TODO: Gắn API tạo video tại đây khi backend sẵn sàng.
        console.log('Create video payload:', slides);

        // Create Video generation job
        const videoName = "Video Generation"
        try {
            const createJobRes = await createJob({ videoName: videoName }).unwrap();
            console.log("Your new Job ID is:", createJobRes.videoGenJob.id);
            videoGen.id = createJobRes.videoGenJob.id;

            await uploadVoices({ jobId: videoGen.id, audios: videoGen.audios }).unwrap();

            // Right before you call the upload API:
            if (!videoGen.slide) {
                showCreateVideoHint('Cần có ít nhất 1 slide để tạo video bài giảng.');
                return; // This early return is the magic key!
            }

            await uploadSlide({ jobId: videoGen.id, slide: videoGen.slide }).unwrap();

            const startJobRes = await startGeneration({ jobId: videoGen.id }).unwrap();
            console.log(startJobRes.message);
        } catch (err) {
            console.error("Failed to create the job: ", err);
        }
    };

    useEffect(() => {
        if (!createVideoHint) {
            return;
        }

        setIsCreateVideoHintVisible(true);
        const fadeTimer = window.setTimeout(() => {
            setIsCreateVideoHintVisible(false);
        }, 2400);

        const clearTimer = window.setTimeout(() => {
            setCreateVideoHint('');
        }, 3000);

        return () => {
            window.clearTimeout(fadeTimer);
            window.clearTimeout(clearTimer);
        };
    }, [createVideoHint]);

    useEffect(() => {
        if (canCreateVideo && createVideoHint) {
            setCreateVideoHint('');
            setIsCreateVideoHintVisible(false);
        }
    }, [canCreateVideo, createVideoHint]);

    useEffect(() => {
        return () => {
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }
            mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
        };
    }, []);

    return (
        <section className="w-full flex flex-col items-center justify-center mt-[5rem] mb-[10rem]">
            <div className = "w-[var(--global-width)] px-4 mt-[2.5rem]">
                <h1 className = "text-center text-2xl font-bold text-[var(--color-secondary)] mb-8 tracking-wide ">
                    1. ĐĂNG KÝ GIỌNG NÓI
                </h1>

                <div className = "grid grid-cols-1 md:grid-cols-2 md:grid-cols-2 gap-4">
                    <div className="relative isolate z-0 md:row-span-3 group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
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

                        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-[2px]">
                            <span className="rounded-full border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-[var(--color-secondary)] shadow-sm">
                                Đang phát triển
                            </span>
                        </div>
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
                            <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Tải giọng nói</p>
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

                        <div className="flex items-stretch gap-2">
                            <label
                                onClick={() => voiceRef.current?.click()}
                                className="flex-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-blue-500/20 rounded-lg py-7 cursor-pointer hover:border-blue-400/50 transition-all"
                            >
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="text-blue-400/50">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-xs text-slate-400">Kéo thả hoặc <span className="text-blue-400 font-medium">chọn file</span></span>
                            </label>

                            <button
                                type="button"
                                onClick={isRecordingVoice ? handleStopRecording : handleStartRecording}
                                className={`w-[92px] shrink-0 rounded-lg border flex flex-col items-center justify-center px-2 py-3 transition-all ${
                                    isRecordingVoice
                                        ? 'border-red-300 bg-red-50 text-red-600 shadow-[0_0_0_3px_rgba(239,68,68,0.12)]'
                                        : 'border-blue-500/20 bg-white text-[var(--color-secondary)] hover:border-blue-400/60'
                                }`}
                                title={isRecordingVoice ? 'Dừng ghi âm' : 'Ghi âm trực tiếp'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
                                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="currentColor"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>

                                {isRecordingVoice ? (
                                    <div className="flex items-end gap-[2px] h-4 mb-1" aria-label="recording-wave">
                                        <span className="w-[2px] h-2 bg-red-500 rounded animate-pulse" />
                                        <span className="w-[2px] h-4 bg-red-500 rounded animate-pulse [animation-delay:120ms]" />
                                        <span className="w-[2px] h-3 bg-red-500 rounded animate-pulse [animation-delay:220ms]" />
                                        <span className="w-[2px] h-4 bg-red-500 rounded animate-pulse [animation-delay:320ms]" />
                                        <span className="w-[2px] h-2 bg-red-500 rounded animate-pulse [animation-delay:420ms]" />
                                    </div>
                                ) : (
                                    <div className="h-4 mb-1" />
                                )}

                                <span className="text-[11px] font-medium text-center leading-tight">
                                    {isRecordingVoice ? 'Đang thu' : 'Mic'}
                                </span>
                            </button>
                        </div>

                        {recordingError && (
                            <p className="mt-2 text-xs text-red-500">{recordingError}</p>
                        )}

                        {voiceSample ? (
                            <div className="space-y-2 mt-3">
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
                        ) : null}
                    </div>

                    <div className="group rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-5 hover:border-blue-400/40 hover:bg-blue-500/[0.05] transition-all duration-200">
                        <div className = "flex items-center gap-2.5 mb-4">
                            <div className = "w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#60a5fa" strokeWidth="1.8" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] leading-none">Nhập văn bản của giọng nói đã tải</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Lưu ý: giọng nói nên từ 5-15 giây, khi thu âm tránh hiện tượng kéo dài âm</p>
                            </div>
                            {textPrompt && (
                                <span className="ml-auto text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    {textPrompt.length} ký tự
                                </span>
                            )}
                        </div>
                        <div className="flex items-stretch gap-2">
                            <textarea
                                className="flex-1 min-h-[108px] border border-blue-500/15 rounded-lg text-sm px-3.5 py-3 resize-none outline-none focus:border-blue-500/40 focus:ring-2 focus:ring-blue-500/10 placeholder-slate-600 leading-relaxed transition bg-transparent"
                                placeholder="VD: Bài giảng về trí tuệ nhân tạo bằng ngôn ngữ đa phương thức..."
                                value={textPrompt}
                                onChange={(e) => setTextPrompt(e.target.value)}
                            />

                            <button
                                type="button"
                                onClick={handleTranscribeByAI}
                                disabled={isTranscribing}
                                className={`w-[92px] shrink-0 rounded-lg border flex flex-col items-center justify-center px-2 py-3 transition-all ${
                                    isTranscribing
                                        ? 'border-blue-300 bg-blue-50 text-[var(--color-secondary)]'
                                        : 'border-blue-500/20 bg-white text-[var(--color-secondary)] hover:border-blue-400/60'
                                } disabled:cursor-not-allowed`}
                                title="AI Transcribe"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="mb-1">
                                    <path d="M12 4l1.6 3.4L17 9l-3.4 1.6L12 14l-1.6-3.4L7 9l3.4-1.6L12 4z" fill="currentColor"/>
                                    <path d="M18.5 14l.8 1.7L21 16.5l-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z" fill="currentColor" opacity="0.9"/>
                                    <path d="M5.5 14l.8 1.7L8 16.5l-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8.8-1.7z" fill="currentColor" opacity="0.75"/>
                                </svg>
                                <span className="text-[11px] font-medium text-center leading-tight">
                                    {isTranscribing ? 'Đang xử lý' : 'AI Transcribe'}
                                </span>
                            </button>
                        </div>

                        {transcribeHint && (
                            <p className="mt-2 text-xs text-slate-500">{transcribeHint}</p>
                        )}
                        
                    </div>

                    <div className = "md:col-span-1 md:col-start-2 h-auto group rounded-xl ">
                            <button
                                disabled={!voiceSample || !textPrompt.trim()}
                                onClick={handleOpenRegisterVoiceModal}
                                className="cursor-pointer bg-secondary w-full h-[3rem] shrink-0 flex items-center justify-center gap-2 px-4 rounded-lg text-sm font-semibold transition-all duration-150
                                    disabled:cursor-not-allowed 
                                "
                                >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2a3 3 0 0 1 3 3v7a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z" fill="white"/>
                                    <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                                <span className = "text-white text-base">Đăng ký giọng nói</span>
                            </button>

                            {registerVoiceHint && (
                                <p className="mt-2 text-xs text-emerald-600">{registerVoiceHint}</p>
                            )}

                    </div>

                    <div className="md:col-span-2 rounded-xl border border-blue-500/20 bg-blue-500/[0.02] p-4 md:p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-[1fr_3fr] gap-3 items-center">
                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] pb-2 pl-2">Giọng nói đã đăng ký</p>
                                <select
                                    className="w-full border border-blue-500/20 rounded-lg text-sm px-3 py-2 outline-none focus:border-indigo-500/50 transition disabled:cursor-not-allowed"
                                    value={selectedRegisteredVoice}
                                    onChange={(e) => setSelectedRegisteredVoice(e.target.value)}
                                    disabled={registeredVoices.length === 0}
                                >
                                    <option value="">
                                        {registeredVoices.length === 0 ? 'Chưa có giọng đã đăng ký' : 'Chọn giọng để nghe lại'}
                                    </option>
                                    {registeredVoices.map((voice) => (
                                        <option key={voice.voice_name} value={voice.voice_name}>
                                            {voice.voice_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-[var(--color-secondary)] pb-2 pl-2">Nghe lại</p>
                                {registeredVoices.length === 0 ? (
                                    <div className="h-10 rounded-lg border border-dashed border-blue-500/20 text-slate-400 text-sm flex items-center justify-center">
                                        Chưa có dữ liệu giọng nói
                                    </div>
                                ) : !selectedRegisteredVoice ? (
                                    <div className="h-10 rounded-lg border border-dashed border-blue-500/20 text-slate-400 text-sm flex items-center justify-center">
                                        Vui lòng chọn một giọng để nghe lại
                                    </div>
                                ) : (
                                    <audio
                                        controls
                                        className="w-full h-10 rounded"
                                        src={registeredVoices.find((voice) => voice.voice_name === selectedRegisteredVoice)?.audio_url}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="md:col-span-2 pt-5">
                    <h1 className = "text-center text-2xl font-bold text-[var(--color-secondary)] mb-8 tracking-wide ">
                        2. TẠO NỘI DUNG GIẢNG DẠY
                    </h1>
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
                                <p className="text-[11px] text-slate-500 mt-0.5">PDF, PPTX (PPTX có thể lỗi)</p>
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
                            onChange = {(e)=>{const f = e.target.files?.[0]; if (f) handleSlideFileUpload(f);}}
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
            <div className = "w-full max-w-[1680px] px-4 md:px-6 lg:px-8 mt-[2.5rem]">
                <div className = "hidden lg:block rounded-xl overflow-hidden border border-blue-500/20 py-2">
                    <div className="hidden lg:grid grid-cols-[2fr_4fr_3fr] gap-4 px-5 py-3 text-center">
                    <div className="text-sm  font-medium border-r border-slate-400">Slide</div>

                        <div className="text-sm font-medium border-r border-slate-400">Nội dung</div>

                        <div className="text-sm  font-medium">Audio</div>
                    </div>
                </div>
                <div className = "divide-y divide-[var(--color-secondary)] rounded-xl py-4 max-h-[1024px] overflow-y-scroll">
                    {isParsingSlide && (
                    <div className="flex items-center justify-center gap-3 py-8 text-sm text-slate-400">
                        <svg className="animate-spin text-blue-400" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="10"/>
                        </svg>
                        Đang phân tích slide...
                    </div>
                    )}
                    {slides.map((slide)=>{
                        const hasAnyAudio = Boolean(slide.audioUrl);

                        return (
                        <div
                            key = {slide.id}
                            className = "group grid grid-cols-1 md:grid-cols-[2fr_4fr_1.5fr_1.5fr] gap-4 px-5 py-5 first:rounded-tl-xl first:rounded-tr-xl first:border-t last:rounded-bl-xl last:rounded-br-xl last:border-b border-l border-r border-blue-500/20 hover:bg-blue-500/5 transition-colors items-center "
                        >
                            <div className="flex flex-col items-center gap-1.5">
                                {slide.slideImageUrl ?(
                                    <div className = "w-full aspect-video rounded-lg overflow-hidden border border-blue-500/30 cursor-pointer hover:border-blue-400/70 hover:scale-105 transition-all duration-150 shadow-md"
                                        onClick={() => setPreviewSlide({ url: slide.slideImageUrl!, title: slide.title })}
                                    >
                                        <img
                                            src={slide.slideImageUrl}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ):(
                                    <div className="w-24 h-16 rounded-lg bg-[var(--color-secondary)]/10 border border-dashed border-blue-500/30 flex items-center justify-center text-blue-500/40">
                                        {isParsingSlide ? (
                                            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="32" strokeDashoffset="10"/>
                                            </svg>
                                        ) : (
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                                            <rect x="3" y="3" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M3 17l4-4 3 3 4-5 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                )}

                                <div>{slide.id}</div>
                            </div>

                            <div className="h-full">
                                <textarea
                                    className = "w-full max-h-[400px] min-h-[100px] border border-blue-500/20 rounded-lg  text-sm px-3.5 py-3 resize-y outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 placeholder-slate-600 leading-relaxed transition"
                                    value = {slide.content}
                                    onChange = {(e)=>updateSlide({id: slide.id, fields: {content: e.target.value}})}
                                    placeholder="Nhập nội dung slide..."
                                />
                            </div>

                            <div className = "grid grid-cols-1 sm:grid-cols-2 gap-0 md:col-span-2 ">
                                <div className="rounded-lg bg-transparent p-2 transition-colors duration-150">
                                    <select
                                        className = "w-full bg-transparent border border-blue-500/20 rounded-lg text-sm px-2.5 py-1.5 outline-none focus:border-indigo-500/50 cursor-pointer transition"
                                        value = {slide.voice}
                                        onChange = {(e)=>updateSlide({id: slide.id, fields: {voice: e.target.value}})}
                                    >
                                        {registeredVoices.length === 0 ? (
                                            <option value="" className = "text-[var(--color-primary)]">
                                                Chưa có giọng đã đăng ký
                                            </option>
                                        ) : (
                                            registeredVoices.map((voice) => (
                                                <option
                                                    key={voice.voice_name}
                                                    value={voice.voice_name}
                                                    className = "text-[var(--color-primary)]"
                                                >
                                                    {voice.voice_name}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                <div className="rounded-lg bg-transparent p-2 transition-colors duration-150">
                                    <button
                                        onClick = {()=>handleGenerateVoice(slide.id, slide.content, slide.voice)}
                                        disabled={slide.isGenerating}
                                        className = "w-full flex items-center justify-center gap-1.5 bg-secondary hover:bg-secondary/80 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold py-1.5 px-2.5 rounded-lg transition-all duration-150"
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
                                    </div>

                                    <div className="sm:col-span-2 rounded-lg bg-transparent p-0 flex items-center justify-center transition-colors duration-150">
                                        <p className="text-xs text-center text-slate-400 font-medium">hoặc</p>
                                </div>

                                    <div className="sm:col-span-2 rounded-lg bg-transparent p-2 flex items-center justify-center transition-colors duration-150">
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
                                        className="cursor-pointer w-full bg-transparent hover:bg-transparent flex items-center justify-center gap-1.5 border border-blue-500/20 hover:border-blue-500/40 text-sm text-[var(--color-secondary)] font-medium py-1.5 px-2.5 rounded-lg transition-all duration-150 whitespace-nowrap"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        {slide.audioFile ? 'Đổi audio' : 'Tải audio'}
                                    </button>
                                </div>

                                <div className="h-[85%] rounded-lg bg-transparent p-2 flex flex-col items-center justify-center min-h-[64px] sm:col-span-2 transition-colors duration-150">
                                    {hasAnyAudio ? (
                                        slide.audioUrl === '#generated' ? (
                                            <p className="text-xs text-blue-500 text-center font-medium">Đã tạo giọng nói</p>
                                        ) : (
                                            <>
                                                <audio controls className="w-full h-7 rounded" src={slide.audioUrl || undefined} />
                                                {slide.audioFile && (
                                                    <p className="text-[11px] text-slate-500 text-center truncate max-w-full mt-0.5">{slide.audioFile.name}</p>
                                                )}
                                            </>
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-400 text-center">Chưa có âm thanh</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            </div>

            <div className="w-full max-w-[1680px] px-4 md:px-6 lg:px-8 mt-6 flex flex-col items-center">
                <button
                    type="button"
                    onClick={handleCreateVideo}
                    className="w-full sm:w-auto sm:min-w-[260px] h-[3rem] px-6 rounded-lg bg-secondary text-white text-base font-semibold transition-all duration-150 hover:bg-secondary/80"
                >
                    Tạo video bài giảng
                </button>
                {createVideoHint && (
                    <p
                        className={`mt-2 text-sm text-red-500 transition-opacity duration-500 ${
                            isCreateVideoHintVisible ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        {createVideoHint}
                    </p>
                )}
            </div>

            {previewSlide && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setPreviewSlide(null)}
                >
                    <div className = "relative max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl"
                        onClick = {(e) => e.stopPropagation()}
                    >
                        <div className = "flex items-center justify-between bg-[#0f172a] px-4 py-3 border-b border-white/10">
                            <span className = "text-sm font-meidum text-white">
                                {previewSlide.title}
                            </span>
                            <button
                                onClick={() => setPreviewSlide(null)}
                                className="text-slate-400 hover:text-white transition-colors"
                                >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>
                        <img src={previewSlide.url} alt={previewSlide.title} className="w-full"/>

                    </div>
                </div>
            )}

            {isRegisterModalOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[1px] flex items-center justify-center p-4"
                    onClick={handleCloseRegisterVoiceModal}
                >
                    <div
                        className="w-full max-w-md rounded-2xl border border-blue-500/20 bg-white shadow-2xl p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="text-lg font-semibold text-[var(--color-secondary)]">Đăng ký giọng nói</h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Nhập tên giọng nói trước khi xác nhận đăng ký.
                        </p>

                        <div className="mt-4 space-y-2">
                            <label className="text-sm font-medium text-[var(--color-secondary)]">Tên giọng nói</label>
                            <input
                                type="text"
                                value={registerVoiceName}
                                onChange={(e) => {
                                    setRegisterVoiceName(e.target.value);
                                    if (registerVoiceError) {
                                        setRegisterVoiceError('');
                                    }
                                }}
                                placeholder="VD: giong-co-ban"
                                className="w-full border border-blue-500/20 rounded-lg text-sm px-3 py-2.5 outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10"
                                autoFocus
                            />
                            {registerVoiceError && (
                                <p className="text-xs text-red-500">{registerVoiceError}</p>
                            )}
                        </div>

                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={handleCloseRegisterVoiceModal}
                                disabled={isRegisteringVoice}
                                className="px-4 py-2 rounded-lg text-sm border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRegisterVoice}
                                disabled={isRegisteringVoice}
                                className="px-4 py-2 rounded-lg text-sm font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:cursor-not-allowed"
                            >
                                {isRegisteringVoice ? 'Đang đăng ký...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )


}