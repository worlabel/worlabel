'use client';

import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

interface MetricData {
  epoch: string;
  loss1?: number;
  loss2?: number;
  loss3?: number;
  fitness?: number;
}

interface ModelLineChartProps {
  data: MetricData[];
  currentEpoch?: number;
  totalEpochs?: number;
  remainingTime?: number;
}

const chartConfig = {
  loss1: {
    label: 'Loss 1',
    color: '#FF6347',
  },
  loss2: {
    label: 'Loss 2',
    color: '#1E90FF',
  },
  loss3: {
    label: 'Loss 3',
    color: '#32CD32',
  },
  fitness: {
    label: 'Fitness',
    color: '#FFD700',
  },
} satisfies ChartConfig;

export default function ModelLineChart({ data, currentEpoch, totalEpochs, remainingTime }: ModelLineChartProps) {
  const emptyData = Array.from({ length: totalEpochs || 0 }, (_, i) => ({
    epoch: (i + 1).toString(),
    loss1: null,
    loss2: null,
    loss3: null,
    fitness: null,
  }));

  const filledData = emptyData.map((item, index) => ({
    ...item,
    ...(data[index] || {}),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Training Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        {currentEpoch !== undefined && totalEpochs !== undefined && remainingTime !== undefined && (
          <div className="mb-4 flex justify-between">
            <p>현재 에포크: {currentEpoch}</p>
            <p>총 에포크: {totalEpochs}</p>
            <p>예상 남은시간: {remainingTime}</p>
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
              dataKey="loss1"
              type="monotone"
              stroke={chartConfig.loss1.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="loss2"
              type="monotone"
              stroke={chartConfig.loss2.color}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="loss3"
              type="monotone"
              stroke={chartConfig.loss3.color}
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
