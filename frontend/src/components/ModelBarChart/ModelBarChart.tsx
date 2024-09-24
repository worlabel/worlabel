'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface MetricData {
  name: string;
  value: number;
  fill: string;
}

interface ModelBarChartProps {
  data: MetricData[];
}

export const description = 'A bar chart with an active bar';

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

export default function ModelBarChart({ data }: ModelBarChartProps) {
  return (
    <Card>
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
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Model metrics are trending well <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">Showing current performance metrics</div>
      </CardFooter>
    </Card>
  );
}
