export interface Point {
  x: number;
  y: number;
}

export interface CurveParameters {
  type: string;
  amplitude?: number;
  frequency?: number;
  phase?: number;
  steps?: number;
  radius?: number;
  loops?: number;
}

export type CurveGenerator = (params: CurveParameters) => Point[];