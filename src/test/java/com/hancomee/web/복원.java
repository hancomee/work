package com.hancomee.web;

import com.boosteel.nativedb.NativeDB;
import org.junit.Test;
import sun.net.ftp.FtpClient;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.*;

public class 복원 {

    private NativeDB db = new NativeDB("jdbc:mariadb://115.23.187.44:3306/hancomee?useOldAliasMetadataBehavior=true", "root", "ko9984");

    @Test
    public void copy() throws Exception {


        db.doStmt(s -> {

            Set<String> set = new HashSet<>();

            try(ResultSet resultSet = s.executeQuery(
                    "SELECT path, subject, user, datetime, filename, filetype, favorite FROM photos WHERE path LIKE '%소라넷%' AND favorite >= 1;;")) {
                while(resultSet.next()) {
                    String path = resultSet.getString("path"),
                            filename = resultSet.getString("filename"),
                            filetype = resultSet.getString("filetype"),

                            subject = resultSet.getString("subject"),
                            user = resultSet.getString("user");

                    path = "F:/3016e92r-/_LICK/_IMG/_temp/gallery/" +
                            path.substring(path.indexOf("소라넷")) + "/" +  filename + "." + filetype;

                    filename = user + "_" + subject + "." + filetype;
                    if(!set.add(filename)) {
                        filename = user + "_" + subject + "-" + UUID.randomUUID().toString().substring(0, 4) + "." + filetype;
                    }
                    Path source = Paths.get(path),
                            copy = Paths.get("F:/3016e92r-/_LICK/_IMG/_temp/gallery/소라넷/_favorite/" +
                                    filename);

                    Files.copy(source, copy);
                }

            }


            /*Path p = Paths.get("F:\\3016e92r-\\_LICK\\_IMG\\_temp\\gallery\\soranet");
            tour(p, (name, type, path, file) -> {

                if(!set.contains(name)) {
                    out("[정보없음] " + file);
                }

            });*/

        });

    }


    private void tour(Path p, Tour handler) throws Exception {

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(p)) {
            for (Path path : stream) {
                String name = path.getFileName().toString();
                if (Files.isDirectory(path)) {
                    if (!name.startsWith("_")) {
                        tour(path, handler);
                    }
                } else if (Files.probeContentType(path).startsWith("image")) {
                    int i = name.lastIndexOf(".");
                    handler.accept(name.substring(0, i), name.substring(i + 1), path.subpath(5, path.getNameCount() - 1).toString(), path);
                }

            }
        }

    }


    interface Tour {
        void accept(String filename, String filetype, String path, Path p) throws Exception;
    }

    private static void out(Object obj) {
        System.out.println(obj);
    }

}
