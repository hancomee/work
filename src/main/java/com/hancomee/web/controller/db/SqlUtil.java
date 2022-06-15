package com.hancomee.web.controller.db;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
 *  2022-06-14
 *  commons의 NavtiveDB를 대체하기 위한 새로운 클래스
 */
public class SqlUtil {

    // createMap(key, value, key, value...)
    public static Map<String, Object> createMap(Object... args) {
        Map<String, Object> map = new HashMap<>();
        int i = 0, len = args.length;
        for (; i < len; i++) {
            map.put(args[i++].toString(), args[i]);
        }
        return map;
    }


    /*
     * {변수}가 포함된 SQL 구문을 파싱해,
     * SQL을 완성시키는 하나의 함수를 반환한다.
     */
    public static Function<Map<String, Object>, String> parser(String lines) {
        List<Function<Map<String, Object>, String>> list = parser0(lines);
        return (map) -> {
            String[] values = new String[list.size()];
            int i = 0;
            for (Function<Map<String, Object>, String> func : list) values[i++] = func.apply(map);
            return String.join("", values);
        };
    }

    private static List<Function<Map<String, Object>, String>> parser0(String lines) {

        List<Function<Map<String, Object>, String>> list = new ArrayList<>();

        Pattern pattern = Pattern.compile("[\\{\\[]");
        Matcher m = pattern.matcher(lines);

        String prefix, suffix, line;
        int len = lines.length(), cursor = 0, pos;

        while (m.find(cursor)) {
            prefix = m.group();
            suffix = prefix.equals("{") ? "}" : "]";
            pos = m.start();

            // 단순 문자열
            if (cursor != pos) {
                String text = lines.substring(cursor, pos);
                list.add((o) -> text);
            }
            line = lines.substring(pos + 1, pos = lines.indexOf(suffix, pos));

            if (prefix.equals("[")) list.add(line(line));
            else list.add(value(line));

            cursor = pos + 1;
        }

        if(len > cursor) {
            String text = lines.substring(cursor, len);
            list.add((o) -> text);
        }

        return list;
    }

    // [AND this.title LIKE {title:%_%}]
    private static Function<Map<String, Object>, String> line(String sql) {
        List<Function<Map<String, Object>, String>> list = parser0(sql);
        return (map) -> {
            String[] values = new String[list.size()];
            int i = 0;
            // 값 중 하나라도 null이면 구문을 삭제한다.
            for (Function<Map<String, Object>, String> func : list) {
                if ((values[i++] = func.apply(map)) == null) return "";
            }
            return String.join("", values);
        };
    }

    // {title:%_%}
    // SQL에 표기된 값은 무조건 map에 값이 들어있다는 전제하에 동작한다.
    // 없을 경우) "prop = null"
    private static Function<Map<String, Object>, String> value(String sql) {
        if (sql.startsWith("?"))
            return (map) -> map.get(sql) == null ? null : "";

        String[] values = sql.split(":");
        String prop = values[0], type = values.length == 1 ? "string" : values[1];
        return (map) -> value0(type, map.get(prop));

    }

    private static String value0(String type, Object value) {
        if (value == null) return null;
        String v;
        switch (type) {
            case "int":
                return value.toString();
            case "%_":
                return quotes("%" + _r(value));
            case "_%":
                return quotes(_r(value) + "%");
            case "%_%":
            case "%":
                return quotes("%" + _r(value) + "%");
            case "st":
                if (value instanceof Number)
                    value = new Date(((Number) value).longValue());
                if (value instanceof Date) {
                    v = new SimpleDateFormat("yyyy-MM-dd").format((Date) value);
                } else v = value.toString();
                return quotes(v + " 00:00:00.000");
            case "et":
                if (value instanceof Number)
                    value = new Date(((Number) value).longValue());
                if (value instanceof Date) {
                    v = new SimpleDateFormat("yyyy-MM-dd").format((Date) value);
                } else v = value.toString();
                return quotes(v + " 23:59:59.999");
            default:
                return _r(value);

        }
    }

    private static String _r(Object s) {
        return s.toString().replaceAll("(%|'|\\\\)", "\\\\$1");
    }

    // % ' \ 는 이스케이프 문자를 추가해준다
    private static String quotes(String s) {
        return "'" + s + "'";
    }
}
