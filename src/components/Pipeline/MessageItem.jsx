
const MessageItem = ({ message, onClick }) => {

    return (
        <>
            <div style={{padding:'5px 10px 0px 10px', color:message.color ? message.color : 'black'}}>{message.date + ' - ' + message.text}</div>
        </>
    )
}

export default MessageItem