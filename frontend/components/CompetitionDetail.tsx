import React, { useState, useEffect } from 'react';
import { CompetitionData, CompetitionDetailProps } from '../types';
import { fetchCompetitionData } from '../api';
import CompetitionHeader from './CompetitionHeader';
import CompetitionSummary from './CompetitionSummary';
import PhaseList from './PhaseList';
import HypeSection from './HypeSection';
import BracketTournamentView from "./BracketTournamentView";

const CompetitionDetail: React.FC<CompetitionDetailProps> = ({ selectedTeam, year, location, category }) => {
    const [data, setData] = useState<CompetitionData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const competitionData = await fetchCompetitionData(year, location, category);
                setData(competitionData);
            } catch (err) {
                setError('Failed to fetch competition data.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [year, location, category, selectedTeam]);

    if (loading) return <div className="text-center p-12 text-xl font-semibold animate-pulse">Loading competition data...</div>;
    if (error) return <div className="text-center p-12 text-xl text-red-400">{error}</div>;
    if (!data) return <div className="text-center p-12">No data available.</div>;

    const { competition } = data;
    const personalizedSummary = competition.personalized_summaries[selectedTeam];

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8 animate-fadeIn">
            <CompetitionHeader
                name={competition.name}
                location={competition.location}
                dates={competition.dates}
                season={competition.season}
            />

            <CompetitionSummary summary={personalizedSummary} />

            <div className="my-12 border-t border-white/20"></div>

            <BracketTournamentView competition={competition} />

            <div className="my-12 border-t border-white/20"></div>

            <PhaseList phases={competition.phases} selectedTeam={selectedTeam} />

            <div className="my-12 border-t border-white/20"></div>

            <HypeSection races={competition.phases.flatMap(p => p.races)} />
        </div>
    );
};

export default CompetitionDetail;