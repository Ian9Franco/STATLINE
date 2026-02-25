"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { subject: "Velocidad", A: 90, fullMark: 100 },
  { subject: "Productiv.", A: 85, fullMark: 100 },
  { subject: "Resolución", A: 75, fullMark: 100 },
  { subject: "Cumplimiento", A: 95, fullMark: 100 },
]

const chartConfig = {
  A: {
    label: "Puntaje",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function MetricRadarChart() {
  return (
    <Card className="glass-panel border-0 shadow-none bg-transparent">
      <CardHeader className="items-center pb-4">
        <CardTitle>Radar de Desempeño</CardTitle>
        <CardDescription>Evaluación del Período Actual</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarGrid className="fill-[--color-muted] opacity-20" />
            <PolarAngleAxis dataKey="subject" />
            <Radar
              dataKey="A"
              fill="var(--color-primary)"
              fillOpacity={0.6}
              stroke="var(--color-primary)"
              strokeWidth={3}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
