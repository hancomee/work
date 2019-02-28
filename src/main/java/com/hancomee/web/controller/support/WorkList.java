package com.hancomee.web.controller.support;

import com.boosteel.nativedb.core.support.Pager;

public class WorkList extends Pager {

    private int[] today;
    private int[] price;
    private int[] count;


    public WorkList setArray(int[][] values) {
        this.count = values[0];
        this.price = values[1];
        return this;
    }

    public int[] getToday() {
        return today;
    }

    public WorkList setToday(int[] today) {
        this.today = today;
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