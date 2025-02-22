import React, {useCallback, useState, useEffect} from 'react';

import Client from '../client';
import {id as pluginId} from '../manifest';

import './enforceConnectedAccountModal.css';

export default function EnforceConnectedAccountModal() {
    const [open, setOpen] = useState(false);
    const [canSkip, setCanSkip] = useState(false);
    const [connectMessage, setConnectMessage] = useState('');
    const iconURL = `/plugins/${pluginId}/public/msteams-sync-icon.svg`;

    const skip = useCallback(() => {
        setOpen(false);
    }, []);

    const connectAccount = useCallback(() => {
        Client.connect().then((result) => {
            setConnectMessage(result.message);
        });
    }, []);

    useEffect(() => {
        Client.needsConnect().then((result) => {
            setOpen(result.needsConnect);
            setCanSkip(result.canSkip);
        });
    }, []);

    const checkConnected = useCallback(async () => {
        const result = await Client.needsConnect();
        if (!result.needsConnect) {
            setOpen(false);
            setConnectMessage('');
        }
    }, []);

    useEffect(() => {
        let interval: any = 0;
        if (connectMessage) {
            interval = setInterval(checkConnected, 1000);
        }
        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [connectMessage]);

    if (!open) {
        return null;
    }

    return (
        <div className='EnforceConnectedAccountModal'>
            <img src={iconURL}/>
            <h1>{'Connect your Microsoft Teams Account'}</h1>
            {!connectMessage && <p>{'For using this server you need to connect your Mattermost account with your MS Teams account, to procced just click in the button'}</p>}
            {!connectMessage && (
                <button
                    className='btn btn-primary'
                    onClick={connectAccount}
                >
                    {'Connect account'}
                </button>
            )}
            {connectMessage && <p className='connectMessage'>{connectMessage}</p>}
            {canSkip && !connectMessage && (
                <a
                    className='skipLink'
                    onClick={skip}
                >
                    {'Skip for now'}
                </a>
            )}
        </div>
    );
}
