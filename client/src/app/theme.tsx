/*
Kinh nghiệm : trong 1 folder ví dụ app
thường có 1 file layout.tsx và theme.tsx 
*/

'use client'
import {ConfigProvider, App} from 'antd';
import {AntdRegistry} from '@ant-design/nextjs-registry';

export const theme = {
    token: {
        colorPrimary: '#000000', //Màu chủ đạo của app
        colorBgContainerDisabled: '#000000', //Màu nền của các component bị disable
    }
}

export default function ThemeProvider({
    children,
}:{
    children: React.ReactNode
}) {
    return (
        <AntdRegistry>
            <App>
                <ConfigProvider theme={theme}>{children}</ConfigProvider>
            </App>
        </AntdRegistry>
    )
}