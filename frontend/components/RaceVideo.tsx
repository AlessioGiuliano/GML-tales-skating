import React from 'react';
import { RaceVideoProps } from '../types';

const RaceVideo: React.FC<RaceVideoProps> = ({ url, title }) => {
    return (
        <div className="aspect-video rounded-lg overflow-hidden shadow-lg border border-white/10">
            <iframe
                className="w-full h-full"
                src={url}
                title={title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
        </div>
    );
};

export default RaceVideo;
