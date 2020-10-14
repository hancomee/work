package com.hancomee.web.controller.worksource;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.nio.file.*;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import static com.boosteel.util.support.Patterns.forEach;

public class NaverCafe {

    String PATH = "logosesang";
    Path ROOT = Paths.get("D:/work-resources"),
            TARGET = ROOT.resolve(PATH);

    Map<String, String> hedaer;

    Pattern r_article = Pattern.compile("\"subject\":\"([^\"]+).*?\"writer\":\\{\"id\":\"([^\"]+).*?\"writeDate\":(\\d+).*?\"contentHtml\":\"(.*?)\",\"[^\"]+\":.*?attaches\":(.*?),\"tags\":");

    public NaverCafe() {
        try {
            hedaer = HTTP.readHeader(getClass().getClassLoader().getResource("./naver.txt"));
            Files.createDirectories(TARGET);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    public void run() throws Exception {

        /*String test = "https://blogattach.naver.net/c356df6c7f2127fbd43859695cbac2b1194bb557ed/MjAyMDA3MTdfMTYw/MDAxNTk0OTUzNDI5MTY0.Nwm6udpYu96oEsomtt7g4X6aGlA_4eCSdAt8V6kohGQg.D0Jp6KrcoSUBZHU0fkFjQH7sPpM8cikvVkzejyJzgGAg.JPEG/스크린샷_노군꼬치.jpg?type=attachment";
        out(test);
        out(urlEncoder(test));*/
        //list("12593431", "1051", 1);
        //readPage("12593431", "3856776");
        확장자();
    }

    public void 확장자() throws Exception {

        Map<String, String[]> dbData = new HashMap<>();
        Map<String, List<String>> result = new HashMap<>();

        DBManager.getDB().doStmt( s -> {
            try(ResultSet rs = s.executeQuery("SELECT id, filename, filetype FROM work_resources WHERE path = 'logosesang'")) {
                while(rs.next())
                    dbData.put(rs.getString("filename"),
                            new String[]{rs.getString("id"), rs.getString("filetype")});
            }
        });


        try(DirectoryStream<Path> stream = Files.newDirectoryStream(TARGET)) {
            int pos;
            String name, type;
            String[] values;
            for(Path path : stream) {
                if(Files.isRegularFile(path)) {
                    name = path.getFileName().toString();
                    out(name);
                    pos = name.lastIndexOf(".");
                    type = name.substring(pos + 1);
                    name = name.substring(0, pos);

                       values = dbData.get(name);

                    if(!values[1].equals(type)) {
                        List<String> list = result.get(type);
                        if(list == null) result.put(type, list = new ArrayList<>());
                        list.add(values[0]);
                    }
                }
            }
        }


        for(Map.Entry<String, List<String>> entry : result.entrySet()) {

            String sql = "UPDATE work_resources SET thumbtype = '" + entry.getKey() + "' WHERE id in (" +
                    String.join(", ", entry.getValue()) + ");";
            out(sql);

        }

    }

    public void list(String clubId, String menuId, int page) throws Exception {

        int[] count = {0};
        String d = "https://cafe.naver.com/ArticleList.nhn" +
                "?search.clubid=" + clubId +
                "&search.menuid=" + menuId +
                "&search.boardtype=L" +
                "&search.totalCount=151" +
                "&search.page=" + page,
                html = HTTP.get(d, "euc-kr");

        forEach("\"inner_number\">(\\d+)", html, (i, g, id) -> {
            readPage(clubId, id);
            count[0]++;
        });

        if (count[0] > 0) list(clubId, menuId, page + 1);
    }

    Pattern r_attaches = Pattern.compile("\"type\":\"([^\"]+).*?\"url\":\"([^\"]+).*?extension\":\"([^\"]+)");

    public void readPage(String clubId, String articleId) throws Exception {
        String url = "https://apis.naver.com/cafe-web/cafe-articleapi/v2/cafes/" + clubId +
                "/articles/" + articleId + "?useCafeId=true&requestFrom=A",
                html = HTTP.get(url, hedaer),
                source = "https://cafe.naver.com/logosesang/" + articleId;

        if(DBManager.exists(PATH, source)) return;

        String[] thumbs = Patterns.exec("([^\"]+cafeptthumb-phinf[^\"]+)", html);
        if (thumbs != null) {

            String thumbURL = thumbs[1],
                    thumbType = type(HTTP.$get(thumbURL).getContentType());

            // 썸네일이 없을때는 돌려보낸다.
            if(thumbType == null) return;

            forEach(r_article, html, (i, g, subject, user, datetime, contentHTML, attaches) -> {

                int no = 1;

                Matcher matcher = r_attaches.matcher(attaches);
                while (matcher.find()) {
                    if (!matcher.group(1).equals("I")) {
                        String prefix = articleId + "-" + no++,
                                thumbImage = prefix + "." + thumbType,
                                fileImage = prefix + "." + matcher.group(3);

                        Files.copy(HTTP.$get(thumbURL, hedaer).getInputStream(),
                                TARGET.resolve(thumbImage), StandardCopyOption.REPLACE_EXISTING);
                        long size = Files.copy(HTTP.$get(matcher.group(2), hedaer).getInputStream(),
                                TARGET.resolve(fileImage), StandardCopyOption.REPLACE_EXISTING);
                        DataBean bean = new DataBean(PATH)
                                .setSource(source)
                                .setUser(user)
                                .setDatetime(Long.parseLong(datetime))
                                .setContent(subject)
                                .setFilename(prefix)
                                .setFiletype(matcher.group(3))
                                .setThumbtype(thumbType)
                                .setFilesize(size);

                        DBManager.getDB().doStmt( s -> {
                            s.executeUpdate(bean.insertSQL());
                        });
                    }
                }
            });
        }
    }

    public String urlEncoder(String src) throws Exception {

        if (1 > 0) return src;
        int pos = src.lastIndexOf("/");
        String s1 = src.substring(0, pos),
                s2 = src.substring(pos + 1),
                s3 = "";
        if ((pos = s2.lastIndexOf("?")) != -1) {
            s3 = s2.substring(pos);
            s2 = s2.substring(0, pos);
        }
        if (!s2.contains("%")) {
            s2 = URLEncoder.encode(s2, "euc-kr").replaceAll("\\+", "%20");
        }

        return s1 + "/" + s2 + s3;
    }

    public String type(String mediaType) {
        if(mediaType == null) return null;
        return mediaType.split("\\/")[1].replaceAll("jpeg", "jpg");
    }

    public void out(Object obj) {
        System.out.println(obj);
    }
}
