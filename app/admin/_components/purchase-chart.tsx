"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PurchaseChartProps {
  data: { date: string; count: number }[];
}

export function PurchaseChart({ data }: PurchaseChartProps) {
  const totalPurchases = data.reduce((sum, item) => sum + item.count, 0);
  const averagePurchases = totalPurchases / data.length;
  const lastDayPurchases = data[data.length - 1].count;
  const trend = lastDayPurchases > averagePurchases ? "up" : "down";
  const trendPercentage = Math.abs(((lastDayPurchases - averagePurchases) / averagePurchases) * 100).toFixed(1);

  return (
    <Card className="hidden md:block md:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Purchases</CardTitle>
        <CardDescription>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart width={600} height={300} data={data}>
          <XAxis dataKey="date" tickFormatter={(value) => new Date(value).getDate().toString()} />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
            formatter={(value: number) => [value, "Purchases"]}
          />
          <Bar dataKey="count" fill="hsl(var(--primary))" />
        </BarChart>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          {trend === "up" ? "Trending up" : "Trending down"} by {trendPercentage}% compared to average
          {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing daily purchases for the current month
        </div>
      </CardFooter>
    </Card>
  )
}