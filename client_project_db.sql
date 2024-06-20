CREATE TABLE "user" (
	"id" serial primary key NOT NULL,
	"username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
	"is_admin" BOOLEAN DEFAULT 'false',
	"is_deleted" BOOLEAN DEFAULT 'false'
);


CREATE TABLE "organization" (
	"id" serial primary key NOT NULL,
	"organization_name" varchar(200) NOT NULL,
	"type" varchar(100) NOT NULL,
	"address" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"zip" integer NOT NULL,
	"primary_contact_first_name" varchar(50) NOT NULL,
	"primary_contact_last_name" varchar(50) NOT NULL,
	"primary_contact_phone" bigint NOT NULL,
	"primary_contact_email" varchar(100),
	"organization_logo" varchar,
	"is_deleted" BOOLEAN NOT NULL DEFAULT 'false',
	"organization_earnings" DECIMAL default 10
);

CREATE TABLE "organization_notes" (
  "id" serial primary key NOT NULL,
  "organization_id" integer REFERENCES "organization"("id") NOT NULL,
  "note_date" DATE NOT NULL,
  "note_content" varchar(1000) NOT NULL,
  "is_deleted" BOOLEAN DEFAULT false
);


CREATE TABLE "group" (
    "id" serial primary key NOT NULL,
    "organization_id" integer REFERENCES "organization"("id") NOT NULL,
    "department" varchar(100) NOT NULL,
    "sub_department" varchar(100),
    "group_nickname" varchar(100) NOT NULL,
    "group_photo" varchar,
    "group_description" varchar(1000),
    "is_deleted" BOOLEAN NOT NULL DEFAULT 'false'
);

CREATE TABLE "user-group" (
	"id" serial primary key NOT NULL,
	"group_id" integer REFERENCES "group"("id") NOT NULL,
	"user_id" integer REFERENCES "user"("id") NOT NULL,
	"group_admin" BOOLEAN NOT NULL DEFAULT 'false'
);

CREATE TABLE "coupon_book" (
	"id" serial primary key NOT NULL,
	"year" varchar(20) NOT NULL
);

CREATE TABLE "fundraiser" (
	"id" serial primary key NOT NULL,
	"group_id" integer REFERENCES "group"("id") NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar NOT NULL,
	"photo" varchar,
	"requested_book_quantity" integer NOT NULL,
	"book_quantity_checked_out" integer NOT NULL,
	"book_checked_out_total_value" DECIMAL,
	"book_quantity_checked_in" integer,
	"books_sold" DECIMAL,
	"money_received" DECIMAL,
	"start_date" DATE NOT NULL,
	"end_date" DATE NOT NULL,
	"coupon_book_id" integer REFERENCES "coupon_book"("id") NOT NULL,
	"outstanding_balance" DECIMAL,
	"is_deleted" BOOLEAN NOT NULL DEFAULT 'false',
	"closed" BOOLEAN NOT NULL DEFAULT 'false',
	"goal" integer DEFAULT NULL

);

------------------------------------------------------------------
-- Trigger/ functions
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_checked_out_total_value()
RETURNS TRIGGER AS $$
BEGIN
 NEW.book_checked_out_total_value = NEW.book_quantity_checked_out * 25;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create a trigger on your_table
CREATE TRIGGER update_checked_out_total_value_trigger
BEFORE INSERT OR UPDATE ON fundraiser
FOR EACH ROW EXECUTE FUNCTION update_checked_out_total_value();
-- Create a function to calculate the outstanding_balance
CREATE OR REPLACE FUNCTION calculate_outstanding_balance()
RETURNS TRIGGER AS $$
BEGIN
 NEW.outstanding_balance = NEW.book_checked_out_total_value
        - COALESCE(NEW.money_received, 0)
        - COALESCE(NEW.book_quantity_checked_in * 25, 0);
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create a trigger to update outstanding_balance before insert or update
CREATE TRIGGER update_outstanding_balance
BEFORE INSERT OR UPDATE ON fundraiser
FOR EACH ROW
EXECUTE FUNCTION calculate_outstanding_balance();

