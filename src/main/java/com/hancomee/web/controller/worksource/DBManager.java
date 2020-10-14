package com.hancomee.web.controller.worksource;

import com.boosteel.nativedb.NativeDB;
import org.junit.Test;

import java.sql.ResultSet;

public class DBManager {

    private static NativeDB db;

    @Test
    public void run() throws Exception {


    }

    public static boolean exists(String path, String source) throws Exception {
        return getDB().doStmtR(s -> {
           try(ResultSet rs = s.executeQuery("SELECT COUNT(id) FROM work_resources WHERE path = '" + path + "' AND source = '" + source + "'")) {
               rs.next();
               return rs.getInt(1) > 0;
           }
        });
    }

    public static final NativeDB getDB() throws Exception {
        if(db == null) db = new NativeDB("jdbc:mariadb://115.23.187.27:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");;
        return db;
    }
}
