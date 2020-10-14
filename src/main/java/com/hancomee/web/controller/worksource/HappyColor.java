package com.hancomee.web.controller.worksource;

import com.boosteel.http.HTTP;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URLEncoder;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import static com.boosteel.util.support.Patterns.forEach;

public class HappyColor {

    Path ROOT = Paths.get("D:/work-resources"),
            TARGET = ROOT.resolve("happycolor");
    Pattern r_page = Pattern.compile("작 성 자.*?([^<>]+)<\\/a.*?(\\d{4}-\\d{2}-\\d{2}).*?제 목.*?\"CmC2\">([^<>]+).*?src=.([^\"]+ciano[^\"']+)");

    public static final String[] MENU = {
            "http://www.happycolor.com/Cian/CianH",  // 현수막 시안
            "http://www.happycolor.com/Cian/CianG",  // 간판 시안
            "http://www.happycolor.com/Cian/CianL",  // 로고
    };

    @Test
    public void run() throws Exception {

        Files.createDirectories(TARGET);

        List<String> list = list(MENU[2], "201901");
        for (String l : list)
            page(l);

        //page("http://www.happycolor.com/Cian/CianL/fm_cont.asp?idx=90316");
    }

    public List<String> list(String _url, String DateYM) throws Exception {
        List<String> values = new ArrayList<>();
        String
                url = _url + "/fm_vew.asp?DateYM=" + DateYM,
                html = HTTP.get(url, "euc-kr");

        html = Patterns.exec("\"#857B57\">분 류(.*?)<\\/table", html)[1];
        out(html);
        forEach("href='([^']+idx=[^']+)", html, (i, g, id) -> {
            values.add(_url + "/" + id);
        });
        return values;
    }

    public List<String> page(String url) throws Exception {
        String html = HTTP.get(url, "euc-kr");
        forEach(r_page, html, (i, g, user, date, title, img) -> {
            title = title.replaceAll("&[^\\s]+;", "").replaceAll("\\{2,}", "").trim();
            out(title + " : " + img);
        });

        String[] downFile = Patterns.exec("href=['\"]([^\"']+fn_down.asp[^\"']+fn=)([^&]+)([^\"']+)", html);
        if(downFile != null) {
            String fileURL = downFile[1] +
                    URLEncoder.encode(downFile[2], "euc-kr").replaceAll("\\+", "%20") +
                    downFile[3];
            out(fileURL);
        }

        return null;
    }


    public void out(Object obj) {
        System.out.println(obj);
    }

}
