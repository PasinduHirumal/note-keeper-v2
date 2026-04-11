"use client";

import { VoiceNote } from "@/lib/types";
import { Edit, Trash2, Pin, Clock, Play, Pause, Volume2, Download } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface VoiceNoteCardProps {
  note: VoiceNote;
  onEdit: () => void;
  onDelete: (id: string) => void;
  onTogglePin?: (id: string) => void;
}

export default function VoiceNoteCard({ note, onEdit, onDelete, onTogglePin }: VoiceNoteCardProps) {
  const dateStr = new Date(note.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) audioRef.current.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; 
      analyserRef.current = analyser;

      const source = ctx.createMediaElementSource(audioRef.current);
      sourceRef.current = source;
      
      source.connect(analyser);
      analyser.connect(ctx.destination);
    }
  };

  const drawVisualizer = () => {
    if (!analyserRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      if (!isPlaying) return;
      animationRef.current = requestAnimationFrame(draw);
      
      analyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 1.5;
      let barHeight;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2;
        
        ctx.fillStyle = `hsl(${220 + (i * 2)}, 80%, 60%)`; 
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 2;
      }
    };
    
    draw();
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    } else {
      initAudioContext();
      if (audioContextRef.current?.state === 'suspended') {
        audioContextRef.current.resume();
      }
      audioRef.current.play();
      setIsPlaying(true);
      setTimeout(drawVisualizer, 50);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const time = Number(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = note.audioData;
    // guess extension via regex data URL header
    const matches = note.audioData.match(/^data:audio\/(webm|mp3|wav|ogg|mpeg);base64,/i);
    let ext = 'webm';
    if (matches && matches.length > 1) {
       ext = matches[1] === 'mpeg' ? 'mp3' : matches[1];
    }
    const filenameSafeTitle = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    a.download = `${filenameSafeTitle || 'voice_note'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="bg-card backdrop-blur-2xl border border-border rounded-xl p-5 hover:shadow-lg transition-all duration-200 flex flex-col group shadow-xl relative min-h-[220px] overflow-hidden">
      <div className="flex justify-between items-start mb-3 relative min-h-[32px]">
        <h3 className="font-semibold text-lg text-card-foreground truncate block w-[calc(100%-130px)] pr-2" title={note.title || "Voice Note"}>
          {note.title || "Voice Note"}
        </h3>
        
        <div className="flex space-x-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity absolute right-0 top-0 bg-card/90 backdrop-blur-sm rounded-md p-0.5 z-10 shadow-sm border border-border/50">
          {onTogglePin && (
            <button
              onClick={(e) => { e.stopPropagation(); onTogglePin(note.id); }}
              className={`p-1.5 rounded-md transition-colors ${
                note.isPinned ? 'text-primary hover:text-primary/80 bg-primary/10' : 'text-gray-500 hover:text-primary hover:bg-primary/10'
              }`}
              title={note.isPinned ? "Unpin" : "Pin"}
            >
              <Pin className={`w-3.5 h-3.5 ${note.isPinned ? 'fill-current' : ''}`} />
            </button>
          )}
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors"
            title="Download Audio"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
            title="Edit Title"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col flex-1 mt-2 mb-4 justify-between min-h-[80px]">
        {/* Pitch Visualizer Area */}
        <div className="flex-1 w-full mb-4 flex items-end justify-center rounded bg-sidebar/30 min-h-[48px] overflow-hidden">
          <canvas 
            ref={canvasRef} 
            className="w-full h-full object-cover px-2"
            width={300}
            height={48}
          />
        </div>

        {/* Custom Audio Controls */}
        <div className="flex items-center space-x-3 bg-sidebar/50 rounded-lg p-2.5 border border-border w-full shadow-sm mt-auto">
          <button
            onClick={togglePlayback}
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all shrink-0 shadow-sm"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          
          <input 
            type="range" 
            min="0" 
            max={duration || 100} 
            value={currentTime} 
            onChange={handleSeek}
            className="flex-1 w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary outline-none" 
          />
          
          <span className="text-xs text-sidebar-foreground/70 font-mono shrink-0 w-10 text-right">
            {formatTime(currentTime)}
          </span>
        </div>

        <audio 
          src={note.audioData} 
          ref={audioRef} 
          className="hidden" 
          preload="metadata"
          crossOrigin="anonymous" 
        />
      </div>

      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between text-xs text-sidebar-foreground opacity-60">
        <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {dateStr}</span>
        <Volume2 className="w-3 h-3" />
      </div>
    </div>
  );
}
