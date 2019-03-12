package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.DataAccess;
import com.boosteel.nativedb.core.SQL;
import com.boosteel.nativedb.core.TableInfo;
import com.boosteel.util.support.MapAccess;
import com.hancomee.web.controller.support.DataTablePager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.ResultSet;
import java.util.HashMap;
import java.util.Map;

import static com.boosteel.nativedb.core.ResultSetAccess.readAll;

@Controller
@RequestMapping("datatable")
public class DataTable {

    @Autowired
    NativeDB workDB;

    Map<String, TableInfo> tables = new HashMap<>();

    @RequestMapping(value = "list/{table}", method = RequestMethod.POST)
    @ResponseBody
    public Object list(@PathVariable("table") String tableName, @RequestBody DataTablePager pager) throws Exception {

        return workDB.doStmtR(statement -> {

            pager.setTable(tableName);
            String[] values = pager.SQL();
            System.out.println(values[0]);
            System.out.println(values[1]);
            try (ResultSet rs = statement.executeQuery(values[0]);
                 ResultSet rs2 = statement.executeQuery(values[1])) {
                pager.setContents(readAll(rs));
                rs2.next();
                pager.setTotalElements(rs2.getLong(1));
            }

            return pager;

        });
    }

    @RequestMapping(value = "save/{table}", method = RequestMethod.PUT)
    @ResponseBody
    public void save(@PathVariable("table") String tableName, @RequestBody Map<String, Object> obj) throws Exception {

        if (obj.containsKey("id")) {
            workDB.update(tableName, obj, "id = " + obj.get("id"));
        } else {
            workDB.insert(tableName, obj);
        }

    }

    @RequestMapping(value = "remove/{table}/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void list(@PathVariable("table") String tableName, @PathVariable("id") String id) throws Exception {
        workDB.doStmt(s -> {
            s.executeUpdate("DELETE FROM " + tableName + " WHERE id = " + id);
        });
    }
}
