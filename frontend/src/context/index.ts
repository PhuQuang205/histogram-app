export type ProcessingType = "equalization" | "log" | "matching" | "slicing";

export interface ProcessingParameters {
  c: number;
  stretchMin: number;
  stretchMax: number;
  keepBackground: boolean;
  matchFile: File | null; // thêm vào đây
}



export const processingOptions = [
    {
        value: "equalization",
        label: "Histogram Equalization",
        description: "Distribute intensity evenly",
    },
    {
        value: "matching",
        label: "Histogram Matching",
        description: "Expand the intensity range",
    },
    {
        value: "log",
        label: "Histogram Log",
        description: "Apply a target histogram",
    },
    {
        value: "slicing",
        label: "Histogram Clicing",
        description: "Apply a target histogram",
    },
];

// context.ts (hoặc file chứa interface của bạn)

export interface ProcessingControlsProps {
	processingType: ProcessingType;
	parameters: ProcessingParameters;
	onProcessingTypeChange: (type: ProcessingType) => void;
	onParametersChange: (params: Partial<ProcessingParameters>) => void;
}


