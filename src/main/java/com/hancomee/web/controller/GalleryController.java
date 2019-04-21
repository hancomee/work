package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.TableInfo;
import com.hancomee.web.controller.support.DataTablePager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.boosteel.nativedb.core.ResultSetAccess.readAll;

@Controller
@RequestMapping("gallery")
public class GalleryController {


    Path root = Paths.get("D:/images");

    @RequestMapping()
    public String intro() {
        return "gallery/main.html";
    }

    @RequestMapping(value = "list")
    @ResponseBody
    public Object list() throws Exception {
        List<String> list = new ArrayList<>();

        try(DirectoryStream<Path> stream  =Files.newDirectoryStream(root)) {
            for(Path p : stream) {
                list.add("/images/" + p.getFileName().toString());
            }
        }

        return list;
    }

}