----------------------------------------------------------------------------------------------
--INSERTS
----------------------------------------------------------------------------------------------
-- Organization Table
INSERT INTO "public"."organization"("organization_name","type","address","city","state","zip","primary_contact_first_name","primary_contact_last_name","primary_contact_phone","primary_contact_email","organization_logo","is_deleted")
VALUES
(E'4 Luv of Dog Rescue',E'Shelter',E'1234 Bark Street',E'Fargo',E'ND',58102,E'Jane',E'Doe',7015552121,E'barks@email.com',E'images/4luv.jpeg',FALSE),
(E'Moorhead High School',E'School',E'555 East Side Drive',E'Moorhead',E'MN',56560,E'Sally',E'Jenkins',2183338765,E'mhs@email.com',E'images/mhd-spuds.jpeg',FALSE),
(E'Tech 4 Kids',E'Non Profit',E'1234 Computer Street',E'Fargo',E'ND',58104,E'Jane',E'Doe',7015551234,E'',E'images/tech4kids.png',FALSE),
(E'Homeward Animal Shelter',E'Shelter',E'1234 Doggo Way',E'Fargo',E'ND',58102,E'John',E'Doe',7015559876,E'',E'images/homeward.jpeg',FALSE),
(E'Warm Blanket Hugs',E'Nonprofit',E'1234 Snuggle Street',E'Fargo',E'ND',58102,E'Jane',E'Johnson',7010000000,E'',E'images/warm-blanket.png',FALSE),
(E'Addies Royal Cupcake Stand',E'Small Business',E'1234 cupcake road',E'Fargo',E'ND',58104,E'Addie',E'Cupcake',8015559292,E'',E'images/addies-cupcakes.jpeg',FALSE),
(E'American Legion',E'Non profit',E'1234 justice dr',E'Fargo',E'ND',58102,E'Uncle',E'Sam',7012005555,E'',E'images/vets.png',FALSE),
(E'Gasper\'s School of Dance',E'Dance Studio',E'1234 Dance road',E'Fargo',E'ND',58103,E'Megan',E'Twirl',7015559191,E'',E'images/gaspers.jpeg',TRUE),
(E'Haley\'s Hope',E'Non profit',E'555 Hope St',E'Fargo',E'ND',58103,E'Haley',E'Hope',7015554098,E'',E'',FALSE),
(E'West Fargo VFW',E'VFW',E'444 Sheyenne Street',E'West Fargo',E'ND',58078,E'Uncle',E'Sam',7015555555,E'',E'images/VFW.png',FALSE),
(E'Shanley High School',E'School',E'1234 school street',E'Fargo',E'ND',58104,E'John',E'Paul',7015559876,E'',E'images/SHS.png',FALSE),
(E'Acapella Express',E'Music',E'1234',E'Fargo',E'ND',58104,E'Jenny',E'Johnson',7012345678,E'',E'images/acapella.png',FALSE),
(E'City of Fargo',E'city',E'1234 Fargo Rd',E'Fargo',E'ND',58104,E'John',E'Johnson',7017017011,E'',E'images/city-fargo.png',FALSE),
(E'Cub Scouts',E'sub scouts',E'1234 cub scout road',E'Fargo',E'ND',58104,E'Jarrod',E'Jackson',7019878989,E'',E'images/cub-scouts.png',FALSE),
(E'Park Christian',E'School',E'1234 school street',E'Fargo',E'ND',58102,E'Park',E'Christian',7017863452,E'',E'images/PCS.png',FALSE),
(E'Fargo North High',E'School',E'1234 19th street n',E'Fargo',E'ND',58102,E'North',E'Dakota',7014446789,E'',E'images/FNH.jpeg',FALSE),
(E'Oak Grove',E'School',E'1234 Oak road',E'Fargo',E'ND',58104,E'John',E'Johnson',7017778909,E'',E'images/oak-grove.jpeg',FALSE),
(E'Fargo South High',E'School',E'234 South street',E'Fargo',E'ND',58103,E'Bruin',E'Johnson',7015559890,E'',E'images/south-high.jpeg',FALSE),
(E'Box of Balloons',E'Nonprofit',E'555 Ballon Street',E'Fargo',E'ND',58102,E'Balloon',E'Lover',7015553445,E'',E'images/balloons.jpeg',TRUE),
(E'Emerging Digital Academy',E'School/ Nonprofit',E'12 Broadway',E'Fargo',E'ND',58102,E'Katie',E'Burington',7015559191,E'',E'images/eda.jpeg',FALSE),
(E'Kiddiland Daycare',E'Daycare',E'1234 Kids Street',E'Fargo',E'ND',58103,E'Johnny',E'Doe',7015551234,E'',E'images/kiddiland.png',FALSE),
(E'NDSU',E'College',E'1234 College Street',E'Fargo',E'ND',58103,E'Bison',E'Doe',7015551234,E'',E'images/ndsu1.png',FALSE);


