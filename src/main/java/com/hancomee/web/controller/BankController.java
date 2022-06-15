package com.hancomee.web.controller;

import com.boosteel.nativedb.NativeDB;
import com.boosteel.nativedb.core.SQL;
import com.boosteel.nativedb.core.anno.Insert;
import com.boosteel.nativedb.core.anno.Update;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import static com.hancomee.web.controller.db.ResultSetUtil.read;

@Controller
@RequestMapping("bank")
public class BankController {


    @Autowired
    NativeDB workDB;

    @RequestMapping()
    public Object html() throws Exception {
        return "/work2/bank.html";
    }




}
