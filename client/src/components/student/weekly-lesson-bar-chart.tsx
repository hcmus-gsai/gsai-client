'use client';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

interface Props {
  data: {
    date: string;
    value: number;
    detail: Record<string, number>;
  }[];
}



export default function WeeklyLessonBarChart({ data }: Props) {
  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: '#374151' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12 }}
          />
        <Tooltip
        content={({ active, payload, label }) => {
            if (!active || !payload || !payload.length) return null;

            const { value, detail } = payload[0].payload;

            return (
            <div className="rounded bg-white p-2 shadow text-sm">
                <div>Tổng: {value}</div>

                {detail && Object.keys(detail).length > 0 && (
                <div className="mt-1 text-xs text-gray-600">
                    {Object.entries(detail).map(([k, v]) => (
                    <div key={k}>
                        {k}: {Number(v)}
                    </div>
                    ))}
                </div>
                )}
            </div>
            );
        }}
        />

          <Bar
            dataKey="value"
            fill="#1363DF"
            radius={[0, 0, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
