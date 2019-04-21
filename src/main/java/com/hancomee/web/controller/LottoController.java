package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.hancomee.web.domain.Lotto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.PostConstruct;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("lotto")
public class LottoController {


    @Autowired
    NativeDB db;


    @PostConstruct
    public void post() {

    }

    @RequestMapping()
    public String intro() {
        return "lotto.html";
    }


    @RequestMapping(value = "values")
    @ResponseBody
    public Object list() {
        List<Lotto> list = new ArrayList<>();
        db.doStmt(s -> {
            try (ResultSet rs = s.executeQuery("SELECT * FROM lotto")) {
                while (rs.next())
                    list.add(new Lotto(
                            rs.getInt("id"),
                            rs.getString("date"),
                            rs.getInt("num1"),
                            rs.getInt("num2"),
                            rs.getInt("num3"),
                            rs.getInt("num4"),
                            rs.getInt("num5"),
                            rs.getInt("num6"),
                            rs.getInt("bonus"),
                            rs.getInt("count"),
                            rs.getLong("money")));
            }
        });
        return list;
    }


}
