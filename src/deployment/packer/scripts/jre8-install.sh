wget -nv -O /tmp/jre8.tar.gz --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jdk/8u20-b26/server-jre-8u20-linux-x64.tar.gz
tar -C /usr/local/lib -xf /tmp/jre8.tar.gz
chown -R root:root /usr/local/lib/jdk1.8.0_20
alternatives --install /usr/bin/java java /usr/local/lib/jdk1.8.0_20/jre/bin/java 100
rm /tmp/jre8.tar.gz
