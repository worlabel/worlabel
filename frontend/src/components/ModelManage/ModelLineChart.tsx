'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { ReportResponse } from '@/types';

interface ModelLineChartProps {
  data: ReportResponse[];
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
} satisfies ChartConfig;

export default function ModelLineChart({ data, className }: ModelLineChartProps) {
  const latestData = data.length > 0 ? data[data.length - 1] : undefined;

  const totalEpochs = latestData?.totalEpochs || 0;
  const emptyData = Array.from({ length: totalEpochs }, (_, i) => ({
    epoch: (i + 1).toString(),
    boxLoss: null,
    classLoss: null,
    dflLoss: null,
    fitness: null,
  }));

  const filledData = emptyData.map((item, index) => ({
    ...item,
    ...(data[index] || {}),
  }));

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
            <p>예상 남은시간: {latestData.leftSecond}초</p>
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
            <Line
              dataKey="boxLoss"
              type="monotone"
              stroke={chartConfig.boxLoss.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="classLoss"
              type="monotone"
              stroke={chartConfig.classLoss.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="dflLoss"
              type="monotone"
              stroke={chartConfig.dflLoss.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="fitness"
              type="monotone"
              stroke={chartConfig.fitness.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
