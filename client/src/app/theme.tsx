'use client';
import '@ant-design/v5-patch-for-react-19';
import { ConfigProvider, App } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = {
    token: {
      colorPrimary: '#1677ff', // xanh chuẩn của Ant Design
    },
  };

  return (
    <AntdRegistry>
      <App>
        <ConfigProvider theme={theme}>{children}</ConfigProvider>
      </App>
    </AntdRegistry>
  );
}
