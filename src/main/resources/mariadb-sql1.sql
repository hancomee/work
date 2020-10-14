
SET SQL_SAFE_UPDATES =0;
SET FOREIGN_KEY_CHECKS = 1;
SET autocommit = 0;


# ************************************ customer 변경  ************************************
SHOW CREATE TABLE hancomee_customer;
ALTER TABLE hancomee_customer MODIFY COLUMN address varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN biz_con varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN biz_num varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN biz_type varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN email varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN fax varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN memo TEXT NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN mobile varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN owner varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN tel varchar(255) NOT NULL DEFAULT '';
ALTER TABLE hancomee_customer MODIFY COLUMN datetime datetime NOT NULL DEFAULT current_timestamp();

# ************************************ customer 변경  ************************************
ALTER TABLE hancomee_work MODIFY COLUMN cost int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN file_len int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN item_len int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN memo_len int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN price int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN total int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN vat int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN datetime datetime NOT NULL DEFAULT current_timestamp();
ALTER TABLE hancomee_work MODIFY COLUMN state int(11) NOT NULL DEFAULT 0;
ALTER TABLE hancomee_work MODIFY COLUMN text TEXT NOT NULL DEFAULT '';
ALTER TABLE hancomee_work MODIFY COLUMN title varchar(255) NOT NULL;
ALTER TABLE hancomee_work MODIFY COLUMN updatetime timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp();
ALTER TABLE hancomee_work MODIFY COLUMN uuid varchar(255) NOT NULL;
ALTER TABLE hancomee_work MODIFY COLUMN customer_id bigint(20) NOT NULL;
ALTER TABLE hancomee_work MODIFY COLUMN activetime datetime NOT NULL DEFAULT current_timestamp();


SELECT COUNT(id) FROM hancomee_work WHERE customer_id = 1058;
UPDATE hancomee_work SET customer_id = 1046 WHERE customer_id = 1058;
DELETE FROM hancomee_customer WHERE id = 1058;