import { useState, useRef, useEffect } from "react";
import { roxanne } from "../assets/songs";

type Track = (typeof roxanne.tracks)[0];

function useBufferLoader(
  audioContext: AudioContext | undefined,
  tracks: Track[]
) {
  const audioBuffers = useRef<(AudioBuffer | undefined)[]>([]);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    if (!audioContext) return;

    async function fetchAndDecodeAudio(path: string) {
      const response = await fetch(path);
      return audioContext?.decodeAudioData(await response.arrayBuffer());
    }

    async function createAudioBuffers(tracks: Track[]) {
      if (!tracks) return;
      for (const track of tracks) {
        try {
          const buffer: AudioBuffer | undefined = await fetchAndDecodeAudio(
            track.path
          );
          audioBuffers.current = [buffer, ...audioBuffers.current];
        } catch (err) {
          if (err instanceof Error)
            console.error(`Error: ${err.message} for file at: ${track.path} `);
        } finally {
          const files = tracks.length * 0.01;
          setLoaded((loaded) => loaded + 1 / files);
        }
      }
      setLoaded(100);
      return audioBuffers.current;
    }
    createAudioBuffers(tracks);
  }, [audioContext, tracks]);

  return { audioBuffers: audioBuffers.current, loaded: Math.ceil(loaded) };
}

export default useBufferLoader;
