import { ControlPanel } from "@/components/ControlPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JoinTeam } from "@/components/JoinTeam";

export default function Home() {
	return (
		<>
			<Header />
			<ControlPanel />
			{/* <JoinTeam/> */}
			<Footer />
		</>
	);
}
