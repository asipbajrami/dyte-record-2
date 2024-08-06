import {
  DyteMixedGrid,
  DyteParticipantsAudio,
  DyteSimpleGrid,
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

  const screensharedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray().filter((p) => p.screenShareEnabled)
  );

  const hasScreenshare = screensharedParticipants.length > 0;

  useEffect(() => {
    // Ideally there should be just one participant with the preset name "LEAD"
    // Comment out if you don't want to pin the peer
    // for (const participant of targetParticipants) {
    //   participant.pin();
    // }
    targetParticipants.forEach(participant => {
      if (participant.videoTrack) {
        console.log(`Video track available for ${participant.name}`);
      } else {
        console.log(`No video track for ${participant.name}`);
      }
    });
  }, [targetParticipants]);

  return (
    <main
      style={{
        display: "flex",
        position: "relative",
        paddingTop: "0rem",
        flexWrap: "wrap",
        flexShrink: "0",
        justifyContent: "center",
        alignContent: "center",
        width: "100vw",
        height: "100vh",
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      {hasScreenshare ? (
        <DyteMixedGrid
          participants={targetParticipants}
          pinnedParticipants={targetParticipants}
          screenShareParticipants={screensharedParticipants}
          plugins={[]}
          meeting={meeting}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      ) : (
        <DyteMixedGrid
        participants={targetParticipants}
        pinnedParticipants={targetParticipants}
        screenShareParticipants={screensharedParticipants}
        plugins={[]}
        meeting={meeting}
        style={{
          width: "100vw",
          height: "100vh",
        }}
      />
      )}

      <DyteParticipantsAudio meeting={meeting} />
    </main>
    
  );
}
