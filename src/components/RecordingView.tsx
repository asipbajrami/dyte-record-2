import { DyteSimpleGrid } from "@dytesdk/react-ui-kit";
import {
  DyteParticipantsAudio,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect } from "react";

const TARGET_PRESET = "livestream_host";

export default function RecordingView() {
  const { meeting } = useDyteMeeting();

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
  );

  const targetParticipants = joinedParticipants.filter(
    (participant) => participant.presetName === TARGET_PRESET
  );

  useEffect(() => {
    targetParticipants.forEach(participant => {
      if (participant.videoTrack) {
        console.log(`Video track available for ${participant.name}`);
      } else {
        console.log(`No video track for ${participant.name}`);
      }
    });
  }, [targetParticipants]);

  const renderColumn = (title: string, participants: any[]) => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '33%',
      height: '100%',
      padding: '10px',
      boxSizing: 'border-box',
    }}>
      <h2 style={{ textAlign: 'center', color: 'white' }}>{title}</h2>
      <DyteSimpleGrid
        participants={participants}
        meeting={meeting}
        style={{
          width: '100%',
          height: 'calc(100% - 40px)', // Adjust for the title
        }}
      />
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
      {renderColumn("Affirmative", targetParticipants)}
      {renderColumn("Judge", [])}
      {renderColumn("Negative", [])}
      <DyteParticipantsAudio meeting={meeting} />
    </main>
  );
}