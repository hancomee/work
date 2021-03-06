package com.hancomee.web.controller;

import com.boosteel.nativedb.core.support.Pager;
import com.hancomee.web.WebApplication;
import com.hancomee.web.controller.support.WorkList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;
import java.util.Properties;

@Controller
@RequestMapping("work/list")
public class ListController {

    @Autowired
    _WorkManager sql;

    @Autowired
    WebApplication.WorkConfig workConfig;

    @RequestMapping()
    public Object html() throws Exception {
        System.out.println(workConfig);
        return "/work2/list.html";
    }

    // hancomee_work INNER JOIN hancomee_customer
    @RequestMapping(method=RequestMethod.POST)
    @ResponseBody
    public Object values(WorkList list, @RequestParam Map<String, Object> map) throws Exception {

        if(map.containsKey("search") && map.containsKey("searchType")) {
            map.put(map.get("searchType").toString(), map.get("search"));
        }
        return sql.getWorkList(list, map);
    }

}
