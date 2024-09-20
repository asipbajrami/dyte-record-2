import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteParticipantTile,
  DyteNameTag,
  DyteAudioVisualizer,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

type PresetName = typeof AFFIRMATIVE | typeof NEGATIVE | typeof JUDGE;

const presetColors: { [key in PresetName]: string } = {
  [AFFIRMATIVE]: '#4a90e2', // Blue
  [NEGATIVE]: '#e57373',    // Red
  [JUDGE]: '#000000',       // Yellow
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

  const getParticipantsByPreset = (presetName: PresetName): DyteParticipant[] => {
    return participants.filter(p => p.presetName === presetName);
  };

  const renderParticipantColumn = (presetName: PresetName, columnStyle: React.CSSProperties) => {
    const presetParticipants = getParticipantsByPreset(presetName);
    const totalParticipants = presetParticipants.length;

    return (
      <div style={columnStyle}>
        {presetParticipants.map((participant, index) => (
          <div key={participant.id} style={{
            height: totalParticipants > 1 ? `${100 / totalParticipants}%` : '50%', // Set max height if only one participant
            marginBottom: index < presetParticipants.length - 1 ? '10px' : '0',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
            maxHeight: '400px', // Prevents the participant from becoming too large
          }}>
            {/* DyteParticipantTile with custom DyteNameTag */}
            <DyteParticipantTile participant={participant} meeting={meeting} style={{ height: '100%' }}>
              <DyteNameTag
                participant={participant}
                style={{
                  backgroundColor: presetColors[presetName], // Set background color based on the preset
                  color: 'white', // Text color for contrast
                }}
              >
                <DyteAudioVisualizer slot="start" />
              </DyteNameTag>
            </DyteParticipantTile>
          </div>
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
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        {/* Negative Column */}
        {renderParticipantColumn(NEGATIVE, { 
          width: '33.33%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-evenly',
          padding: '10px'
        })}

        {/* Center Column with Judges and Logo */}
        <div style={{ 
          width: '33.33%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          padding: '10px',
          position: 'relative'
        }}>
          {judgeParticipants.map((participant, index) => (
            <div key={participant.id} style={{
              height: '40%',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: index === 0 ? '10px' : '0',
              position: 'relative',
            }}>
              <DyteParticipantTile participant={participant} meeting={meeting} style={{ height: '100%' }}>
                <DyteNameTag
                  participant={participant}
                  style={{
                    backgroundColor: presetColors[JUDGE], // Use judge color
                    color: 'white',
                  }}
                >
                  <DyteAudioVisualizer slot="start" />
                </DyteNameTag>
              </DyteParticipantTile>
            </div>
          ))}
        </div>

        {/* Affirmative Column */}
        {renderParticipantColumn(AFFIRMATIVE, { 
          width: '33.33%', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-evenly',
          padding: '10px'
        })}

        {/* Centered Logo */}
        <div style={{ 
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10
        }}>
          <img src={logo} alt="Logo" style={{
            maxWidth: '150px',
            maxHeight: '150px',
            objectFit: 'contain'
          }} />
        </div>
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}
