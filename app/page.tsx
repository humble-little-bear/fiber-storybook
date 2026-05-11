import { FiberStorybook } from "@/components/story/fiber-storybook";
import { airportNapChapter } from "@/lib/story-content";

export default function HomePage() {
  return (
    <main className="home-shell home-shell--landing" id="top">
      <FiberStorybook chapter={airportNapChapter} />
    </main>
  );
}
