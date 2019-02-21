package com.hancomee.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("work")
public class Mappings {

    @RequestMapping("{html}")
    public String html(@PathVariable("html") String html) {
        return "/work/" + html + ".html";
    }

}
