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

  useEffect(() => {
    // Any side effects can be added here
  }, []);

  const renderParticipantGrid = (participants: any[], gridStyle: React.CSSProperties) => (
    <DyteSimpleGrid
      participants={participants}
      meeting={meeting}
      style={gridStyle}
    />
  );

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: '#000',
      }}
    >
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Negative Column */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ textAlign: 'center', color: 'red' }}>Negative</h2>
          {renderParticipantGrid(negativeParticipants, { flex: 1 })}
        </div>

        {/* Center Column with Judge and Logo */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ textAlign: 'center', color: 'yellow' }}>Judge</h2>
          {renderParticipantGrid(judgeParticipants, { height: '30%' })}
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
        </div>

        {/* Affirmative Column */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ textAlign: 'center', color: 'blue' }}>Affirmative</h2>
          {renderParticipantGrid(affirmativeParticipants, { flex: 1 })}
        </div>
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}