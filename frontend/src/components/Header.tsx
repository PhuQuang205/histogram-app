import Shuffle from "@/components/custom/Shuffle";
import GradientText from "@/components/custom/GradientText";

export const Header = () => {
	return (
		<div className="flex justify-center items-center w-full h-[400px] bg-gray-900 relative pb-16 lg:py-24">
			<div
				className="absolute inset-0 z-0"
				style={{
					background: `radial-gradient(circle at 50% 50%, rgba(226, 232, 240, 0.2) 0%, rgba(226, 232, 240, 0.1) 25%, rgba(226, 232, 240, 0.05) 35%, transparent 50%)`,
				}}
			/>
			<div className="container mx-auto flex justify-center z-10">
				<div className="inline-flex flex-col items-center gap-4 text-center">
					<Shuffle
						className="text-5xl lg:text-6xl text-sky-500"
						text="Level Scheme Processing"
						shuffleDirection="right"
						duration={0.35}
						animationMode="evenodd"
						shuffleTimes={1}
						ease="power3.out"
						stagger={0.03}
						threshold={0.1}
						triggerOnce={true}
						triggerOnHover={true}
						respectReducedMotion={true}
					/>

					<GradientText
						colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
						animationSpeed={3}
						showBorder={false}
						className="font-cascadia text-2xl lg:text-3xl"
					>
						Tool for testing histogram processing for multi-grayscale images
					</GradientText>
				</div>
			</div>
		</div>
	);
};
