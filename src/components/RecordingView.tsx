import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { DyteParticipant } from '@dytesdk/web-core';
import MyMeetingUI from './MyMeetingUI'; // Import your custom component
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

type PresetName = typeof AFFIRMATIVE | typeof NEGATIVE | typeof JUDGE;

const presetColors: { [key in PresetName]: string } = {
  [AFFIRMATIVE]: '#4a90e2', // Blue
  [NEGATIVE]: '#e57373',    // Red
  [JUDGE]: '#ffd54f',       // Yellow
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
    return (
      <div style={columnStyle}>
        {presetParticipants.map((participant, index) => (
          <div key={participant.id} style={{
            height: `${100 / presetParticipants.length}%`,
            marginBottom: index < presetParticipants.length - 1 ? '10px' : '0',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative',
          }}>
            {/* Replace DyteSimpleGrid with MyMeetingUI */}
            <MyMeetingUI participant={participant} />
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '5px 10px',
              borderRadius: '4px',
              fontSize: '14px',
              color: presetColors[presetName],
            }}>
              {participant.name}
            </div>
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
              <MyMeetingUI participant={participant} />
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
