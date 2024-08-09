import {
  DyteMixedGrid,
  DyteParticipantsAudio,
  DyteSimpleGrid,
} from "@dytesdk/react-ui-kit";
import { useDyteMeeting, useDyteSelector } from "@dytesdk/react-web-core";
import { useEffect } from "react";


export default function RecordingView() {
  const { meeting } = useDyteMeeting();

  const joinedParticipants = useDyteSelector((meeting) =>
    meeting.participants.joined.toArray()
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
  }, [joinedParticipants]);

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
      }}
    >
      {hasScreenshare ? (
        <DyteMixedGrid
          participants={joinedParticipants}
          pinnedParticipants={joinedParticipants}
          screenShareParticipants={screensharedParticipants}
          plugins={[]}
          meeting={meeting}
          style={{
            width: "100vw",
            height: "100vh",
          }}
        />
      ) : (
        <DyteSimpleGrid
          participants={joinedParticipants}
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