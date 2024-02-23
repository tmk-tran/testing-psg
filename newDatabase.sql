----- AUDIT TABLE FOR LOGGING ACTIVITY ------
CREATE TABLE audit_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    action VARCHAR(255),
    details TEXT
);

----------- COLUMN UPDATE FUNCTION --------------------------------
CREATE OR REPLACE FUNCTION log_seller_changes()
RETURNS TRIGGER AS $$
DECLARE
    log_message TEXT;
    user_id INT;
    ref_id VARCHAR;
BEGIN
    -- Initialize the log message with the current timestamp
    log_message := 'Updated at ' || CURRENT_TIMESTAMP;
    
    -- Fetch the refId from the session (assuming it's passed to the function directly)
    ref_id := NEW."refId"; -- Assuming NEW.refId contains the refId

    -- Check if the operation is an UPDATE
    IF TG_OP = 'UPDATE' THEN
        -- Iterate over each column that was updated and append its name and new value to the log message
        IF NEW.lastname IS DISTINCT FROM OLD.lastname THEN
            log_message := log_message || ', lastname changed to: ' || NEW.lastname;
        END IF;
        IF NEW.firstname IS DISTINCT FROM OLD.firstname THEN
            log_message := log_message || ', firstname changed to: ' || NEW.firstname;
        END IF;
        IF NEW.level IS DISTINCT FROM OLD.level THEN
            log_message := log_message || ', level changed to: ' || NEW.level;
        END IF;
        IF NEW.teacher IS DISTINCT FROM OLD.teacher THEN
            log_message := log_message || ', teacher changed to: ' || NEW.teacher;
        END IF;
        IF NEW.initial_books IS DISTINCT FROM OLD.initial_books THEN
            log_message := log_message || ', initial_books changed to: ' || NEW.initial_books;
        END IF;
        IF NEW.additional_books IS DISTINCT FROM OLD.additional_books THEN
            log_message := log_message || ', additional_books changed to: ' || NEW.additional_books;
        END IF;
        IF NEW.books_returned IS DISTINCT FROM OLD.books_returned THEN
            log_message := log_message || ', books_returned changed to: ' || NEW.books_returned;
        END IF;
        IF NEW.cash IS DISTINCT FROM OLD.cash THEN
            log_message := log_message || ', cash changed to: ' || NEW.cash;
        END IF;
        IF NEW.checks IS DISTINCT FROM OLD.checks THEN
            log_message := log_message || ', checks changed to: ' || NEW.checks;
        END IF;
        IF NEW.digital IS DISTINCT FROM OLD.digital THEN
            log_message := log_message || ', digital changed to: ' || NEW.digital;
        END IF;
        IF NEW.donations IS DISTINCT FROM OLD.donations THEN
            log_message := log_message || ', donations changed to: ' || NEW.donations;
        END IF;
        IF NEW.notes IS DISTINCT FROM OLD.notes THEN
            log_message := log_message || ', notes changed to: ' || NEW.notes;
        END IF;
        IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
            log_message := log_message || ', is_deleted changed to: ' || NEW.is_deleted;
        END IF;
        IF NEW.digital_donations IS DISTINCT FROM OLD.digital_donations THEN
            log_message := log_message || ', digital_donations changed to: ' || NEW.digital_donations;
        END IF;
        -- Repeat the above for other columns that need to be logged

        -- Insert a new row into the audit_log table with the log message
        INSERT INTO audit_log (ref_id, action, details)
        VALUES (ref_id, 'UPDATE', log_message);
    END IF;

    -- Return the modified row so that the original update can proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

------------ Trigger that fires after an update on the sellers table ------------------
CREATE TRIGGER sellers_update_trigger
AFTER UPDATE OF lastname, firstname, level, teacher, initial_books, additional_books, books_returned, cash, checks, digital, donations, notes, is_deleted, digital_donations
ON sellers
FOR EACH ROW
EXECUTE FUNCTION log_seller_changes();


------------ Location Table --------------------------------
CREATE TABLE location (
    id SERIAL PRIMARY KEY,
    location_name character varying(100) NOT NULL,
    phone_number bigint NOT NULL,
    address character varying(250) NOT NULL,
    city character varying(150) NOT NULL,
    state character varying(50) NOT NULL,
    zip integer NOT NULL,
    coordinates character varying(75),
    region_id integer REFERENCES region(id),
    is_deleted boolean DEFAULT false,
    merchant_id integer,
    additional_details character varying(200)
);

-------------- Merchant Notes --------------------------------
CREATE TABLE merchant_notes (
    id SERIAL PRIMARY KEY,
    merchant_id integer NOT NULL REFERENCES merchant(id),
    note_date date NOT NULL,
    note_content character varying(1000) NOT NULL,
    is_deleted boolean DEFAULT false
);


------------ Alter Tables for file uploads --------------------------------
-- First, drop the existing column if it exists
ALTER TABLE merchant DROP COLUMN IF EXISTS merchant_logo;

-- Then, add the merchant_logo column with the bytea data type
ALTER TABLE merchant ADD COLUMN merchant_logo bytea;

-- First, drop the existing column if it exists
ALTER TABLE organization DROP COLUMN IF EXISTS organization_logo;

-- Then, add the merchant_logo column with the bytea data type
ALTER TABLE organization ADD COLUMN organzization_logo bytea;



-------------------- Merchant Table ----------------------------------
CREATE TABLE merchant (
    id SERIAL PRIMARY KEY,
    merchant_name character varying(200) NOT NULL,
    address character varying(200) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(50) NOT NULL,
    zip integer NOT NULL,
    primary_contact_first_name character varying(75) NOT NULL,
    primary_contact_last_name character varying(75) NOT NULL,
    contact_phone_number bigint,
    contact_email character varying(100),
    is_deleted boolean DEFAULT false,
    archive_reason character varying(150),
    merchant_logo bytea,
    filename character varying(255),
    website character varying(150)
);


-------------------- Merchant Comments --------------------------------
CREATE TABLE merchant_comments (
    id SERIAL PRIMARY KEY,
    merchant_id integer NOT NULL,
    comment_content character varying(200) NOT NULL,
    is_deleted boolean DEFAULT false,
    "user" character varying(80) NOT NULL,
    task_id integer REFERENCES merchant_tasks(id),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


-------------------- Merchant Tasks --------------------------------
CREATE TABLE merchant_tasks (
    id SERIAL PRIMARY KEY,
    category character varying(200),
    task character varying(200),
    merchant_id integer,
    merchant_name character varying(75),
    assign character varying(100) NOT NULL,
    due_date date NOT NULL,
    description character varying(300),
    task_status character varying(100) NOT NULL,
    coupon_details character varying(200),
    is_deleted boolean DEFAULT false
);


-------------------- Organization Table ---------------------------------
CREATE TABLE organization (
    id SERIAL PRIMARY KEY,
    organization_name character varying(200) NOT NULL,
    type character varying(100) NOT NULL,
    address character varying(100) NOT NULL,
    city character varying(100) NOT NULL,
    state character varying(100) NOT NULL,
    zip integer NOT NULL,
    primary_contact_first_name character varying(50) NOT NULL,
    primary_contact_last_name character varying(50) NOT NULL,
    primary_contact_phone bigint NOT NULL,
    primary_contact_email character varying(100),
    is_deleted boolean DEFAULT false,
    organization_earnings numeric DEFAULT 10,
    organization_logo bytea,
    filename character varying(255)
);

------------------ Organization Tasks ----------------------------
CREATE TABLE organization_tasks (
    id SERIAL PRIMARY KEY,
    category character varying(200),
    task character varying(200),
    organization_id integer,
    organization_name character varying(75),
    assign character varying(100) NOT NULL,
    due_date date NOT NULL,
    description character varying(300),
    task_status character varying(100) NOT NULL,
    is_deleted boolean DEFAULT false
);

----------------- Sellers -----------------------------
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    "refId" character varying(20),
    lastname character varying(255),
    firstname character varying(255),
    level character varying(255),
    teacher character varying(255),
    initial_books integer,
    additional_books integer,
    books_returned integer,
    cash numeric,
    checks numeric,
    digital numeric,
    donations numeric,
    notes character varying(250),
    organization_id integer REFERENCES organization(id),
    is_deleted boolean DEFAULT false,
    digital_donations numeric
);
