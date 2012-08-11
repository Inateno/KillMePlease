function addMessage(username, message, time)
{
	if (typeof time != 'string')
	{
		var date = new Date(time);
		time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
	}
	
	var line = '[' + time + '] <strong>' + username + '</strong>: ' + message + '<br />';
	messagesArea.innerHTML = line + messagesArea.innerHTML;
}