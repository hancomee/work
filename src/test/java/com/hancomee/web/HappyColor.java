package com.hancomee.web;

import com.boosteel.http.HTTP;
import com.boosteel.nativedb.core.support.NamedPrepareStatement;
import com.boosteel.util.support.Patterns;
import org.junit.Test;

import java.net.URL;
import java.net.URLEncoder;
import java.nio.file.*;

public class HappyColor {

    Path root = Paths.get("D:\\통장\\happycolor");
    int size = 0;

    @Test
    public void run() throws Exception {
        down("2016", "01");
    }


    public void down(String year, String month) throws Exception {

        out("------------------------------ [ " + year + " / " + month + "] ------------------------------");

        String html =
                HTTP.post("http://www.happycolor.com/Cian/CianH/fm_vew.asp?" +
                        "DateYM=" + year + month, "euc-kr");

        Patterns.forEach("(<tr>.*?\"CmC2\".*?<\\/tr>)", html, (i, g, contnet) -> {

            Patterns.forEach("idx=(\\d+).*?>([^<>]+).*?\"CmC1\".*?\"CmC1\">([^<>]+)", contnet, (ii, gg, uuid, title, user) -> {

                //out("[" + user + "] " + title);
                String pageURL = "http://www.happycolor.com/Cian/CianH/fm_cont.asp?idx=" + uuid,
                        pageHTML = HTTP.get(pageURL, "euc-kr");

                Patterns.forEach("■ 제 목.*?([^<>]+)<font(.*?)community_Market_img06", pageHTML, (i3, g3, subject, imgContent) -> {


                    int[] count = {0};
                    out("\n\n[" + user + "] " +subject);
                    Patterns.forEach("src=\"([^\"']+happycolor[^\"']+)", imgContent, (i4, g4, imgURL) -> {
                        int iiii = imgURL.lastIndexOf('/');
                        imgURL = imgURL.substring(0, iiii+ 1) + URLEncoder.encode(imgURL.substring(iiii+ 1), "utf-8").replaceAll("\\+", "%20");
                        out(imgURL);
                        Files.copy(new URL(imgURL).openStream(), root.resolve(user + size++ + ".jpg"), StandardCopyOption.REPLACE_EXISTING);
                    });

                });


            });

        });
    }

    private void error() {
        throw new RuntimeException();
    }

    private void out(Object obj) {
        System.out.println(obj);
    }


}
