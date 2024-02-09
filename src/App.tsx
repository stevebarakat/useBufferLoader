import { useRef, useState } from "react";
import { justDance, roxanne } from "./assets/songs";
import useBufferLoader from "./hooks/useBufferLoader";
import useAudioContext from "./hooks/useAudioContext";

type SourceSong = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  year: string;
  studio: string;
  location: string;
  bpm: number;
  tracks: SourceTrack[];
};

type SourceTrack = {
  id: string;
  name: string;
  path: string;
};

function App() {
  const [sourceSong, setSourceSong] = useState<SourceSong | undefined>(
    undefined
  );
  const audioContext = useAudioContext();
  const audioBufferSourceNodes = useRef<(AudioBufferSourceNode | undefined)[]>(
    []
  );

  const tracks = sourceSong?.tracks;

  const { audioBuffers, loaded } = useBufferLoader(audioContext, tracks);

  function loadSong(e: React.FormEvent<HTMLSelectElement>): void {
    console.log("e.currentTarget.value", e.currentTarget.value);
    const songSlug = e.currentTarget.value;
    switch (songSlug) {
      case "":
        break;

      case "roxanne":
        setSourceSong(roxanne);
        break;

      case "justDance":
        setSourceSong(justDance);
        break;

      default:
        break;
    }
  }

  if (!sourceSong) {
    return (
      <select onChange={loadSong}>
        <option value="">Choose a song:</option>
        <option value="roxanne">The Police - Roxanne</option>
        <option value="justDance">Lady Gaga - Just Dance</option>
      </select>
    );
  } else if (loaded >= 100) {
    return (
      <div className="flex-y">
        <div className="flex">
          {tracks?.map((track) => (
            <div key={track.id} className="track">
              {track.name}
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <>
        <label htmlFor="loaded">{`${loaded}%`}</label>
        <progress id="loaded" max="100" value={loaded} />
      </>
    );
  }
}

export default App;
