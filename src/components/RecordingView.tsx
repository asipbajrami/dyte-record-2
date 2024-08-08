import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect } from "react";
import logo from '../assets/logo.png'; // Import the logo

const AFFIRMATIVE = "affirmative";
const NEGATIVE = "negative";
const JUDGE = "judge";

export default function RecordingView() {
  const { meeting } = useDyteMeeting();

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const affirmativeParticipants = joinedParticipants.filter(
    (participant) => participant.presetName === AFFIRMATIVE
  );
  const negativeParticipants = joinedParticipants.filter(
    (participant) => participant.presetName === NEGATIVE
  );
  const judgeParticipants = joinedParticipants.filter(
    (participant) => participant.presetName === JUDGE
  );

  const renderParticipantColumn = (participants: any[], columnStyle: React.CSSProperties) => (
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