"use client";

import { useState } from "react";
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
import { useDebouncedCallback } from "use-debounce";
import { HeaderCard } from "@/components/header-card";
import { ProcessingControlsProps, processingOptions } from "@/context";
import { ImageUploadMatching } from "@/components/ImageUploadMatching";

export const ProcessController = ({
	processingType,
	parameters,
	onProcessingTypeChange,
	onParametersChange,
	
}: ProcessingControlsProps) => {
	const [c, setC] = useState(parameters.c);
	const [stretchMin, setStretchMin] = useState<number>(parameters.stretchMin);
	const [stretchMax, setStretchMax] = useState<number>(parameters.stretchMax);
	const [keepBackground, setKeepBackground] = useState<boolean>(
		parameters.keepBackground
	);

	const [debouncedUpdateClip] = useDebouncedCallback((value: number) => {
		onParametersChange({ c: value });
	}, 700);

	// Debounce cho slicing (stretchMin, stretchMax)
	const [debouncedUpdateStretchMin] = useDebouncedCallback((value: number) => {
		onParametersChange({ stretchMin: value });
	}, 700);

	const [debouncedUpdateStretchMax] = useDebouncedCallback((value: number) => {
		onParametersChange({ stretchMax: value });
	}, 700);

	const [matchFile, setMatchFile] = useState<File | null>(parameters.matchFile);

	const currentOption = processingOptions.find(
		(option) => option.value === processingType
	);

	return (
		<div className="flex flex-col gap-4">
			<HeaderCard icon={Settings} text="Setting Image" />
			{/* Phần chọn phương thức xử lý */}
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
			{(() => {
				switch (processingType) {
					case "equalization":
						return <></>;
						break;
					case "matching":
						return (
							<ImageUploadMatching
								onImageUpload={(file) => {
									setMatchFile(file);
									onParametersChange({ matchFile: file }); // gửi ra component cha
								}}
							/>
						);
						break;
					case "log":
						return (
							<div>
								<label className="text-sm text-white font-medium my-2 block">
									C: {c}
								</label>
								<Slider
									value={[c]}
									onValueChange={([value]) => {
										setC(value);
										debouncedUpdateClip(value);
									}}
									min={1}
									max={10}
									step={0.1}
								/>
							</div>
						);
					case "slicing":
						return (
							<div className="flex flex-col gap-4">
								{/* Slider cho ngưỡng a */}
								<div>
									<label className="text-sm text-white font-medium my-2 block">
										Ngưỡng a: {stretchMin}
									</label>
									<Slider
										value={[stretchMin]}
										onValueChange={([value]) => {
											setStretchMin(value);
											debouncedUpdateStretchMin(value);
										}}
										min={0}
										max={255}
										step={1}
									/>
								</div>

								{/* Slider cho ngưỡng b */}
								<div>
									<label className="text-sm text-white font-medium my-2 block">
										Ngưỡng b: {stretchMax}
									</label>
									<Slider
										value={[stretchMax]}
										onValueChange={([value]) => {
											setStretchMax(value);
											debouncedUpdateStretchMax(value);
										}}
										min={0}
										max={255}
										step={1}
									/>
								</div>

								{/* Checkbox giữ nền hay không */}
								<div className="flex items-center gap-2 mt-2">
									<input
										type="checkbox"
										checked={keepBackground ?? false}
										onChange={(e) => {
											const checked = e.target.checked;
											setKeepBackground(checked);
											onParametersChange({ keepBackground: checked });
										}}
									/>
									<label className="text-sm text-white font-medium">
										Giữ nền (Keep background)
									</label>
								</div>
							</div>
						);

					default:
						return "";
				}
			})()}
		</div>
	);
};
