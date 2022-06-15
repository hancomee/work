package com.hancomee.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("work/view")
public class ViewController {


    @Autowired
    _WorkManager sql;


    @RequestMapping("{uuid}")
    public Object html() throws Exception {
        return "/work2/view.html";
    }

    @RequestMapping()
    @ResponseBody
    public Object values(@RequestParam("uuid") String uuid) throws Exception {
        return sql.getWork(uuid);
    }
}
