"use client";

import { useMemo } from "react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import Image from "next/image";

interface HistogramChartProps {
	originalHistogram?: number[];
	processedHistogram?: number[];
	showComparison?: boolean;
}

export function HistogramChart({
	originalHistogram,
	processedHistogram,
	showComparison = true,
}: HistogramChartProps) {
	type HistogramDataItem = {
		intensity: number;
		original?: number;
		processed?: number;
	};

	// Chuẩn hóa dữ liệu trước khi vẽ biểu đồ
	const chartData = useMemo<HistogramDataItem[]>(() => {
		if (!originalHistogram && !processedHistogram) return [];

		const maxLength = Math.max(
			originalHistogram?.length ?? 0,
			processedHistogram?.length ?? 0
		);

		return Array.from({ length: maxLength }, (_, i) => ({
			intensity: i,
			original: originalHistogram?.[i],
			processed: processedHistogram?.[i],
		}));
	}, [originalHistogram, processedHistogram]);

	// Nếu không có dữ liệu
	if (chartData.length === 0) {
		return (
			<div className="h-96 flex flex-col items-center justify-center border-b-2 border-sky-500 rounded-lg">
				<Image
					src="/images/empty-image.png"
					alt="Empty histogram"
					width={200}
					height={200}
					className="opacity-60"
				/>
				<p className="mt-2 text-sm md:text-lg font-medium text-white">
					No histogram data
				</p>
			</div>
		);
	}

	return (
		<div className="h-96 bg-white py-4 rounded-xl flex justify-center w-full">
			<div className="w-[90%] max-w-5xl mx-auto">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={chartData}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="intensity"
							tick={{ fontSize: 10, fontFamily: "Cascadia Code, monospace" }}
							interval="preserveStartEnd"
						/>
						<YAxis
							tick={{ fontSize: 10, fontFamily: "Cascadia Code, monospace" }}
						/>
						<Tooltip
							wrapperStyle={{
								fontFamily: "Cascadia Code, monospace",
								fontSize: "12px",
							}}
							labelFormatter={(value) => `Intensity: ${value}`}
							formatter={(value: number, name: string) => [
								value.toLocaleString(),
								name === "original" ? "Original Image" : "Processed Image",
							]}
						/>
						{showComparison && <Legend />}
						{originalHistogram && (
							<Bar
								dataKey="original"
								fill="#6B3F69"
								name="Original Image"
								opacity={showComparison ? 0.7 : 1}
							/>
						)}
						{processedHistogram && (
							<Bar
								dataKey="processed"
								fill="#37AFE1"
								name="Processed Image"
								opacity={showComparison ? 0.7 : 1}
							/>
						)}
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}
