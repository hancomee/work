package com.hancomee.web.controller;

import com.boosteel.nativedb.core.anno.*;
import com.hancomee.web.controller.support.ReceivableList;
import com.hancomee.web.controller.support.WorkList;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Map;

public interface _WorkSQL {

    static final String
            WORK_MEMO = "hancomee_workmemo",
            WORK_ITEM = "hancomee_workitem";


    /*
     *  ************************************ 작업 리스트 ************************************
     */
    @PageList(list="#select.work", count = "#count.work")
    WorkList listAll(Statement stmt, WorkList pager, Map<String, Object> params);
    @Selector("#state.work")
    ResultSet stateAll(Statement stmt, Map<String, Object> params);

    @SQLString("#select.work")
    String list(Map<String, Object> map);

    @SQLString("#state.work")
    String state(Map<String, Object> map);

    @SQLString("#count.work")
    String count(Map<String, Object> map);


    // ************************ 레포팅 ************************ //
    @SelectorJoin(value="#report.work", columns = {"items"})
    List<Map<String, Object>> report(@Value("st") String st, @Value("et") String et);


    /*
     *  ************************************ 작업 상세 ************************************
     */
    @Selector("SELECT * FROM hancomee_work this " +
            "INNER JOIN hancomee_customer customer ON this.customer_id = customer.id " +
            "WHERE this.uuid = :uuid")
    Map<String, Object> getWork(Statement stmt, @Value("uuid") String uuid);

    @Selector("SELECT * FROM hancomee_workitem this WHERE this.work_id = :id{i} ORDER BY this.priority")
    List<Map<String, Object>> getItems(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_ref _r USING(id) " +
            "WHERE _r.work_id = :id{i} ORDER BY this.datetime")
    List<Map<String, Object>> getRefs(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_draft _r USING(id) " +
            "WHERE _r.item_id = :id{i} ORDER BY this.datetime")
    List<Map<String, Object>> getDrafts(Statement stmt, @Value("id") Object itemId);

    @Selector("SELECT * FROM hancomee_workfile this INNER JOIN hancomee_workfile_print _r USING(id) " +
            "WHERE _r.item_id = :id{i} ORDER BY this.datetime DESC")
    List<Map<String, Object>> getPrints(Statement stmt, @Value("id") Object itemId);

    @Selector("SELECT * FROM hancomee_workmemo this WHERE this.work_id = :id{i}")
    List<Map<String, Object>> getMemos(Statement stmt, @Value("id") Object workId);

    /*
     *  ************************************ 작업 생성 & 수정 ************************************
     */
    @Selector("SELECT work_uuid2()")
    String createUUID(Statement statement);

    @Save(value = "INSERT INTO hancomee_work (customer_id, uuid, title) " +
            "VALUES (:customer_id{i}, :uuid, :title)",
            lastId = true)
    int insertWork(Statement stmt, Map<String, Object> dataMap);

    @Update(value = "hancomee_work", where = "id = :id{i}")
    int updateWork(Statement stmt, Map<String, Object> dataMap);

    // ************************ 거래처 ************************ //
    @Selector("SELECT this.* " +
            "FROM hancomee_customer this WHERE this.name LIKE :%name% ORDER BY this.name")
    List<Map<String, Object>> customerSearch(Statement stmt, @Value("name") Object name);

    @Insert(value = "hancomee_customer", lastId = true)
    int insertCustomer(Statement stmt, Map<String, Object> dataMap);

    @Update(value = "hancomee_customer", where = "id = :id{i}")
    int updateCustomer(Statement stmt, Map<String, Object> dataMap);

    // ************************ 작업메모 ************************ //
    @Insert(value = WORK_MEMO, lastId = true)
    int insertMemo(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);

    @Save("UPDATE " + WORK_MEMO + " SET value = :value WHERE id = :id")
    int updateMemo(Statement stmt, @Value("id") Object id, @Value("value") Object value);

    @Save("DELETE FROM " + WORK_MEMO + " WHERE id = :id{i}")
    int deleteMemo(Statement stmt, @Value("id") Object id);

    @Save("DELETE FROM " + WORK_MEMO + " WHERE work_id = :id{i}")
    int deleteAllMemo(Statement stmt, @Value("id") Object workId);

    @Save("UPDATE hancomee_work SET memo_len = " +
            "(SELECT count(id) FROM hancomee_workmemo WHERE work_id = :id{i}) " +
            "WHERE id = :id{i}")
    int refreshMemo(Statement stmt, @Value("id") Object workId);

    // ************************ 모든 파일 업로드 ************************ //
    @Insert(value = "hancomee_workfile", lastId = true)
    int insertFile(Statement stmt, Map<String, Object> map);

