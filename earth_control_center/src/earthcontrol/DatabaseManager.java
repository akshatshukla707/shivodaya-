package earthcontrol;

import java.sql.*;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class DatabaseManager {
    private static final String DEFAULT_DB_PATH = "/home/akshat/Downloads/parabitshivchaitanya.db";
    private static final String FALLBACK_DB_PATH = "earth_control_center/parabitshivchaitanya.db";
    private String activeDbPath;

    public DatabaseManager() {
        File f1 = new File(DEFAULT_DB_PATH);
        if (f1.exists()) {
            activeDbPath = DEFAULT_DB_PATH;
        } else {
            activeDbPath = FALLBACK_DB_PATH;
        }
    }

    public Connection getConnection() throws SQLException {
        try {
            Class.forName("org.sqlite.JDBC");
            return DriverManager.getConnection("jdbc:sqlite:" + activeDbPath);
        } catch (ClassNotFoundException e) {
            // Fallback to SQLite dynamic connection via org.sqlite wrapper
            return DriverManager.getConnection("jdbc:sqlite:" + activeDbPath);
        }
    }

    public String getActiveDbPath() {
        return activeDbPath;
    }

    public static void main(String[] args) {
        DatabaseManager db = new DatabaseManager();
        db.initializeTablesIfMissing();
        System.out.println("[+] Database initialized successfully at: " + db.getActiveDbPath());
    }

    public void initializeTablesIfMissing() {
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute("CREATE TABLE IF NOT EXISTS pbtagencyregistration (" +
                    "Sno TEXT PRIMARY KEY, agencyname TEXT, agencyabbreviation TEXT, country TEXT, status TEXT, comment TEXT, note TEXT)");

            stmt.execute("CREATE TABLE IF NOT EXISTS pbtmission (" +
                    "mid INTEGER PRIMARY KEY AUTOINCREMENT, mname TEXT, officialmid TEXT, mlaunchdate TEXT, mlaunchtime TEXT, " +
                    "mdestinationdate TEXT, mdestinationtime TEXT, magency TEXT, mlife TEXT, mmodule TEXT, mmoduleid TEXT, " +
                    "mmembers INTEGER, mpurpose1 TEXT, mpurpose2 TEXT, mpurpose3 TEXT, mpurpose4 TEXT, malertcount INTEGER, " +
                    "malertid TEXT, mstatus TEXT, mcomment TEXT, mnote TEXT)");

            stmt.execute("CREATE TABLE IF NOT EXISTS pbtalert (" +
                    "alertid TEXT PRIMARY KEY, frecdate TEXT, frectime TEXT, alertsource TEXT, alerttypeid TEXT, " +
                    "alertdetectdate TEXT, alertdetecttime TEXT, fcreateddate TEXT, fcreatedtime TEXT, predictedalertdate TEXT, " +
                    "predictedalerttime TEXT, predictalertrisk TEXT, aloginid TEXT, status TEXT, comment TEXT, note TEXT, visibility TEXT)");

            stmt.execute("CREATE TABLE IF NOT EXISTS pbtastronaut (" +
                    "aid TEXT PRIMARY KEY, aname TEXT, adob TEXT, agender TEXT, anationality TEXT, arole1 TEXT, arole2 TEXT, " +
                    "aagencyname TEXT, aagencyid TEXT, aagencycountry TEXT, aaphone1 TEXT, aaphone2 TEXT, aloginid TEXT, " +
                    "aloginpass TEXT, aworkexphr TEXT, aradlvl TEXT, astatus TEXT, acomment TEXT, anote TEXT, mid INTEGER)");

            stmt.execute("CREATE TABLE IF NOT EXISTS pbttrajectory (" +
                    "pathid TEXT PRIMARY KEY, dynamictid TEXT, fixedtid TEXT, mid INTEGER, date TEXT, time TEXT, " +
                    "rateles TEXT, decteles TEXT, deltadis TEXT, deldotsun TEXT, deldotmission TEXT, alertid TEXT)");

            NASADataSeeder.populateNASAData(conn);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private void seedInitialData(Connection conn) throws SQLException {
        // Seed initial missions if empty
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM pbtmission")) {
            if (rs.next() && rs.getInt(1) == 0) {
                String seedMissions = "INSERT INTO pbtmission (mname, officialmid, mlaunchdate, mlaunchtime, mdestinationdate, mdestinationtime, magency, mlife, mmodule, mmoduleid, mmembers, mpurpose1, mpurpose2, mpurpose3, mpurpose4, malertcount, malertid, mstatus, mcomment, mnote) VALUES " +
                        "('Gaganyaan G1', 'ISRO-G1', '2025-12-10', '09:00:00', '2025-12-10', '15:00:00', 'ISRO , INDIA', '4.5', 'Bhaarat Transceiver v2', '301', 6, 'Human Spaceflight', 'Orbital Test', 'Life Support Test', 'Crew Safety', 3, 'ALT-2026-001', 'Active', 'First Indian Human Mission', 'Operational Bhaarat Shivodaya Transceiver Module'), " +
                        "('Chandrayaan-3 Lunar Relay', 'ISRO-CH3', '2023-07-14', '14:35:00', '2023-08-23', '12:33:00', 'ISRO , INDIA', '5.3', 'Bhaarat Transceiver v2', '302', 0, 'Moon Landing', 'Surface Study', 'Soil Analysis', 'DTN Relay Node', 1, 'ALT-2026-004', 'Active', 'Successful Soft Landing', 'Cis-Lunar DTN Mesh Node'), " +
                        "('Aditya-L1 Solar Probe', 'ISRO-L1', '2023-09-02', '11:50:00', '2024-01-06', '16:00:00', 'ISRO , INDIA', '5.0', 'Bhaarat Transceiver v2', '101', 0, 'Solar Observation', 'CME Monitoring', 'JSCC Encoding', 'Radiation Alerting', 12, 'ALT-2026-009', 'Active', 'Aditya-L1 Halo Orbit', 'Primary Solar Telemetry Acquisition Probe'), " +
                        "('Perseverance Mars Rover', 'NASA-PER-01', '2020-07-30', '07:50:00', '2021-02-18', '15:55:00', 'NASA , USA', '10.0', 'Receiver-Only Mode', '405', 0, 'Mars Soil Sampling', 'Jezero Crater Exploration', 'Astrobiology', 'No Broadcast', 0, 'NONE', 'Active', 'US Mars Rover Target Node', 'Bhaarat Security Switch set to RECEIVE-ONLY'), " +
                        "('ExoMars Trace Gas Orbiter', 'ESA-TGO-02', '2016-03-14', '09:31:00', '2016-10-19', '14:42:00', 'ESA , EUROPE', '8.0', 'Bhaarat Transceiver v2', '501', 0, 'Methane Analysis', 'Mars Atmospheric Profile', 'DTN Relay Node', 'Deep Space Communications', 2, 'ALT-2026-003', 'Active', 'Joint ESA Mars Relay', 'Full Transceiver Module Active')";
                stmt.executeUpdate(seedMissions);
            }
        }

        // Seed initial alerts if empty
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM pbtalert")) {
            if (rs.next() && rs.getInt(1) == 0) {
                String seedAlerts = "INSERT INTO pbtalert (alertid, frecdate, frectime, alertsource, alerttypeid, alertdetectdate, alertdetecttime, fcreateddate, fcreatedtime, predictedalertdate, predictedalerttime, predictalertrisk, aloginid, status, comment, note, visibility) VALUES " +
                        "('ALT-2026-001', '2026-08-28', '00:02:00', 'Aditya-L1 Probe', 'CME_SEVERE', '2026-08-28', '00:00:00', '2026-08-28', '00:02:05', '2026-08-28', '04:15:00', 'HIGH_CRITICAL', 'OPERATOR_ISRO', 'HARMFUL', 'Severe Coronal Mass Ejection detected', 'Velocity: 1800 km/s, Acceleration: 1500 km/s/min', 'PUBLIC_AGENCY'), " +
                        "('ALT-2026-002', '2026-08-28', '00:05:00', 'Aditya-L1 Probe', 'SEP_SPIKE', '2026-08-28', '00:03:00', '2026-08-28', '00:05:10', '2026-08-28', '02:30:00', 'MEDIUM_HIGH', 'OPERATOR_ISRO', 'HARMFUL', 'Solar Energetic Particle surge', 'Particle Intensity: 85 p/cm2/s/sr', 'PUBLIC_AGENCY'), " +
                        "('ALT-2026-003', '2026-08-28', '00:10:00', 'Solar Orbiter ESA', 'XRAY_FLARE', '2026-08-28', '00:08:00', '2026-08-28', '00:10:15', '2026-08-28', '01:00:00', 'HIGH_CRITICAL', 'OPERATOR_ESA', 'HARMFUL', 'X1.5 Class X-Ray Flare', 'Flux: 300 W/m2', 'RESTRICTED'), " +
                        "('ALT-2026-004', '2026-08-28', '00:15:00', 'Deep Space Radar 4', 'PROTON_FLUX', '2026-08-28', '00:12:00', '2026-08-28', '00:15:20', '2026-08-28', '06:00:00', 'LOW_NOMINAL', 'OPERATOR_NASA', 'RESOLVED', 'Proton Flux surge decayed', 'Flux back below 10 p/cm2/s/sr', 'PUBLIC_AGENCY')";
                stmt.executeUpdate(seedAlerts);
            }
        }

        // Seed initial trajectory comparison records if empty
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM pbttrajectory")) {
            if (rs.next() && rs.getInt(1) == 0) {
                String seedTraj = "INSERT INTO pbttrajectory (pathid, dynamictid, fixedtid, mid, date, time, rateles, decteles, deltadis, deldotsun, deldotmission, alertid) VALUES " +
                        "('TRAJ-101', 'DYN-MARS-01', 'FIX-L1-01', 1, '2026-08-28', '00:02:00', 'RA: 14h20m', 'DEC: -12.5 deg', '0.045 AU', '1.01 AU', '0.002 AU', 'ALT-2026-001'), " +
                        "('TRAJ-102', 'DYN-MOON-02', 'FIX-L1-01', 2, '2026-08-28', '00:05:00', 'RA: 08h15m', 'DEC: +24.1 deg', '0.012 AU', '0.99 AU', '0.0005 AU', 'ALT-2026-002'), " +
                        "('TRAJ-103', 'DYN-MARS-03', 'FIX-L1-01', 4, '2026-08-28', '00:10:00', 'RA: 18h40m', 'DEC: -05.2 deg', '0.120 AU', '1.42 AU', '0.018 AU', 'ALT-2026-003')";
                stmt.executeUpdate(seedTraj);
            }
        }

        // Seed initial astronauts if empty
        try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM pbtastronaut")) {
            if (rs.next() && rs.getInt(1) == 0) {
                String seedAstro = "INSERT INTO pbtastronaut (aid, aname, adob, agender, anationality, arole1, arole2, aagencyname, aagencyid, aagencycountry, aaphone1, aaphone2, aloginid, aloginpass, aworkexphr, aradlvl, astatus, acomment, anote, mid) VALUES " +
                        "('AST-01', 'Group Capt. Prashanth Nair', '1976-08-26', 'Male', 'Indian', 'Commander', 'Pilot', 'ISRO', '13', 'INDIA', '+91-9876543210', '+91-9876543211', 'pnair', 'pass123', '2400', '0.12 mSv', 'Active', 'Gaganyaan G1 Commander', 'Nominal Radiation Dose', 1), " +
                        "('AST-02', 'Group Capt. Ajit Krishnan', '1982-04-19', 'Male', 'Indian', 'Pilot', 'Payload Specialist', 'ISRO', '13', 'INDIA', '+91-9876543212', '+91-9876543213', 'akrishnan', 'pass123', '2100', '0.10 mSv', 'Active', 'Gaganyaan G1 Pilot', 'Nominal Radiation Dose', 1), " +
                        "('AST-03', 'Dr. Christina Koch', '1979-01-29', 'Female', 'American', 'Mission Specialist', 'Flight Engineer', 'NASA', '1', 'USA', '+1-202-555-0199', '+1-202-555-0198', 'ckoch', 'pass123', '3500', '0.45 mSv', 'Active', 'Artemis Crew Member', 'Monitored for CME Radiation', 4)";
                stmt.executeUpdate(seedAstro);
            }
        }
    }
}
