
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";
export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: {
      second: 0,
      minute: 0,
    },
    totalTime: {
      second: 0,
      minute: 0,
    },
  });

  const play = () => {
    if (audioRef.current) {
      audioRef.current.play();
      setPlayStatus(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlayStatus(false);
    }
  };

  const playWithId = async (id) => {
    if (audioRef.current) {
      await setTrack(songsData[id]);
      await audioRef.current.play();
      setPlayStatus(true);
    }
  };
const previous=async()=>{
    if(track.id>0){
        await setTrack(songsData[track.id-1]);
        await audioRef.current.play();
        setPlayStatus(true)
    }
}
const next=async()=>{
    if(track.id<songsData.length-1){
        await setTrack(songsData[track.id+1]);
        await audioRef.current.play();
        setPlayStatus(true)
    }
}

// const seekSong=async(e)=>{
//     audioRef.current.currentTime=((e.nativeEvent.offsetX/ seekSong.current.offsetWidth
//     )*audioRef.current.duration

//     )

// }
const seekSong = async (e) => {
    if (seekBg.current) {
      const clickPosition = e.nativeEvent.offsetX;
      const seekWidth = seekBg.current.offsetWidth;
      const duration = audioRef.current.duration;
  
      // Calculate the new time
      audioRef.current.currentTime = (clickPosition / seekWidth) * duration;
    }
  };
  
  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        seekBar.current.style.width =
          (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";

        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60),
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60),
          },
        });
      }
    };

    const audio = audioRef.current;
    if (audio) {
      audio.ontimeupdate = handleTimeUpdate;
    }

    return () => {
      if (audio) {
        audio.ontimeupdate = null; // Clean up listener
      }
    };
  }, [audioRef]);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children} {/* Corrected from props.childern */}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;





