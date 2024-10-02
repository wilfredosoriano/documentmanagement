import React, { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Label, Pie, PieChart } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '../ui/chart';
import axios from 'axios';


const getLastSixMonths = () => {
    const months = [];
    const now = new Date();
    
    const monthNames = [
      "January", "February", "March", "April", "May", "June", 
      "July", "August", "September", "October", "November", "December"
    ];
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        month: monthNames[date.getMonth()],
        Desktop: 0,
        Mobile: 0
      });
    }
  
    return months;
  };

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
};

export default function DashboardChart() {

    const [chartData, setChartData] = useState(getLastSixMonths());
    const [dateRange, setDateRange] = useState('');
    const [percentage, setPercentage] = useState('');
    const [trendIcon, setTrendIcon] = useState('');

    useEffect(() => {
        const fetchDeviceCounts = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/users/getDeviceCounts`);
                const counts = response.data; 
        
                const updatedChartData = getLastSixMonths().map(monthEntry => {
                    const foundEntry = counts.find(count => count.month === monthEntry.month);
                    if (foundEntry) {
                        return {
                            ...monthEntry,
                            Mobile: foundEntry.Mobile,
                            Desktop: foundEntry.Desktop,
                        };
                    }
                    return monthEntry;
                });
        
                setChartData(updatedChartData);
        
                const months = getLastSixMonths();
                setDateRange(`${months[0].month} - ${months[months.length - 1].month}`);
        
                const currentMonthIndex = updatedChartData.length - 1;
                const previousMonthIndex = updatedChartData.length - 2;

                if (previousMonthIndex >= 0) {
                    const currentMobile = updatedChartData[currentMonthIndex].Mobile;
                    const previousMobile = updatedChartData[previousMonthIndex].Mobile;

                    const currentDesktop = updatedChartData[currentMonthIndex].Desktop;
                    const previousDesktop = updatedChartData[previousMonthIndex].Desktop;

                    const mobileChange = ((currentMobile - previousMobile) / (previousMobile || 1)) * 100;
                    const desktopChange = ((currentDesktop - previousDesktop) / (previousDesktop || 1)) * 100;

                    let changePercentage;
                    let trendingMessage;

                    if(mobileChange > 0 || desktopChange > 0){
                        changePercentage = Math.max(mobileChange, desktopChange).toFixed(2);
                        trendingMessage = `Trending up by +${changePercentage}%`;
                        setTrendIcon(<TrendingUp size={20} />)
                    } else {
                        changePercentage = Math.max(mobileChange, desktopChange).toFixed(2);
                        trendingMessage =  `Down by ${changePercentage}%`;
                        setTrendIcon(<TrendingDown size={20} />)
                    }

                    setPercentage(trendingMessage);
                }

            } catch (error) {
                console.error('Error fetching device counts:', error);
            }
        };
        
        fetchDeviceCounts();
    }, []);    

  return (
        <Card>
            <CardHeader>
                <CardTitle>Visitors each month</CardTitle>
                <CardDescription>{dateRange}</CardDescription>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig} className='max-h-[550px] w-full'>
                <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value}
                    />
                    <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dashed" />}
                    />
                    <Bar dataKey="Desktop" fill="var(--color-desktop)" radius={4} />
                    <Bar dataKey="Mobile" fill="var(--color-mobile)" radius={4} />
                </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                {percentage} this month {trendIcon}
                </div>
            </CardFooter>
        </Card>
  );
}
