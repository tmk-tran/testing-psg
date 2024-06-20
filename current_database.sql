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

    -- Check the operation type
    CASE
        WHEN TG_OP = 'INSERT' THEN
            log_message := 'Inserted at ' || CURRENT_TIMESTAMP;
        WHEN TG_OP = 'UPDATE' THEN
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
    END CASE;

    -- Insert a new row into the audit_log table with the log message
    INSERT INTO audit_log (ref_id, action, details)
    VALUES (ref_id, TG_OP, log_message);

    -- Return the modified row so that the original update can proceed
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


------------ Trigger that fires after an update on the sellers table ------------------
CREATE TRIGGER sellers_update_trigger
AFTER INSERT OR UPDATE OF lastname, firstname, level, teacher, initial_books, additional_books, books_returned, cash, checks, digital, donations, notes, is_deleted, digital_donations
ON sellers
FOR EACH ROW
EXECUTE FUNCTION log_seller_changes();

------------ Function for logging updates from transactions table ---------------------
CREATE OR REPLACE FUNCTION log_transaction_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (ref_id, action, details)
        VALUES (NEW."refId", 'UPDATE Transactions', 'Physical Book Cash changed to: ' || NEW.physical_book_cash);
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (ref_id, action, details)
        VALUES (NEW."refId", 'INSERT Transactions', 'New record inserted');    
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-------------- Trigger for transactions table ----------------------------
CREATE TRIGGER transactions_update_trigger
AFTER INSERT OR UPDATE OF physical_book_cash
ON transactions
FOR EACH ROW
EXECUTE FUNCTION log_transaction_changes();

------------ Region Table --------------------------------
CREATE TABLE "region" (
	"id" serial PRIMARY KEY NOT NULL,
	"region_name" varchar(150) NOT NULL,
	"geospatial_map" point
);

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
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    coupon_id integer REFERENCES coupon(id)
);

----------------------------------------------------
----------- Function / Trigger for comments --------
CREATE FUNCTION before_insert_merchant_comments()
RETURNS TRIGGER AS $$
BEGIN
  NEW.created_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_merchant_comments
BEFORE INSERT ON merchant_comments
FOR EACH ROW
EXECUTE FUNCTION before_insert_merchant_comments();
----------------------------------------------------


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

-----------------------------------------------------------------------------
----------------- Sellers ---------------------------------------------------
---- "refId" is case sensitive, please make sure to include the quotes ------
CREATE TABLE sellers (
    id SERIAL PRIMARY KEY,
    "refId" character varying(20) UNIQUE,
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
    digital_donations numeric,
    books_due integer,
    coupon_book_id integer REFERENCES coupon_book(id)
);

------ Function for sellers -------------------
CREATE OR REPLACE FUNCTION update_books_due()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sellers s
    SET books_due = (s.initial_books + s.additional_books) - s.books_returned - COALESCE((
        SELECT SUM(t.physical_book_cash + t.physical_book_digital)
        FROM transactions t
        WHERE t."refId" = s."refId"
    ), 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

------- Trigger for transactions ----------------------
CREATE TRIGGER calculate_books_due_trigger
AFTER INSERT OR UPDATE OF physical_book_cash, physical_book_digital
ON transactions
FOR EACH ROW
EXECUTE FUNCTION update_books_due();

------- Trigger for sellers ----------------------
CREATE TRIGGER calculate_books_due_seller_trigger
AFTER UPDATE OF additional_books, books_returned
ON sellers
FOR EACH ROW
EXECUTE FUNCTION update_books_due();

------------ Customers table ------------------------------
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    "refId" character varying(10) REFERENCES sellers("refId"),
    last_name character varying(30) NOT NULL,
    first_name character varying(30) NOT NULL,
    phone bigint,
    created timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    email character varying(50),
    address character varying(50),
    unit character varying(10),
    city character varying(50),
    state character varying(25),
    zip integer
);

-------------------------------------------------------------
----------- Transactions ------------------------------------
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    "refId" character varying(10) REFERENCES sellers("refId") UNIQUE,
    organization_id integer REFERENCES organization(id),
    physical_book_cash integer DEFAULT 0,
    physical_book_digital integer DEFAULT 0,
    digital_book_credit integer DEFAULT 0,
    seller_earnings numeric DEFAULT 0
);

