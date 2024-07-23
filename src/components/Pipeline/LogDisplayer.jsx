import React from 'react';
import MessageItem from './MessageItem.jsx'

const LogDisplayer = ({messages}) => {
    return (
        <div style={{border: "1px solid black",
            height:"60vh",
            width:"100%",
            overflow: 'auto',
            position: 'relative'
        }}>
            <div style={{
                display:'flex',
                justifyContent:'center',
                flexDirection:'column'
            }}>
                <div className={"TitleContainer"} style={{
                    textAlign: 'center',
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'white',
                    zIndex: 1,
                    borderBottom: '1px solid black',
                    marginBottom: '0px',
                }}>Logs</div>
                {messages?.map((message, index) => (
                    <MessageItem key={index} message={message} />
                ))}
            </div>
        </div>
    )
}

export default LogDisplayer