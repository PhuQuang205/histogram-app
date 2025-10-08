import { ArrowUpRight } from "lucide-react";

const navLinks = [
	{
		title: "By Quang",
		href: "#",
	},
	
];


export const Footer = () => {
  return (
   <footer className="relative -z-10 overflow-clip container mx-auto">
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[400px] w-[1600px] bg-sky-300/20 [mask-image:radial-gradient(50%_50%_at_bottom_center,black,transparent)] -z-10" />
			<div className="container font-cascadia">
				<div className="flex flex-col lg:flex-row justify-between items-center gap-8 border-t border-white py-6 text-sm">
					<div className="text-sky-500 ">&Copy; 2025. All rights reserved.</div>
					<div>
						<nav className="inline-flex flex-col lg:flex-row items-center gap-8">
							{navLinks.map((navLink, index) => (
								<div key={index} className="flex items-center gap-1 text-white">
									<span>
										<a href={navLink.href} className="font-semibold">
											{navLink.title}
										</a>
									</span>
									<ArrowUpRight className="size-5" />
								</div>
							))}
						</nav>
					</div>
				</div>
			</div>
		</footer>
  )
}
