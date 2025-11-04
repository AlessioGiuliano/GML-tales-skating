import React from 'react';
import { PhaseListProps } from '../types';
import RaceVideo from './RaceVideo';
import RaceResults from './RaceResults';

const PhaseList: React.FC<PhaseListProps> = ({ phases, selectedTeam }) => {
    return (
        <section className="animate-fadeInUp" style={{animationDelay: '200ms'}}>
            {phases.map(phase => (
                <div key={phase.name} className="mb-12">
                    <h2 className="text-3xl font-extrabold uppercase mb-6 border-b-2 border-blue-400 pb-2">{phase.name}</h2>
                    {phase.races.map(race => {
                        const summary = race.personalized_summaries[selectedTeam];
                        return (
                            <div key={race.id} className="mb-10 p-4 sm:p-6 rounded-lg" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                                <h3 className="text-2xl font-bold mb-4">{race.title}</h3>
                                {summary && (
                                    <div className="mb-6 p-4 rounded-md text-sm" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                                        <h4 className="font-bold text-base">{summary.title}</h4>
                                        <p className="text-white/80">{summary.text}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                    <div>
                                        <h4 className="text-xl font-semibold mb-3">Race Video</h4>
                                        <RaceVideo url={race.video_url} title={race.title} />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold mb-3">Results</h4>
                                        <RaceResults results={race.results} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </section>
    );
};

export default PhaseList;
