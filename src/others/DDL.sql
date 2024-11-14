create database integrador1;
use integrador1;


create table usuario (
	id_usuario int auto_increment primary key,
    apellido varchar(50) not null,
	nombre varchar(50) not null,
    mail varchar(50) unique not null,
    pass varchar(255) not null,
    nro_tel bigint(20) unsigned not null,
    rol enum ('cliente','administrador','cajero','mozo') not null
);

create table reserva (
	id_reserva int auto_increment primary key,
    fecha_hoy timestamp default current_timestamp,
    fecha_res date not null,
    usuario_res int not null,
    apellido varchar(50) not null,
    nombre varchar(50) not null,
    nro_tel bigint(20) unsigned not null,
    cant_personas int(4) not null,
    estado enum ('activa','finalizada') not null,
    foreign key (usuario_res) references usuario(id_usuario)
);

create table mesa (
	id_mesa int auto_increment primary key,  				   
	nro_mesa int(3) unsigned unique not null,
    lugares int (3) unsigned not null,
    disponible enum ('si','no') not null
);

create table producto (
	id_prod int auto_increment primary key,                
    nombre_prod varchar(50) unique not null,
    precio decimal (8,2) unsigned not null,		
    categoria enum ('gaseosas','aguas','vinos','cervezas','espumantes','tragos','postres','platos') not null,
    stock int (4) unsigned default (0)   
);

create table cuenta_mesa (
	id_cuenta int auto_increment primary key,
    fecha_hora timestamp default current_timestamp,
    reserva int ,
    mesa int not null,
    total decimal (9,2) unsigned default(0),
	pago enum ('no','si') not null,
    foreign key (reserva) references reserva(id_reserva),
    foreign key (mesa) references mesa(id_mesa)
);

create table prod_x_cuenta (
	id_pxc int auto_increment primary key,
    cuenta int not null,
    producto int not null,
    cantidad int(2) unsigned not null,
    observaciones varchar (255),
    subtotal decimal (9,2) not null,
    cargado_por int not null,
    foreign key (cuenta) references cuenta_mesa(id_cuenta),
    foreign key (producto) references producto(id_prod),
    foreign key (cargado_por) references usuario(id_usuario)
);
