# creating log folder
if [ -d /var/log/future-maker ];
then
   echo "/var/log/future-maker already exists"
else
   mkdir /var/log/future-maker
   chmod 755 /var/log/future-maker
   chown midas /var/log/future-maker
fi
