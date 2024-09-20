import React, { useEffect, useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteParticipantTile,
  DyteMicToggle,
  DyteIcon,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { DyteParticipant } from '@dytesdk/web-core';
import logo from '../assets/logo.png';

const AFFIRMATIVE = 'affirmative';
const NEGATIVE = 'negative';
const JUDGE = 'judge';

// Define the PresetName type
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
      setParticipants((prev) => [...prev, participant]);
    };

    const handleParticipantLeave = (participant: DyteParticipant) => {
      setParticipants((prev) => prev.filter((p) => p.id !== participant.id));
    };

    meeting.participants.joined.on('participantJoined', handleParticipantJoin);
    meeting.participants.joined.on('participantLeft', handleParticipantLeave);

    return () => {
      meeting.participants.joined.off(
        'participantJoined',
        handleParticipantJoin
      );
      meeting.participants.joined.off(
        'participantLeft',
        handleParticipantLeave
      );
    };
  }, [meeting, joinedParticipants]);

  const getParticipantsByPreset = (
    presetName: PresetName
  ): DyteParticipant[] => {
    return participants.filter((p) => p.presetName === presetName);
  };

  // Updated ParticipantTile component with custom name tag
  const ParticipantTile = ({
    participant,
    presetName,
  }: {
    participant: DyteParticipant;
    presetName: PresetName;
  }) => {
    return (
      <div
        key={participant.id}
        style={{
          width: '100%',
          position: 'relative',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', // 16:9 aspect ratio
          }}
        >
          <DyteParticipantTile
            participant={participant}
            meeting={meeting}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            {/* Custom Name Tag */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                backgroundColor: presetColors[presetName],
                color: 'white',
                padding: '5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              {/* Display participant's name */}
              <div>{participant.name}</div>
              {participant.id === meeting.self.id ? (
                <DyteMicToggle size="sm" meeting={meeting} />
              ) : (
                <DyteIcon
                  icon={participant.audioEnabled ? 'mic' : 'mic_off'}
                  style={{ color: 'white' }}
                />
              )}
            </div>
          </DyteParticipantTile>
        </div>
      </div>
    );
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
          display: 'grid',
          gridTemplateRows: `repeat(${presetParticipants.length}, 1fr)`,
          gap: '10px',
        }}
      >
        {presetParticipants.map((participant) => (
          <ParticipantTile
            key={participant.id}
            participant={participant}
            presetName={presetName}
          />
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
        overflow: 'hidden',
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
            display: 'grid',
            gridTemplateRows: `repeat(${judgeParticipants.length}, 1fr)`,
            gap: '10px',
            padding: '10px',
            position: 'relative',
          }}
        >
          {judgeParticipants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
              presetName={JUDGE}
            />
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
