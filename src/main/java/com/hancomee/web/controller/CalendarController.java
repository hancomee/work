package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.SQL;
import com.boosteel.nativedb.core.anno.Insert;
import com.boosteel.nativedb.core.anno.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

import static com.hancomee.web.controller.db.ResultSetUtil.read;

@Controller
@RequestMapping("calendar")
public class CalendarController {


    @Autowired
    NativeDB workDB;
    C_SQL _SQL;

    Map<String, String> methodMap = createMethoMap("id:int date:string category:string text:string priority:int created:time complete:int");

    @PostConstruct
    public void init() throws Exception {
        _SQL = workDB.createRepository(C_SQL.class);
    }

    public interface C_SQL {

        @Insert(value = "hancomee_calendar", lastId = true)
        int insertContent(Statement stmt, Map<String, Object> map);

        @Update(value = "hancomee_calendar")
        int updateContent(Statement stmt, Map<String, Object> dataMap);
    }

    @RequestMapping()
    public Object html() throws Exception {
        return "/work2/calendar.html";
    }


    @RequestMapping(value = "list")
    @ResponseBody
    public Object list(@RequestParam("st") String st, @RequestParam("et") String et) throws Exception {
        String sql = "SELECT * FROM hancomee_calendar WHERE date BETWEEN {0} AND {1}";
        return workDB.doStmtR(s -> {
            try (ResultSet rs = s.executeQuery(SQL.mapToSQL(sql, st, et))) {
                return read(rs, methodMap, "date");
            }
        });
    }


    @RequestMapping(value ="save", method=RequestMethod.POST)
    @ResponseBody
    public Object save(@RequestBody Map<String, Object> map) throws Exception {
        Object id = map.get("id");
        return workDB.doStmtR( s -> {
            // insert
            if(id == null) {
               return  _SQL.insertContent(s, map);
            }
            // update
            else {
                _SQL.updateContent(s, map);
                return id;
            }
        });
    }

    @RequestMapping(value ="remove/{id}", method=RequestMethod.DELETE)
    @ResponseBody
    public void remove(@PathVariable("id") String id) throws Exception {
        workDB.doStmt( s -> {
            s.executeUpdate("DELETE FROM hancomee_calendar WHERE id = " + id);
        });
    }

    private Map<String, String> createMethoMap(String str) {
        Map<String, String> map = new HashMap<>();
        for (String value : str.split(" ")) {
            String[] values = value.split(":");
            map.put(values[0], values[1]);
        }
        return map;
    }



}
