
/*
SHOW CREATE FUNCTION hancomee_months_stats;
SHOW CREATE FUNCTION hancomee_search_img;
SHOW CREATE FUNCTION hancomee_state_of_all;
SHOW CREATE FUNCTION hancomee_state_of_all_by;
SHOW CREATE FUNCTION hancomee_state_of_search_customer;
SHOW CREATE FUNCTION hancomee_state_of_search_files;
SHOW CREATE FUNCTION hancomee_state_of_search_item;
SHOW CREATE FUNCTION hancomee_state_of_search_memo;
SHOW CREATE FUNCTION hancomee_state_of_search_title;
SHOW CREATE FUNCTION work_uuid;
*/




DELIMITER ;;

DROP FUNCTION IF EXISTS hancomee_months_stats;;

CREATE FUNCTION hancomee_months_stats(t CHAR(10), c int) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE et CHAR(10) DEFAULT date_add(CONCAT(t, '-01'), interval + 1 month);							# 다음달 1일
    DECLARE bt CHAR(19) DEFAULT CONCAT(date_add(CONCAT(t, '-01'), interval - 1 day), ' ', '23:59:59');	# 전달 마지막 순간

	/* 각 월별 매출, 작업수 산출 */
    DECLARE result TEXT DEFAULT '';
    DECLARE ct CHAR(10);				# 계산 중인 달
    DECLARE i INT DEFAULT 1;

    REPEAT
		SET ct =  date_add(et, interval - 1 month);		# 실제 계산중인 달

		SELECT CONCAT(result, ',', DATE_FORMAT(ct, '%Y-%m'), '=', IFNULL(SUM(w.total), 0), '/', COUNT(w.total)) INTO result
					FROM hancomee_work w WHERE w.state = 6 AND bt < w.activetime AND w.activetime < et;

        SET et = date_add(et, interval - 1 month);
        SET bt = date_add(bt, interval - 1 month);
        SET i = i + 1;
    UNTIL i > c
    END REPEAT;

    RETURN substring(result, 2, length(result));

END;;



DROP FUNCTION IF EXISTS hancomee_search_img;;

CREATE FUNCTION hancomee_search_img(word VARCHAR(255)) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.state), '-', f.save_name) INTO result
			FROM hancomee_work w
            INNER JOIN hancomee_customer c ON w.customer_id = c.id
            INNER JOIN hancomee_workitem i ON w.id = i.work_id
            INNER JOIN hancomee_workfile_draft d ON i.id = d.item_id
            INNER JOIN hancomee_workfile f ON d.id = f.id
            WHERE w.state = i AND c.name LIKE word;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_all;;

CREATE FUNCTION hancomee_state_of_all() RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.state)) INTO result FROM hancomee_work w
        WHERE w.state = i;

		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_all_by;;

CREATE FUNCTION hancomee_state_of_all_by(st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.id)) INTO result
        FROM hancomee_work w
        WHERE w.state = i AND w.activetime BETWEEN st AND et;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_search_customer;;

CREATE FUNCTION hancomee_state_of_search_customer(word VARCHAR(255), st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.state)) INTO result
			FROM hancomee_work w INNER JOIN hancomee_customer c ON w.customer_id = c.id
            WHERE w.activetime BETWEEN st AND et
            AND w.state = i
            AND c.name LIKE word;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_search_files;;

CREATE FUNCTION hancomee_state_of_search_files(word VARCHAR(255), st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT

		# 인쇄파일은 여러개의 중복결과를 가지고 올 수 있으므로, 중복방지를 위해 서브쿼리를 이용햇다.
		SELECT CONCAT(result, ',', IFNULL(SUM(u.total), 0), '/', COUNT(u.id)) INTO result
			FROM
            (
				SELECT i.id id, w.total total
				FROM hancomee_work w INNER JOIN hancomee_workitem i ON w.id = i.work_id
				INNER JOIN hancomee_workfile_print p ON p.item_id = i.id
				INNER JOIN hancomee_workfile wf ON p.id = wf.id
				WHERE w.activetime BETWEEN st AND et
                AND w.state = i
                AND wf.original_name LIKE word GROUP BY i.id
            ) u;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_search_item;;

CREATE FUNCTION hancomee_state_of_search_item(word VARCHAR(255), st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.state)) INTO result
			FROM hancomee_work w INNER JOIN hancomee_workitem i ON w.id = i.work_id
            WHERE w.activetime BETWEEN st AND et
            AND w.state = i
            AND (i.subject LIKE word OR i.detail LIKE word OR i.memo LIKE word);
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_search_memo;;

CREATE FUNCTION hancomee_state_of_search_memo(word VARCHAR(255), st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.state)) INTO result
			FROM hancomee_work w INNER JOIN hancomee_workmemo i ON w.id = i.work_id
            WHERE w.activetime BETWEEN st AND et
            AND w.state = i
            AND i.value LIKE word;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS hancomee_state_of_search_title;;

CREATE FUNCTION hancomee_state_of_search_title(word VARCHAR(255), st datetime, et datetime) RETURNS text CHARSET utf8
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN

	DECLARE result TEXT DEFAULT '';
	DECLARE i INT DEFAULT 0;

    REPEAT
		SELECT CONCAT(result, ',', IFNULL(SUM(w.total), 0), '/', COUNT(w.total)) INTO result
		FROM hancomee_work w
        WHERE w.activetime BETWEEN st AND et
        AND w.state = i
        AND w.title LIKE word;
		SET i = i + 1;
    UNTIL i > 6
    END REPEAT;

    RETURN substring(result, 2, length(result));
END;;


DROP FUNCTION IF EXISTS work_uuid;;

CREATE FUNCTION work_uuid(val VARCHAR(10)) RETURNS bigint(20) unsigned
    MODIFIES SQL DATA
    SQL SECURITY INVOKER
BEGIN
	INSERT INTO work_uuid_table SET n = val, v=(@v_current_value:=1)
    ON DUPLICATE KEY
    UPDATE v=(@v_current_value:=v+1);

    RETURN @v_current_value;
END;;

DELIMITER ;