package com.hancomee.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@Controller
@RequestMapping("work/db")
public class DBController {


    @Autowired
    _WorkManager sql;

    // ***************************** Work ************************************* //
    @RequestMapping(value = "create", method = RequestMethod.POST)
    @ResponseBody
    public Object createWork(@RequestBody Map<String, Object> map) throws Exception {
        return "\"" + sql.createWork(map) + "\"";
    }

    @RequestMapping(value = "remove/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void removeWork(@PathVariable("id") Object id) throws Exception {
        sql.removeWork(id);
    }


    // ***************************** 거래처 ************************************* //
    @RequestMapping(value = "customer", method = RequestMethod.POST)
    @ResponseBody
    public Object customer(@RequestBody Map<String, Object> map) throws Exception {
        if(!map.containsKey("id"))
            return sql.createCustomer(map);

        sql.updateCustomer(map);
        return map.get("id");
    }

    @RequestMapping(value = "customer/{search}", method = RequestMethod.GET)
    @ResponseBody
    public Object customerSearch(@PathVariable("search") String search) throws Exception {
        return sql.searchCustomer(search);
    }

    // Work 수정
    @RequestMapping(value = "update/state/{id}/{state}", method = RequestMethod.POST)
    @ResponseBody
    public void updateState(@PathVariable("id") long id, @PathVariable("state") int state) throws Exception {
        sql.updateState(id, state);
    }

    // Work 수정
    @RequestMapping(value = "update/{id}", method = RequestMethod.POST)
    @ResponseBody
    public void updateWork(@RequestBody Map<String, Object> map, @PathVariable("id") Object id) throws Exception {
        sql.updateWork(id, map);
    }

    // 거래처 이름 검색
    @RequestMapping(value = "customer/search/{key}")
    @ResponseBody
    public Object customer(@PathVariable("key") String key) throws Exception {
        return sql.searchCustomer(key);
    }

    // ***************************** 아이템 ************************************* //
    @RequestMapping(value = "item/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object item(@PathVariable("workId") String workId, @RequestBody Map<String, Object> map) throws Exception {
        return sql.saveItem(workId, map);
    }

    @RequestMapping(value = "item/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void item(@PathVariable("id") int id) throws Exception {
        sql.removeItem(id);
    }

    @RequestMapping(value = "item/priority", method = RequestMethod.POST)
    @ResponseBody
    public int item(@RequestBody List<String> ids) throws Exception {
        return sql.setPriority(ids);
    }

    // *************************  파일 **************************
    @RequestMapping(value = "ref/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object ref(@PathVariable("workId") int workId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addRef(workId, map);
    }

    @RequestMapping(value = "ref/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void ref(@PathVariable("id") int id) throws Exception {
        sql.deleteRef(id);
    }

    @RequestMapping(value = "print/{itemId}", method = RequestMethod.POST)
    @ResponseBody
    public Object print(@PathVariable("itemId") int itemId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addPrint(itemId, map);
    }

    @RequestMapping(value = "print/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void print(@PathVariable("id") int id) throws Exception {
        sql.deletePrint(id);
    }

    @RequestMapping(value = "draft/{itemId}", method = RequestMethod.POST)
    @ResponseBody
    public Object draft(@PathVariable("itemId") int itemId,
                      @RequestBody Map<String, Object> map) throws Exception {
        return sql.addDraft(itemId, map);
    }

    @RequestMapping(value = "draft/{id}", method = RequestMethod.DELETE)
    @ResponseBody
    public void draft(@PathVariable("id") int id) throws Exception {
        sql.deleteDraft(id);
    }


    // ***************************** 메모 ************************************* //
    @RequestMapping(value = "memo/{workId}", method = RequestMethod.POST)
    @ResponseBody
    public Object memo(@PathVariable("workId") String workId, @RequestBody Map<String, Object> map) throws Exception {
        return sql.saveMemo(workId, map);

    }

    @RequestMapping(value = "memo/{id}/{workId}", method = RequestMethod.DELETE)
    @ResponseBody
    public void memo(@PathVariable("id") Object id,
                     @PathVariable("workId") Object workId) throws Exception {
        sql.removeMemo(id, workId);

    }

}
