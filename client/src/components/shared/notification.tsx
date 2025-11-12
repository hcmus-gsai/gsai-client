import React, { createContext } from 'react';
import {notification} from 'antd';
import type {NotificationArgsProps} from 'antd';

type NotificationType = "success" | "info" | "warning" | "error";

interface CustomNotificationArgsProps extends NotificationArgsProps {
    notiType?: NotificationType; //can be optional
}

type NotificationContextType = {
    notify: (config: CustomNotificationArgsProps) => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);


export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [api, contextHolder] = notification.useNotification();
    
    const notify = (config: CustomNotificationArgsProps) => {
        api[config.notiType || 'success']({
            ...config,
            placement: 'topRight',
            showProgress: true,
            duration: 5000,
        })
    }

    return (
        <NotificationContext.Provider value = {{notify}}>
            {contextHolder}
            {children}
        </NotificationContext.Provider>
    )
}