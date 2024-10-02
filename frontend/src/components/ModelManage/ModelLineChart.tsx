'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { ReportResponse } from '@/types';
import { Spinner } from '@/components/ui/spinner';

interface ModelLineChartProps {
  data: ReportResponse[];
  isTraining: boolean;
  className?: string;
}

const chartConfig = {
  boxLoss: {
    label: 'Box Loss',
    color: '#FF6347',
  },
  classLoss: {
    label: 'Class Loss',
    color: '#1E90FF',
  },
  dflLoss: {
    label: 'DFL Loss',
    color: '#32CD32',
  },
  fitness: {
    label: 'Fitness',
    color: '#FFD700',
  },
  segLoss: {
    label: 'Segmentation Loss',
    color: '#FF1493',
  },
} satisfies ChartConfig;

export default function ModelLineChart({ data, isTraining, className }: ModelLineChartProps) {
  const latestData = data.length > 0 ? data[data.length - 1] : undefined;

  const totalEpochs = latestData?.totalEpochs || 0;
  const emptyData = Array.from({ length: totalEpochs }, (_, i) => ({
    epoch: (i + 1).toString(),
    boxLoss: null,
    clsLoss: null,
    dflLoss: null,
    fitness: null,
    segLoss: null,
  }));

  const filledData = emptyData.map((item, index) => ({
    ...item,
    ...(data[index] || {}),
  }));

  const renderLine = (dataKey: keyof ReportResponse, color: string) => {
    const hasNonZeroData = filledData.some((d) => d[dataKey] !== 0);
    return hasNonZeroData ? (
      <Line
        key={dataKey}
        dataKey={dataKey}
        type="monotone"
        stroke={color}
        strokeWidth={2}
        dot={false}
      />
    ) : null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Training Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {latestData && latestData.totalEpochs !== Number(latestData.epoch) && (
          <div className="mb-4 flex justify-between">
            <p>현재 에포크: {latestData.epoch}</p>
            <p>총 에포크: {latestData.totalEpochs}</p>
            <p>예상 남은시간: {latestData.leftSecond.toFixed(2)}초</p>
          </div>
        )}
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={filledData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="epoch"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `Epoch ${value}`}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderLine('boxLoss', chartConfig.boxLoss.color)}
            {renderLine('clsLoss', chartConfig.classLoss.color)}
            {renderLine('dflLoss', chartConfig.dflLoss.color)}
            {renderLine('fitness', chartConfig.fitness.color)}
            {renderLine('segLoss', chartConfig.segLoss.color)}

            {isTraining && data.length === 0 && (
              <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <div className="flex h-full w-full items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Spinner
                      size="large"
                      show={true}
                    />
                    <p className="mt-4 text-lg font-semibold">대기 중...</p>
                  </div>
                </div>
              </foreignObject>
            )}
            {!isTraining && data.length === 0 && (
              <foreignObject
                x="0"
                y="0"
                width="100%"
                height="100%"
              >
                <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-gray-500">
                  학습 중이 아닙니다.
                </div>
              </foreignObject>
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
