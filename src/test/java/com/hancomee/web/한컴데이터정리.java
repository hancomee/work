package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.ResultSetAccess;
import com.boosteel.nativedb.core.SQL;
import com.boosteel.nativedb.core.anno.SQLString;
import com.boosteel.nativedb.core.anno.Selector;
import org.junit.Test;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;

public class 한컴데이터정리 {
    private NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.27:3306/hellofunc?useOldAliasMetadataBehavior=true", "root", "ko9984");

    @Test
    public void copy() throws Exception {



    }



    private static void out(Object obj) {
        System.out.println(obj);
    }

}
