'use client';

import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MetricData {
  epoch: string;
  loss1: number;
  loss2: number;
  loss3: number;
  fitness: number;
}

interface ModelLineChartProps {
  data: MetricData[];
}

const chartConfig = {
  loss1: {
    label: 'Loss 1',
    color: '#FF6347', // 토마토색
  },
  loss2: {
    label: 'Loss 2',
    color: '#1E90FF', // 다저블루색
  },
  loss3: {
    label: 'Loss 3',
    color: '#32CD32', // 라임색
  },
  fitness: {
    label: 'Fitness',
    color: '#FFD700', // 골드색
  },
} satisfies ChartConfig;

export default function ModelLineChart({ data }: ModelLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Training Metrics</CardTitle>
        <CardDescription>Loss and Fitness over Epochs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
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
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this epoch <TrendingUp className="h-4 w-4" />
            </div>
            <div className="text-muted-foreground flex items-center gap-2 leading-none">
              Showing training loss and fitness for the current model
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
