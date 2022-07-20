if getent passwd midas > dev/null; then
	userdel midas
fi

if getent group midas > /dev/null; then
	groupdel midas
fi

rm -rf /opt/future-maker
