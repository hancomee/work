package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.SQLString;
import com.boosteel.nativedb.core.anno.Selector;
import com.boosteel.nativedb.core.support.RepositoryConfig;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.SQLTimeoutException;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Pattern;

public class TTEST {

    private NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hancomee?useOldAliasMetadataBehavior=true", "root", "ko9984");

    @Test
    public void copy() throws Exception {
        Path p = Paths.get(getClass().getClassLoader().getResource("work.sql").toURI());
        SQL sql = db.createRepository(SQL.class, new RepositoryConfig().addSQL(p));

        Map<String, Object> map = new HashMap<>();
        map.put("state", "6");
        map.put("title", "당일판");
        map.put("customerName", "화장");
        map.put("itemSubject", "명함");
        map.put("st", "2017-07-17");
        map.put("et", "2017-08-31");

        out(sql.list(map));
        out("");
        out(sql.state(map));
        out("");
        out(sql.count(map));
    }

    interface SQL {
        @Selector("#select.work")
        List<Map<String, Object>> list(Map<String, Object> map);

        @SQLString("#state.work")
        String state(Map<String, Object> map);

        @SQLString("#count.work")
        String count(Map<String, Object> map);
    }


    public String query(List<String> ids) {
        List whens = new ArrayList();
        int i = 0;
        for (String id : ids) {
            whens.add("WHEN " + id + " THEN " + i++ + " \n");
        }

        return "UPDATE hancomee_workitem\n" +
                "SET priority = CASE id \n" +
                String.join("", whens) +
                "ELSE priority\n" +
                "END\n" +
                "WHERE id IN(" + String.join(", ", ids) + ")";
    }

    private static void out(Object obj) {
        System.out.println(obj);
    }

}
