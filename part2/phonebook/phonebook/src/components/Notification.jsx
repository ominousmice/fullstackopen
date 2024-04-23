const Notification = ({ message }) => {
    const notificationStyle = {
        color: 'green',
        background: 'lightgreen',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10
    }

    if (message === null) {
        return null
    }

    return (
        <div className='notification' style={notificationStyle}>
            {message}
        </div>
    )
}

export default Notification