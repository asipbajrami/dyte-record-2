import React from 'react';
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

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const getParticipantsByPreset = (
    presetNames: PresetName | PresetName[]
  ): DyteParticipant[] => {
    const names = Array.isArray(presetNames) ? presetNames : [presetNames];
    return joinedParticipants.filter(
      (p) => p.presetName && names.includes(p.presetName as PresetName)
    );
  };

  // ParticipantTile component with DyteNameTag and DyteAudioVisualizer
  const ParticipantTile = React.memo(
    ({
      participant,
      presetName,
    }: {
      participant: DyteParticipant;
      presetName: PresetName;
    }) => {
      return (
        <div
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
    }
  );

  // Fetch participants by presets
  const negativeParticipants = getParticipantsByPreset(NEGATIVE);
  const affirmativeParticipants = getParticipantsByPreset(AFFIRMATIVE);
  const judgeParticipants = getParticipantsByPreset(JUDGE);
  const soloParticipants = getParticipantsByPreset(SOLO);

  // Initialize left and right columns
  const leftColumnParticipants = [...negativeParticipants];
  const rightColumnParticipants = [...affirmativeParticipants];

  // Distribute SOLO participants between left and right columns
  soloParticipants.forEach((participant, index) => {
    if (index % 2 === 0) {
      leftColumnParticipants.push(participant);
    } else {
      rightColumnParticipants.push(participant);
    }
  });

  const renderParticipantsColumn = React.useCallback(
    (participants: DyteParticipant[], columnStyle: React.CSSProperties) => {
      return (
        <div
          style={{
            ...columnStyle,
            display: 'grid',
            gridTemplateRows: `repeat(${participants.length}, 1fr)`,
            gap: '10px',
          }}
        >
          {participants.map((participant) => (
            <ParticipantTile
              key={participant.id}
              participant={participant}
              presetName={participant.presetName as PresetName}
            />
          ))}
        </div>
      );
    },
    []
  );

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
        {/* Left Column */}
        {renderParticipantsColumn(leftColumnParticipants, {
          width: '33.33%',
          padding: '10px',
        })}

        {/* Center Column with Judges */}
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

        {/* Right Column */}
        {renderParticipantsColumn(rightColumnParticipants, {
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
            zIndex: 1,
            pointerEvents: 'none',
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