-- Group Table
INSERT INTO "public"."group"("organization_id","department","sub_department","group_nickname","group_photo","group_description","is_deleted")
VALUES
(1,E'Staff',E'Full-time',E'waggin Tails',E'images/dawgs2.jpeg',E'Staff is raising money by selling the PSG books.',FALSE),
(1,E'Volunteers',E'Part-time',E'Volunteers',E'images/dog1.jpeg',E'Volunteers are selling blue books',FALSE),
(2,E'10th Grade',E'Tennis',E'10th Grade Tennis',E'images/tennis1.jpeg',E'Sophomore tennis team',FALSE),
(2,E'9th Grade',E'Tennis',E'9th Grade Tennis',E'images/tennis2.jpeg',E'Freshman tennis team',FALSE),
(2,E'11th Grade',E'Tennis',E'11th Grade Tennis',E'images/tennis3.jpeg',E'Junior tennis team',FALSE),
(2,E'12th Grade',E'Tennis',E'12th Grade Tennis',E'images/tennis4.jpeg',E'Senior tennis team',FALSE),
(12,E'Acapella',E'Singers',E'Winter group 1',E'images/acapella.jpeg',E'harmony is our jam!',FALSE),
(7,E'volunteers',NULL,E'Vets FM',E'images/amlegion.jpeg',E'Support our troops!',FALSE),
(20,E'students',E'Koss',E'Koss Cohort',E'images/koss.jpeg',E'Our Full Stack Engineering course teaches students how to build modern web applications from the ground up.',FALSE),
(6,E'Staff',NULL,E'Cupcakes4All',E'images/addies.jpeg',E'always baking up smiles!',FALSE),
(20,E'Sourdough',E'bread',E'Blaine\'s Bread bakery',E'images/sourdough.jpeg',E'sourdough rules! Donating for every loaf sold',FALSE),
(14,E'Eagle Scouts',NULL,E'troop 341',E'images/cubscouts.png',NULL,FALSE),
(21,E'Pre-school',E'group 1',E'Eagle Room',E'images/kiddi.jpeg',E'raising money for a new swingset!',FALSE),
(22,E'Faculty',E'Biology',E'Professors',E'images/professor.png',E'We want to see which professor can raise the most money',FALSE),
(22,E'Incoming Freshmen',E'',E'Students',E'images/ndsu-students.jpeg',E'Ndsu is the best college',FALSE),
(22,E'Womens Sports',E'',E'Coaches',E'images/ndsu.jpeg',E'we love giving back to our community',FALSE),
(22,E'Administration',E'fraternity ',E'Sigma Phi Epsilon',E'images/sae.jpeg',E'SAE raising money for sand volleyball court upkeep',FALSE),
(4,E'Puppy funds',E'',E'Pups 4 psg',E'images/dawgs.jpg',E'woof woof',FALSE),
(17,E'Sunday school',E'middle school age',E'Group 1',E'images/oakgrove.jpeg',E'',FALSE),
(22,E'Orchestra',E'strings',E'Music',E'images/ndsuStrings.jpeg',E'raising money for the auditorium',FALSE);


