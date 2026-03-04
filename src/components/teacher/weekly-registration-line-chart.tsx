'use client';

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Area,
} from "recharts";

type Props = {
    data: { date: string; value: number }[];
};

export default function WeeklyRegistrationLineChart({ data }: Props) {
    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid vertical={false} strokeDasharray="3 3" />

                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="none"
                        fill="url(#colorValue)"
                    />

                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}