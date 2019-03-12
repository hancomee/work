package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.SQLString;
import com.boosteel.nativedb.core.anno.Selector;
import org.junit.Test;

import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class 한컴데이터정리 {

    private NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");

    @Test
    public void copy() throws Exception {


       //업체명("임봉식");
        //업체명정리(1058, 1046);
        업체();
    }

    public void 업체() {
        List<String> list = new ArrayList<>();
        db.doStmt(s -> {
            try(ResultSet rs = s.executeQuery("SELECT * FROM hancomee_customer")) {
                while(rs.next()) {
                    list.add(rs.getString("id") + "\t" +
                    rs.getString("name"));
                }
            }
        });
        out(String.join("\n", list));
    }

    public void 업체명(String str) {
        String sql = "SELECT id, name " +
                "FROM hancomee_customer " +
                "WHERE name LIKE '%" + str + "%'";

        db.doStmt(statement -> {
            try (ResultSet rs = statement.executeQuery(sql);) {
                while (rs.next()) {
                    String id = rs.getString(1),
                            name = rs.getString(2);

                    out(id + " " + name);
                }
            }
        });
    }

    public void 업체명정리(Object from, Object to) {
        int[] i = {1};
        List<String> list = new ArrayList<>();
        String sql = "SELECT w.id, w.title, c.name " +
                "FROM hancomee_work w " +
                "INNER JOIN hancomee_customer c ON w.customer_id = c.id " +
                "WHERE w.customer_id = " + from;
        db.doStmt(statement -> {
            try (ResultSet rs = statement.executeQuery(sql);) {
                while (rs.next()) {
                    String workId = rs.getString(1),
                            title = rs.getString(2),
                            customerName = rs.getString(3);

                    list.add("#" + i[0]++ + ")" + workId + " " + title + " " + customerName);
                }
            }
        });

        list.add("SELECT COUNT(id) FROM hancomee_work WHERE customer_id = " + from + ";");
        list.add("UPDATE hancomee_work SET customer_id = " + to + " WHERE customer_id = " + from + ";");
        list.add("DELETE FROM hancomee_customer WHERE id = " + from + ";");
        out(String.join("\n", list));
    }


    private static void out(Object obj) {
        System.out.println(obj);
    }

}
