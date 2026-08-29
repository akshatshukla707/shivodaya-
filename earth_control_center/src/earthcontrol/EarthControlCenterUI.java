package earthcontrol;

import javax.swing.*;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableModel;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.File;
import java.sql.*;

public class EarthControlCenterUI extends JFrame {
    private DatabaseManager dbManager;
    private JPanel sidebarPanel;
    private boolean sidebarExpanded = true;
    private JPanel contentCardsPanel;
    private CardLayout cardLayout;
    private JLabel alertBannerLabel;
    private boolean flashState = false;

    public EarthControlCenterUI() {
        ModernTheme.applyFlatLafSettings();

        dbManager = new DatabaseManager();
        dbManager.initializeTablesIfMissing();

        setTitle("PROJECT SHIVODAYA :: ISRO GROUND OPERATIONS MISSION CONTROL CENTER");
        setSize(1480, 920);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        getContentPane().setBackground(ModernTheme.BG_DARK);

        initUI();
    }

    private void initUI() {
        JPanel mainPanel = new JPanel(new BorderLayout(8, 8));
        mainPanel.setBackground(ModernTheme.BG_DARK);
        mainPanel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // Top HUD Header Command Bar
        JPanel headerPanel = createHeaderPanel();
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Center Split Layout (Collapsible Collapsible Sidebar + Content Cards)
        sidebarPanel = createSidebarPanel();
        contentCardsPanel = new JPanel(cardLayout = new CardLayout());
        contentCardsPanel.setBackground(ModernTheme.BG_DARK);

        contentCardsPanel.add(createMissionPanel(), "pbtmission");
        contentCardsPanel.add(createAgencyPanel(), "pbtagencyregistration");
        contentCardsPanel.add(createAlertPanel(), "pbtalert");
        contentCardsPanel.add(createAstronautPanel(), "pbtastronaut");
        contentCardsPanel.add(createTrajectoryPanel(), "pbttrajectory");
        contentCardsPanel.add(createAuditLogPanel(), "pbtlogtable");

        mainPanel.add(sidebarPanel, BorderLayout.WEST);
        mainPanel.add(contentCardsPanel, BorderLayout.CENTER);

        // Footer Bar
        JPanel footerPanel = createFooterPanel();
        mainPanel.add(footerPanel, BorderLayout.SOUTH);

        add(mainPanel);

        // Flashing Critical Radiation Alert Banner Timer
        Timer flashTimer = new Timer(500, e -> {
            flashState = !flashState;
            if (flashState) {
                alertBannerLabel.setForeground(ModernTheme.VIVID_RED);
            } else {
                alertBannerLabel.setForeground(ModernTheme.VIVID_YELLOW);
            }
        });
        flashTimer.start();
    }

    private JPanel createHeaderPanel() {
        JPanel header = new JPanel(new BorderLayout(15, 0));
        header.setBackground(ModernTheme.PANEL_BG);
        header.setBorder(ModernTheme.createSharpBorder(ModernTheme.VIVID_CYAN));
        header.setPreferredSize(new Dimension(0, 50));

        // Sidebar Toggle Button
        JButton toggleSidebarBtn = ModernTheme.createTacticalButton("☰ SIDEBAR", ModernTheme.CARD_BG, ModernTheme.VIVID_CYAN);
        toggleSidebarBtn.addActionListener(e -> {
            sidebarExpanded = !sidebarExpanded;
            sidebarPanel.setPreferredSize(new Dimension(sidebarExpanded ? 260 : 50, sidebarPanel.getHeight()));
            sidebarPanel.revalidate();
            sidebarPanel.repaint();
        });

        JLabel titleLabel = new JLabel(" PROJECT SHIVODAYA GROUND CENTER ");
        titleLabel.setFont(ModernTheme.FONT_TITLE);
        titleLabel.setForeground(ModernTheme.VIVID_CYAN);

        JPanel leftHeader = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        leftHeader.setOpaque(false);
        leftHeader.add(toggleSidebarBtn);
        leftHeader.add(titleLabel);

        // Flashing Alert Status Banner
        alertBannerLabel = new JLabel("⚠️ CRITICAL: HALO CME 1800 KM/S AT ADITYA-L1");
        alertBannerLabel.setFont(ModernTheme.FONT_MONO_BOLD);
        alertBannerLabel.setForeground(ModernTheme.VIVID_RED);

        JButton launch3dBtn = ModernTheme.createTacticalButton("🌐 3D MESH VISUALIZER", ModernTheme.VIVID_AMBER, Color.BLACK);
        launch3dBtn.addActionListener(e -> {
            try {
                Desktop.getDesktop().open(new File("/home/akshat/shivodaya/richa/main3dvisual.html"));
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Opening 3D visualizer at: richa/main3dvisual.html", "3D Visualizer", JOptionPane.INFORMATION_MESSAGE);
            }
        });

        JPanel rightHeader = new JPanel(new FlowLayout(FlowLayout.RIGHT, 12, 5));
        rightHeader.setOpaque(false);
        rightHeader.add(alertBannerLabel);
        rightHeader.add(launch3dBtn);

        header.add(leftHeader, BorderLayout.WEST);
        header.add(rightHeader, BorderLayout.EAST);
        return header;
    }

