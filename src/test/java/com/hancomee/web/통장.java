package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.SQLString;
import com.boosteel.nativedb.core.anno.Selector;
import org.junit.Test;
import org.springframework.scheduling.concurrent.ScheduledExecutorTask;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.*;

public class 통장 {


    @Test
    public void copy() throws Exception {

        Set<AccountData> set = new HashSet<>();

        Path file = Paths.get(getClass().getClassLoader().getResource("이체결과.txt").toURI());
        List<String> lines = Files.readAllLines(file);

        for(String line : lines) {
            AccountData data = new AccountData(line.split("\t"));
            if(set.add(data))
                out(data);
        }



    }


    class AccountData {

        String value;
        String name;
        String bank;

        public AccountData(String...ars) {
            bank = ars[0];
            value = ars[1];
            name = ars[2];
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) return true;
            if (o == null || getClass() != o.getClass()) return false;
            AccountData that = (AccountData) o;
            return Objects.equals(value, that.value) &&
                    Objects.equals(name, that.name) &&
                    Objects.equals(bank, that.bank);
        }

        @Override
        public int hashCode() {

            return Objects.hash(value, name, bank);
        }

        @Override
        public String toString() {
            return "[" + bank + "] " + value + " / " + name;
        }
    }

    private static void out(Object obj) {
        System.out.println(obj);
    }

}
