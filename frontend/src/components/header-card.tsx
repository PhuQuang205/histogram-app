import Shuffle from "@/components/custom/Shuffle";
import React from "react";


interface HeaderCardProps {
	icon: React.ElementType; 
	text: string;
}

export const HeaderCard: React.FC<HeaderCardProps> = ({ icon: Icon, text }) => {
	return (
		<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
			<Icon className="size-6" />
			<div className="mt-1">
				<Shuffle
					className="text-white text-lg leading-0.5"
					text={text}
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
			</div>
		</div>
	);
};
