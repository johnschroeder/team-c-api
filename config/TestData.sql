use dev_impdb;
insert into permissions values(null, 5);
insert into users values("test01","bla","blalast", "sdfdsf","601", "1234","salt","2015-01-01");
insert into users values("test02","sdf","fefew", "asdfaee","601", "dve","savvlt","2015-05-01");
insert into users values("test03","svv","fvvvvv", "vvv","601", "d3333","sa333","2015-05-01");

insert into products values(null, "paper", "paper des", "2015-01-01");
insert into piles values(null, 101, "warehouse01");
insert into runs values(null,301,"2015-01-03",500,0);

insert into sizemap values(null,101,"package",50);
insert into cart values(null,"cart1","test01","a1","2015-02-01", "2015-04-01");

insert into usergroups values("a1","test01");
insert into usergroups values("a1","test02");
insert into cart values(null,"cart2","test01","test01","2015-02-01", "2015-04-01");