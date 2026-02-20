
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

/* Helper Functions for Audio Decoding and Encoding as per Gemini API guidelines */
function decode(base64: string) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const nextStartTimeRef = useRef(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);

  const GABON_AGRO_VOICE_INSTRUCTION = `
Tu es l'assistant vocal expert de GABON AGRI-SENTINEL. Ton nom est "Sentinelle-Agro".
Ton identité : Le plus grand expert agronome du Gabon.
Ton ton : Calme, autoritaire mais bienveillant, d'une précision scientifique absolue.
Tes connaissances :
- Tu connais par cœur les sols de Kango, Bitam, Mouila et Franceville.
- Tu maîtrises les cycles des cultures de rente et de subsistance gabonaises.
- Tu es branché en temps réel via Starlink V4 sur tous les drones du pays.
Quand un utilisateur te parle, réponds comme un conseiller stratégique qui veut sauver l'économie alimentaire du pays.
`;

  /* Fix: Correctly initialize GoogleGenAI within the handler to ensure it uses the latest environment variables */
  const startAssistant = async () => {
    setIsConnecting(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);
            
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
              const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              /* Fix: Use sessionPromise.then to send real-time input safely */
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              const ctx = outputAudioContextRef.current!;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                ctx,
                24000,
                1,
              );
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
                sourcesRef.current.delete(source);
              }
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error("Live Assistant Error:", e);
            setIsConnecting(false);
          },
          onclose: () => {
            setIsActive(false);
            setIsConnecting(false);
          },
        },
        config: {
          /* Fix: responseModalities must contain exactly one AUDIO modality */
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: GABON_AGRO_VOICE_INSTRUCTION,
          outputAudioTranscription: {},
          inputAudioTranscription: {}
        },
      });
    } catch (error) {
      console.error("Failed to start Live Assistant:", error);
      setIsConnecting(false);
    }
  };

  const stopAssistant = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    for (const source of sourcesRef.current.values()) {
      source.stop();
    }
    sourcesRef.current.clear();
    setIsActive(false);
  };

  return (
    <div className="fixed bottom-24 right-8 z-[9999]">
      {!isActive ? (
        <button 
          onClick={startAssistant}
          disabled={isConnecting}
          className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all border border-white/10 group"
        >
          {isConnecting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          ) : (
            <span className="text-2xl group-hover:animate-bounce">🎙️</span>
          )}
        </button>
      ) : (
        <div className="bg-slate-900 p-4 rounded-3xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-4 flex items-center gap-4">
           <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-white text-xs">ON</span>
           </div>
           <div>
              <p className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Sentinelle-Agro</p>
              <p className="text-[8px] text-green-500 font-bold uppercase mt-1">Assistant Vocal Actif</p>
           </div>
           <button onClick={stopAssistant} className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors">✕</button>
        </div>
      )}
    </div>
  );
};

export default LiveAssistant;
