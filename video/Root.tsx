import { Composition } from 'remotion'
import { ConveyorScene } from './ConveyorScene'

export function VideoRoot() {
  return (
    <>
      <Composition
        id="KseConveyor"
        component={ConveyorScene}
        durationInFrames={96}
        fps={24}
        width={1440}
        height={810}
      />
      <Composition
        id="KseConveyorMobile"
        component={ConveyorScene}
        defaultProps={{ mobile: true }}
        durationInFrames={96}
        fps={24}
        width={750}
        height={1334}
      />
    </>
  )
}
