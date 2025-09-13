import { useRef } from "react";

export function useAssemblyAISpeechToText({ apiKey, onTranscript }) {
  const wsRef = useRef(null);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);

  async function start() {
    const sampleRate = 16000;
    const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=${sampleRate}&format_turns=true`;
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onopen = async () => {
      wsRef.current.send(JSON.stringify({}));
      // Use webkitAudioContext for Safari compatibility
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioCtx({ sampleRate });
      mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      const source = audioContextRef.current.createMediaStreamSource(
        mediaStreamRef.current
      );
      const processor = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );

      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        // Convert Float32Array [-1,1] to Int16Array PCM
        const pcm = new Int16Array(input.length);
        for (let i = 0; i < input.length; i++) {
          pcm[i] = Math.max(-32768, Math.min(32767, input[i] * 32767));
        }
        // Send as ArrayBuffer
        wsRef.current?.send(pcm.buffer);
      };

      source.connect(processor);
      processor.connect(audioContextRef.current.destination);
    };

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.transcript) {
        onTranscript(data.transcript);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }

  function stop() {
    wsRef.current?.close();
    audioContextRef.current?.close();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  }

  return { start, stop };
}
