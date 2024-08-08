import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting } from "@dytesdk/react-web-core";
import { DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

export default function RecordingView() {
  const { meeting } = useDyteMeeting();
  const [participants, setParticipants] = useState<DyteParticipant[]>([]);

  useEffect(() => {
    const handleParticipantJoin = (participant: DyteParticipant) => {
      setParticipants(prev => {
        if (!prev.some(p => p.id === participant.id)) {
          return [...prev, participant];
        }
        return prev;
      });
    };

    const handleParticipantLeave = (participant: DyteParticipant) => {
      setParticipants(prev => prev.filter(p => p.id !== participant.id));
    };

    // Set up listeners
    meeting.participants.joined.on('participantJoined', handleParticipantJoin);
    meeting.participants.joined.on('participantLeft', handleParticipantLeave);

    // Initialize with current participants
    setParticipants(meeting.participants.joined.toArray());

    return () => {
      meeting.participants.joined.off('participantJoined', handleParticipantJoin);
      meeting.participants.joined.off('participantLeft', handleParticipantLeave);
    };
  }, [meeting]);

  const getParticipantsByPreset = (presetName: string) => 
    participants.filter(p => p.presetName === presetName);

  const renderParticipantColumn = (presetName: string, columnStyle: React.CSSProperties) => {
    const presetParticipants = getParticipantsByPreset(presetName);
    return (
      <div style={columnStyle}>
        {presetParticipants.map((participant, index) => (
          <DyteSimpleGrid
            key={participant.id}
            participants={[participant]}
            meeting={meeting}
            style={{
              height: `${100 / presetParticipants.length}%`,
              marginBottom: index < presetParticipants.length - 1 ? '10px' : '0',
            }}
          />
        ))}
      </div>
    );
  };

  const judgeParticipants = getParticipantsByPreset(JUDGE);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: '#000',
        color: 'white',
      }}
    >
      {/* Column Titles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <h2 style={{ color: 'red' }}>Negative</h2>
        <h2 style={{ color: 'yellow' }}>Judge</h2>
        <h2 style={{ color: 'blue' }}>Affirmative</h2>
      </div>

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Negative Column */}
        {renderParticipantColumn(NEGATIVE, { 
          width: '33.33%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          padding: '0 10px'
        })}

        {/* Center Column with Judges and Logo */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 10px' }}>
          {judgeParticipants[0] && (
            <DyteSimpleGrid
              participants={[judgeParticipants[0]]}
              meeting={meeting}
              style={{ height: '40%' }}
            />
          )}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <img src={logo} alt="Logo" style={{
              maxWidth: '40%',
              maxHeight: '40%',
              objectFit: 'contain'
            }} />
          </div>
          {judgeParticipants[1] && (
            <DyteSimpleGrid
              participants={[judgeParticipants[1]]}
              meeting={meeting}
              style={{ height: '40%' }}
            />
          )}
        </div>

        {/* Affirmative Column */}
        {renderParticipantColumn(AFFIRMATIVE, { 
          width: '33.33%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'flex-start',
          padding: '0 10px'
        })}
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}