INSERT INTO "public"."coupon_book"("year")
VALUES
(2023-2024),
(2024-2025),
(2025-2026);


INSERT INTO "public"."fundraiser"("group_id","title","description","photo","requested_book_quantity","book_quantity_checked_out","book_checked_out_total_value","book_quantity_checked_in","books_sold","money_received","start_date","end_date","coupon_book_id","outstanding_balance","is_deleted","closed","goal")
VALUES
(1,E'Bark the halls',E' A holiday fundraiser for 4 Luv of Dogs Staff',NULL,100,100,2500,50,50,1250,E'2023-01-01',E'2023-12-31',1,0,FALSE,FALSE,2000),
(2,E'Howlin\'-ween',E'Halloween fundraiser',NULL,100,100,2500,25,75,1875,E'2023-10-01',E'2023-10-31',1,0,FALSE,TRUE,1500),
(3,E'Blue-bookin',E'Tennis students competing to sell blue books',NULL,60,60,1500,0,60,1500,E'2023-07-17',E'2023-11-30',1,0,FALSE,FALSE,500),
(4,E'9th grade',E'9th Grade Tennis',E'',10,10,250,0,10,250,E'2023-11-07',E'2023-11-21',2,0,FALSE,FALSE,1800),
(5,E'Tennis',E'We love tennis',NULL,10,10,250,5,5,100,E'2023-11-07',E'2023-11-29',2,25,FALSE,FALSE,2200),
(6,E'12th grade',E'tennis',E'',100,80,2000,0,0,0,E'2023-11-01',E'2023-11-30',2,2000,FALSE,TRUE,1300),
(7,E'Winter Group',E'acapella',E'',100,50,1250,NULL,NULL,NULL,E'2023-11-07',E'2023-11-29',2,1250,FALSE,FALSE,600),
(8,E'Vets FM',E'VFW',E'',100,50,1250,NULL,NULL,NULL,E'2023-11-07',E'2023-11-29',2,1250,FALSE,FALSE,750),
(9,E'Devs for dollars',E'EDA students rock',E'',10,10,250,NULL,NULL,NULL,E'2023-11-01',E'2023-11-30',2,250,FALSE,FALSE,500),
(10,E'cupcakes',E'Staff',E'',20,20,500,NULL,NULL,NULL,E'2023-11-28',E'2023-11-30',1,500,FALSE,FALSE,800),(30,14,E'Dr. Johnson',E'competition',NULL,25,25,625,5,20,500,E'2023-11-01',E'2023-11-30',1,0,FALSE,TRUE,500),
(14,E'Mrs. Peterson',E'Competition',NULL,25,25,625,0,25,625,E'2023-11-01',E'2023-11-30',1,0,FALSE,FALSE,500),
(14,E'Dr. Simpson',E'competition',NULL,25,25,625,10,15,375,E'2023-11-01',E'2023-11-30',1,0,FALSE,TRUE,500),
(14,E'Mrs. Bayman',E'Competition',NULL,25,25,625,2,23,575,E'2023-11-01',E'2023-11-30',1,0,FALSE,TRUE,600),
(15,E'Students for PSG',E'Students raising money',NULL,100,100,2500,NULL,NULL,NULL,E'2023-10-31',E'2023-12-01',1,2500,FALSE,TRUE,1500),
(16,E'Track is the best',E'track coaches trying to win the competition',NULL,100,100,2500,20,80,2000,E'2022-09-01',E'2023-08-30',1,0,FALSE,TRUE,1000),
(16,E'Volleyball',E'Volleyball wil spike the competition',NULL,200,150,3750,60,90,2250,E'2023-09-01',E'2023-11-30',2,0,FALSE,FALSE,3000),
(16,E'Slam Dunkin- Basketball',E'Bball will crush the competition',NULL,200,120,3000,35,65,2125,E'2023-09-01',E'2023-11-30',2,0,FALSE,TRUE,2000),
(16,E'Tennis',E'Tennis is the best',NULL,150,120,3000,0,120,2500,E'2023-09-01',E'2023-11-30',2,500,FALSE,FALSE,2750),
(16,E'Soccer',E'soccer players to raise money',NULL,150,150,3750,50,100,2500,E'2023-09-01',E'2023-11-30',2,0,FALSE,FALSE,2500),
(16,E'Lacrosse',E'we love psg',NULL,100,100,2500,0,0,0,E'2023-10-31',E'2023-11-30',1,2500,FALSE,TRUE,1000),
(17,E'Frat Volleyball Court',E'Need money for sand volleyball',NULL,100,50,1250,0,50,1000,E'2023-11-01',E'2023-11-30',1,250,FALSE,TRUE,1200),
(22,E'Violin Section',E'Violins rock',NULL,100,100,2500,30,70,1750,E'2023-10-01',E'2023-11-30',2,0,FALSE,TRUE,1500),
(22,E'Chello',E'hello chello',NULL,200,175,4375,25,150,2500,E'2023-10-01',E'2023-11-30',2,1250,FALSE,TRUE,3500),
(22,E'Bass is best',E'Bass is the best',NULL,200,200,5000,0,200,5000,E'2023-10-01',E'2023-11-30',2,0,FALSE,TRUE,5500);

