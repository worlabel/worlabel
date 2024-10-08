'use client';

import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Rectangle } from 'recharts';
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
  map50: {
    label: 'mAP50',
    color: 'hsl(var(--chart-3))',
  },
  map5095: {
    label: 'mAP50-95',
    color: 'hsl(var(--chart-4))',
  },
  fitness: {
    label: 'Fitness',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function ModelBarChart({ data, className }: ModelBarChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  className="bg-white"
                />
              }
            />
            <Bar
              dataKey="value"
              strokeWidth={0}
              radius={8}
              fillOpacity={1}
              onMouseEnter={(_, index) => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
              shape={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fill={props.fill}
                    fillOpacity={activeIndex === props.index ? 0.8 : 1}
                    stroke={activeIndex === props.index ? props.fill : 'none'}
                    strokeWidth={activeIndex === props.index ? 2 : 0}
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
