package com.hancomee.web.backup;

import org.apache.commons.net.ftp.FTP;
import org.apache.commons.net.ftp.FTPClient;
import org.apache.commons.net.ftp.FTPFile;
import org.apache.commons.net.ftp.FTPReply;
import org.junit.Test;

public class FTPTest {

    private FTPClient ftp;
    private String ip = "localhost";
    private int port = 21;
    private String root;

    @Test
    public void run() throws Exception {
        ip = "115.23.187.44";
        port = 61954;
        setRoot("$bin/backup");
    }

    public FTPTest setRoot(String root) {
        this.root = root;
        return this;
    }

    public FTPTest setIP(String ip) {
        this.ip = ip;
        return this;
    }

    public FTPTest setPort(int port) {
        this.port = port;
        return this;
    }

    public FTPTest connect() throws Exception {
        ftp = new FTPClient();
        ftp.setControlEncoding("utf-8");
        //ftp.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(System.out)));
        ftp.setDefaultPort(port);
        ftp.connect(ip);//호스트 연결

        if (!FTPReply.isPositiveCompletion(ftp.getReplyCode())) {
            ftp.disconnect();
            System.out.println("FTP server refused connection.");
        } else {
            System.out.println("\n--------------------------------------------------------\n" +
                    "------------------ Connect successful ------------------" +
                    "\n--------------------------------------------------------\n\n");
        }
        ftp.login("nas1", "ko9984");//로그인
        ftp.setFileType(FTP.BINARY_FILE_TYPE);
        ftp.enterLocalPassiveMode();

        if (root != null)
            ftp.changeWorkingDirectory(root);

        return this;
    }

    public FTPTest disconnect() throws Exception {
        ftp.logout();
        ftp.disconnect();
        return this;
    }


    public FTPTest active(Handler handler) throws Exception {
        if (ftp == null || !ftp.isConnected())
            connect();
        handler.accept(ftp);
        return this;
    }

    interface Handler {
        void accept(FTPClient ftp) throws Exception;
    }

    private void out(Object obj) {
        System.out.println(obj);
    }
}
