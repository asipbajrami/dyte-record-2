import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { DyteMeeting, DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

export default function RecordingView() {
  const { meeting } = useDyteMeeting();
  const [affirmativeParticipants, setAffirmativeParticipants] = useState<DyteParticipant[]>([]);
  const [negativeParticipants, setNegativeParticipants] = useState<DyteParticipant[]>([]);
  const [judgeParticipants, setJudgeParticipants] = useState<DyteParticipant[]>([]);

  const joinedParticipants = useDyteSelector((meeting: DyteMeeting) =>
    meeting.participants.joined.toArray()
  );

  useEffect(() => {
    const handleParticipantJoin = (participant: DyteParticipant) => {
      switch (participant.presetName) {
        case AFFIRMATIVE:
          setAffirmativeParticipants(prev => [...prev, participant]);
          break;
        case NEGATIVE:
          setNegativeParticipants(prev => [...prev, participant]);
          break;
        case JUDGE:
          setJudgeParticipants(prev => [...prev, participant]);
          break;
      }
    };

    const handleParticipantLeave = (participant: DyteParticipant) => {
      const removeParticipant = (setter: React.Dispatch<React.SetStateAction<DyteParticipant[]>>) => {
        setter(prev => prev.filter(p => p.id !== participant.id));
      };

      switch (participant.presetName) {
        case AFFIRMATIVE:
          removeParticipant(setAffirmativeParticipants);
          break;
        case NEGATIVE:
          removeParticipant(setNegativeParticipants);
          break;
        case JUDGE:
          removeParticipant(setJudgeParticipants);
          break;
      }
    };

    meeting.participants.joined.on('participantJoined', handleParticipantJoin);
    meeting.participants.joined.on('participantLeft', handleParticipantLeave);

    // Initial placement of already joined participants
    joinedParticipants.forEach(handleParticipantJoin);

    return () => {
      meeting.participants.joined.off('participantJoined', handleParticipantJoin);
      meeting.participants.joined.off('participantLeft', handleParticipantLeave);
    };
  }, [meeting, joinedParticipants]);

  const renderParticipantColumn = (participants: DyteParticipant[], columnStyle: React.CSSProperties) => (
    <div style={columnStyle}>
      {participants.map((participant, index) => (
        <DyteSimpleGrid
          key={participant.id}
          participants={[participant]}
          meeting={meeting}
          style={{
            height: `${100 / participants.length}%`,
            marginBottom: index < participants.length - 1 ? '10px' : '0',
          }}
        />
      ))}
    </div>
  );

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
        {renderParticipantColumn(negativeParticipants, { 
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
        {renderParticipantColumn(affirmativeParticipants, { 
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