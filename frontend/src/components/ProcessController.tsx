"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";
import Shuffle from "@/components/custom/Shuffle";
import { useDebouncedCallback } from "use-debounce";

export type ProcessingType = "equalization" | "stretching" | "specification";

interface ProcessingParameters {
	stretchMin: number;
	stretchMax: number;
	clipLimit: number;
	tileSize: number;
}

interface ProcessingControlsProps {
	processingType: ProcessingType;
	parameters: ProcessingParameters;
	onProcessingTypeChange: (type: ProcessingType) => void;
	onParametersChange: (params: Partial<ProcessingParameters>) => void;
}

const processingOptions = [
	{
		value: "equalization",
		label: "Histogram Equalization",
		description: "Distribute intensity evenly",
	},
	{
		value: "stretching",
		label: "Histogram Stretching",
		description: "Expand the intensity range",
	},
	{
		value: "specification",
		label: "Histogram Specification",
		description: "Apply a target histogram",
	},
];

export const ProcessController = ({
	processingType,
	parameters,
	onProcessingTypeChange,
	onParametersChange,
}: ProcessingControlsProps) => {
	const [localClipLimit, setLocalClipLimit] = useState(parameters.clipLimit);
	const [localTileSize, setLocalTileSize] = useState(parameters.tileSize);

	// đồng bộ khi cha reset params
	useEffect(() => {
		setLocalClipLimit(parameters.clipLimit);
		setLocalTileSize(parameters.tileSize);
	}, [parameters.clipLimit, parameters.tileSize]);

	const [debouncedUpdateClip] = useDebouncedCallback((value: number) => {
		onParametersChange({ clipLimit: value });
	}, 700);

	const [debouncedUpdateTile] = useDebouncedCallback((value: number) => {
		onParametersChange({ tileSize: value });
	}, 700);

	const currentOption = processingOptions.find(
		(option) => option.value === processingType
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-1.5 font-cascadia font-bold text-xl py-4 text-white">
				<Settings className="size-6" />
				<div className="mt-1">
					<Shuffle
						className="text-white text-lg leading-0.5"
						text="Setting Image"
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
			{/* chọn phương thức xử lý */}
			<Select value={processingType} onValueChange={onProcessingTypeChange}>
				<SelectTrigger>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{processingOptions.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							<div className="font-medium w-full text-sky-50 shadow-2xl font-cascadia">
								{option.label}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{currentOption && (
				<Badge variant="outline" className="font-cascadia text-white text-xs">
					{currentOption.description}
				</Badge>
			)}

			{processingType === "equalization" && (
				<div className="font-cascadia text-white flex flex-col gap-4">
					{/* Clip Limit */}
					<div>
						<label className="text-sm font-medium my-2 block">
							Clip Limit: {localClipLimit}
						</label>
						<Slider
							value={[localClipLimit]}
							onValueChange={([value]) => {
								setLocalClipLimit(value); // update UI mượt
								debouncedUpdateClip(value); // sync lên cha sau 300ms
							}}
							min={1}
							max={10}
							step={0.1}
						/>
					</div>

					{/* Tile Size */}
					<div>
						<label className="text-sm font-medium my-2 block">
							Tile Size: {localTileSize}x{localTileSize}
						</label>
						<Slider
							value={[localTileSize]}
							onValueChange={([value]) => {
								setLocalTileSize(value);
								debouncedUpdateTile(value);
							}}
							min={4}
							max={16}
							step={2}
						/>
					</div>
				</div>
			)}
		</div>
	);
};
