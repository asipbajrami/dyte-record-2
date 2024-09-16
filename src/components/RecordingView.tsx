import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

const presetColors = {
  [AFFIRMATIVE]: '#4a90e2', // Soft blue
  [NEGATIVE]: '#e57373',    // Soft red
  [JUDGE]: '#ffd54f',       // Soft yellow
};

export default function RecordingView() {
  const { meeting } = useDyteMeeting();
  const [participants, setParticipants] = useState<DyteParticipant[]>([]);

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  useEffect(() => {
    setParticipants(joinedParticipants);

    const handleParticipantJoin = (participant: DyteParticipant) => {
      setParticipants(prev => [...prev, participant]);
    };

    const handleParticipantLeave = (participant: DyteParticipant) => {
      setParticipants(prev => prev.filter(p => p.id !== participant.id));
    };

    meeting.participants.joined.on('participantJoined', handleParticipantJoin);
    meeting.participants.joined.on('participantLeft', handleParticipantLeave);

    return () => {
      meeting.participants.joined.off('participantJoined', handleParticipantJoin);
      meeting.participants.joined.off('participantLeft', handleParticipantLeave);
    };
  }, [meeting, joinedParticipants]);

  const getParticipantsByPreset = (presetName: string): DyteParticipant[] => {
    return participants.filter(p => p.presetName === presetName);
  };

  const renderParticipantColumn = (presetName: string) => {
    const presetParticipants = getParticipantsByPreset(presetName);
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-evenly',
      }}>
        {presetParticipants.map((participant) => (
          <div key={participant.id} style={{
            height: `${90 / Math.max(presetParticipants.length, 1)}%`,
            marginBottom: '10px',
            border: `2px solid ${presetColors[presetName]}`,
            borderRadius: '8px',
            overflow: 'hidden',
          }}>
            <DyteSimpleGrid
              participants={[participant]}
              meeting={meeting}
              style={{ height: '100%' }}
            />
          </div>
        ))}
      </div>
    );
  };

  const judgeParticipants = getParticipantsByPreset(JUDGE);

  return (
    <main style={{
      display: "flex",
      flexDirection: "column",
      width: "100vw",
      height: "100vh",
      backgroundColor: '#1a1a1a',
      color: 'white',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <h2 style={{ color: presetColors[NEGATIVE] }}>Negative</h2>
        <h2 style={{ color: presetColors[JUDGE] }}>Judge</h2>
        <h2 style={{ color: presetColors[AFFIRMATIVE] }}>Affirmative</h2>
      </div>

      <div style={{ display: 'flex', flex: 1, padding: '0 20px' }}>
        <div style={{ width: '30%' }}>{renderParticipantColumn(NEGATIVE)}</div>
        
        <div style={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ height: '40%', width: '100%' }}>
            {judgeParticipants[0] && (
              <div style={{
                height: '100%',
                border: `2px solid ${presetColors[JUDGE]}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <DyteSimpleGrid
                  participants={[judgeParticipants[0]]}
                  meeting={meeting}
                  style={{ height: '100%' }}
                />
              </div>
            )}
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ maxWidth: '60%', maxHeight: '60%', objectFit: 'contain' }} />
          </div>
          <div style={{ height: '40%', width: '100%' }}>
            {judgeParticipants[1] && (
              <div style={{
                height: '100%',
                border: `2px solid ${presetColors[JUDGE]}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}>
                <DyteSimpleGrid
                  participants={[judgeParticipants[1]]}
                  meeting={meeting}
                  style={{ height: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div style={{ width: '30%' }}>{renderParticipantColumn(AFFIRMATIVE)}</div>
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}