package com.hancomee.web.backup;

import org.junit.Test;

import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.text.SimpleDateFormat;
import java.util.*;

public class FileBackup {

    SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Path configFile, changeFile;
    Map<String, Long> config;

    @Test
    public void run() throws Exception {

        //check("D:\\images");
        upload("D:\\images");
    }


    public void check(String root) throws Exception {
        check(Paths.get(root));
    }

    public void check(Path root) throws Exception {
        configFile = root.resolve(".files.txt");
        changeFile = root.resolve(".change.txt");

        if (Files.exists(configFile)) {
            config = parse(configFile);
        } else {
            Files.createFile(configFile);
            config = new HashMap<>();
        }

        /*
         *  .change.txt가 있을 경우에는 루프를 멈춘다.
         */
        if (Files.exists(changeFile)) {
            throw new RuntimeException(".change.txt 파일이 존재합니다.");
        }
        Files.createFile(changeFile);

        List<String> lines = new ArrayList<>();
        Map<String, Long> changes = new HashMap<>();

        tour(root, (path, attr, f) -> {
            long l = attr.lastModifiedTime().toMillis();
            Long v = config.get(path);

            if (v == null || !v.equals(l)) {
                changes.put(path, l);
                config.put(path, l);
            }

            config.put(f.toString().replaceAll("\\\\", "/"), attr.lastModifiedTime().toMillis());
        });


        for (Map.Entry<String, Long> entry : config.entrySet())
            lines.add(entry.getKey() + "\t" + entry.getValue());

        Files.write(configFile, lines, StandardOpenOption.TRUNCATE_EXISTING);

        lines.clear();
        for (Map.Entry<String, Long> entry : changes.entrySet())
            lines.add(entry.getKey() + "\t" + entry.getValue());

        Files.write(changeFile, lines, StandardOpenOption.TRUNCATE_EXISTING);
    }


    public void upload(String _root) throws Exception {

        Path root = Paths.get(_root),
                CHANGE = root.resolve(".change.txt");
        int count = root.getNameCount();

        if (Files.exists(CHANGE)) {

            Map<String, Long> list = parse(CHANGE);

            if (!list.isEmpty()) {
                FTPTest ftpTest = new FTPTest();
                ftpTest.setIP("115.23.187.44");
                ftpTest.setPort(61954);
                ftpTest.setRoot("$bin/backup");

                ftpTest.active(ftp -> {
                    for (String path : list.keySet()) {
                        Path f = Paths.get(path);
                        if(count < f.getNameCount() - 1) {
                            String dir = f.subpath(count, f.getNameCount() - 1).toString().replaceAll("\\\\", "/");
                            out(dir);
                            ftp.mkd(dir);
                        }
                        ftp.storeFile(f.subpath(count, f.getNameCount()).toString().replaceAll("\\\\", "/"), Files.newInputStream(f));
                    }
                });



            }

        } else {
            out(root + " 에 .change.txt 파일이 없습니다");
        }


    }

    public Map<String, Long> parse(Path file) throws Exception {
        Map<String, Long> result = new HashMap<>();
        for (String line : Files.readAllLines(file)) {
            if (line.contains("\t")) {
                String[] values = line.split("\t");
                result.put(values[0], Long.valueOf(values[1]));
            }
        }
        return result;
    }

    private void tour(Path root, Accept accept) throws Exception {
        _tour(root, accept);
    }

    private void _tour(Path root, Accept accept) throws Exception {

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(root)) {
            for (Path p : stream) {
                String filename = p.getFileName().toString();
                if (!filename.startsWith(".")) {
                    if (Files.isDirectory(p)) {
                        _tour(p, accept);
                    } else {
                        accept.accept(p.toString().replaceAll("\\\\", "/"),
                                Files.readAttributes(p, BasicFileAttributes.class), p);

                    }
                }
            }
        }

    }

    private void out(Object obj) {
        System.out.println(obj);
    }

    interface Accept {
        void accept(String path, BasicFileAttributes attrs, Path file) throws Exception;
    }
}
