"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function AnalyticsPage() {
  // Mock data for product quantity by category
  const productsByCategoryData = [
    { category: "Electronics", quantity: 100 },
    { category: "Furniture", quantity: 50 },
    { category: "Apparel", quantity: 120 },
    { category: "Books", quantity: 80 },
    { category: "Home Goods", quantity: 70 },
  ];

  // Mock data for sales over time
  const salesOverTimeData = [
    { month: "Jan", sales: 12000 },
    { month: "Feb", sales: 15000 },
    { month: "Mar", sales: 13000 },
    { month: "Apr", sales: 18000 },
    { month: "May", sales: 16000 },
    { month: "Jun", sales: 20000 },
  ];

  // Mock data for product importance distribution
  const importanceDistributionData = [
    { importance: "low", count: 30 },
    { importance: "medium", count: 50 },
    { importance: "high", count: 20 },
  ];

  const chartConfig = {
    quantity: {
      label: "Quantity",
      color: "hsl(var(--chart-1))",
    },
    sales: {
      label: "Sales",
      color: "hsl(var(--chart-2))",
    },
    count: {
      label: "Count",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  return (
    <div className="p-4">
      <h1 className="mb-6 text-3xl font-bold">Inventory Analytics Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Product Quantity by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Product Quantity by Category</CardTitle>
            <CardDescription>
              Distribution of products across categories.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={productsByCategoryData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar
                    dataKey="quantity"
                    fill="var(--color-quantity)"
                    radius={8}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Sales Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Sales Over Time</CardTitle>
            <CardDescription>Monthly sales performance.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={salesOverTimeData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="sales"
                    type="monotone"
                    stroke="var(--color-sales)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Product Importance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Product Importance Distribution</CardTitle>
            <CardDescription>
              Count of products by importance level.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="min-h-[200px] w-full"
            >
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={importanceDistributionData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="importance"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
