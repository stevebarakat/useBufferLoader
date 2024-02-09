import { useState, useRef, useEffect } from "react";

export default function useAudioContext() {
  const audioContext = useRef<AudioContext | undefined>(undefined);
  const [audioContextInitialized, initializeAudioContext] = useState(false);

  function initContext() {
    audioContext.current = new AudioContext();
    initializeAudioContext(true);
  }

  useEffect(() => {
    if (!audioContextInitialized) {
      window.addEventListener("click", initContext);
    }
    return () => window.removeEventListener("click", initContext);
  }, [audioContextInitialized]);

  return audioContext.current;
}