    // ************************ 인쇄파일 ************************ //
    @Insert(value = "hancomee_workfile_print", lastId = false)
    int insertPrint(Statement stmt, @Value("id") Object id, @Value("item_id") Object itemId);

    @Save("DELETE v, file FROM hancomee_workfile_print v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deletePrint(Statement stmt, @Value("id") Object id);

    @Save("DELETE v, file FROM hancomee_workfile_print v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.item_id = :id{i}")
    int deleteAllPrint(Statement stmt, @Value("id") Object itemId);

    // ************************ 시안파일 ************************ //
    @Insert(value = "hancomee_workfile_draft", lastId = false)
    int insertDraft(Statement stmt, @Value("id") Object id, @Value("item_id") Object itemId);

    @Save("DELETE v, file FROM hancomee_workfile_draft v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deleteDraft(Statement stmt, @Value("id") Object id);

    @Save("DELETE v, file FROM hancomee_workfile_draft v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.item_id = :id{i}")
    int deleteAllDraft(Statement stmt, @Value("id") Object itemId);

    // ************************ 참고파일 ************************ //
    @Save("UPDATE hancomee_work SET file_len = " +
            "(SELECT count(id) FROM hancomee_workfile_ref WHERE work_id = :id{i}) " +
            "WHERE id = :id{i}")
    int refreshRef(Statement stmt, @Value("id") Object workId);

    @Insert(value = "hancomee_workfile_ref", lastId = false)
    int insertRef(Statement stmt, @Value("id") Object id, @Value("work_id") Object workId);

    @Save("DELETE v, file FROM hancomee_workfile_ref v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.id = :id{i}")
    int deleteRef(Statement stmt, @Value("id") Object refId);

    @Save("DELETE v, file FROM hancomee_workfile_ref v " +
            "INNER JOIN hancomee_workfile file USING(id) WHERE v.work_id = :id{i}")
    int deleteAllRef(Statement stmt, @Value("id") Object workId);

    // ************************ 작업 아이템 ************************ //
    @Selector("SELECT COUNT(id) item_len, SUM(price) price, SUM(total) total, SUM(vat) vat " +
            "FROM hancomee_workitem WHERE work_id = :id{i}")
    Map<String, Object> itemValue(Statement stmt, @Value("id") Object workId);

    @Save("DELETE item, f1, f2, print, draft FROM hancomee_workitem item " +
            "LEFT OUTER JOIN hancomee_workfile_print print ON item.id = print.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f2 ON f2.id = print.id " +
            "LEFT OUTER JOIN hancomee_workfile_draft draft ON item.id = draft.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f1 ON f1.id = draft.id " +
            "WHERE item.id = :id{i}")
    int deleteWorkItem(Statement stmt, @Value("id") Object itemId);

    @Save("DELETE item, f1, f2, print, draft FROM hancomee_workitem item " +
            "LEFT OUTER JOIN hancomee_workfile_print print ON item.id = print.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f2 ON f2.id = print.id " +
            "LEFT OUTER JOIN hancomee_workfile_draft draft ON item.id = draft.item_id " +
            "LEFT OUTER JOIN hancomee_workfile f1 ON f1.id = draft.id " +
            "WHERE item.work_id = :id{i}")
    int deleteAllWorkItem(Statement stmt, @Value("id") Object workId);

    @Selector("SELECT work_id FROM " + WORK_ITEM + " WHERE id = :id")
    String getWorkId(Statement stmt, @Value("id") int itemId);

    @Update(value = "hancomee_work", where = "id = :id{i}")
    int refreshWorkItem(Statement stmt, Map<String, Object> map, @Value("id") Object id);

    @Save("DELETE FROM hancomee_work WHERE id = :id{i}")
    int deleteWork(Statement stmt, @Value("id") Object id);

    @Update(value = WORK_ITEM, where = "id = :id{i}")
    int updateItem(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);

    @Insert(value = WORK_ITEM, lastId = true)
    int insertItem(Statement stmt, Map<String, Object> map, @Value("work_id") Object workId);


    // ************************ 미수금 ************************ //
    @Selector(value="#select.receivable")
    List<Map<String, Object>> receivableList(Map<String, Object> map);


    // ************************ 사이드바 간편메모 ************************ //
    @Selector(value="SELECT this.* FROM todo this ORDER BY this.datetime DESC")
    List<Map<String, Object>> todoList();

    @Save("DELETE FROM todo WHERE id = :id{i}")
    int deleteTodo(@Value("id") Object id);

    @Save("UPDATE todo SET value = :value WHERE id = :id{i}")
    int updateTodo(@Value("id") Object id, @Value("value") String value);

    @Insert(value = "todo", lastId = true)
    int insertTodo(Map<String, Object> values);




}
