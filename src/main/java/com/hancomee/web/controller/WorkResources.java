package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.anno.PageList;
import com.boosteel.nativedb.core.anno.Selector;
import com.boosteel.nativedb.core.support.Pager;
import com.boosteel.nativedb.core.support.RepositoryConfig;
import com.hancomee.web.controller.support.WorkList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("work-resources")
public class WorkResources {

    @Autowired
    NativeDB db;

    _SQL SQL;
    RepositoryConfig CONFIG;

    public WorkResources() {
    }


    @PostConstruct
    public void before() {
        SQL = db.createRepository(
                _SQL.class,
                CONFIG = new RepositoryConfig()
                        .addSQL(WorkResources.class.getClassLoader().getResourceAsStream("work-resources.sql"))
        );
    }

    @RequestMapping()
    public String intro() {
        return "work-resources.html";
    }


    @RequestMapping("list")
    @ResponseBody
    public Object list(@ModelAttribute WRPager pager) {
        return db.doStmtR(s -> SQL.listAll(s, pager, pager.params()));
    }


    public static class WRPager extends Pager {
        // path datetime uploadtime user content filename filetype filesize source favorite blind down
        public String path;
        public String content;
        public String user;
        public int favorite;
        public int blind;
        public int down;

        public WRPager setPath(String path) {
            this.path = path;
            return this;
        }

        public WRPager setContent(String content) {
            this.content = content;
            return this;
        }

        public WRPager setUser(String user) {
            this.user = user;
            return this;
        }

        public WRPager setFavorite(int favorite) {
            this.favorite = favorite;
            return this;
        }

        public WRPager setBlind(int blind) {
            this.blind = blind;
            return this;
        }

        public WRPager setDown(int down) {
            this.down = down;
            return this;
        }

        public Map<String, Object> params() {
            Map<String, Object> map = new HashMap<>();
            if(path != null) map.put("path", path);
            if(content != null) map.put("content", content);
            if(user != null) map.put("user", user);
            if(favorite != 0) map.put("favorite", favorite);
            if(blind != 0) map.put("blind", blind);
            if(down != 0) map.put("down", down);
            return map;
        }
    }


    interface _SQL {

        @PageList(list="#select", count = "#count")
        WRPager listAll(Statement stmt, WRPager pager, Map<String, Object> params);

    }
}
