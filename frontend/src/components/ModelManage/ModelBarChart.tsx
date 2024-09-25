'use client';

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MetricData {
  name: string;
  value: number;
  fill: string;
}

interface ModelBarChartProps {
  data: MetricData[];
  className?: string;
}

const chartConfig = {
  precision: {
    label: 'Precision',
    color: 'hsl(var(--chart-1))',
  },
  recall: {
    label: 'Recall',
    color: 'hsl(var(--chart-2))',
  },
  mAP50: {
    label: 'mAP50',
    color: 'hsl(var(--chart-3))',
  },
  mAP50_95: {
    label: 'mAP50-95',
    color: 'hsl(var(--chart-4))',
  },
  fitness: {
    label: 'Fitness',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function ModelBarChart({ data, className }: ModelBarChartProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Model Metrics</CardTitle>
        <CardDescription>Performance metrics of the model</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                );
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
