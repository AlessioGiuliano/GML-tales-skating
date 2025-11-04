import React, { useState } from 'react';
import { CompetitionDetailProps, Qualifier, Race, Stat, TeamStatComparison, EventStage, Team } from '../types';
import TheEdge from './TheEdge';
import CountryFlag from './CountryFlag';

const ArrowLeftIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
  </svg>
);

const QualifierPill: React.FC<{qualifier: Qualifier; selectedTeam: Team; position: number}> = ({ qualifier, selectedTeam, position }) => {
    const isProfileTeam = qualifier.country === selectedTeam.country;
    
    const nameParts = qualifier.name.split(' ');
    const lastName = nameParts.length > 1 ? nameParts.pop()!.toUpperCase() : qualifier.name.toUpperCase();
    const firstName = nameParts.join(' ');

    return (
        <li 
            className={`flex justify-between items-center text-sm p-2 rounded-lg transition-all duration-300 ${isProfileTeam ? 'shadow-lg' : 'opacity-90'}`}
            style={{ 
                backgroundColor: isProfileTeam ? selectedTeam.bgColor : 'rgba(255, 255, 255, 0.1)',
                color: isProfileTeam ? selectedTeam.textColor : '#FFFFFF'
            }}
        >
            <div className="flex items-center gap-2 truncate">
                <CountryFlag country={qualifier.country} className="text-lg" />
                <span className="font-bold w-4 text-center opacity-80">{position}.</span>
                <span className="truncate">
                    {firstName} <strong>{lastName}</strong>
                </span>
            </div>
            <span className="font-mono text-xs opacity-90 flex-shrink-0">{qualifier.time}</span>
        </li>
    )
}

const CompetitionFlow: React.FC<{stages: EventStage[], selectedTeam: Team}> = ({ stages, selectedTeam }) => (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.1s'}}>
        <h2 className="text-2xl font-extrabold mb-4 uppercase">Competition Flow</h2>
        <div className="flex overflow-x-auto pb-4 -mb-4 gap-4" style={{'scrollbarWidth': 'none', 'msOverflowStyle': 'none'}}>
            {stages.map((stage, i) => (
                <div key={i} className="flex-shrink-0 w-72 rounded-xl p-4" style={{ backgroundColor: 'rgba(0,0,0,0.15)', backdropFilter: 'blur(10px)' }}>
                    <h3 className="font-bold mb-3">{stage.name}</h3>
                    <ul className="space-y-2">
                        {stage.topQualifiers.map((qualifier, index) => <QualifierPill key={qualifier.name} qualifier={qualifier} selectedTeam={selectedTeam} position={index + 1}/>)}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);


const RacePlayer: React.FC<{ race: Race; delay: number }> = ({ race, delay }) => {
    const [isPlaying, setIsPlaying] = useState(false);

    if (isPlaying) {
        return (
             <div className="rounded-xl overflow-hidden aspect-video" style={{ 
                animation: `fadeInUp 0.5s ease-out ${delay}s both`,
            }}>
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${race.videoId}?autoplay=1&modestbranding=1&rel=0`}
                    title={race.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        )
    }

    return (
        <div 
            className="rounded-xl p-4 cursor-pointer group relative aspect-video flex flex-col justify-between"
            style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
                animation: `fadeInUp 0.5s ease-out ${delay}s both`,
                backgroundImage: `url(https://img.youtube.com/vi/${race.videoId}/hqdefault.jpg)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
            onClick={() => setIsPlaying(true)}
        >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-300 rounded-xl"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white/80" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.748 1.295 2.536 0 3.284L7.279 20.99c-1.25.72-2.779-.217-2.779-1.643V5.653Z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
            <h4 className="font-bold relative z-10">{race.title}</h4>
            <div className="relative z-10 text-xs self-start">
                <span className="px-2 py-1 rounded bg-white/10">Watch Now</span>
            </div>
        </div>
    );
};

const RacesSection: React.FC<{races: Race[]}> = ({ races }) => (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.2s'}}>
        <h2 className="text-2xl font-extrabold mb-4 uppercase">Races</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {races.map((race, i) => <RacePlayer key={race.videoId} race={race} delay={0.3 + i * 0.1} />)}
        </div>
    </div>
);

const StatCard: React.FC<{ title: string; value: string; delay: number }> = ({ title, value, delay }) => (
    <div className="rounded-xl p-4" style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        border: `1px solid rgba(255, 255, 255, 0.1)`,
        animation: `fadeInUp 0.5s ease-out ${delay}s both`,
    }}>
        <p className="text-sm opacity-70 uppercase">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
    </div>
);

const StatsDashboard: React.FC<{stats: Stat[], teamStats: TeamStatComparison[], selectedTeam: Team}> = ({ stats, teamStats, selectedTeam }) => (
    <div className="animate-fadeInUp" style={{ animationDelay: '0.3s'}}>
        <h2 className="text-2xl font-extrabold mb-4 uppercase">Stats Dashboard</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => <StatCard key={stat.title} title={stat.title} value={stat.value} delay={0.4 + i * 0.05} />)}
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: '0.5s'}}>
            <h3 className="text-xl font-bold mb-4 uppercase">
                {selectedTeam.name} vs The Average
            </h3>
            <div className="rounded-xl p-6" style={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                border: `1px solid rgba(255, 255, 255, 0.1)`,
            }}>
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                    {teamStats.map((stat) => (
                        <div key={stat.metric} className="flex justify-between items-baseline border-b border-white/10 pb-2">
                            <span className="text-sm opacity-80">{stat.metric}</span>
                            <div className="text-right">
                                <span className="font-bold">{stat.teamValue}</span>
                                <span className={`ml-2 text-xs font-normal ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                                    ({stat.delta})
                                </span>
                            </div>
                       </div>
                    ))}
               </div>
            </div>
        </div>
    </div>
)


const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ competition, selectedTeam, onBack }) => {
  const { stages = [], races = [], stats = [], teamStats = [] } = competition;
    
  return (
    <div className="p-4 sm:p-8 animate-fadeIn relative overflow-hidden flex-grow">
        <TheEdge />
        <div className="relative z-10">
            <main className="max-w-7xl mx-auto">
                {/* Page Header */}
                <div className="flex items-center mb-12 animate-fadeInUp" style={{ animationDelay: '0s' }}>
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors mr-4" aria-label="Back to schedule">
                        <ArrowLeftIcon className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-display font-extrabold uppercase">{competition.title}: {competition.location}</h1>
                        <p className="text-white/80">{competition.date}</p>
                    </div>
                </div>
                
                {/* Main Content Sections */}
                <div className="flex flex-col gap-12">
                    {stages.length > 0 && <CompetitionFlow stages={stages} selectedTeam={selectedTeam} />}
                    {races.length > 0 && <RacesSection races={races} />}
                    {stats.length > 0 && teamStats.length > 0 && <StatsDashboard stats={stats} teamStats={teamStats} selectedTeam={selectedTeam} />}
                </div>

            </main>
        </div>
    </div>
  );
};

export default CompetitionDetail;