"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mic, Square, Play, Pause, RotateCcw, Upload } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/lib/ToastContext";

interface VoiceNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, audioData?: string) => void;
  isEditing?: boolean;
  initialTitle?: string;
  existingAudioData?: string;
}

export default function VoiceNoteModal({
  isOpen, onClose, onSave, isEditing, initialTitle = "", existingAudioData
}: VoiceNoteModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioDataUrl, setAudioDataUrl] = useState<string | null>(existingAudioData || null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Live mic visualizer tools
  const analyzerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const recordingContextRef = useRef<AudioContext | null>(null);
  const recordingAnalyserRef = useRef<AnalyserNode | null>(null);
  const recordingAnimRef = useRef<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setAudioDataUrl(existingAudioData || null);
      setIsRecording(false);
      setRecordingTime(0);
      setIsPlaying(false);
    } else {
      handleStopRecording();
      if (audioRef.current) {
        audioRef.current.pause();
      }
      cleanupVisualizer();
    }
  }, [isOpen, initialTitle, existingAudioData]);

  const cleanupVisualizer = () => {
    if (recordingAnimRef.current) cancelAnimationFrame(recordingAnimRef.current);
    if (recordingContextRef.current && recordingContextRef.current.state !== 'closed') {
      recordingContextRef.current.close().catch(e => console.error(e));
    }
    recordingContextRef.current = null;
    recordingAnalyserRef.current = null;
  };

  const drawLiveVisualizer = () => {
    if (!recordingAnalyserRef.current || !analyzerCanvasRef.current) return;
    
    const canvas = analyzerCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bufferLength = recordingAnalyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const draw = () => {
      recordingAnimRef.current = requestAnimationFrame(draw);
      recordingAnalyserRef.current!.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const barWidth = (canvas.width / bufferLength) * 2;
      let barHeight;
      let x = 0;

      for(let i = 0; i < bufferLength; i++) {
        // Boost visually for mic feedback
        barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        
        ctx.fillStyle = `hsl(350, 80%, ${50 + (dataArray[i]/255)*30}%)`; // Vibrant red feedback
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
        
        x += barWidth + 3;
      }
    };
    draw();
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup Visualizer
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      recordingContextRef.current = audioCtx;
      recordingAnalyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          setAudioDataUrl(reader.result as string);
        };
        stream.getTracks().forEach(track => track.stop());
      };

      setAudioDataUrl(null); 
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Give it a tiny delay to allow React to render the canvas before drawing
      setTimeout(drawLiveVisualizer, 100);

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 119) { 
            handleStopRecording();
            toast.info("Recording reached 2-minute limit");
            return 120;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast.error("Could not access microphone.");
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      cleanupVisualizer();
    }
  };

  const discardRecording = () => {
    setAudioDataUrl(null);
    setRecordingTime(0);
    setIsRecording(false);
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
    cleanupVisualizer();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) { // Max 10MB to avoid completely freezing localStorage
      toast.error("File is too large. Please select a file under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setAudioDataUrl(reader.result as string);
      toast.success("Audio imported successfully!");
    };
    reader.onerror = () => {
      toast.error("Failed to read audio file.");
    };

    // Reset input
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const triggerImportClick = () => {
      fileInputRef.current?.click();
  };

  const togglePlayback = () => {
    if (!audioRef.current || !audioDataUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-card backdrop-blur-2xl w-full max-w-md rounded-2xl shadow-2xl flex flex-col border border-border overflow-hidden my-4 max-h-[90vh]"
          >
            <div className="flex justify-between items-center p-4 border-b border-border bg-sidebar/50 shrink-0">
              <h2 className="text-lg font-semibold text-foreground">
                {isEditing ? "Edit Voice Note" : "New Voice Note"}
              </h2>
              <button onClick={onClose} className="p-1 text-gray-500 hover:text-foreground rounded-md transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col space-y-6 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1.5">Voice Note Title</label>
                <input
                  type="text"
                  placeholder="e.g., Idea for project..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-transparent border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary text-foreground placeholder:text-gray-500 outline-none transition-all"
                  autoFocus
                />
              </div>

              {!isEditing && (
                <div className="flex flex-col items-center justify-center bg-sidebar/30 border border-border rounded-xl p-6 relative overflow-hidden min-h-[200px]">
                  
                  {/* Idle Actions (Record & Import) */}
                  {!audioDataUrl && !isRecording && (
                    <div className="flex flex-col items-center space-y-4">
                        <button
                          onClick={handleStartRecording}
                          className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all shadow-lg hover:scale-105"
                        >
                          <Mic className="w-8 h-8" />
                        </button>
                        <span className="text-sm text-gray-500 font-medium">Capture directly</span>
                        
                        <div className="flex items-center space-x-3 w-full my-2">
                           <div className="flex-1 h-px bg-border"></div>
                           <span className="text-xs text-gray-400 font-semibold uppercase">Or</span>
                           <div className="flex-1 h-px bg-border"></div>
                        </div>

                        <button
                          onClick={triggerImportClick}
                          className="flex items-center px-4 py-2 bg-card border border-border rounded-lg hover:bg-border/50 hover:text-primary transition-colors text-sm font-medium text-foreground w-full justify-center"
                        >
                           <Upload className="w-4 h-4 mr-2" />
                           Import Audio File
                        </button>
                        <input 
                           type="file" 
                           accept="audio/*" 
                           className="hidden" 
                           ref={fileInputRef} 
                           onChange={handleImportFile} 
                        />
                    </div>
                  )}

                  {/* Active Recording State with Live Pitch visualizer */}
                  {isRecording && (
                    <div className="flex flex-col items-center w-full z-10">
                      <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white animate-pulse mb-3 z-10">
                        <Mic className="w-8 h-8" />
                      </div>
                      <span className="text-xl font-mono text-foreground mb-4 z-10">{formatTime(recordingTime)}</span>
                      
                      <div className="w-full h-16 bg-sidebar/50 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                        <canvas 
                          ref={analyzerCanvasRef} 
                          width={280} 
                          height={60} 
                          className="opacity-80"
                        />
                      </div>

                      <button
                        onClick={handleStopRecording}
                        className="flex items-center px-4 py-2 bg-card border border-border rounded-lg hover:bg-border/50 transition-colors text-sm font-medium text-foreground z-10"
                      >
                        <Square className="w-4 h-4 mr-2 text-red-500" fill="currentColor" />
                        Stop Recording
                      </button>
                    </div>
                  )}

                  {/* Saved / Pre-Playback State */}
                  {audioDataUrl && (
                    <div className="w-full flex justify-between items-center bg-card border border-border p-3 rounded-xl shadow-sm">
                      <button 
                        onClick={togglePlayback}
                        className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-colors shrink-0"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </button>
                      <div className="flex-1 px-4">
                        <div className="h-2 bg-border rounded-full overflow-hidden w-full relative">
                           <div className="absolute inset-y-0 left-0 bg-primary/50 w-full rounded-full"></div>
                        </div>
                      </div>
                      <button 
                        onClick={discardRecording}
                        className="p-2 text-gray-500 hover:text-red-500 rounded-md transition-colors shrink-0"
                        title="Discard and re-record"
                      >
                        <RotateCcw className="w-5 h-5" />
                      </button>
                      
                      <audio 
                        src={audioDataUrl} 
                        ref={audioRef} 
                        className="hidden" 
                        onEnded={() => setIsPlaying(false)}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-border bg-sidebar/50 flex justify-end space-x-3 shrink-0">
              <button
                onClick={onClose}
                className="px-4 py-2 font-medium text-gray-600 dark:text-gray-400 hover:bg-border/50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(title || "Voice Note", audioDataUrl || undefined)}
                disabled={(!audioDataUrl && !isEditing)}
                className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-lg font-medium shadow-sm transition-all"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
