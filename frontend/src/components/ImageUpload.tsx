"use client";

import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ImageUploaderProps {
	onImageUpload?: (file: File) => void;
}

export const ImageUpload = ({ onImageUpload }: ImageUploaderProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragOver, setIsDragOver] = useState(false);

	const processFile = (file: File) => {
		if (file && file.type.startsWith("image/")) {
			onImageUpload?.(file);
			toast.success("Image uploaded successfully!");
		} else {
			toast.error("Please select a valid image file.");
		}
	};

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) processFile(file);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
		const file = e.dataTransfer.files?.[0];
		if (file) processFile(file);
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="flex flex-col gap-4 pb-4">
			<div
				className={`border-4 border-dashed rounded-xl transition-colors duration-300 ${
					isDragOver ? "border-blue-400" : "border-white"
				}`}
			>
				<div className="h-[330px]">
					<div
						className="inline-flex items-center justify-center cursor-pointer size-full"
						onClick={handleUploadClick}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<div className="font-cascadias lg:px-10 text-center">
							<div className="flex flex-col gap-2">
								<Button className="text-white bg-sky-500 hover:bg-sky-400 py-8 px-4 flex items-center rounded-lg font-bold cursor-pointer">
									<ImagePlus className="size-5 md:size-6" />
									<span className="font-cascadia text-base md:text-2xl font-bold uppercase">Choose Images</span>
								</Button>
								<div className="font-cascadia flex flex-col gap-1.5">
									<h3 className="text-md text-white/20 md:text-xl">Drag & Drop your images here</h3>
									<p className="text-md md:text-xl text-white/30">JPG / PNG images allowed</p>
								</div>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								accept="image/*"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