------ Function for transactions --------
CREATE OR REPLACE FUNCTION calculate_seller_earnings()
RETURNS TRIGGER AS $$
BEGIN
    NEW.seller_earnings := (NEW.physical_book_cash + NEW.physical_book_digital + NEW.digital_book_credit) * (
        SELECT organization_earnings FROM organization WHERE id = NEW.organization_id
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

------- Trigger for transactions calc seller earnings ------
CREATE TRIGGER update_seller_earnings_trigger
BEFORE INSERT OR UPDATE OF physical_book_cash, physical_book_digital, digital_book_credit
ON transactions
FOR EACH ROW
EXECUTE FUNCTION calculate_seller_earnings();

-------- Function to create new transaction row for seller ----------------
CREATE OR REPLACE FUNCTION create_transaction_for_new_seller()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO transactions ("refId", organization_id)
    VALUES (NEW."refId", NEW.organization_id);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-------- Trigger for transaction row creations for seller -----------------
CREATE TRIGGER create_transaction_trigger
AFTER INSERT ON sellers
FOR EACH ROW
EXECUTE FUNCTION create_transaction_for_new_seller();
---------------------------------------------------------------------------

---------- Function for updating seller earnings --------------------------
CREATE OR REPLACE FUNCTION update_seller_earnings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE seller
    SET seller_earnings = (physical_book_cash + physical_book_digital + digital_book_credit) * NEW.organization_earnings
    WHERE organization_id = NEW.id;
    
    RETURN NULL; -- Returning NULL to prevent update on organization table
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_seller_earnings_trigger
AFTER UPDATE OF organization_earnings ON organization
FOR EACH ROW
EXECUTE FUNCTION update_seller_earnings();


----------------------------------------------------------------------
-------------------- Coupon table ------------------------------------
CREATE TABLE coupon (
    id SERIAL PRIMARY KEY,
    merchant_id integer REFERENCES merchant(id),
    is_deleted boolean DEFAULT false,
    filename_front character varying(255),
    front_view_pdf bytea,
    filename_back character varying(255),
    back_view_pdf bytea,
    offer character varying(200),
    value numeric,
    exclusions character varying(200),
    expiration date,
    additional_info character varying(200),
    task_id integer REFERENCES merchant_tasks(id),
    book_id integer REFERENCES coupon_book(id)
);
----------------------------------------------------------------------

--------------------------------------------------------------------
-------- For updating coupon list when merchant is archived --------          

CREATE OR REPLACE FUNCTION update_coupon_on_merchant_archive()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.is_deleted IS DISTINCT FROM NEW.is_deleted AND NEW.is_deleted = true THEN
        UPDATE coupon SET is_deleted = true WHERE merchant_id = NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupon_trigger
AFTER UPDATE OF is_deleted ON merchant
FOR EACH ROW
EXECUTE FUNCTION update_coupon_on_merchant_archive();

--------------------------------------------------------------------
--------------------------------------------------------------------

----------------------------------------------------------
------- Table to tie locations to coupons ----------------
CREATE TABLE coupon_location (
    id SERIAL PRIMARY KEY,
    coupon_id integer REFERENCES coupon(id),
    location_id integer REFERENCES location(id),
    is_redeemed boolean DEFAULT false,
    CONSTRAINT unique_coupon_location UNIQUE (coupon_id, location_id)
);

-----------------------------------------------------------
-------- Coupon Redemption --------------------------------
CREATE TABLE coupon_redemption (
    id SERIAL PRIMARY KEY,
    coupon_id integer REFERENCES coupon(id),
    location_id integer REFERENCES location(id),
    redeemed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    redeemed_by integer REFERENCES "user"(id) ON DELETE CASCADE
);

---------- Paypal transactions table ---------------
CREATE TABLE paypal_transactions (
    id SERIAL PRIMARY KEY,
    status character varying(50),
    payment_source_email character varying(255),
    payment_source_account_id character varying(255),
    payment_source_account_status character varying(50),
    payment_source_name_given_name character varying(255),
    payment_source_name_surname character varying(255),
    purchase_units_reference_id character varying(255),
    purchase_units_shipping_name_full_name character varying(255),
    purchase_units_shipping_address_address_line_1 character varying(255),
    purchase_units_shipping_address_admin_area_2 character varying(255),
    purchase_units_shipping_address_admin_area_1 character varying(255),
    purchase_units_shipping_address_postal_code character varying(20),
    purchase_units_payments_captures_id character varying(255),
    purchase_units_payments_captures_status character varying(50),
    purchase_units_payments_captures_amount_value numeric(10,2),
    purchase_units_payments_captures_create_time timestamp without time zone,
    purchase_units_payments_captures_update_time timestamp without time zone,
    payer_name_given_name character varying(255),
    payer_name_surname character varying(255),
    payer_email_address character varying(255),
    payer_payer_id character varying(255),
    links_href character varying(255),
    links_rel character varying(50),
    links_method character varying(10),
    seller_receivable_gross_amount_value numeric(10,2),
    seller_receivable_paypal_fee_value numeric(10,2),
    seller_receivable_net_amount_value numeric(10,2)
);
----------------------------------------------------

---------- Trigger for coupon related tasks --------

-- Function for coupons / tasks
CREATE OR REPLACE FUNCTION create_coupon_on_new_task()
RETURNS TRIGGER AS
$$
DECLARE
    new_coupon_id INTEGER;
BEGIN
    -- Check if the task is 'new create proof'
    IF LOWER(NEW.task) = 'new create proof' AND NOT NEW.is_auto_generated THEN
        -- Start a transaction
        BEGIN
            -- Insert a new row into the coupon table
            INSERT INTO coupon (merchant_id, offer, value, exclusions, expiration, additional_info, task_id, book_id, is_auto_generated)
            VALUES (NEW.merchant_id, NEW.coupon_details, NULL, NULL, NULL, NULL, NEW.id, NEW.book_id, true)
            RETURNING id INTO new_coupon_id;

            -- Update the merchant_tasks table with the new coupon_id
            UPDATE merchant_tasks SET coupon_id = new_coupon_id WHERE id = NEW.id;
        -- Commit the transaction
        END;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

DROP TRIGGER new_task_trigger ON merchant_tasks;

-- Trigger for tasks
CREATE TRIGGER new_task_trigger
AFTER INSERT ON merchant_tasks
FOR EACH ROW
EXECUTE FUNCTION create_coupon_on_new_task();

----------------------------------------------------
-- Function for adding task when a new coupon is added
CREATE OR REPLACE FUNCTION create_task_on_new_coupon()
RETURNS TRIGGER AS
$$
DECLARE
    new_merchant_name VARCHAR(75);
BEGIN
    -- Fetch the merchant_name based on the merchant_id
    SELECT merchant_name INTO new_merchant_name FROM merchant WHERE id = NEW.merchant_id LIMIT 1;

	-- Check if the coupon is not auto-generated
    IF NOT NEW.is_auto_generated THEN
    -- Insert a new row into the merchant_tasks table
    INSERT INTO merchant_tasks (category, task, merchant_id, merchant_name, assign, due_date, description, task_status, coupon_details, coupon_id, book_id, is_auto_generated)
    VALUES ('Coupon', 'New create proof', NEW.merchant_id, new_merchant_name, NULL, NULL, NULL, 'New', NULL, NEW.id, NEW.book_id, true);
    
    -- Get the newly inserted task's id
    SELECT id INTO NEW.task_id FROM merchant_tasks WHERE coupon_id = NEW.id;

    -- Update the coupon table with the new task_id
    UPDATE coupon SET task_id = NEW.task_id WHERE id = NEW.id;
    
END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Drop the existing trigger if it exists
DROP TRIGGER IF EXISTS new_coupon_trigger ON coupon;

-- Trigger for coupons
CREATE TRIGGER new_coupon_trigger
AFTER INSERT ON coupon
FOR EACH ROW
EXECUTE FUNCTION create_task_on_new_coupon();

----------------------------------------------------
CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username character varying(80) NOT NULL UNIQUE,
    password character varying(1000) NOT NULL,
    is_admin boolean DEFAULT false,
    is_deleted boolean DEFAULT false,
    org_admin boolean DEFAULT false,
    graphic_designer boolean DEFAULT false,
    first_name character varying(100),
    last_name character varying(100)
);

