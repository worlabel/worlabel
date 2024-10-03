'use client';

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
    color: '#FF6347',
  },
  recall: {
    label: 'Recall',
    color: '#1E90FF',
  },
  map50: {
    label: 'mAP50',
    color: '#32CD30',
  },
  map5095: {
    label: 'mAP50-95',
    color: '#BA55D3',
  },
  fitness: {
    label: 'Fitness',
    color: '#FF1493',
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
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={1}
                    stroke={props.payload.fill}
                    strokeDasharray={0}
                    strokeDashoffset={0}
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
