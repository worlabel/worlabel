export interface ResultResponse {
  id: number;
  precision: number;
  recall: number;
  fitness: number;
  ratio: number;
  epochs: number;
  batch: number;
  lr0: number;
  lrf: number;
  optimizer: 'AUTO' | 'SGD' | 'ADAM' | 'ADAMW' | 'NADAM' | 'RADAM' | 'RMSPROP';
  map50: number;
  map5095: number;
}

export interface ReportResponse {
  modelId: number;
  totalEpochs: number;
  epoch: number;
  boxLoss: number;
  clsLoss: number;
  dflLoss: number;
  fitness: number;
  epochTime: number;
  leftSecond: number;
  segLoss: number;
}
