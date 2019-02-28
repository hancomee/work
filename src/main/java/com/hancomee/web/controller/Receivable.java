package com.hancomee.web.controller;

import com.hancomee.web.controller.support.ReceivableList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Controller
@RequestMapping("work/receivable")
public class Receivable {

    @Autowired
    _WorkManager sql;

    @RequestMapping(value = "list", method = RequestMethod.GET)
    @ResponseBody
    public Object customerSearch(Map<String, Object> list) throws Exception {
        return sql.receivableList(list);
    }
}
