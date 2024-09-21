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
const SOLO = 'solo';

type PresetName = typeof AFFIRMATIVE | typeof NEGATIVE | typeof JUDGE | typeof SOLO;

const presetColors: { [key in PresetName]: string } = {
  [AFFIRMATIVE]: '#043B6D', // Blue
  [NEGATIVE]: '#641316', // Red
  [JUDGE]: '#0D0B0E', // Black
  [SOLO]: '#471a55', // Purple
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

  const getParticipantsByPreset = (
    presetNames: PresetName | PresetName[]
  ): DyteParticipant[] => {
    const names = Array.isArray(presetNames) ? presetNames : [presetNames];
    return participants.filter(
      (p) => p.presetName && names.includes(p.presetName as PresetName)
    );
  };

  // ParticipantTile component with DyteNameTag and DyteAudioVisualizer
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
            <DyteNameTag
              participant={participant}
              style={{
                backgroundColor: presetColors[presetName],
                color: 'white',
              }}
            >
              {/* Audio Visualizer */}
              <DyteAudioVisualizer participant={participant} slot="start" />
            </DyteNameTag>
          </DyteParticipantTile>
        </div>
      </div>
    );
  };

  const renderParticipantColumn = (
    presetNames: PresetName | PresetName[],
    columnStyle: React.CSSProperties
  ) => {
    const presetParticipants = getParticipantsByPreset(presetNames);

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
            presetName={participant.presetName as PresetName}
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
              presetName={participant.presetName as PresetName}
            />
          ))}
        </div>

        {/* Affirmative and Solo Column */}
        {renderParticipantColumn([AFFIRMATIVE, SOLO], {
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
