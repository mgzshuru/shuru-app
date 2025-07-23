"use client"
import Image from 'next/image';
import { useState } from 'react';
import { Play } from 'lucide-react';
import { VideoEmbedBlock } from '@/lib/types';

interface VideoEmbedProps {
  video_url: string;
  title?: string;
  description?: string;
  thumbnail?: VideoEmbedBlock['thumbnail'];
  autoplay?: boolean;
}

export function VideoEmbed({
  video_url,
  title,
  description,
  thumbnail,
  autoplay = false
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(autoplay);

  // Extract video ID and platform
  const getVideoData = (url: string) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}${autoplay ? '?autoplay=1' : ''}`
      };
    }

    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}${autoplay ? '?autoplay=1' : ''}`
      };
    }

    return {
      platform: 'other',
      id: null,
      embedUrl: url
    };
  };

  const videoData = getVideoData(video_url);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div className="my-12 max-w-4xl mx-auto">
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-gray-600 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        {!isPlaying && thumbnail ? (
          <div className="relative w-full h-full group cursor-pointer" onClick={handlePlay}>
            <Image
              src={thumbnail.url}
              alt={title || 'Video thumbnail'}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 group-hover:bg-white rounded-full p-4 shadow-lg transform group-hover:scale-110 transition-all duration-300">
                <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={videoData.embedUrl}
            title={title || 'Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
}