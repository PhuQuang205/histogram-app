"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

interface ImageDisplayProps {
	originalImage: File | null;
	processedImage?: string;
	isProcessing?: boolean;
}

export const DisplayImage = ({
	originalImage,
	processedImage,
}: ImageDisplayProps) => {
	const [previewUrl, setPreviewUrl] = useState<string>("");

	useEffect(() => {
		if (originalImage) {
			const objectUrl = URL.createObjectURL(originalImage);
			setPreviewUrl(objectUrl);

			return () => URL.revokeObjectURL(objectUrl);
		} else {
			setPreviewUrl("");
		}
	}, [originalImage]);

	return (
		<div className="flex flex-col md:flex-row gap-4">
			<div className="flex-1 flex flex-col gap-4">
				<div className="flex items-center justify-between font-cascadia text-white">
					<h4 className="font-medium">Default Image</h4>
					<Badge variant="outline" className="text-sky-500">
						Original
					</Badge>
				</div>
				{previewUrl && (
					<div className="overflow-hidden flex-1">
						<div className="h-full">
							<Image
								src={previewUrl}
								alt="Image default"
								className="w-full h-full object-contain"
								width={500}
								height={500}
							/>
						</div>
					</div>
				)}
			</div>
      <Separator className="max-md:hidden" orientation="vertical"/>
			<div className="flex-1 flex flex-col gap-4">
				<div className="flex items-center justify-between font-cascadia text-white">
					<h4 className="font-medium">Handled Image</h4>
					<Badge variant="outline" className="text-sky-500">
						Handled
					</Badge>
				</div>
				{processedImage ? (
					<div className="overflow-hidden flex-1">
						<div className="h-full">
							<Image
								src={processedImage}
								alt="Image default"
								className="w-full h-full object-contain"
								width={500}
								height={500}
							/>
						</div>
					</div>
				) : (
					<div className="w-full flex items-center justify-center font-cascadia h-full">
						<Badge className="text-sm text-primary bg-sky-100">No image handled</Badge>
					</div>
				)}
			</div>
		</div>
	);
};
