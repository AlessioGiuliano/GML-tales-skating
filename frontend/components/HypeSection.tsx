import React from 'react';
import { HypeSectionProps } from '../types';

const HypeSection: React.FC<HypeSectionProps> = ({ races }) => {
    const topRaces = [...races]
        .sort((a, b) => b.hype_score - a.hype_score)
        .slice(0, 3);

    return (
        <section className="animate-fadeInUp" style={{animationDelay: '300ms'}}>
            <h2 className="text-3xl font-extrabold uppercase mb-6">Top 3 Most Hyped Races</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {topRaces.map((race, index) => {
                    const videoId = race.video_url.split('/embed/')[1]?.split('?')[0];
                    return (
                        <div key={race.id} className="rounded-xl overflow-hidden relative group aspect-video shadow-lg border border-white/10" style={{
                            animation: `fadeInUp 0.5s ease-out ${index * 0.1 + 0.3}s both`,
                        }}>
                            <img
                                src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                alt={race.title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-4 w-full">
                                <h3 className="font-bold text-lg leading-tight">{race.title}</h3>
                                <p className="text-sm font-bold text-yellow-400">Hype Score: {race.hype_score.toFixed(1)}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default HypeSection;
