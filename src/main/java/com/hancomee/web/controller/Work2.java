package com.hancomee.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@Controller
@RequestMapping("work2/view")
public class Work2 {

    @RequestMapping("{uuid}")
    public Object values() throws Exception {
        return "/work2/view.html";
    }

    @RequestMapping(value="upload", method = RequestMethod.PUT)
    @ResponseBody
    public Object values(@RequestPart("file") MultipartFile file) throws Exception {
        Files.copy(file.getInputStream(), Paths.get("D:/test.txt"), StandardCopyOption.REPLACE_EXISTING);
        return "/work2/view.html";
    }
}
