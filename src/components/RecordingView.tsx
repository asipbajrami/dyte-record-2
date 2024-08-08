import React, { useState } from 'react';
import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import logo from '../assets/logo.png';

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

// Dummy data for testing
const dummyParticipants = [
  { id: '1', name: 'Negative 1', presetName: NEGATIVE },
  { id: '2', name: 'Negative 2', presetName: NEGATIVE },
  { id: '3', name: 'Judge 1', presetName: JUDGE },
  { id: '4', name: 'Judge 2', presetName: JUDGE },
  { id: '5', name: 'Affirmative 1', presetName: AFFIRMATIVE },
];

// Aspect ratio and dimensions
const ASPECT_RATIO = 16 / 9;
const VIDEO_WIDTH = 500; // in pixels
const VIDEO_HEIGHT = VIDEO_WIDTH / ASPECT_RATIO;

export default function RecordingView() {
  const { meeting } = useDyteMeeting();
  const [useDummyData, setUseDummyData] = useState(false);

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const getParticipants = (presetName) => {
    if (useDummyData) {
      return dummyParticipants.filter(p => p.presetName === presetName);
    }
    return joinedParticipants.filter(p => p.presetName === presetName);
  };

  const affirmativeParticipants = getParticipants(AFFIRMATIVE);
  const negativeParticipants = getParticipants(NEGATIVE);
  const judgeParticipants = getParticipants(JUDGE);

  const renderParticipantColumn = (participants, columnStyle) => (
    <div style={columnStyle}>
      {participants.map((participant, index) => (
        <div key={participant.id} style={{
          width: `${VIDEO_WIDTH}px`,
          height: `${VIDEO_HEIGHT}px`,
          marginBottom: '10px',
          backgroundColor: '#333',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '8px',
          overflow: 'hidden',
        }}>
          {useDummyData ? (
            <div>{participant.name}</div>
          ) : (
            <DyteSimpleGrid
              participants={[participant]}
              meeting={meeting}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
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
      {/* Toggle for dummy data */}
      <div style={{ padding: '10px', textAlign: 'center' }}>
        <button onClick={() => setUseDummyData(!useDummyData)}>
          {useDummyData ? 'Use Live Data' : 'Use Dummy Data'}
        </button>
      </div>

      {/* Column Titles */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px' }}>
        <h2 style={{ color: 'red' }}>Negative</h2>
        <h2 style={{ color: 'yellow' }}>Judge</h2>
        <h2 style={{ color: 'blue' }}>Affirmative</h2>
      </div>

      <div style={{ display: 'flex', flex: 1, justifyContent: 'space-between', padding: '0 20px' }}>
        {/* Negative Column */}
        {renderParticipantColumn(negativeParticipants, { 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        })}

        {/* Center Column with Judges and Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          {judgeParticipants[0] && (
            <div style={{ width: `${VIDEO_WIDTH}px`, height: `${VIDEO_HEIGHT}px`, backgroundColor: '#333', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {useDummyData ? (
                <div>{judgeParticipants[0].name}</div>
              ) : (
                <DyteSimpleGrid
                  participants={[judgeParticipants[0]]}
                  meeting={meeting}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          )}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <img src={logo} alt="Logo" style={{
              maxWidth: '50%',
              maxHeight: '50%',
              objectFit: 'contain'
            }} />
          </div>
          {judgeParticipants[1] && (
            <div style={{ width: `${VIDEO_WIDTH}px`, height: `${VIDEO_HEIGHT}px`, backgroundColor: '#333', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              {useDummyData ? (
                <div>{judgeParticipants[1].name}</div>
              ) : (
                <DyteSimpleGrid
                  participants={[judgeParticipants[1]]}
                  meeting={meeting}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </div>
          )}
        </div>

        {/* Affirmative Column */}
        {renderParticipantColumn(affirmativeParticipants, { 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
        })}
      </div>
      {!useDummyData && <DyteParticipantsAudio meeting={meeting} />}
    </main>
  );
}