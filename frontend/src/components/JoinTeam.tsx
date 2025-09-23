"use client";

import Image from "next/image";

const teamMembers = [
	{
		id: 1,
		name: "Phú Quang",
		role: "Leader",
		avatar: "/images/avatar.jpg",
		bio: "Design UI/UX",
		skills: ["Node.js", "MongoDB", "PostgreSQL", "Docker"],
		social: {
			github: "https://github.com/phuquang",
			linkedin: "https://linkedin.com/in/phuquang",
			email: "quang@example.com",
		},
	},
];
export const JoinTeam = () => {
	return (
		<section className="container mx-auto py-16">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="text-center py-1 border-b border-white">
					<h2 className="font-bold text-sky-500 text-5xl font-press">
						Meet Our Team
					</h2>
					<p className="text-lg text-white font-cascadia py-4 max-w-2xl mx-auto">
						Passionate developers and designers working together to create the
						best social media experience for you.
					</p>
				</div>

				<div className="gap-8 my-8 w-fit">
					{teamMembers.map((member) => (
						<div
							key={member.id}
							className="rounded-xl shadow-sm border border-sky-300"
						>
							<div className="flex items-center p-4 lg:p-8">
								<div className="text-center font-cascadia mb-4 border-r border-white pr-4">
									<Image
										src={member.avatar || "/placeholder.svg"}
										alt={member.name}
										className="size-24 rounded-full mx-auto mb-4 object-cover"
										width={500}
										height={500}
									/>
									<h3 className="text-xl font-semibold text-white mb-1">
										{member.name}
									</h3>
									<p className="text-sky-500 font-medium mb-3">{member.role}</p>
								</div>
								<div className="px-4 flex flex-1 border-2 border-red-500 h-full">
									<p className="text-gray-600 text-sm mb-4 leading-relaxed">
										{member.bio}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};