-- User-group table
INSERT INTO "public"."user-group"("group_id","user_id","group_admin")
VALUES
(4,4,TRUE),
(3,4,TRUE),
(5,4,TRUE),
(6,4,TRUE),
(10,1,TRUE),
(2,2,FALSE),
(1,2,FALSE),
(14,5,FALSE),
(15,5,FALSE),
(16,5,TRUE),
(17,5,FALSE),
(22,5,FALSE);

-- Notes
INSERT INTO "public"."organization_notes"("organization_id","note_date","note_content","is_deleted")
VALUES
(1,E'2023-11-21',E'update contact info',FALSE),
(12,E'2023-11-21',E'call Jenny to confirm number of books needed for next year\n',FALSE),
(6,E'2023-11-21',E'call next week',FALSE),
(7,E'2023-11-21',E'needs 100 more books',FALSE),
(14,E'2023-11-21',E'need to update email for Jarrod',FALSE),
(20,E'2023-11-21',E'Koss Cohort client presentations are 11/28!',FALSE),
(22,E'2023-11-21',E'are coaches participating next year?',FALSE),
(22,E'2023-11-21',E'check with professors if they need additional books next month',FALSE);

------------------------------------------------------------------
-- Trigger/ functions
----------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_checked_out_total_value()
RETURNS TRIGGER AS $$
BEGIN
 NEW.book_checked_out_total_value = NEW.book_quantity_checked_out * 25;
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create a trigger on your_table
CREATE TRIGGER update_checked_out_total_value_trigger
BEFORE INSERT OR UPDATE ON fundraiser
FOR EACH ROW EXECUTE FUNCTION update_checked_out_total_value();
-- Create a function to calculate the outstanding_balance
CREATE OR REPLACE FUNCTION calculate_outstanding_balance()
RETURNS TRIGGER AS $$
BEGIN
 NEW.outstanding_balance = NEW.book_checked_out_total_value
        - COALESCE(NEW.money_received, 0)
        - COALESCE(NEW.book_quantity_checked_in * 25, 0);
 RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create a trigger to update outstanding_balance before insert or update
CREATE TRIGGER update_outstanding_balance
BEFORE INSERT OR UPDATE ON fundraiser
FOR EACH ROW
EXECUTE FUNCTION calculate_outstanding_balance();

