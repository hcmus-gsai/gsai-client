'use client';

import React, {useEffect, useRef} from 'react';
import {notification} from 'antd';

import {useAppDispatch, useAppSelector} from '@/store/hook';
import { selectNotifications, markNotificationAsShown } from '@/store/slice/notifySlice';


export const NotificationListener : React.FC<{children: React.ReactNode}> = ({children}) => {
    const [api, contextHolder] = notification.useNotification();
    const dispatch = useAppDispatch();
    const notifications = useAppSelector(selectNotifications);

    const exposeIds = useRef<Set<string>>(new Set());

    useEffect(() => {
        notifications.forEach((noti)=>{
            if (exposeIds.current.has(noti.id)) return;
            exposeIds.current.add(noti.id);
            api[noti.type]({
                message: noti.message,
                description: noti.description,
                placement: 'topRight',
                key: noti.id,
                duration: 5,
                onClose: () => {
                    dispatch(markNotificationAsShown(noti.id));
                },
            })
            dispatch(markNotificationAsShown(noti.id));

        })
    }, [notifications, api, dispatch]);

    return (
        <>
            {contextHolder}
            {children}
        </>
    )

}