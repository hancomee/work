SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_ref _r USING(id) WHERE _r.work_id = :id{i} ORDER BY this.datetime

# select.work
SELECT work.*, customer.*, draft.*
            FROM hancomee_work work
            INNER JOIN hancomee_customer customer ON work.customer_id = customer.id
            LEFT OUTER JOIN hancomee_workitem item ON work.id = item.work_id
            [INNER JOIN hancomee_workmemo memo ON work.id = memo.work_id  |memo]
            [INNER JOIN hancomee_workfile_ref ref ON ref.work_id = work.id  |ref]
            [INNER JOIN hancomee_workfile wfile1 ON ref.id = wfile1.id  |ref]
            [INNER JOIN hancomee_workfile_print print ON print.item_id = item.id  |print]
            [INNER JOIN hancomee_workfile wfile3 ON print.id = wfile3.id  |print]
            LEFT OUTER JOIN hancomee_workfile_draft draft ON draft.item_id = item.id
            LEFT OUTER JOIN hancomee_workfile wfile2 ON draft.id = wfile2.id
            WHERE work.state = :state{i}
            [AND work.title LIKE :%title%]
            [AND print.original_name LIKE :%print%]
            [AND ref.original_name LIKE :%ref%]
            [AND customer.name LIKE :%customerName%]
            [AND item.subject LIKE :%itemSubject%]
            [AND memo.value LIKE :%memo%]
            [AND work.datetime BETWEEN :st{st} AND :et{et}]
            GROUP BY work.id;

# state.work
SELECT r.state, count(r.state), sum(r.total)
FROM
	(
		SELECT work.state, work.total FROM hancomee_work work
            [INNER JOIN hancomee_customer customer ON work.customer_id = customer.id   |customerName]
            [INNER JOIN hancomee_workitem item ON work.id = item.work_id   |itemSubject,print]
            [INNER JOIN hancomee_workmemo memo ON work.id = memo.work_id   |memo]
            [INNER JOIN hancomee_workfile_ref ref ON ref.work_id = work.id  |ref]
            [INNER JOIN hancomee_workfile wfile1 ON ref.id = wfile1.id  |ref]
            [INNER JOIN hancomee_workfile_print print ON print.item_id = item.id  |print]
            [INNER JOIN hancomee_workfile wfile3 ON print.id = wfile3.id  |print]
            WHERE 1
            [AND work.title LIKE :%title%]
            [AND print.original_name LIKE :%print%]
            [AND ref.original_name LIKE :%ref%]
            [AND customer.name LIKE :%customerName%]
            [AND item.subject LIKE :%itemSubject%]
            [AND memo.value LIKE :%memo%]
            [AND work.datetime BETWEEN :st{st} AND :et{et}]
            GROUP BY work.id
	) r
GROUP BY r.state;



/*

 GROUP BY work.id 를 쓰게 되면 행이 나뉘게 된다.
 GROUP BY는 아마도 결과를 행으로 그룹화시키는 역할을 하는 것 같다.

 */
# count.work
SELECT count(DISTINCT work.id)
            FROM hancomee_work work
            [INNER JOIN hancomee_customer customer ON work.customer_id = customer.id   |customerName]
            [INNER JOIN hancomee_workitem item ON work.id = item.work_id   |itemSubject,print]
            [INNER JOIN hancomee_workmemo memo ON work.id = memo.work_id  |memo]
            [INNER JOIN hancomee_workfile_ref ref ON ref.work_id = work.id  |ref]
            [INNER JOIN hancomee_workfile wfile1 ON ref.id = wfile1.id  |ref]
            [INNER JOIN hancomee_workfile_print print ON print.item_id = item.id  |print]
            [INNER JOIN hancomee_workfile wfile3 ON print.id = wfile3.id  |print]
            WHERE work.state = :state{i}
            [AND work.title LIKE :%title%]
            [AND print.original_name LIKE :%print%]
            [AND ref.original_name LIKE :%ref%]
            [AND customer.name LIKE :%customerName%]
            [AND item.subject LIKE :%itemSubject%]
            [AND memo.value LIKE :%memo%]
            [AND work.datetime BETWEEN :st{st} AND :et{et}];