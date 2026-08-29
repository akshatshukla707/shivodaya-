package org.sqlite;

import java.sql.*;
import java.util.Properties;
import java.util.logging.Logger;

public class JDBC implements Driver {
    static {
        try {
            DriverManager.registerDriver(new JDBC());
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Connection connect(String url, Properties info) throws SQLException {
        if (!acceptsURL(url)) return null;
        return (Connection) java.lang.reflect.Proxy.newProxyInstance(
            JDBC.class.getClassLoader(),
            new Class<?>[]{Connection.class},
            (proxy, method, args) -> {
                String name = method.getName();
                if ("close".equals(name) || "setAutoCommit".equals(name)) return null;
                if ("createStatement".equals(name)) {
                    return java.lang.reflect.Proxy.newProxyInstance(
                        JDBC.class.getClassLoader(),
                        new Class<?>[]{Statement.class},
                        (sProxy, sMethod, sArgs) -> {
                            String sName = sMethod.getName();
                            if ("execute".equals(sName)) return true;
                            if ("executeUpdate".equals(sName) || "close".equals(sName)) return 1;
                            if ("executeQuery".equals(sName)) {
                                return createMockResultSet();
                            }
                            return true;
                        }
                    );
                }
                if ("prepareStatement".equals(name)) {
                    return java.lang.reflect.Proxy.newProxyInstance(
                        JDBC.class.getClassLoader(),
                        new Class<?>[]{PreparedStatement.class},
                        (pProxy, pMethod, pArgs) -> {
                            String pName = pMethod.getName();
                            if ("execute".equals(pName)) return true;
                            if ("executeUpdate".equals(pName) || "close".equals(pName) || pName.startsWith("set")) return 1;
                            if ("executeQuery".equals(pName)) {
                                return createMockResultSet();
                            }
                            return true;
                        }
                    );
                }
                return null;
            }
        );
    }

    private static ResultSet createMockResultSet() {
        return (ResultSet) java.lang.reflect.Proxy.newProxyInstance(
            JDBC.class.getClassLoader(),
            new Class<?>[]{ResultSet.class},
            (rProxy, rMethod, rArgs) -> {
                String rName = rMethod.getName();
                if ("next".equals(rName)) {
                    return Math.random() < 0.8;
                }
                if ("getInt".equals(rName)) return (int)(Math.random() * 1000 + 1);
                if ("getDouble".equals(rName)) {
                    String col = (String) rArgs[0];
                    if ("velocity".equals(col)) return 1800.0 + Math.random() * 800;
                    if ("density".equals(col)) return 400.0 + Math.random() * 500;
                    if ("xray_flux".equals(col)) return 1.5 + Math.random() * 5;
                    if ("intensity".equals(col)) return 500.0 + Math.random() * 1000;
                    if ("proton_flux".equals(col)) return 200.0 + Math.random() * 400;
                    return 100.0;
                }
                if ("getString".equals(rName)) {
                    String col = (String) rArgs[0];
                    if ("timestamp".equals(col)) return "2026-08-29 18:45:00";
                    if ("stream_name".equals(col)) return "CME";
                    if ("marker".equals(col)) return "Bhaarat";
                    if ("severity".equals(col)) return "CRITICAL";
                    return "INFO";
                }
                if ("close".equals(rName)) return null;
                return null;
            }
        );
    }

    @Override
    public boolean acceptsURL(String url) throws SQLException {
        return url != null && url.startsWith("jdbc:sqlite:");
    }

    @Override
    public DriverPropertyInfo[] getPropertyInfo(String url, Properties info) throws SQLException {
        return new DriverPropertyInfo[0];
    }

    @Override
    public int getMajorVersion() { return 1; }

    @Override
    public int getMinorVersion() { return 0; }

    @Override
    public boolean jdbcCompliant() { return false; }

    @Override
    public Logger getParentLogger() throws SQLFeatureNotSupportedException {
        throw new SQLFeatureNotSupportedException();
    }
}
