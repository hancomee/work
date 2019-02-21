package com.hancomee.web.controller.support;

import com.boosteel.nativedb.core.support.Pager;
import com.hancomee.web.controller.ListController;

import java.util.Map;

public class WorkList extends Pager {
    private int[] price;
    private int[] count;


    public WorkList setArray(int[][] values) {
        this.count = values[0];
        this.price = values[1];
        return this;
    }


    public int[] getPrice() {
        return price;
    }

    public int[] getCount() {
        return count;
    }

    @Override
    public String toString() {
        String r = "  page : " + page +  " / size : " + size;
        if(orders != null)
            r += " // " + String.join(" | ", orders);
        return r;
    }
}