---------- JOIN table for users who are orgAdmins -----------
CREATE TABLE user_org_admin (
    user_id integer REFERENCES "user"(id) ON DELETE CASCADE,
    org_id integer REFERENCES organization(id),
    CONSTRAINT user_org_admin_pkey PRIMARY KEY (user_id, org_id)
);

------- Table for creating coupon list for users, uses function -----
------- and trigger listed below ------------------------------------

CREATE TABLE user_coupon (
    id SERIAL PRIMARY KEY,
    user_id integer REFERENCES "user"(id) ON DELETE CASCADE,
    coupon_id integer REFERENCES coupon(id),
    location_id integer REFERENCES location(id),
    redeemed boolean DEFAULT false,
    show_book boolean DEFAULT false,
    CONSTRAINT user_coupon_user_id_coupon_id_location_id_key UNIQUE (user_id, coupon_id, location_id)
);

-- Function to insert coupon IDs for a new user and mark them as unredeemed
CREATE OR REPLACE FUNCTION insert_user_coupons()
RETURNS TRIGGER AS
$$
BEGIN
    -- Insert coupon IDs for the new user into user_coupon table
    INSERT INTO user_coupon (user_id, coupon_id)
	SELECT NEW.id, id
	FROM coupon;


    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger to automatically insert coupon IDs for a new user
CREATE TRIGGER insert_user_coupons_trigger
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION insert_user_coupons();


----------------------------------------------------------------------

----------------------------------------------------------------------
------- Function and trigger for unique coupons for users ------------
CREATE OR REPLACE FUNCTION redeem_coupon_trigger_function()
RETURNS TRIGGER AS
$$
BEGIN
    -- Insert a record into the user_coupons table when a coupon is redeemed
    INSERT INTO user_coupon (user_id, coupon_id, location_id)
    VALUES (NEW.redeemed_by, NEW.coupon_id, NEW.location_id);
    -- Update the redeemed column to true in the coupon_redemption table
    UPDATE user_coupon
    SET redeemed = true
    WHERE user_id = NEW.redeemed_by AND coupon_id = NEW.coupon_id;
    
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

-- Trigger --
CREATE TRIGGER redeem_coupon_trigger
AFTER INSERT ON coupon_redemption
FOR EACH ROW
EXECUTE FUNCTION redeem_coupon_trigger_function();

----------------------------------------------------

----------------------------------------------------
------------- Coupon Book Table --------------------
CREATE TABLE coupon_book (
    id SERIAL PRIMARY KEY,
    year character varying(20) NOT NULL,
    active boolean DEFAULT false
);
----------------------------------------------------
----------------------------------------------------