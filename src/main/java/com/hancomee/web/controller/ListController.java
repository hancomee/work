package com.hancomee.web.controller;

import com.boosteel.nativedb.core.support.Pager;
import com.hancomee.web.controller.support.WorkList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.Map;

@Controller
@RequestMapping("work/list")
public class ListController {

    @Autowired
    _WorkManager sql;

    // hancomee_work INNER JOIN hancomee_customer
    @RequestMapping()
    @ResponseBody
    public Object values(WorkList list, @RequestParam Map<String, Object> map) throws Exception {
        return sql.getWorkList(list, map);
    }

}
