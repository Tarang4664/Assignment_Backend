wget -nv -O /tmp/jce_policy-8.zip --header "Cookie: oraclelicense=accept-securebackup-cookie" http://download.oracle.com/otn-pub/java/jce/8/jce_policy-8.zip
unzip /tmp/jce_policy-8.zip *_policy.jar -d /tmp
cp /tmp/UnlimitedJCEPolicyJDK8/*_policy.jar /usr/local/lib/jdk1.8.0_20/jre/lib/security
chown -R root:root /usr/local/lib/jdk1.8.0_20
rm -rf /tmp/jce_policy-8.zip /tmp/UnlimitedJCEPolicyJDK8
