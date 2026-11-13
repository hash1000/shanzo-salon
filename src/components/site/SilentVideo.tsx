'use client';

import { useEffect, useRef, type VideoHTMLAttributes } from 'react';
import './silent-video.css';

type Props = Omit<VideoHTMLAttributes<HTMLVideoElement>, 'controls' | 'autoPlay' | 'muted' | 'loop' | 'playsInline' | 'preload'>;

export default function SilentVideo(props: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const silence = () => {
      video.defaultMuted = true;
      video.muted = true;
      if (video.volume !== 0) video.volume = 0;
    };
    const resume = () => {
      silence();
      if (!document.hidden && video.paused) void video.play().catch(() => {
        // Mobile power-saving policies can defer autoplay until playback is allowed.
      });
    };
    silence();
    resume();
    video.addEventListener('volumechange', silence);
    video.addEventListener('canplay', resume);
    document.addEventListener('visibilitychange', resume);
    return () => {
      video.removeEventListener('volumechange', silence);
      video.removeEventListener('canplay', resume);
      document.removeEventListener('visibilitychange', resume);
    };
  }, [props.src]);

  return <video {...props} ref={ref} data-silent-video autoPlay muted loop playsInline controls={false}
    preload="auto" disablePictureInPicture disableRemotePlayback
    controlsList="nodownload nofullscreen noremoteplayback" tabIndex={-1}
    style={{ ...props.style, pointerEvents: 'none' }} />;
}
