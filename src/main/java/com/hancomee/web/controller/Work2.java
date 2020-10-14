package com.hancomee.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping("work2/view")
public class Work2 {

    @RequestMapping("{uuid}")
    public Object values() throws Exception {
        return "/work2/view.html";
    }
}
