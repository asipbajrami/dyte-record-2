import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteParticipantTile,
  DyteNameTag,
  DyteAudioVisualizer,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = 'affirmative';
const NEGATIVE = 'negative';
const JUDGE = 'judge';

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
      setParticipants((prev) => [...prev, participant]);
    };

    const handleParticipantLeave = (participant: DyteParticipant) => {
      setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
    };

    meeting.participants.joined.on('participantJoined', handleParticipantJoin);
    meeting.participants.joined.on('participantLeft', handleParticipantLeave);

    return () => {
      meeting.participants.joined.off('participantJoined', handleParticipantJoin);
      meeting.participants.joined.off('participantLeft', handleParticipantLeave);
    };
  }, [meeting, joinedParticipants]);

  const getParticipantsByPreset = (presetName: PresetName): DyteParticipant[] => {
    return participants.filter((p) => p.presetName === presetName);
  };

  const renderParticipantColumn = (
    presetName: PresetName,
    columnStyle: React.CSSProperties
  ) => {
    const presetParticipants = getParticipantsByPreset(presetName);

    return (
      <div
        style={{
          ...columnStyle,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          overflowY: 'auto',
        }}
      >
        {presetParticipants.map((participant) => (
          <div
            key={participant.id}
            style={{
              width: '250px', // Fixed width
              height: '180px', // Fixed height
              borderRadius: '8px',
              overflow: 'hidden',
              position: 'relative',
              margin: '10px 0',
            }}
          >
            <DyteParticipantTile
              participant={participant}
              meeting={meeting}
              style={{ height: '100%', width: '100%' }}
            >
              <DyteNameTag
                participant={participant}
                style={{
                  backgroundColor: presetColors[presetName],
                  color: 'white',
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
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        color: 'white',
        overflow: 'hidden', // Prevents the page from scrolling
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Negative Column */}
        {renderParticipantColumn(NEGATIVE, {
          width: '33.33%',
          padding: '10px',
        })}

        {/* Center Column with Judges and Logo */}
        <div
          style={{
            width: '33.33%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '10px',
            position: 'relative',
            overflowY: 'auto',
          }}
        >
          {judgeParticipants.map((participant) => (
            <div
              key={participant.id}
              style={{
                width: '250px',
                height: '180px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                margin: '10px 0',
              }}
            >
              <DyteParticipantTile
                participant={participant}
                meeting={meeting}
                style={{ height: '100%', width: '100%' }}
              >
                <DyteNameTag
                  participant={participant}
                  style={{
                    backgroundColor: presetColors[JUDGE],
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
          padding: '10px',
        })}

        {/* Centered Logo */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              maxWidth: '150px',
              maxHeight: '150px',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}
