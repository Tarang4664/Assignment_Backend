if ! getent group midas > /dev/null; then
	groupadd -r midas
fi

if ! getent passwd midas > dev/null; then
	useradd -r -g midas -d /opt/future-maker -s /sbin/nologin midas
fi
