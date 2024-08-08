import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
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
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {renderParticipantGrid(negativeParticipants, { height: '50%' })}
        </div>

        {/* Center Column with Judges and Logo */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {judgeParticipants[0] && renderParticipantGrid([judgeParticipants[0]], { height: '25%' })}
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center'
          }}>
            <img src={logo} alt="Logo" style={{
              maxWidth: '80%',
              maxHeight: '80%',
              objectFit: 'contain'
            }} />
          </div>
          {judgeParticipants[1] && renderParticipantGrid([judgeParticipants[1]], { height: '25%' })}
        </div>

        {/* Affirmative Column */}
        <div style={{ width: '33.33%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {renderParticipantGrid(affirmativeParticipants, { height: '50%' })}
        </div>
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}