service { 'nginx':
  ensure => running,
  enable => true,
  hasrestart => true,
  require => File['/etc/nginx/conf.d/future-maker.conf'],
  restart => '/sbin/service nginx reload'
}

file { '/etc/nginx/conf.d/future-maker.conf':
  ensure => present,
  content=> '
server {
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;
    ssl_certificate /etc/nginx/cert/server.crt;
    ssl_certificate_key /etc/nginx/cert/server.key;
    listen 443 ssl;
    server_name   futuremaker.test.midas.com;
    ssl on;
    location /api/fm {
       proxy_pass http://localhost:8080/api/;
    }
    location /api-docs {
       proxy_pass http://localhost:8080/api-docs;
    }
    location /swagger {
        root /home/data/www/swagger-ui;
     }
}
',
 notify => Service['nginx']
}

service { 'futuremaker':
  ensure     => running,
  enable     => false,
  hasrestart => true,
  hasstatus  => true,
  path       => '/etc/init.d',
}

service { 'mongod':
	ensure => 'running',
	enable => 'true'
}


file_line { 'change default swagger api-docs url':
  path  => '/home/data/www/swagger-ui/swagger/index.html',
  line  => 'url: "https://futuremaker.test.midas.com/api-docs",',
  match => 'url:*',
}

firewall { '100 allow http and https access':
    port   => [80, 443],
    proto  => tcp,
    action => accept
}
