package earthcontrol;

import java.sql.*;

public class NASADataSeeder {

    public static void populateNASAData(Connection conn) throws SQLException {
        // Clear existing tables and repopulate with NASA JPL / ISRO deep space telemetry & mission data
        try (Statement stmt = conn.createStatement()) {

            // 1. REPOPULATE pbtagencyregistration (Deep Space Agencies)
            stmt.executeUpdate("DELETE FROM pbtagencyregistration");
            String seedAgencies = "INSERT INTO pbtagencyregistration (Sno, agencyname, agencyabbreviation, country, status, comment, note) VALUES " +
                    "('101', 'Indian Space Research Organisation', 'ISRO', 'INDIA', 'ACTIVE', 'Primary Operator for Project Shivodaya', 'Bhaarat Deep Space Command'), " +
                    "('102', 'National Aeronautics and Space Administration', 'NASA', 'USA', 'ACTIVE', 'Deep Space Network Partner', 'JPL Pasadena Coordination'), " +
                    "('103', 'European Space Agency', 'ESA', 'EUROPE', 'ACTIVE', 'Cis-Lunar Mesh Node Operator', 'ESOC Darmstadt Operations'), " +
                    "('104', 'Japan Aerospace Exploration Agency', 'JAXA', 'JAPAN', 'ACTIVE', 'Solar System Exploration Partner', 'Tsukuba Space Center'), " +
                    "('105', 'Roscosmos State Corporation', 'ROSCOSMOS', 'RUSSIA', 'ACTIVE', 'Orbital Telemetry Exchange', 'Roscosmos Flight Control'), " +
                    "('106', 'Space Exploration Technologies Corp.', 'SPACEX', 'USA', 'ACTIVE', 'Commercial Payload & Starlink DTN', 'Hawthorne Mission Operations')";
            stmt.executeUpdate(seedAgencies);

            // 2. REPOPULATE pbtmission (Missions with Bhaarat Security Module Toggle)
            stmt.executeUpdate("DELETE FROM pbtmission");
            String seedMissions = "INSERT INTO pbtmission (mname, officialmid, mlaunchdate, mlaunchtime, mdestinationdate, mdestinationtime, magency, mlife, mmodule, mmoduleid, mmembers, mpurpose1, mpurpose2, mpurpose3, mpurpose4, malertcount, malertid, mstatus, mcomment, mnote) VALUES " +
                    "('Aditya-L1 Solar Probe', 'ISRO-L1-2023', '2023-09-02', '11:50:00', '2024-01-06', '16:00:00', 'ISRO , INDIA', '5.0', 'Bhaarat Transceiver v2 (Full Transmit & Receive Mesh Node)', 'SHIV-101', 0, 'Solar CME Detection', 'JSCC Neural Encoding', 'Aditya Telemetry', 'Space Weather Warning', 14, 'ALT-2026-001', 'Active', 'Aditya-L1 Halo Orbit', 'Primary Telemetry Ingestion Node'), " +
                    "('Gaganyaan Crew Mission 1', 'ISRO-G1-2025', '2025-12-10', '09:00:00', '2025-12-10', '15:00:00', 'ISRO , INDIA', '4.5', 'Bhaarat Transceiver v2 (Full Transmit & Receive Mesh Node)', 'SHIV-301', 6, 'Human Spaceflight', 'Life Support Shielding', 'Astronaut Radiation Safety', 'Crew Operations', 4, 'ALT-2026-002', 'Active', 'First Indian Crewed Flight', 'Protected by Shivodaya Early Warning'), " +
                    "('Chandrayaan-3 Lunar Relay', 'ISRO-CH3-2023', '2023-07-14', '14:35:00', '2023-08-23', '12:33:00', 'ISRO , INDIA', '7.0', 'Bhaarat Transceiver v2 (Full Transmit & Receive Mesh Node)', 'SHIV-201', 0, 'Moon South Pole Base', 'DTN Custody Relay', 'Surface Spectrometry', 'Lunar Gateway Link', 2, 'ALT-2026-004', 'Active', 'Cis-Lunar Mesh Node', 'Non-volatile Store-and-Forward Relay'), " +
                    "('Perseverance Mars Rover', 'NASA-MARS-2020', '2020-07-30', '07:50:00', '2021-02-18', '15:55:00', 'NASA , USA', '12.0', 'Receiver-Only Mode (Security Switch ACTIVE - No Transmission)', 'SHIV-405', 0, 'Jezero Crater Sampling', 'Mars Bio-signature Search', 'Astrobiology', 'No Broadcast', 1, 'ALT-2026-003', 'Active', 'US Mars Rover Target Node', 'Bhaarat Security Switch set to RECEIVE-ONLY'), " +
                    "('ExoMars Trace Gas Orbiter', 'ESA-TGO-2016', '2016-03-14', '09:31:00', '2016-10-19', '14:42:00', 'ESA , EUROPE', '10.0', 'Bhaarat Transceiver v2 (Full Transmit & Receive Mesh Node)', 'SHIV-502', 0, 'Atmospheric Profile', 'Methane Detection', 'DTN Relay Node', 'Mars Orbit Backup', 3, 'ALT-2026-003', 'Active', 'Joint ESA Mars Relay', 'Full Transceiver Module Active'), " +
                    "('Artemis III Crewed Lunar Mission', 'NASA-ART-3', '2026-09-15', '12:00:00', '2026-09-21', '18:30:00', 'NASA , USA', '3.0', 'Bhaarat Transceiver v2 (Full Transmit & Receive Mesh Node)', 'SHIV-601', 4, 'Lunar South Pole Landing', 'Crew Habitat Operations', 'Radiation Monitoring', 'DTN Link', 5, 'ALT-2026-005', 'Active', 'NASA Artemis Program', 'Integrated with Shivodaya Mesh Warnings')";
            stmt.executeUpdate(seedMissions);

            // 3. REPOPULATE pbtalert (NASA / ISRO Solar Alert Logs)
            stmt.executeUpdate("DELETE FROM pbtalert");
            String seedAlerts = "INSERT INTO pbtalert (alertid, frecdate, frectime, alertsource, alerttypeid, alertdetectdate, alertdetecttime, fcreateddate, fcreatedtime, predictedalertdate, predictedalerttime, predictalertrisk, aloginid, status, comment, note, visibility) VALUES " +
                    "('ALT-2026-001', '2026-08-28', '00:02:00', 'Aditya-L1 Probe', 'CME_SEVERE', '2026-08-28', '00:00:00', '2026-08-28', '00:02:05', '2026-08-28', '04:15:00', 'HIGH_CRITICAL', 'OPERATOR_ISRO', 'HARMFUL', 'Halo Coronal Mass Ejection detected. Speed: 1800 km/s, Acceleration: 1500 km/s/min', 'Direct shockwave vector towards Mars Base ipn:3.1', 'PUBLIC_AGENCY'), " +
                    "('ALT-2026-002', '2026-08-28', '00:05:00', 'Aditya-L1 Probe', 'SEP_SURGE', '2026-08-28', '00:03:00', '2026-08-28', '00:05:10', '2026-08-28', '02:30:00', 'HIGH_CRITICAL', 'OPERATOR_ISRO', 'HARMFUL', 'Solar Energetic Particle spike > 85 p/cm2/s/sr', 'Gaganyaan G1 crew instructed to enter storm shelter', 'PUBLIC_AGENCY'), " +
                    "('ALT-2026-003', '2026-08-28', '00:10:00', 'Solar Orbiter ESA', 'XRAY_FLARE_X15', '2026-08-28', '00:08:00', '2026-08-28', '00:10:15', '2026-08-28', '01:00:00', 'HIGH_CRITICAL', 'OPERATOR_ESA', 'HARMFUL', 'X15.4 Class Extreme X-Ray Solar Flare', 'Cis-Lunar Direct Line-of-Sight Blackout Event', 'RESTRICTED_BHAARAT'), " +
                    "('ALT-2026-004', '2026-08-28', '00:15:00', 'Deep Space Network 4', 'SOLAR_WIND_SURGE', '2026-08-28', '00:12:00', '2026-08-28', '00:15:20', '2026-08-28', '06:00:00', 'MEDIUM_HIGH', 'OPERATOR_NASA', 'HARMFUL', 'Solar Wind Velocity Surge: 950 km/s', 'Dynamic pressure surge on magnetosphere', 'PUBLIC_AGENCY'), " +
                    "('ALT-2026-005', '2026-08-28', '00:22:00', 'Parker Solar Probe', 'PROTON_FLUX_SURGE', '2026-08-28', '00:20:00', '2026-08-28', '00:22:10', '2026-08-28', '03:45:00', 'HIGH_CRITICAL', 'OPERATOR_NASA', 'HARMFUL', 'Proton Flux surge: 320 p/cm2/s/sr/min', 'High risk of satellite solar array degradation', 'PUBLIC_AGENCY')";
            stmt.executeUpdate(seedAlerts);

            // 4. REPOPULATE pbtastronaut (Astronaut Profiles & Dosages)
            stmt.executeUpdate("DELETE FROM pbtastronaut");
            String seedAstronauts = "INSERT INTO pbtastronaut (aid, aname, adob, agender, anationality, arole1, arole2, aagencyname, aagencyid, aagencycountry, aaphone1, aaphone2, aloginid, aloginpass, aworkexphr, aradlvl, astatus, acomment, anote, mid) VALUES " +
                    "('AST-01', 'Group Capt. Prashanth Nair', '1976-08-26', 'Male', 'Indian', 'Mission Commander', 'Flight Test Pilot', 'ISRO', '101', 'INDIA', '+91-9876543210', '+91-9876543211', 'pnair', 'pass123', '2400', '0.12 mSv', 'Active', 'Gaganyaan G1 Commander', 'Nominal Radiation Dosage', 2), " +
                    "('AST-02', 'Group Capt. Ajit Krishnan', '1982-04-19', 'Male', 'Indian', 'Flight Pilot', 'Payload Specialist', 'ISRO', '101', 'INDIA', '+91-9876543212', '+91-9876543213', 'akrishnan', 'pass123', '2100', '0.10 mSv', 'Active', 'Gaganyaan G1 Pilot', 'Nominal Radiation Dosage', 2), " +
                    "('AST-03', 'Group Capt. Angad Pratap', '1982-07-17', 'Male', 'Indian', 'Flight Engineer', 'Systems Operator', 'ISRO', '101', 'INDIA', '+91-9876543214', '+91-9876543215', 'apratap', 'pass123', '1950', '0.09 mSv', 'Active', 'Gaganyaan Flight Engineer', 'Nominal Radiation Dosage', 2), " +
                    "('AST-04', 'Wing Cdr. Shubhanshu Shukla', '1985-10-10', 'Male', 'Indian', 'Pilot Specialist', 'ISS Operations', 'ISRO', '101', 'INDIA', '+91-9876543216', '+91-9876543217', 'sshukla', 'pass123', '1800', '0.15 mSv', 'Active', 'Axiom-4 ISS Mission Specialist', 'Trained on Shivodaya Early Warning', 2), " +
                    "('AST-05', 'Dr. Christina Koch', '1979-01-29', 'Female', 'American', 'Mission Commander', 'Astrobiology Specialist', 'NASA', '102', 'USA', '+1-202-555-0199', '+1-202-555-0198', 'ckoch', 'pass123', '3500', '0.42 mSv', 'Active', 'Artemis III Crew Member', 'Monitored for CME Radiation', 6)";
            stmt.executeUpdate(seedAstronauts);

            // 5. REPOPULATE pbttrajectory (Trajectory Comparison: Flight Path vs Radiation Front)
            stmt.executeUpdate("DELETE FROM pbttrajectory");
            String seedTraj = "INSERT INTO pbttrajectory (pathid, dynamictid, fixedtid, mid, date, time, rateles, decteles, deltadis, deldotsun, deldotmission, alertid) VALUES " +
                    "('TRAJ-101', 'DYN-MARS-01', 'FIX-L1-01', 1, '2026-08-28', '00:02:00', 'RA: 14h20m', 'DEC: -12.5 deg', '0.045 AU', '1.01 AU', '0.002 AU', 'ALT-2026-001'), " +
                    "('TRAJ-102', 'DYN-MOON-02', 'FIX-L1-01', 2, '2026-08-28', '00:05:00', 'RA: 08h15m', 'DEC: +24.1 deg', '0.012 AU', '0.99 AU', '0.0005 AU', 'ALT-2026-002'), " +
                    "('TRAJ-103', 'DYN-MARS-03', 'FIX-L1-01', 4, '2026-08-28', '00:10:00', 'RA: 18h40m', 'DEC: -05.2 deg', '0.120 AU', '1.42 AU', '0.018 AU', 'ALT-2026-003'), " +
                    "('TRAJ-104', 'DYN-MARS-04', 'FIX-L1-01', 5, '2026-08-28', '00:15:00', 'RA: 16h10m', 'DEC: -08.4 deg', '0.025 AU', '1.05 AU', '0.001 AU', 'ALT-2026-004'), " +
                    "('TRAJ-105', 'DYN-LUNAR-05', 'FIX-L1-01', 6, '2026-08-28', '00:22:00', 'RA: 11h05m', 'DEC: +18.2 deg', '0.008 AU', '0.98 AU', '0.0003 AU', 'ALT-2026-005')";
            stmt.executeUpdate(seedTraj);

            // 6. REPOPULATE pbtlogtable (Audit & System Operations Log)
            stmt.executeUpdate("DELETE FROM pbtlogtable");
            String seedLogs = "INSERT INTO pbtlogtable (loginid, logintimeanddate, userswitchtimeanddate, switchloginid, comment, note, workinghrs, ewarning, etime) VALUES " +
                    "('ISRO_GROUND_CMD', '2026-08-28 00:00:01', '2026-08-28 00:00:05', 'OPERATOR_BHAARAT', 'System initialization', 'Shivodaya Mesh Node Online', '8.0', 'NOMINAL', '00:00:01'), " +
                    "('ADITYA_L1_PROBE', '2026-08-28 00:02:00', '2026-08-28 00:02:05', 'ENCODER_C11', 'CME Severe Alert Dispatch', 'JSCC Vector 32-float encoded with Bhaarat marker', '24.0', 'CRITICAL_CME', '00:02:00'), " +
                    "('CISLUNAR_GATEWAY', '2026-08-28 00:05:00', '2026-08-28 00:05:02', 'RICHA_NEURAL_ROUTER', 'Perceptron Dijkstra CGR reroute', 'Multi-hop BFS path activated around solar blackout', '12.0', 'WARNING_SEP', '00:05:00'), " +
                    "('MARS_BASE_3_1', '2026-08-28 00:10:00', '2026-08-28 00:10:04', 'AKASHDEEP_DECODER', 'Reverse MLP semantic vector decoded', 'Reconstructed CME velocity 1800 km/s - SAFE ZONE DIRECTIVE ISSUED', '18.0', 'CRITICAL_FLARE', '00:10:00'), " +
                    "('NASA_JPL_DSN', '2026-08-28 00:15:00', '2026-08-28 00:15:01', 'OPERATOR_NASA', 'Telemetry synchronization', 'Inter-agency DTN custody exchange verified', '10.0', 'NOMINAL', '00:15:00')";
            stmt.executeUpdate(seedLogs);
        }
    }
}
