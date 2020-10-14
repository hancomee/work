package com.hancomee.web.controller.worksource;

import java.text.SimpleDateFormat;
import java.util.Date;

public class DataBean {

    int id;
    String path;

    String datetime;
    String uploadtime;
    String user;
    String content;
    String filename;
    String filetype;
    String thumbtype;

    long filesize;
    String source;
    int favorite;
    int blind;
    int down;

    public DataBean(String path) {
        this.path = path;
    }

    public DataBean setDatetime(long datetime) {
        this.datetime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date(datetime));
        return this;
    }

    public DataBean setDatetime(String datetime) {
        this.datetime = datetime;
        return this;
    }

    public DataBean setUser(String user) {
        this.user = user;
        return this;
    }

    public DataBean setContent(String content) {
        this.content = content;
        return this;
    }

    public DataBean setFilename(String filename) {
        this.filename = filename;
        return this;
    }

    public DataBean setFiletype(String filetype) {
        this.filetype = filetype;
        return this;
    }

    public DataBean setThumbtype(String thumbtype) {
        this.thumbtype = thumbtype;
        return this;
    }

    public DataBean setFilesize(long filesize) {
        this.filesize = filesize;
        return this;
    }

    public DataBean setSource(String source) {
        this.source = source;
        return this;
    }

    public String insertSQL() {
        return "INSERT INTO work_resources (path, datetime, user, content, filename, filetype, filesize, thumbtype, source) VALUES " +
                insertValues() + ";";
    }

    public String insertValues() {
        return "(" + _(path, datetime, user, content, filename, filetype, String.valueOf(filesize), thumbtype, source) + ")";
    }

    public String _(String... str) {
        int l = str.length;
        for (int i = 0; i < l; i++) {
            str[i] = "'" + str[i].replaceAll("'", "\\\\'") + "'";
        }
        return String.join(", ", str);
    }

}
