package com.hancomee.web.backup;

import org.junit.Test;
import org.springframework.expression.spel.ast.Literal;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class DBData {

    @Test
    public void run() throws Exception {

        mysqldump("work", "hellofunc", "192.168.1.94");
    }

    Path DB_ROOT = Paths.get("d:/backup/db");

    public String[] command(String dbname) {
        return new String[]{
                "\"D:/sys/mariadb/bin/mysqldump\"",
                "--routines", "--trigger",
                "-uroot", "-pko9984", dbname,
        };
    }

    public String[] command(String dbname, String ip) {
        return new String[]{
                "\"D:/sys/mariadb/bin/mysqldump\"",
                "--routines", "--trigger",
                "-u", "root", "-pko9984", "-h", ip, "-P", "3306", dbname,
        };
    }

    public void mysqldump(String name, String dbname) throws Exception {
        String date = name + "-" + new SimpleDateFormat("yyyy-MM-dd HHmmss").format(new Date());
        String[] command = command(dbname);
        dump(command, date);
    }

    public void mysqldump(String name, String dbname, String ip) throws Exception {
        String date = name + "-" + new SimpleDateFormat("yyyy-MM-dd HHmmss").format(new Date());
        dump(command(dbname, ip), date);
    }

    private void dump(String[] command, String name) throws Exception {
        Path file = Files.createFile(DB_ROOT.resolve(name + ".sql"));
        $createReader(command, (l) -> {
            List<String> lines = new ArrayList<>();
            lines.add(l);
            Files.write(file, lines, StandardOpenOption.APPEND);
        });
    }



    public void $createReader(String[] exp, AcceptLog log) throws Exception {
        out(String.join(" " , exp));
        ProcessBuilder builder = new ProcessBuilder(exp);
        Process p = builder.start();
        String line = null;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream(), "utf-8"))) {
            while ((line = br.readLine()) != null) {
                log.accept(line);
            }
        }
        try (BufferedReader br = new BufferedReader(new InputStreamReader(p.getErrorStream(), "utf-8"))) {
            while ((line = br.readLine()) != null) {
                log.accept(line);
            }
        }
    }

    interface AcceptLog {
        void accept(String line) throws Exception;
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
