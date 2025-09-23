"use client";

import React, { useState } from "react";
import {
	ImageIcon,
	SwordsIcon,
	RotateCcw,
	Download,
	ChartArea,
	GitCompare,
} from "lucide-react";
import { ImageUpload } from "@/components/ImageUpload";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import { DisplayImage } from "@/components/DisplayImage";
import {
	ProcessController,
	ProcessingType,
} from "@/components/ProcessController";
import { callHistogramAPI } from "@/api/image-api";
import { HistogramChart } from "@/components/HistogramChart";
import Shuffle from "@/components/custom/Shuffle";

interface ProcessingParameters {
	[key: string]: number;
	stretchMin: number;
	stretchMax: number;
	clipLimit: number;
	tileSize: number;
}

export const ControlPanel = () => {
	const [originalImage, setOriginalImage] = useState<File | null>(null);
	const [processedImage, setProcessedImage] = useState<string>("");
	const [originalHistogram, setOriginalHistogram] = useState<number[]>([]);
	const [processedHistogram, setProcessedHistogram] = useState<number[]>([]);
	const [processingType, setProcessingType] =
		useState<ProcessingType>("equalization");
	const [parameters, setParameters] = useState<ProcessingParameters>({
		stretchMin: 0,
		stretchMax: 255,
		clipLimit: 2.0,
		tileSize: 8,
	});

	console.log(parameters)

	const [isProcessing, setIsProcessing] = useState(false);

	const handledImage = async () => {
		if (!originalImage) {
			toast.warning("No image to handle!");
			return;
		}

		setIsProcessing(true);
		try {
			const res = await callHistogramAPI({
				file: originalImage,
				type: processingType,
				params: parameters,
			});

			setProcessedImage(res.processedImage);
			setOriginalHistogram(res.originalHistogram);
			setProcessedHistogram(res.processedHistogram);
		} catch (err) {
			console.error("Error khi gọi API:", err);
			toast.error("Có lỗi khi xử lý ảnh!");
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="py-16 lg:py-24 container mx-auto relative">
			<div className="px-8 lg:px-0">
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Control Panel */}
					<div className="lg:sticky lg:top-8 h-fit">
						<div className=" border-2 border-sky-300 px-8 py-4 rounded-xl">
							<div className="flex bg-transparent flex-col gap-8">
								{!originalImage ? (
									<>
										<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
											<ImageIcon className="size-6" />
											<div className="mt-1">
												<Shuffle
													className="text-white text-lg leading-0.5"
													text="Upload Image"
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
										<ImageUpload onImageUpload={setOriginalImage} />
									</>
								) : (
									<>
										<ProcessController
											processingType={processingType}
											parameters={parameters}
											onProcessingTypeChange={setProcessingType}
											onParametersChange={(newParams) =>
												setParameters((prev) => ({ ...prev, ...newParams }))
											}
										/>
										<div className="flex flex-col font-cascadia md:flex-row justify-between gap-4 pb-4">
											<Button
												variant="outline"
												className="flex items-center gap-1.5 py-3 group"
												onClick={() => {
													if (originalImage === null) {
														toast.info("Chưa có hình ảnh!");
														return;
													}
													setOriginalImage(null);
													setProcessedImage("");
													setOriginalHistogram([]);
													setProcessedHistogram([]);
													toast.success("Đã reset dữ liệu!");
												}}
											>
												<RotateCcw className="size-5 transform transition-transform duration-300 ease-in-out group-hover:-rotate-180" />
												Reset
											</Button>

											<Button className="flex items-center gap-1.5 py-3 bg-sky-500 hover:bg-sky-400">
												<Download className="size-5" />
												Download
											</Button>

											<Button
												onClick={handledImage}
												disabled={isProcessing}
												className="flex items-center gap-1.5 py-3 bg-sky-500 hover:bg-sky-400"
											>
												<SwordsIcon className="size-5" />
												{isProcessing ? "Processing..." : "Handle Image"}
											</Button>
										</div>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Main Content */}
					<div className="flex-1">
						<div className="flex flex-col gap-8">
							{!originalImage ? (
								<div className="border-2 border-sky-300 rounded-xl h-[487px]">
									<div className="py-4 px-8 flex flex-col gap-16">
										<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
											<GitCompare className="size-6" />
											<div className="mt-1">
												<Shuffle
													className="text-white text-lg leading-0.5"
													text="Compare Image"
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
										<div className="text-center font-cascadia flex flex-col gap-1.5 items-center">
											<Image
												src="/images/upload-image.png"
												alt="upload image"
												width={500}
												height={500}
												className="size-[200px]"
											/>
											<h3 className="text-md text-white/20 md:text-xl">
												Upload a Photo to Get Started
											</h3>
											<p className="text-md md:text-xl text-white/30">
												Select a grayscale image to test histogram manipulations
											</p>
										</div>
									</div>
								</div>
							) : (
								<div className="border-2 border-sky-300 rounded-xl">
									<div className="py-8 px-8 flex flex-col">
										<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
											<GitCompare className="size-6" />
											<div className="mt-1">
												<Shuffle
													className="text-white text-lg leading-0.5"
													text="Compare Image"
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
										<div>
											<DisplayImage
												originalImage={originalImage}
												processedImage={processedImage}
												isProcessing={isProcessing}
											/>
										</div>
									</div>
								</div>
							)}
							{/* Phân tích biểu đồ */}
							{originalImage ? (
								<div className="border-2 border-sky-300 rounded-xl">
									<div className="py-4 px-8">
										<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
											<ChartArea className="size-6" />
											<div className="mt-1">
												<Shuffle
													className="text-white text-lg leading-0.5"
													text="Analyses Image"
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
										<div className="pb-4">
											<div className="space-y-6 font-cascadia">
												<div>
													<h4 className="font-bold text-white py-2">+ Compare</h4>
													<HistogramChart
														originalHistogram={originalHistogram}
														processedHistogram={processedHistogram}
														showComparison={true}
													/>
												</div>
												<div>
													<h4 className="font-bold text-white py-2">+ Original</h4>
													<HistogramChart
														originalHistogram={originalHistogram}
														showComparison={false}
													/>
												</div>
												<div>
													<h4 className="font-bold text-white py-2">+ Handled</h4>
													<HistogramChart
														processedHistogram={processedHistogram}
														showComparison={false}
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							) : (
								""
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
