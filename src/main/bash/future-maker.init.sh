#!/bin/bash

. /etc/rc.d/init.d/functions

PATH=/usr/bin:/sbin:/bin:/usr/sbin
export PATH
TZ='Asia/Kolkata'
export TZ

pidfile=/var/run/future-maker.pid
logfile=/var/log/future-maker/midas.stdout

java=/usr/bin/java

app_user=midas
app_group=midas

app_jar=/opt/future-maker/lib/futuremaker.jar
app_config=/etc/future-maker/future-maker-configuration.yml

app_start="java -jar $app_jar server $app_config"

init() {
    echo -n "app init.."
}

start() {
	echo -n "Starting Application: "
	touch "$logfile"
	chown $app_user:$app_group $logfile
	daemon --user=$app_user --pidfile=$pidfile "$app_start > $logfile &"
	RETVAL=$?
	PID=`ps ax | grep $app_jar | grep -v grep | awk '{print $1}'`
	if [ $RETVAL = 0 ]; then
		echo $PID > $pidfile
		success
	else
		failure
	fi
	echo
	return $RETVAL
}

stop() {
	echo -n "Stopping App:"
	killproc -p $pidfile $java
	RETVAL=$?
	echo
}

case $1 in
	start)
		init
		start
	;;
	stop)
		stop
	;;
	status)
		status -p $pidfile $java
		exit $?
	;;
	restart|reload|force-reload)
		stop
		start
	;;
	*)
		echo "Usage: $0 {stop|start|status|restart|reload|force-reload}"
	;;
esac

exit 0