    private JPanel createSidebarPanel() {
        JPanel sidebar = new JPanel(new BorderLayout());
        sidebar.setBackground(ModernTheme.PANEL_BG);
        sidebar.setPreferredSize(new Dimension(260, 0));
        sidebar.setBorder(ModernTheme.createSharpBorder(ModernTheme.BORDER_COLOR));

        JPanel navPanel = new JPanel();
        navPanel.setLayout(new BoxLayout(navPanel, BoxLayout.Y_AXIS));
        navPanel.setOpaque(false);
        navPanel.setBorder(BorderFactory.createEmptyBorder(10, 8, 10, 8));

        JLabel navTitle = new JLabel("PRIMARY MISSION TABLES");
        navTitle.setFont(ModernTheme.FONT_MONO_BOLD);
        navTitle.setForeground(ModernTheme.VIVID_CYAN);
        navTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        navPanel.add(navTitle);
        navPanel.add(Box.createRigidArea(new Dimension(0, 12)));

        addNavButton(navPanel, "🚀 Mission Reg (pbtmission)", "pbtmission", ModernTheme.VIVID_CYAN);
        addNavButton(navPanel, "🏛️ Agency Reg (pbtagency)", "pbtagencyregistration", ModernTheme.VIVID_GREEN);
        addNavButton(navPanel, "⚠️ Alerts Log (pbtalert)", "pbtalert", ModernTheme.VIVID_RED);
        addNavButton(navPanel, "👨‍🚀 Astronauts (pbtastronaut)", "pbtastronaut", ModernTheme.VIVID_PURPLE);
        addNavButton(navPanel, "🛰️ Trajectory (pbttrajectory)", "pbttrajectory", ModernTheme.VIVID_AMBER);
        addNavButton(navPanel, "📋 Audit Logs (pbtlogtable)", "pbtlogtable", ModernTheme.VIVID_YELLOW);

        navPanel.add(Box.createRigidArea(new Dimension(0, 20)));

        // Live Telemetry Waveform Component Embedded in Sidebar
        JLabel chartTitle = new JLabel("LIVE SOLAR WAVEFORMS");
        chartTitle.setFont(ModernTheme.FONT_MONO_BOLD);
        chartTitle.setForeground(ModernTheme.VIVID_ORANGE);
        chartTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        navPanel.add(chartTitle);
        navPanel.add(Box.createRigidArea(new Dimension(0, 8)));

        TelemetryChartPanel chartPanel = new TelemetryChartPanel();
        chartPanel.setAlignmentX(Component.LEFT_ALIGNMENT);
        navPanel.add(chartPanel);

        sidebar.add(navPanel, BorderLayout.NORTH);
        return sidebar;
    }

    private void addNavButton(JPanel navPanel, String label, String cardName, Color accent) {
        JButton btn = ModernTheme.createTacticalButton(label, ModernTheme.CARD_BG, ModernTheme.TEXT_PRIMARY);
        btn.setMaximumSize(new Dimension(240, 36));
        btn.setAlignmentX(Component.LEFT_ALIGNMENT);
        btn.addActionListener(e -> cardLayout.show(contentCardsPanel, cardName));
        navPanel.add(btn);
        navPanel.add(Box.createRigidArea(new Dimension(0, 6)));
    }

