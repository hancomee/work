package com.hancomee.web.controller.support;

import com.boosteel.nativedb.core.support.Pager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class DataTablePager extends Pager {

    private List<String> where = new ArrayList<>();
    private String table;


    public DataTablePager setTable(String table) {
        this.table = table;
        return this;
    }


    public DataTablePager setGreater(Map<String, String[]> map) {
        for (Map.Entry<String, String[]> entry : map.entrySet()) {
            where.add(entry.getKey() + " < " + entry.getValue());
        }
        return this;
    }

    public DataTablePager setLesser(Map<String, String[]> map) {
        for (Map.Entry<String, String[]> entry : map.entrySet()) {
            if (entry.getValue() != null)
                where.add(entry.getKey() + " > " + entry.getValue());
        }
        return this;
    }


    public DataTablePager setEquals(Map<String, Object> map) {
        Object obj;
        Class<?> clazz;
        String value;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            obj = entry.getValue();

            if (obj != null) {
                clazz = obj.getClass();
                if (Number.class.isAssignableFrom(clazz))
                    value = obj.toString();
                else value = "'" + obj.toString() + "'";

                where.add(entry.getKey() + " = " + value);
            }

        }
        return this;
    }

    public DataTablePager setDuration(Map<String, String[]> map) {
        String[] values;
        for (Map.Entry<String, String[]> entry : map.entrySet()) {
            values = entry.getValue();
            if (values != null)
                where.add(entry.getKey() + " BETWEEN '" + values[0] +
                        " 00:00:00.000' AND '" + values[1] + " 23:59:59.999'");
        }
        return this;
    }

    public DataTablePager setStartWith(Map<String, String> map) {
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if (entry.getValue() != null)
                where.add(entry.getKey() + " LIKE '" + entry.getValue() + "%'");
        }
        return this;
    }

    public DataTablePager setEndWith(Map<String, String> map) {
        for (Map.Entry<String, String> entry : map.entrySet()) {
            if (entry.getValue() != null)
            where.add(entry.getKey() + " LIKE '%" + entry.getValue() + "'");
        }
        return this;
    }

    public DataTablePager setContains(Map<String, String> map) {
        if(map == null) return this;
        for (Map.Entry<String, String> entry : map.entrySet()) {
            where.add(entry.getKey() + " LIKE '%" + entry.getValue() + "%'");
        }
        return this;
    }


    public String[] SQL() {
        String w = where.isEmpty() ? "" : " WHERE " + String.join(" AND ", where);
        return new String[]{
                "SELECT * FROM " + table + w + orderBy() + limit(),
                "SELECT count(id) FROM " + table + w
        };
    }


    @Override
    public String toString() {
        String w = where.isEmpty() ? "" : " WHERE " + String.join(" AND ", where);
        return "FROM " + table + w + orderBy() + limit();
    }

}
