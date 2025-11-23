import { CanvasContainer } from '@/components/CanvasContainer'
import { UIOverlay } from '@/components/UIOverlay'

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <CanvasContainer />
      <UIOverlay />
    </main>
  )
}