    // =========================================================================
    // TAB 1: MISSION REGISTRATION (pbtmission)
    // =========================================================================
    private JPanel createMissionPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{
                "MID", "Mission Name", "Official ID", "Launch Date/Time", "Destination Date/Time",
                "Agency", "Life (Yrs)", "Module Security Config", "Module ID", "Members",
                "Alert Count", "Status", "Comment / Note"
        }, 0);

        JTable table = createStyledTable(model);
        refreshMissionTable(model);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(ModernTheme.PANEL_BG);
        formPanel.setBorder(BorderFactory.createTitledBorder(
                ModernTheme.createSharpBorder(ModernTheme.VIVID_CYAN),
                " 📝 REGISTER MISSION & SHIVODAYA SECURITY MODULE SWITCH ",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBTITLE, ModernTheme.VIVID_CYAN
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField tfName = new JTextField(14);
        JTextField tfOfficialId = new JTextField(12);
        JTextField tfLaunchDate = new JTextField("2026-10-01", 10);
        JTextField tfLaunchTime = new JTextField("09:00:00", 8);
        JTextField tfDestDate = new JTextField("2026-10-02", 10);
        JTextField tfDestTime = new JTextField("14:00:00", 8);
        JComboBox<String> cbAgency = new JComboBox<>(new String[]{"ISRO , INDIA", "NASA , USA", "ESA , EUROPE", "SPACEX , USA", "ROSCOSMOS , RUSSIA", "JAXA , JAPAN"});
        JTextField tfLife = new JTextField("5.0", 5);

        JComboBox<String> cbModuleType = new JComboBox<>(new String[]{
                "Shivodaya Transceiver v2 (Full Transmit & Receive Mesh Node)",
                "Receiver-Only Mode (Security Switch ACTIVE - No Transmission)",
                "Emergency Off (Module Deactivated for National Security)"
        });
        JTextField tfModuleId = new JTextField("SHIV-301", 8);
        JTextField tfMembers = new JTextField("4", 5);

        JTextField tfPurpose1 = new JTextField("Space Weather Detection", 14);
        JTextField tfPurpose2 = new JTextField("Deep Space Routing", 14);
        JTextField tfComment = new JTextField("Primary Mission Profile", 16);
        JTextField tfNote = new JTextField("Shivodaya Network Integrated", 16);

        addFormField(formPanel, gbc, 0, 0, "Mission Name:", tfName);
        addFormField(formPanel, gbc, 0, 2, "Official Mission ID:", tfOfficialId);
        addFormField(formPanel, gbc, 1, 0, "Launch Date:", tfLaunchDate);
        addFormField(formPanel, gbc, 1, 2, "Launch Time:", tfLaunchTime);
        addFormField(formPanel, gbc, 2, 0, "Destination Date:", tfDestDate);
        addFormField(formPanel, gbc, 2, 2, "Destination Time:", tfDestTime);
        addFormField(formPanel, gbc, 3, 0, "Space Agency:", cbAgency);
        addFormField(formPanel, gbc, 3, 2, "Expected Life (Yrs):", tfLife);

        addFormField(formPanel, gbc, 4, 0, "Shivodaya Security Module Config:", cbModuleType, 3);
        addFormField(formPanel, gbc, 5, 0, "Module Hardware ID:", tfModuleId);
        addFormField(formPanel, gbc, 5, 2, "Crew Members Count:", tfMembers);
        addFormField(formPanel, gbc, 6, 0, "Primary Purpose:", tfPurpose1);
        addFormField(formPanel, gbc, 6, 2, "Secondary Purpose:", tfPurpose2);
        addFormField(formPanel, gbc, 7, 0, "Comment:", tfComment);
        addFormField(formPanel, gbc, 7, 2, "Security Note:", tfNote);

        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 5));
        btnPanel.setOpaque(false);

        JButton btnKillSwitch = ModernTheme.createTacticalButton("🛑 EMERGENCY SECURITY KILL SWITCH (RECEIVE-ONLY)", ModernTheme.VIVID_RED, Color.WHITE);
        JButton btnSave = ModernTheme.createTacticalButton("💾 SAVE MISSION REGISTRATION", ModernTheme.VIVID_CYAN, Color.BLACK);

        btnSave.addActionListener(e -> {
            try (Connection conn = dbManager.getConnection()) {
                String sql = "INSERT INTO pbtmission (mname, officialmid, mlaunchdate, mlaunchtime, mdestinationdate, mdestinationtime, " +
                        "magency, mlife, mmodule, mmoduleid, mmembers, mpurpose1, mpurpose2, mpurpose3, mpurpose4, malertcount, malertid, mstatus, mcomment, mnote) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DTN Mesh', 'Security Verified', 0, 'NONE', 'Active', ?, ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tfName.getText());
                pstmt.setString(2, tfOfficialId.getText().isEmpty() ? "MID-" + System.currentTimeMillis() % 1000 : tfOfficialId.getText());
                pstmt.setString(3, tfLaunchDate.getText());
                pstmt.setString(4, tfLaunchTime.getText());
                pstmt.setString(5, tfDestDate.getText());
                pstmt.setString(6, tfDestTime.getText());
                pstmt.setString(7, (String) cbAgency.getSelectedItem());
                pstmt.setString(8, tfLife.getText());
                pstmt.setString(9, (String) cbModuleType.getSelectedItem());
                pstmt.setString(10, tfModuleId.getText());
                pstmt.setInt(11, Integer.parseInt(tfMembers.getText().trim()));
                pstmt.setString(12, tfPurpose1.getText());
                pstmt.setString(13, tfPurpose2.getText());
                pstmt.setString(14, tfComment.getText());
                pstmt.setString(15, tfNote.getText());
                pstmt.executeUpdate();

                JOptionPane.showMessageDialog(this, "Mission Registered Successfully into Database!", "Registration Complete", JOptionPane.INFORMATION_MESSAGE);
                refreshMissionTable(model);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error saving mission: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnKillSwitch.addActionListener(e -> {
            int selectedRow = table.getSelectedRow();
            if (selectedRow == -1) {
                JOptionPane.showMessageDialog(this, "Please select a mission row in the table first to toggle security kill switch.", "Select Mission", JOptionPane.WARNING_MESSAGE);
                return;
            }
            int mid = (Integer) model.getValueAt(selectedRow, 0);
            try (Connection conn = dbManager.getConnection()) {
                String sql = "UPDATE pbtmission SET mmodule = 'Receiver-Only Mode (Security Switch ACTIVE - No Transmission)', mnote = 'SHIVODAYA SECURITY KILL SWITCH ACTIVATED - TRANSMITTER SHUT DOWN' WHERE mid = ?";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setInt(1, mid);
                pstmt.executeUpdate();

                JOptionPane.showMessageDialog(this, "SECURITY DIRECTIVE EXECUTED:\nMission ID [" + mid + "] Shivodaya Transmitter Switch DEACTIVATED.\nModule set to RECEIVE-ONLY mode.", "Security Kill Switch Executed", JOptionPane.WARNING_MESSAGE);
                refreshMissionTable(model);
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        });

        btnPanel.add(btnKillSwitch);
        btnPanel.add(btnSave);

        gbc.gridx = 0;
        gbc.gridy = 8;
        gbc.gridwidth = 4;
        formPanel.add(btnPanel, gbc);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    private void refreshMissionTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT mid, mname, officialmid, mlaunchdate, mlaunchtime, mdestinationdate, mdestinationtime, magency, mlife, mmodule, mmoduleid, mmembers, malertcount, mstatus, mcomment, mnote FROM pbtmission")) {
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getInt("mid"),
                        rs.getString("mname"),
                        rs.getString("officialmid"),
                        rs.getString("mlaunchdate") + " " + rs.getString("mlaunchtime"),
                        rs.getString("mdestinationdate") + " " + rs.getString("mdestinationtime"),
                        rs.getString("magency"),
                        rs.getString("mlife"),
                        rs.getString("mmodule"),
                        rs.getString("mmoduleid"),
                        rs.getInt("mmembers"),
                        rs.getInt("malertcount"),
                        rs.getString("mstatus"),
                        rs.getString("mcomment") + " | " + rs.getString("mnote")
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // TAB 2: AGENCY REGISTRATION (pbtagencyregistration)
    // =========================================================================
    private JPanel createAgencyPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{"SNo", "Agency Name", "Abbreviation", "Country", "Status", "Comment", "Note"}, 0);
        JTable table = createStyledTable(model);
        refreshAgencyTable(model);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(ModernTheme.PANEL_BG);
        formPanel.setBorder(BorderFactory.createTitledBorder(
                ModernTheme.createSharpBorder(ModernTheme.VIVID_GREEN),
                " 🏛️ REGISTER DEEP SPACE AGENCY (pbtagencyregistration) ",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBTITLE, ModernTheme.VIVID_GREEN
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField tfSno = new JTextField(6);
        JTextField tfName = new JTextField(16);
        JTextField tfAbbr = new JTextField(8);
        JTextField tfCountry = new JTextField(10);
        JComboBox<String> cbStatus = new JComboBox<>(new String[]{"ACTIVE", "UNDER_REVIEW", "SUSPENDED"});
        JTextField tfComment = new JTextField(16);
        JTextField tfNote = new JTextField(16);

        addFormField(formPanel, gbc, 0, 0, "SNo / ID:", tfSno);
        addFormField(formPanel, gbc, 0, 2, "Agency Name:", tfName);
        addFormField(formPanel, gbc, 1, 0, "Abbreviation:", tfAbbr);
        addFormField(formPanel, gbc, 1, 2, "Country:", tfCountry);
        addFormField(formPanel, gbc, 2, 0, "Status:", cbStatus);
        addFormField(formPanel, gbc, 2, 2, "Comment:", tfComment);
        addFormField(formPanel, gbc, 3, 0, "Note:", tfNote);

        JButton btnSave = ModernTheme.createTacticalButton("💾 REGISTER AGENCY", ModernTheme.VIVID_GREEN, Color.BLACK);
        btnSave.addActionListener(e -> {
            try (Connection conn = dbManager.getConnection()) {
                String sql = "INSERT INTO pbtagencyregistration (Sno, agencyname, agencyabbreviation, country, status, comment, note) VALUES (?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tfSno.getText().isEmpty() ? String.valueOf(System.currentTimeMillis() % 1000) : tfSno.getText());
                pstmt.setString(2, tfName.getText());
                pstmt.setString(3, tfAbbr.getText());
                pstmt.setString(4, tfCountry.getText());
                pstmt.setString(5, (String) cbStatus.getSelectedItem());
                pstmt.setString(6, tfComment.getText());
                pstmt.setString(7, tfNote.getText());
                pstmt.executeUpdate();

                JOptionPane.showMessageDialog(this, "Space Agency Registered Successfully!", "Agency Added", JOptionPane.INFORMATION_MESSAGE);
                refreshAgencyTable(model);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        gbc.gridx = 2;
        gbc.gridy = 3;
        gbc.gridwidth = 2;
        formPanel.add(btnSave, gbc);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    private void refreshAgencyTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT Sno, agencyname, agencyabbreviation, country, status, comment, note FROM pbtagencyregistration")) {
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("Sno"), rs.getString("agencyname"), rs.getString("agencyabbreviation"),
                        rs.getString("country"), rs.getString("status"), rs.getString("comment"), rs.getString("note")
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // TAB 3: RADIATION ALERTS LOG (pbtalert)
    // =========================================================================
    private JPanel createAlertPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{
                "Alert ID", "Rec Date/Time", "Source Probe", "Type ID", "Detect Date/Time",
                "Created Date/Time", "Predicted Arrival", "Risk Level", "Operator Login",
                "Harmful Status", "Comment / Details", "Visibility Scope"
        }, 0);

        JTable table = createStyledTable(model);
        refreshAlertTable(model);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(ModernTheme.PANEL_BG);
        formPanel.setBorder(BorderFactory.createTitledBorder(
                ModernTheme.createSharpBorder(ModernTheme.VIVID_RED),
                " ⚠️ BROADCAST & LOG RADIATION ALERT DISPATCH (pbtalert) ",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBTITLE, ModernTheme.VIVID_RED
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField tfAlertId = new JTextField("ALT-2026-006", 10);
        JTextField tfSource = new JTextField("Aditya-L1 Probe", 14);
        JComboBox<String> cbType = new JComboBox<>(new String[]{"CME_SEVERE", "SEP_SURGE", "SOLAR_WIND_SURGE", "PROTON_FLUX_SURGE", "XRAY_FLARE_X15"});
        JTextField tfPredDate = new JTextField("2026-08-28", 10);
        JTextField tfPredTime = new JTextField("05:00:00", 8);
        JComboBox<String> cbRisk = new JComboBox<>(new String[]{"HIGH_CRITICAL", "MEDIUM_HIGH", "LOW_NOMINAL"});
        JComboBox<String> cbStatus = new JComboBox<>(new String[]{"HARMFUL", "MONITORING", "RESOLVED", "SAFE"});
        JComboBox<String> cbVis = new JComboBox<>(new String[]{"PUBLIC_AGENCY", "RESTRICTED_SHIVODAYA", "ISRO_INTERNAL"});
        JTextField tfComment = new JTextField("Halo Coronal Mass Ejection trajectory direct vector to Mars Base ipn:3.1", 22);

        addFormField(formPanel, gbc, 0, 0, "Alert ID:", tfAlertId);
        addFormField(formPanel, gbc, 0, 2, "Alert Source Probe:", tfSource);
        addFormField(formPanel, gbc, 1, 0, "Alert Type ID:", cbType);
        addFormField(formPanel, gbc, 1, 2, "Predicted Arrival Date:", tfPredDate);
        addFormField(formPanel, gbc, 2, 0, "Predicted Arrival Time:", tfPredTime);
        addFormField(formPanel, gbc, 2, 2, "Risk Level:", cbRisk);
        addFormField(formPanel, gbc, 3, 0, "Harmful Status:", cbStatus);
        addFormField(formPanel, gbc, 3, 2, "Visibility Scope:", cbVis);
        addFormField(formPanel, gbc, 4, 0, "Alert Description / Comment:", tfComment, 3);

        JButton btnSave = ModernTheme.createTacticalButton("🚨 BROADCAST ALERT TO GROUND & MESH MODULES", ModernTheme.VIVID_RED, Color.WHITE);
        btnSave.addActionListener(e -> {
            try (Connection conn = dbManager.getConnection()) {
                String sql = "INSERT INTO pbtalert (alertid, frecdate, frectime, alertsource, alerttypeid, alertdetectdate, alertdetecttime, " +
                        "fcreateddate, fcreatedtime, predictedalertdate, predictedalerttime, predictalertrisk, aloginid, status, comment, note, visibility) " +
                        "VALUES (?, '2026-08-28', '00:25:00', ?, ?, '2026-08-28', '00:23:00', '2026-08-28', '00:25:05', ?, ?, ?, 'OPERATOR_SHIVODAYA', ?, ?, 'Logged by Shivodaya Module', ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tfAlertId.getText());
                pstmt.setString(2, tfSource.getText());
                pstmt.setString(3, (String) cbType.getSelectedItem());
                pstmt.setString(4, tfPredDate.getText());
                pstmt.setString(5, tfPredTime.getText());
                pstmt.setString(6, (String) cbRisk.getSelectedItem());
                pstmt.setString(7, (String) cbStatus.getSelectedItem());
                pstmt.setString(8, tfComment.getText());
                pstmt.setString(9, (String) cbVis.getSelectedItem());
                pstmt.executeUpdate();

                JOptionPane.showMessageDialog(this, "Radiation Alert Broadcasted and Saved into Database!", "Alert Broadcasted", JOptionPane.WARNING_MESSAGE);
                refreshAlertTable(model);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        gbc.gridx = 0;
        gbc.gridy = 5;
        gbc.gridwidth = 4;
        formPanel.add(btnSave, gbc);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    private void refreshAlertTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT alertid, frecdate, frectime, alertsource, alerttypeid, alertdetectdate, alertdetecttime, fcreateddate, fcreatedtime, predictedalertdate, predictedalerttime, predictalertrisk, aloginid, status, comment, note, visibility FROM pbtalert")) {
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("alertid"),
                        rs.getString("frecdate") + " " + rs.getString("frectime"),
                        rs.getString("alertsource"),
                        rs.getString("alerttypeid"),
                        rs.getString("alertdetectdate") + " " + rs.getString("alertdetecttime"),
                        rs.getString("fcreateddate") + " " + rs.getString("fcreatedtime"),
                        rs.getString("predictedalertdate") + " " + rs.getString("predictedalerttime"),
                        rs.getString("predictalertrisk"),
                        rs.getString("aloginid"),
                        rs.getString("status"),
                        rs.getString("comment") + " " + rs.getString("note"),
                        rs.getString("visibility")
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // TAB 4: ASTRONAUT MANAGEMENT (pbtastronaut)
    // =========================================================================
    private JPanel createAstronautPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{
                "Astronaut ID", "Name", "DOB", "Gender", "Nationality", "Role 1", "Role 2",
                "Agency", "Work Exp (Hrs)", "Current Rad Level", "Status", "Assigned Mission MID"
        }, 0);

        JTable table = createStyledTable(model);
        refreshAstronautTable(model);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(ModernTheme.PANEL_BG);
        formPanel.setBorder(BorderFactory.createTitledBorder(
                ModernTheme.createSharpBorder(ModernTheme.VIVID_PURPLE),
                " 👨‍🚀 ASTRONAUT CREW REGISTRATION & DOSAGE MONITOR (pbtastronaut) ",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBTITLE, ModernTheme.VIVID_PURPLE
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField tfAid = new JTextField("AST-06", 8);
        JTextField tfName = new JTextField(16);
        JTextField tfDob = new JTextField("1988-03-24", 10);
        JComboBox<String> cbGender = new JComboBox<>(new String[]{"Male", "Female", "Other"});
        JTextField tfNation = new JTextField("Indian", 10);
        JTextField tfRole1 = new JTextField("Mission Specialist", 12);
        JTextField tfRole2 = new JTextField("Flight Engineer", 12);
        JTextField tfAgency = new JTextField("ISRO", 10);
        JTextField tfWorkHrs = new JTextField("1650", 6);
        JTextField tfRadLvl = new JTextField("0.11 mSv", 8);
        JTextField tfMid = new JTextField("2", 5);

        addFormField(formPanel, gbc, 0, 0, "Astronaut ID:", tfAid);
        addFormField(formPanel, gbc, 0, 2, "Full Name:", tfName);
        addFormField(formPanel, gbc, 1, 0, "Date of Birth:", tfDob);
        addFormField(formPanel, gbc, 1, 2, "Gender:", cbGender);
        addFormField(formPanel, gbc, 2, 0, "Nationality:", tfNation);
        addFormField(formPanel, gbc, 2, 2, "Primary Role:", tfRole1);
        addFormField(formPanel, gbc, 3, 0, "Secondary Role:", tfRole2);
        addFormField(formPanel, gbc, 3, 2, "Space Agency:", tfAgency);
        addFormField(formPanel, gbc, 4, 0, "Work Experience (Hrs):", tfWorkHrs);
        addFormField(formPanel, gbc, 4, 2, "Monitored Radiation Level:", tfRadLvl);
        addFormField(formPanel, gbc, 5, 0, "Assigned Mission MID:", tfMid);

        JButton btnSave = ModernTheme.createTacticalButton("💾 REGISTER ASTRONAUT", ModernTheme.VIVID_PURPLE, Color.BLACK);
        btnSave.addActionListener(e -> {
            try (Connection conn = dbManager.getConnection()) {
                String sql = "INSERT INTO pbtastronaut (aid, aname, adob, agender, anationality, arole1, arole2, aagencyname, aagencyid, " +
                        "aagencycountry, aaphone1, aaphone2, aloginid, aloginpass, aworkexphr, aradlvl, astatus, acomment, anote, mid) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, '101', 'INDIA', '+91-0000000000', '+91-0000000001', ?, 'pass123', ?, ?, 'Active', 'Gaganyaan Crew Member', 'Verified', ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tfAid.getText());
                pstmt.setString(2, tfName.getText());
                pstmt.setString(3, tfDob.getText());
                pstmt.setString(4, (String) cbGender.getSelectedItem());
                pstmt.setString(5, tfNation.getText());
                pstmt.setString(6, tfRole1.getText());
                pstmt.setString(7, tfRole2.getText());
                pstmt.setString(8, tfAgency.getText());
                pstmt.setString(9, tfName.getText().toLowerCase().replaceAll(" ", "") + "_user");
                pstmt.setString(10, tfWorkHrs.getText());
                pstmt.setString(11, tfRadLvl.getText());
                pstmt.setInt(12, Integer.parseInt(tfMid.getText().trim()));
                pstmt.executeUpdate();

                JOptionPane.showMessageDialog(this, "Astronaut Profile Registered Successfully!", "Astronaut Registered", JOptionPane.INFORMATION_MESSAGE);
                refreshAstronautTable(model);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        gbc.gridx = 2;
        gbc.gridy = 5;
        gbc.gridwidth = 2;
        formPanel.add(btnSave, gbc);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    private void refreshAstronautTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT aid, aname, adob, agender, anationality, arole1, arole2, aagencyname, aworkexphr, aradlvl, astatus, mid FROM pbtastronaut")) {
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("aid"), rs.getString("aname"), rs.getString("adob"), rs.getString("agender"),
                        rs.getString("anationality"), rs.getString("arole1"), rs.getString("arole2"), rs.getString("aagencyname"),
                        rs.getString("aworkexphr"), rs.getString("aradlvl"), rs.getString("astatus"), rs.getInt("mid")
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // TAB 5: TRAJECTORY COMPARISON (pbttrajectory)
    // =========================================================================
    private JPanel createTrajectoryPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{
                "Path ID", "Dynamic Target ID", "Fixed Target ID", "Mission MID", "Date", "Time",
                "Right Ascension", "Declination", "Delta Distance (AU)", "Delta Sun (AU)", "Delta Mission (AU)", "Linked Alert ID", "Collision Risk Evaluation"
        }, 0);

        JTable table = createStyledTable(model);
        refreshTrajectoryTable(model);

        JPanel formPanel = new JPanel(new GridBagLayout());
        formPanel.setBackground(ModernTheme.PANEL_BG);
        formPanel.setBorder(BorderFactory.createTitledBorder(
                ModernTheme.createSharpBorder(ModernTheme.VIVID_AMBER),
                " 🛰️ TRAJECTORY COMPARISON ENGINE (Mission Path vs Radiation Front) ",
                TitledBorder.LEFT, TitledBorder.TOP, ModernTheme.FONT_SUBTITLE, ModernTheme.VIVID_AMBER
        ));

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 6, 4, 6);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        JTextField tfPathId = new JTextField("TRAJ-106", 8);
        JTextField tfDynTid = new JTextField("DYN-MARS-05", 10);
        JTextField tfFixTid = new JTextField("FIX-L1-01", 10);
        JTextField tfMid = new JTextField("2", 4);
        JTextField tfDate = new JTextField("2026-08-28", 8);
        JTextField tfTime = new JTextField("00:40:00", 8);
        JTextField tfRA = new JTextField("RA: 15h30m", 10);
        JTextField tfDEC = new JTextField("DEC: -10.2 deg", 10);
        JTextField tfDeltaDis = new JTextField("0.018 AU", 8);
        JTextField tfDeltaSun = new JTextField("1.02 AU", 8);
        JTextField tfDeltaMiss = new JTextField("0.0015 AU", 8);
        JTextField tfAlertId = new JTextField("ALT-2026-001", 10);

        addFormField(formPanel, gbc, 0, 0, "Trajectory Path ID:", tfPathId);
        addFormField(formPanel, gbc, 0, 2, "Dynamic Target ID:", tfDynTid);
        addFormField(formPanel, gbc, 1, 0, "Fixed Target ID:", tfFixTid);
        addFormField(formPanel, gbc, 1, 2, "Target Mission MID:", tfMid);
        addFormField(formPanel, gbc, 2, 0, "Observation Date:", tfDate);
        addFormField(formPanel, gbc, 2, 2, "Observation Time:", tfTime);
        addFormField(formPanel, gbc, 3, 0, "Right Ascension (RA):", tfRA);
        addFormField(formPanel, gbc, 3, 2, "Declination (DEC):", tfDEC);
        addFormField(formPanel, gbc, 4, 0, "Delta Distance (AU):", tfDeltaDis);
        addFormField(formPanel, gbc, 4, 2, "Delta Distance Sun:", tfDeltaSun);
        addFormField(formPanel, gbc, 5, 0, "Delta Distance Mission:", tfDeltaMiss);
        addFormField(formPanel, gbc, 5, 2, "Linked Radiation Alert ID:", tfAlertId);

        JPanel btnBox = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 5));
        btnBox.setOpaque(false);

        JButton btnEvaluate = ModernTheme.createTacticalButton("⚡ RUN TRAJECTORY INTERSECTION & RADIATION COLLISION ANALYSIS", ModernTheme.VIVID_AMBER, Color.BLACK);

        btnEvaluate.addActionListener(e -> {
            try (Connection conn = dbManager.getConnection()) {
                String sql = "INSERT INTO pbttrajectory (pathid, dynamictid, fixedtid, mid, date, time, rateles, decteles, deltadis, deldotsun, deldotmission, alertid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement pstmt = conn.prepareStatement(sql);
                pstmt.setString(1, tfPathId.getText());
                pstmt.setString(2, tfDynTid.getText());
                pstmt.setString(3, tfFixTid.getText());
                pstmt.setInt(4, Integer.parseInt(tfMid.getText().trim()));
                pstmt.setString(5, tfDate.getText());
                pstmt.setString(6, tfTime.getText());
                pstmt.setString(7, tfRA.getText());
                pstmt.setString(8, tfDEC.getText());
                pstmt.setString(9, tfDeltaDis.getText());
                pstmt.setString(10, tfDeltaSun.getText());
                pstmt.setString(11, tfDeltaMiss.getText());
                pstmt.setString(12, tfAlertId.getText());
                pstmt.executeUpdate();

                double dMiss = Double.parseDouble(tfDeltaMiss.getText().replaceAll("[^0-9.]", ""));
                String alertResult;
                if (dMiss < 0.005) {
                    alertResult = "CRITICAL WARNING: Mission flight path INTERSECTS severe solar radiation flare trajectory!\nImmediate safe-zone protocol execution & shield alignment required.";
                } else {
                    alertResult = "NOMINAL: Radiation front clearance distance safe (" + dMiss + " AU). No trajectory collision detected.";
                }

                JOptionPane.showMessageDialog(this, "TRAJECTORY COLLISION ANALYSIS RESULT:\n\n" + alertResult, "Trajectory Analysis Complete", JOptionPane.WARNING_MESSAGE);
                refreshTrajectoryTable(model);
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Error: " + ex.getMessage(), "Database Error", JOptionPane.ERROR_MESSAGE);
            }
        });

        btnBox.add(btnEvaluate);
        gbc.gridx = 0;
        gbc.gridy = 6;
        gbc.gridwidth = 4;
        formPanel.add(btnBox, gbc);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        panel.add(formPanel, BorderLayout.SOUTH);
        return panel;
    }

    private void refreshTrajectoryTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT pathid, dynamictid, fixedtid, mid, date, time, rateles, decteles, deltadis, deldotsun, deldotmission, alertid FROM pbttrajectory")) {
            while (rs.next()) {
                String dMissStr = rs.getString("deldotmission");
                String eval = "SAFE CLEARANCE";
                try {
                    double val = Double.parseDouble(dMissStr.replaceAll("[^0-9.]", ""));
                    if (val < 0.005) eval = "⚠️ COLLISION RISK";
                } catch (Exception ignored) {}

                model.addRow(new Object[]{
                        rs.getString("pathid"), rs.getString("dynamictid"), rs.getString("fixedtid"),
                        rs.getInt("mid"), rs.getString("date"), rs.getString("time"),
                        rs.getString("rateles"), rs.getString("decteles"), rs.getString("deltadis"),
                        rs.getString("deldotsun"), rs.getString("deldotmission"), rs.getString("alertid"), eval
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // TAB 6: AUDIT & SYSTEM LOGS (pbtlogtable)
    // =========================================================================
    private JPanel createAuditLogPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBackground(ModernTheme.PANEL_BG);
        panel.setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        DefaultTableModel model = new DefaultTableModel(new String[]{
                "Operator Login ID", "Login Date/Time", "Switch Date/Time", "Switch Login ID",
                "Comment", "System Note", "Working Hours", "Warning Status", "Execution Time"
        }, 0);

        JTable table = createStyledTable(model);
        refreshAuditLogTable(model);

        panel.add(new JScrollPane(table), BorderLayout.CENTER);
        return panel;
    }

    private void refreshAuditLogTable(DefaultTableModel model) {
        model.setRowCount(0);
        try (Connection conn = dbManager.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery("SELECT loginid, logintimeanddate, userswitchtimeanddate, switchloginid, comment, note, workinghrs, ewarning, etime FROM pbtlogtable")) {
            while (rs.next()) {
                model.addRow(new Object[]{
                        rs.getString("loginid"),
                        rs.getString("logintimeanddate"),
                        rs.getString("userswitchtimeanddate"),
                        rs.getString("switchloginid"),
                        rs.getString("comment"),
                        rs.getString("note"),
                        rs.getString("workinghrs"),
                        rs.getString("ewarning"),
                        rs.getString("etime")
                });
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    // =========================================================================
    // HELPER STYLING METHODS
    // =========================================================================
    private JTable createStyledTable(DefaultTableModel model) {
        JTable table = new JTable(model);
        table.setBackground(ModernTheme.PANEL_BG);
        table.setForeground(ModernTheme.TEXT_PRIMARY);
        table.setGridColor(ModernTheme.GRID_COLOR);
        table.setRowHeight(28);
        table.setSelectionBackground(new Color(0, 110, 190));
        table.setSelectionForeground(Color.WHITE);

        table.setDefaultRenderer(Object.class, ModernTheme.createDynamicTableRenderer());
        return table;
    }

    private void addFormField(JPanel panel, GridBagConstraints gbc, int row, int col, String labelText, JComponent field) {
        addFormField(panel, gbc, row, col, labelText, field, 1);
    }

    private void addFormField(JPanel panel, GridBagConstraints gbc, int row, int col, String labelText, JComponent field, int colSpan) {
        gbc.gridx = col;
        gbc.gridy = row;
        gbc.gridwidth = 1;
        JLabel lbl = new JLabel(labelText);
        lbl.setForeground(ModernTheme.TEXT_PRIMARY);
        lbl.setFont(ModernTheme.FONT_MONO_BOLD);
        panel.add(lbl, gbc);

        gbc.gridx = col + 1;
        gbc.gridwidth = colSpan;
        field.setFont(ModernTheme.FONT_MONO);
        if (field instanceof JTextField) {
            field.setBackground(ModernTheme.INPUT_BG);
            field.setForeground(Color.WHITE);
            ((JTextField) field).setCaretColor(ModernTheme.VIVID_CYAN);
            field.setBorder(BorderFactory.createCompoundBorder(
                    BorderFactory.createLineBorder(ModernTheme.BORDER_COLOR, 1),
                    BorderFactory.createEmptyBorder(5, 8, 5, 8)
            ));
        } else if (field instanceof JComboBox) {
            field.setBackground(ModernTheme.INPUT_BG);
            field.setForeground(Color.WHITE);
        }
        panel.add(field, gbc);
    }

    private JPanel createFooterPanel() {
        JPanel footer = new JPanel(new BorderLayout());
        footer.setBackground(ModernTheme.PANEL_BG);
        footer.setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));

        JLabel copyLabel = new JLabel("PROJECT SHIVODAYA © 2026 | ISRO Ground Monitoring & DSN Telemetry Integration");
        copyLabel.setFont(ModernTheme.FONT_MONO);
        copyLabel.setForeground(ModernTheme.TEXT_MUTED);

        JLabel statusLabel = new JLabel("● SYSTEM STATUS: ONLINE (HUD Monospaced Telemetry Enabled)");
        statusLabel.setFont(ModernTheme.FONT_MONO_BOLD);
        statusLabel.setForeground(ModernTheme.VIVID_GREEN);

        footer.add(copyLabel, BorderLayout.WEST);
        footer.add(statusLabel, BorderLayout.EAST);
        return footer;
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            EarthControlCenterUI ui = new EarthControlCenterUI();
            ui.setVisible(true);
        });
    }
}
