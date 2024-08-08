import {
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect } from "react";

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

  }, []);

  const renderColumn = (title: string, participants: any[]) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '33.33%',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
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
        position: "relative",
        width: "100vw",
        height: "100vh",
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
      }}
    >
      {renderColumn("Negative", negativeParticipants)}
      {renderColumn("Judge", judgeParticipants)}
      {renderColumn("Affirmative", affrimativeParticipants)}
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}