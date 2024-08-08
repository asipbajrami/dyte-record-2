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

  const affrimativeParticipants = joinedParticipants.filter(
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

  const renderColumn = (title: string, participants: any[]) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '33.33%',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
      backgroundColor: '#0000',
    }}>
      <h2 style={{ textAlign: 'center', color: 'white' }}>{title}</h2>
      {participants.length > 0 && (
        <DyteSimpleGrid
          participants={participants}
          meeting={meeting}
          style={{
            width: '100%',
            height: 'calc(100% - 40px)', // Adjust for the title
          }}
        />
      )}
    </div>
  );

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        backgroundColor: '#0000',
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        <img src={logo} alt="Logo" style={{
          maxWidth: '150px',
          maxHeight: '100px',
        }} />
      </div>
      <div style={{
        display: 'flex',
        flex: 1,
      }}>
        {renderColumn("Negative", negativeParticipants)}
        {renderColumn("Judge", judgeParticipants)}
        {renderColumn("Affirmative", affrimativeParticipants)}
      </div>
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}