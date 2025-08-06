create table SKILLS (
s_id int auto_increment primary key,
skill varchar(100) unique
);

create table STATES (
state_code char(2) primary key,
state_name varchar(50)
);

create table USERPROFILE (
u_id int auto_increment primary key,
fname varchar(25),
lname varchar(25),
phone varchar(15),
role enum('volunteer', 'admin') default 'volunteer',
status enum('Active', 'Inactive') default 'Active',
preferences text,
address1 varchar(100),
address2 varchar(100),
city varchar(100),
state char(2),
zipcode varchar(10),
foreign key (state) references STATES(state_code)
);

create table USERCREDENTIALS (
u_id int primary key,
email varchar(100) unique,
password varchar(255),
foreign key (u_id) references USERPROFILE(u_id) 
on delete CASCADE
);

create table VOLUNTEER_SKILLS (
u_id int,
s_id int,
primary key (u_id, s_id),
foreign key (u_id) references USERPROFILE(u_id)
on delete CASCADE,
foreign key (s_id) references SKILLS(s_id)
);

create table AVAILABILITY (
u_id int,
available_date date,
primary key (u_id, available_date),
foreign key (u_id) references USERPROFILE(u_id)
on delete CASCADE
);

create table EVENTDETAILS (
e_id int auto_increment primary key,
event_name varchar(100),
event_description text,
event_location varchar(250),
event_urgency enum('Low', 'Medium', 'High'),
event_date datetime,
event_start time,
event_end time,
event_status enum('Active', 'Cancelled', 'Complete') default 'Active'
);

create table EVENT_SKILLS (
e_id int,
s_id int,
primary key(e_id, s_id),
foreign key (e_id) references EVENTDETAILS(e_id)
on delete CASCADE,
foreign key (s_id) references SKILLS(s_id)
);

create table VOLUNTEERHISTORY (
h_id int auto_increment primary key,
u_id int,
e_id int,
status enum('scheduled', 'completed', 'in_progress', 'missed') default 'scheduled',
clock_in_time time,
clock_out_time time,
hours_worked int,
feedback text,
rating int,
createdAt datetime,
completedAt datetime,
foreign key (u_id) references USERPROFILE(u_id)
on delete CASCADE,
foreign key (e_id) references EVENTDETAILS(e_id)
on delete SET NULL
);

create table HISTORY_SKILLS_USED (
h_id int,
s_id int,
primary key (h_id, s_id),
foreign key (h_id) references VOLUNTEERHISTORY(h_id)
on delete CASCADE,
foreign key (s_id) references SKILLS(s_id)
);

create table NOTIFICATIONS (
n_id int auto_increment primary key,
u_id int,
e_id int,
noti_type enum('reminder', 'assignment', 'update', 'general'),
title varchar(250),
message text,
status enum('unread', 'read') default 'unread',
createdAt datetime,
readAt datetime,
sender_id int null,
foreign key (sender_id) references USERPROFILE(u_id)
on delete set null,
foreign key (u_id) references USERPROFILE(u_id)
on delete CASCADE,
foreign key (e_id) references EVENTDETAILS(e_id)
on delete CASCADE
);

create table ASSIGNMENT (
u_id int,
e_id int,
volunteer_status boolean default TRUE,
primary key (u_id, e_id),
foreign key (u_id) references USERPROFILE(u_id)
on delete cascade,
foreign key (e_id) references EVENTDETAILS(e_id)
on delete cascade
);