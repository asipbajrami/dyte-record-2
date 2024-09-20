import { DyteParticipantTile, DyteNameTag, DyteAudioVisualizer } from "@dytesdk/react-ui-kit";
import { DyteParticipant } from '@dytesdk/web-core';

export default function MyMeetingUI({ participant }: { participant: DyteParticipant }) {
  return (
    <DyteParticipantTile participant={participant}>
      <DyteNameTag participant={participant} style={{ backgroundColor: 'red', color: 'white' }}>
      <DyteAudioVisualizer slot="start" />
      </DyteNameTag>
    </DyteParticipantTile>
  );
}
