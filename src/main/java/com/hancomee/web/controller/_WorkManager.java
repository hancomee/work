package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.support.RepositoryConfig;
import com.hancomee.web.controller.support.WorkList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class _WorkManager {

    @Autowired
    NativeDB db;

    _WorkSQL SQL;
    RepositoryConfig CONFIG;

    @PostConstruct
    public void before() {
        /*
         *  jar 실행시 path를 가지고 오는 방법은 좀 더럽다.
         *  AsStream을 통해서만 파일을 가지고 올 수 있다.
         */

        SQL = db.createRepository(
                _WorkSQL.class,
                CONFIG = new RepositoryConfig()
                        .addSQL(_WorkManager.class.getClassLoader().getResourceAsStream("work.sql"))
        );
    }

    /*
     *  작업 추가하기
     *  반환값은 uuid
     *
     *  폴더도 미리 만들어놓는다.
     *
     */
    private static final Path ROOT = Paths.get("D:\\work");

    // 새작업만들기
    public String createWork(Map<String, Object> map) {
        return db.doStmtR(stmt -> {
            String uuid = SQL.createUUID(stmt);

                    /*year = uuid.substring(0, 4),
                    month = uuid.substring(5, 7),
                    num = uuid.substring(7, uuid.length());

            // 폴더 생성
            Files.createDirectories(ROOT.resolve(year).resolve(month).resolve(num));*/

            map.put("uuid", uuid);
            SQL.insertWork(stmt, map);

            return uuid;
        });
    }

    // 작업 아예 삭제하기
    public _WorkManager removeWork(Object workId) {

        db.doStmt(stmt -> {
            // 모든 메모 삭제
            SQL.deleteAllMemo(stmt, workId);
            // 모든 파일 삭제
            SQL.deleteAllRef(stmt, workId);

            SQL.deleteAllWorkItemFiles(stmt, workId);
            // 모든 아이템 삭제
            SQL.deleteAllWorkItem(stmt, workId);

            SQL.deleteWork(stmt, workId);
        });

        return this;
    }

    // 작업 리스트 가지고 오기
    public WorkList getWorkList(WorkList list, Map<String, Object> map) {
        return db.doStmtR(stmt -> {

            if (map.get("state") == null) map.put("state", 0);

            String
                    duration = map.get("duration").toString(),
                    today = LocalDate.now().toString();

            // duration=today
            if (duration.equals("today")) {
                map.put("st", today);
                map.put("et", today);
            }
            list.setArray(parseState(SQL.stateAll(stmt, map)));
            SQL.listAll(stmt, list, map);

            // 당일판
            map.put("st", today);
            map.put("et", today);
            list.setToday(parseState(SQL.stateAll(stmt, map))[0]);
            return list;
        });
    }

    private int[][] parseState(ResultSet rs) throws Exception {
        int[] count = {0, 0, 0, 0, 0, 0, 0}, total = {0, 0, 0, 0, 0, 0, 0};
        int index;
        while (rs.next()) {
            index = rs.getInt("idx");
            count[index] = rs.getInt("count");
            total[index] = rs.getInt("sum");
        }
        return new int[][]{count, total};
    }

    // CASE문으로 priority 갱신하기
    public int setPriority(List<String> list) {
        return db.doStmtR(statement -> {
            return statement.executeUpdate(priorityQuery(list));
        });
    }

    private String priorityQuery(List<String> ids) {
        List whens = new ArrayList();
        int i = 0;
        for (String id : ids) {
            whens.add("WHEN " + id + " THEN " + i++ + " ");
        }

        return "UPDATE hancomee_workitem " +
                "SET priority = CASE id " +
                String.join("", whens) +
                "ELSE priority " +
                "END " +
                "WHERE id IN(" + String.join(", ", ids) + ")";
    }

    public Map<String, Object> getWork(String uuid) {
        return db.doStmtR(stmt -> {

            // work, work.customer
            Map<String, Object>
                    result = new HashMap<>(),
                    work = SQL.getWork(stmt, uuid);
            Object id = work.get("id");

            // work.ref
            work.put("refs", SQL.getRefs(stmt, id));
            work.put("memo", SQL.getMemos(stmt, id));

            // workItem
            List<Map<String, Object>> items = SQL.getItems(stmt, id);

            // workItem.draft,  workItem.print
            for (Map<String, Object> m : items) {
                id = m.get("id");
                m.put("draft", SQL.getDrafts(stmt, id));
                m.put("print", SQL.getPrints(stmt, id));
            }

            result.put("work", work);
            result.put("items", items);
            return result;
        });
    }

    public void updateState(long id, int state) {


        db.doStmt(stmt -> {

            /*
             *  제작중으로 넘어갈때는 activetime도 갱신한다.
             *  제작이 넘어간 건수부터 이번달 집계로 쓴다.
             *
             *  datetime과 activetime이 같은때만 activetme을 갱신한다.
             *  (다를 경우 이미 이전에 갱신되었었다는 뜻이다.)
             *  실수로 state를 왔다갔다 변경하게 될 경우가 있을지 모르는데,
             *  이때마다 state가 변경되면 매출 집계가 뒤죽박죽이 된다. (게다가 이미 데이터 유실로 복원도 안됨)
             */
            String updateActive = "UPDATE hancomee_work w " +
                    "SET " +
                    "w.state = " + state + ", " +
                    "w.activetime = " +
                    "CASE " +
                    "WHEN " + state + " > 5 AND w.activetime = w.datetime THEN now() " +
                    "ELSE w.activetime " +
                    "END " +
                    "WHERE w.id = " + id;
            stmt.executeUpdate(updateActive);
        });
    }


    public List<Map<String, Object>> searchCustomer(String key) {
        return db.doStmtR(stmt -> SQL.customerSearch(stmt, key));
    }

    public void updateWork(Object id, Map<String, Object> data) {
        data.put("id", id);
        db.doStmt(stmt -> SQL.updateWork(stmt, data));
    }

    public Object createCustomer(Map<String, Object> map) {
        return db.doStmtR(stmt -> SQL.insertCustomer(stmt, map));
    }

    public void updateCustomer(Map<String, Object> map) {
        db.doStmt(stmt -> SQL.updateCustomer(stmt, map));
    }

    // 참고파일 추가하기
    public int addRef(int workId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertRef(stmt, id, workId);
            SQL.refreshRef(stmt, workId);
            return id;
        });
    }

    public void deleteRef(int id) {
        db.doStmt(stmt -> {
            try (ResultSet rs = stmt.executeQuery("SELECT work_id FROM hancomee_workfile_ref WHERE id = " + id)) {
                rs.next();
                SQL.deleteRef(stmt, id);
                SQL.refreshRef(stmt, rs.getInt(1));
            }

        });
    }

    public void deletePrint(int id) {
        db.doStmt(stmt -> SQL.deletePrint(stmt, id));
    }

    public void deleteDraft(int id) {
        db.doStmt(stmt -> SQL.deleteDraft(stmt, id));
    }

    // 인쇄파일 추가하기
    public int addPrint(int itemId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertPrint(stmt, id, itemId);
            return id;
        });
    }

    // 시안파일 추가하기
    public int addDraft(int itemId, Map<String, Object> fileData) {
        return db.doStmtR(stmt -> {
            int id = SQL.insertFile(stmt, fileData);
            SQL.insertDraft(stmt, id, itemId);
            return id;
        });
    }


    /*
     *   작업 아이템 추가, 수정
     */
    public int saveItem(Object workId, Map<String, Object> itemData) {
        return db.doStmtR(stmt -> {
            Object id = itemData.get("id");

            // id 유무에 따라 Insert or Update
            if (id == null) itemData.put("id", id = SQL.insertItem(stmt, itemData, workId));
            else SQL.updateItem(stmt, itemData, workId);

            // hancomee_work의 item_len 등을 갱신한다.
            SQL.refreshWorkItem(stmt, SQL.itemValue(stmt, workId), workId);

            return Integer.parseInt(id.toString());
        });
    }

    /*
     *  작업 아이템 지우기
     */
    public void removeItem(int itemId) {
        db.doStmt(stmt -> {
            // print, draft도 모두 지움
            SQL.deleteAllDraft(stmt, itemId);
            SQL.deleteAllPrint(stmt, itemId);

            String workId = SQL.getWorkId(stmt, itemId);
            SQL.deleteWorkItem(stmt, itemId);
            // hancomee_work의 item_len 등을 갱신한다.
            SQL.refreshWorkItem(stmt, SQL.itemValue(stmt, workId), workId);
        });
    }


    public Object saveMemo(Object workId, Map<String, Object> memoData) {
        return db.doStmtR(stmt -> {
            Object id = memoData.get("id");
            if (id == null) id = SQL.insertMemo(stmt, memoData, workId);
            else SQL.updateMemo(stmt, id, memoData.get("value"));
            SQL.refreshMemo(stmt, workId);
            return id;
        });
    }

    public void removeMemo(Object memoId, Object workId) {
        db.doStmt(stmt ->
        {
            SQL.deleteMemo(stmt, memoId);
            SQL.refreshMemo(stmt, workId);
        });
    }


    public Object receivableList(Map<String, Object> map) {
        return SQL.receivableList(map);
    }


}
