package com.hancomee.web.controller.db;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;


/*
 *  2022-06-14
 *  commons의 NavtiveDB를 대체하기 위한 새로운 클래스
 */
public class ResultSetUtil {


    // 단순히 가지고 오기
    public static List<Map<String, Object>> read(ResultSet rs, Map<String, String> methodMap) throws Exception {
        List<Map<String, Object>> result = new ArrayList<>();
        Set<String> labels = methodMap.keySet();
        while (rs.next()) {
            Map<String, Object> values = new HashMap<>();
            for (String label : labels) {
                values.put(label, read0(rs, label, methodMap.get(label)));
            }
            result.add(values);
        }
        return result;
    }


    // 특정 라벨을 기준으로 값 가지고 오기
    public static Map<String, List<Map<String, Object>>> read(ResultSet rs, Map<String, String> methodMap, String keyLabel) throws Exception {

        Map<String, List<Map<String, Object>>> result = new HashMap<>();
        String key;
        List<Map<String, Object>> list;

        Set<String> labels = methodMap.keySet();

        while (rs.next()) {

            Map<String, Object> values = new HashMap<>();
            key = rs.getString(keyLabel);   // key는 string으로 가지고 온다.

            list = result.get(key);
            if (list == null) result.put(key, list = new ArrayList<>());

            for (String label : labels) {
                values.put(label, read0(rs, label, methodMap.get(label)));
            }

            list.add(values);

        }

        return result;
    }


    // "id:int date:string category:string text:string priority:int created:time complete:int"
    private static Object read0(ResultSet rs, String columnLabel, String method) throws SQLException {

        switch (method) {
            case "int":
                return rs.getInt(columnLabel);
            case "string":
                return rs.getString(columnLabel);
            case "time":
                return rs.getDate(columnLabel).getTime();
            default:
                throw new RuntimeException(method + " 등록되지 않은 ResultSet 메소드타입입니다.");
        }

    }
}
