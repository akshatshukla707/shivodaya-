import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableCellRenderer;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.sql.*;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class CME_Dashboard extends JFrame {

    static final Color BG_COLOR = new Color(0x12, 0x14, 0x20);
    static final Color PANEL_BG_COLOR = new Color(0x1c, 0x20, 0x35);
    static final Color BORDER_COLOR = new Color(0x2d, 0x36, 0x55);
    static final Color TEXT_COLOR = new Color(0xe2, 0xe8, 0xf0);
    static final Color CRITICAL_COLOR = new Color(0xff, 0x33, 0x66);
    static final Color WARNING_COLOR = new Color(0xff, 0xb7, 0x4d);
    static final Color INFO_COLOR = new Color(0x00, 0xe5, 0xff);
    static final Font MAIN_FONT = new Font("SansSerif", Font.PLAIN, 13);
    static final Font BOLD_FONT = new Font("SansSerif", Font.BOLD, 15);
    static final Font TITLE_FONT = new Font("SansSerif", Font.BOLD, 20);
    static final Font HEADER_FONT = new Font("SansSerif", Font.BOLD, 12);

    private JLabel activeAlertsCountLabel;
    private DefaultTableModel historicalAlertsModel;
    private JPanel alertSummaryInnerPanel;
    private CMEAlertTrendChart trendChart;
    private JButton startAnalysisButton;
    private DigitalClockPanel earthClock;
    private DigitalClockPanel marsClock;

    private int lastProcessedId = 0;
    private final List<CMEAlert> liveAlertsList = new ArrayList<>();
    private final List<Object[]> datasetQueue = new ArrayList<>();
    private String streamFilter = "ALL";

    enum Severity { CRITICAL, WARNING, HIGH_RISK }

    static class CMEAlert {
        final ZonedDateTime eventTime;
        final int speed;
        final double kineticEnergy;
        final String notes;
        final Severity severity;
        final String marker;
        final String streamName;

        CMEAlert(ZonedDateTime eventTime, int speed, double kineticEnergy, String notes, String marker) {
            this(eventTime, speed, kineticEnergy, notes, marker, "CME");
        }

        CMEAlert(ZonedDateTime eventTime, int speed, double kineticEnergy, String notes, String marker, String streamName) {
            this.eventTime = eventTime;
            this.speed = speed;
            this.kineticEnergy = kineticEnergy;
            this.notes = notes;
            this.marker = marker;
            this.streamName = streamName;
            if (speed > 2200) this.severity = Severity.CRITICAL;
            else if (speed > 1600) this.severity = Severity.WARNING;
            else this.severity = Severity.HIGH_RISK;
        }
    }

    public CME_Dashboard() {
        this("ALL");
    }

    public CME_Dashboard(String streamFilter) {
        super("Akashdeep Detailed Monitor - " + streamFilter + " Stream");
        this.streamFilter = streamFilter != null ? streamFilter : "ALL";

        setDefaultCloseOperation(JFrame.DISPOSE_ON_CLOSE);
        setSize(1600, 900);
        setLocationRelativeTo(null);
        getContentPane().setBackground(BG_COLOR);
        setLayout(new BorderLayout(10, 10));

        add(createHeaderPanel(), BorderLayout.NORTH);
        add(createMainDashboardPanel(), BorderLayout.CENTER);
        add(createAlertSummaryPanel(), BorderLayout.EAST);
        add(createSidePanel(), BorderLayout.WEST);

        initClocks();
        loadDatasetQueue();
        startGradualDatasetBuilder();
        startDatabasePollingWorker();
    }

    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout());
        headerPanel.setBackground(PANEL_BG_COLOR);
        headerPanel.setBorder(BorderFactory.createMatteBorder(0, 0, 1, 0, BORDER_COLOR));

        JPanel leftPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 10, 5));
        leftPanel.setOpaque(false);

        JButton backButton = new JButton("◀ GO BACK TO MAIN CONTROL CENTER");
        backButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        backButton.setBackground(new Color(0xef, 0x44, 0x44));
        backButton.setForeground(Color.WHITE);
        backButton.setFocusPainted(false);
        backButton.setBorder(BorderFactory.createEmptyBorder(6, 12, 6, 12));
        backButton.addActionListener(e -> dispose());

        JLabel titleLabel = new JLabel("  AKASHDEEP DETAILED MONITOR :: " + streamFilter.toUpperCase() + " TELEMETRY");
        titleLabel.setFont(TITLE_FONT);
        titleLabel.setForeground(INFO_COLOR);

        leftPanel.add(backButton);
        leftPanel.add(titleLabel);

        JPanel navPanel = new JPanel(new FlowLayout(FlowLayout.CENTER, 20, 0));
        navPanel.setOpaque(false);
        navPanel.add(createNavLink("Stream: " + streamFilter));
        navPanel.add(createNavLink("Marker: 'Bhaarat'"));
        navPanel.add(createNavLink("DTN Mode: Active"));

        headerPanel.add(leftPanel, BorderLayout.WEST);
        headerPanel.add(navPanel, BorderLayout.CENTER);
        headerPanel.add(createClockPanel(), BorderLayout.EAST);

        return headerPanel;
    }

    private JPanel createClockPanel() {
        JPanel clockContainer = new JPanel(new FlowLayout(FlowLayout.RIGHT, 15, 5));
        clockContainer.setOpaque(false);
        clockContainer.setBorder(new EmptyBorder(0, 10, 0, 10));

        earthClock = new DigitalClockPanel("EARTH (IST)");
        marsClock = new DigitalClockPanel("MARS (MTC)");

        clockContainer.add(earthClock);
        clockContainer.add(marsClock);

        return clockContainer;
    }

    private void initClocks() {
        Timer timer = new Timer(1000, e -> updateClocks());
        timer.start();
        updateClocks();
    }

    private void updateClocks() {
        ZonedDateTime earthTime = ZonedDateTime.now(ZoneId.of("Asia/Kolkata"));
        earthClock.setTime(earthTime.format(DateTimeFormatter.ofPattern("HH:mm:ss")));

        double terrestrialTime = System.currentTimeMillis() / 1000.0;
        double julianDateUTC = (terrestrialTime / 86400.0) + 2440587.5;
        double julianDateTT = julianDateUTC + (37 + 32.184) / 86400.0;
        double marsSolDate = ((julianDateTT - 2451549.5) / 1.02749125) + 44796.0 - 0.00096;
        double mtc = (marsSolDate % 1) * 24;

        int hours = (int) mtc;
        int minutes = (int) ((mtc * 60) % 60);
        int seconds = (int) ((mtc * 3600) % 60);

        marsClock.setTime(String.format("%02d:%02d:%02d", hours, minutes, seconds));
    }

    private JLabel createNavLink(String text) {
        JLabel navLink = new JLabel(text);
        navLink.setFont(BOLD_FONT);
        navLink.setForeground(TEXT_COLOR);
        return navLink;
    }

    private JPanel createMainDashboardPanel() {
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setOpaque(false);
        mainPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        JPanel topPanel = new JPanel(new BorderLayout(10,10));
        topPanel.setOpaque(false);
        topPanel.add(createActiveAlertsPanel(), BorderLayout.WEST);
        topPanel.add(createVisualizationPanel(), BorderLayout.CENTER);

        mainPanel.add(topPanel, BorderLayout.NORTH);
        mainPanel.add(createHistoricalAlertsPanel(), BorderLayout.CENTER);

        return mainPanel;
    }

    private JPanel createSidePanel() {
        JPanel sidePanel = new JPanel();
        sidePanel.setLayout(new BoxLayout(sidePanel, BoxLayout.Y_AXIS));
        sidePanel.setOpaque(false);
        sidePanel.setBorder(new EmptyBorder(10, 10, 10, 0));
        sidePanel.setPreferredSize(new Dimension(320, 0));

        sidePanel.add(createAnalysisControlPanel());
        sidePanel.add(Box.createRigidArea(new Dimension(0, 10)));
        sidePanel.add(createConfigurationPanel());
        sidePanel.add(Box.createVerticalGlue());

        return sidePanel;
    }

    private JPanel createAnalysisControlPanel() {
        JPanel panel = createStyledPanel("STREAM ANALYSIS STATUS");
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));

        startAnalysisButton = new JButton("BUILDING LIVE WAVEFORM...");
        startAnalysisButton.setFont(BOLD_FONT);
        startAnalysisButton.setBackground(new Color(0x00, 0xb0, 0xff));
        startAnalysisButton.setForeground(Color.WHITE);
        startAnalysisButton.setFocusPainted(false);
        startAnalysisButton.setAlignmentX(Component.CENTER_ALIGNMENT);
        startAnalysisButton.setMaximumSize(new Dimension(280, 45));

        panel.add(Box.createRigidArea(new Dimension(0, 10)));
        panel.add(startAnalysisButton);
        panel.add(Box.createRigidArea(new Dimension(0, 10)));

        return panel;
    }

    private JPanel createConfigurationPanel() {
        JPanel panel = createStyledPanel("STREAM THRESHOLDS");
        panel.setLayout(new GridLayout(4, 2, 5, 5));

        panel.add(createLabel("Critical Limit:"));
        panel.add(createValueLabel("> 2200 km/s"));

        panel.add(createLabel("Warning Limit:"));
        panel.add(createValueLabel("> 1600 km/s"));

        panel.add(createLabel("Active Stream:"));
        panel.add(createValueLabel(streamFilter));

        panel.add(createLabel("Build Speed:"));
        panel.add(createValueLabel("400 ms/row"));

        return panel;
    }

    private JPanel createActiveAlertsPanel() {
        JPanel panel = createStyledPanel("CRITICAL ALERT COUNT");
        panel.setLayout(new BorderLayout());
        panel.setPreferredSize(new Dimension(280, 220));

        activeAlertsCountLabel = new JLabel("0", SwingConstants.CENTER);
        activeAlertsCountLabel.setFont(new Font("SansSerif", Font.BOLD, 72));
        activeAlertsCountLabel.setForeground(CRITICAL_COLOR);

        JLabel subText = new JLabel("Active Radiation Warnings", SwingConstants.CENTER);
        subText.setFont(MAIN_FONT);
        subText.setForeground(TEXT_COLOR);

        panel.add(activeAlertsCountLabel, BorderLayout.CENTER);
        panel.add(subText, BorderLayout.SOUTH);
        return panel;
    }

    private JPanel createVisualizationPanel() {
        JPanel panel = createStyledPanel("LIVE GRAPH BUILDING IN PROGRESS (" + streamFilter + ")");
        panel.setLayout(new BorderLayout());
        panel.setPreferredSize(new Dimension(0, 220));

        trendChart = new CMEAlertTrendChart();
        panel.add(trendChart, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createHistoricalAlertsPanel() {
        JPanel panel = createStyledPanel("LIVE TELEMETRY RECONSTRUCTION LOG (akashdeep_telemetry.db)");
        panel.setLayout(new BorderLayout());

        String[] columnNames = {"ID", "Timestamp", "Stream Name", "Velocity (km/s)", "Density", "X-Ray Flux", "Marker", "Severity"};
        historicalAlertsModel = new DefaultTableModel(columnNames, 0) {
            @Override
            public boolean isCellEditable(int row, int column) { return false; }
        };

        JTable table = new JTable(historicalAlertsModel);
        table.setBackground(PANEL_BG_COLOR);
        table.setForeground(TEXT_COLOR);
        table.setFont(MAIN_FONT);
        table.setRowHeight(26);
        table.setShowGrid(true);
        table.setGridColor(BORDER_COLOR);

        JTableHeader header = table.getTableHeader();
        header.setBackground(BG_COLOR);
        header.setForeground(INFO_COLOR);
        header.setFont(HEADER_FONT);

        JScrollPane scrollPane = new JScrollPane(table);
        scrollPane.getViewport().setBackground(PANEL_BG_COLOR);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        panel.add(scrollPane, BorderLayout.CENTER);
        return panel;
    }

    private JPanel createAlertSummaryPanel() {
        JPanel panel = createStyledPanel("LIVE ALERT DISPATCH");
        panel.setLayout(new BorderLayout());
        panel.setPreferredSize(new Dimension(380, 0));

        alertSummaryInnerPanel = new JPanel();
        alertSummaryInnerPanel.setLayout(new BoxLayout(alertSummaryInnerPanel, BoxLayout.Y_AXIS));
        alertSummaryInnerPanel.setOpaque(false);

        JScrollPane scrollPane = new JScrollPane(alertSummaryInnerPanel);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());

        panel.add(scrollPane, BorderLayout.CENTER);
        return panel;
    }

    private JPanel createStyledPanel(String title) {
        JPanel panel = new JPanel();
        panel.setBackground(PANEL_BG_COLOR);
        Border border = BorderFactory.createLineBorder(BORDER_COLOR, 1);
        TitledBorder titledBorder = BorderFactory.createTitledBorder(border, "  " + title + "  ");
        titledBorder.setTitleFont(HEADER_FONT);
        titledBorder.setTitleColor(TEXT_COLOR);
        panel.setBorder(BorderFactory.createCompoundBorder(titledBorder, new EmptyBorder(8, 8, 8, 8)));
        return panel;
    }

    private JLabel createLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(MAIN_FONT);
        label.setForeground(new Color(0x94, 0xa3, 0xb8));
        return label;
    }

    private JLabel createValueLabel(String text) {
        JLabel label = new JLabel(text);
        label.setFont(BOLD_FONT);
        label.setForeground(TEXT_COLOR);
        return label;
    }

    private void loadDatasetQueue() {
        File datasetFile = new File("CME_dataset_1000_harmful.txt");
        if (!datasetFile.exists()) return;

        try (BufferedReader br = new BufferedReader(new FileReader(datasetFile))) {
            String line;
            int count = 0;
            br.readLine(); // Skip header
            while ((line = br.readLine()) != null && count < 35) {
                String[] parts = line.split(",");
                if (parts.length >= 8) {
                    String date = parts[0].replace("\"", "");
                    String time = parts[1].replace("\"", "");
                    String speedStr = parts[4].replace("\"", "");
                    String notes = parts[7].replace("\"", "");
                    try {
                        int speed = Integer.parseInt(speedStr);
                        datasetQueue.add(new Object[]{count + 1, date + " " + time, speed, notes});
                        count++;
                    } catch (NumberFormatException ignored) {}
                }
            }
        } catch (Exception ignored) {}
    }

    // Gradually stream dataset rows into table and graph at a controlled pace (every 400ms)
    private void startGradualDatasetBuilder() {
        Timer timer = new Timer(400, new ActionListener() {
            private int index = 0;
            @Override
            public void actionPerformed(ActionEvent e) {
                if (index < datasetQueue.size()) {
                    Object[] item = datasetQueue.get(index++);
                    int id = (Integer) item[0];
                    String ts = (String) item[1];
                    int speed = (Integer) item[2];
                    String notes = (String) item[3];

                    ZonedDateTime zdt = ZonedDateTime.now();
                    CMEAlert alert = new CMEAlert(zdt, speed, speed * 1.5, notes, "Bhaarat", "CME");
                    liveAlertsList.add(alert);

                    // Add point to line chart to show graph building live
                    trendChart.addDataPoint(speed);

                    Object[] rowData = {
                        id, ts, "CME Telemetry", speed + " km/s",
                        String.format("%.1f", speed * 0.4), "1.25 W/m²", "Bhaarat", alert.severity.name()
                    };
                    historicalAlertsModel.insertRow(0, rowData);

                    if (alert.severity == Severity.CRITICAL || alert.severity == Severity.WARNING) {
                        AlertSummaryItemPanel itemPanel = new AlertSummaryItemPanel(alert);
                        alertSummaryInnerPanel.add(itemPanel, 0);
                        alertSummaryInnerPanel.revalidate();
                        alertSummaryInnerPanel.repaint();
                    }

                    long criticalCount = liveAlertsList.stream().filter(a -> a.severity == Severity.CRITICAL).count();
                    activeAlertsCountLabel.setText(String.valueOf(criticalCount));
                } else {
                    startAnalysisButton.setText("STREAM LIVE READY");
                    ((Timer) e.getSource()).stop();
                }
            }
        });
        timer.start();
    }

    private void startDatabasePollingWorker() {
        Timer timer = new Timer(400, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                new SwingWorker<List<CMEAlert>, Void>() {
                    @Override
                    protected List<CMEAlert> doInBackground() throws Exception {
                        List<CMEAlert> newAlerts = new ArrayList<>();
                        try (Connection conn = DriverManager.getConnection("jdbc:sqlite:akashdeep_telemetry.db");
                             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM telemetry_alerts WHERE id > ? ORDER BY id ASC")) {
                            stmt.setInt(1, lastProcessedId);
                            ResultSet rs = stmt.executeQuery();
                            while (rs.next()) {
                                lastProcessedId = rs.getInt("id");
                                String tsStr = rs.getString("timestamp");
                                String streamName = rs.getString("stream_name");
                                double vel = rs.getDouble("velocity");
                                double density = rs.getDouble("density");

                                if (!"ALL".equalsIgnoreCase(streamFilter) && streamName != null && !streamName.toUpperCase().contains(streamFilter.toUpperCase())) {
                                    continue;
                                }

                                ZonedDateTime zdt = ZonedDateTime.now();
                                CMEAlert alert = new CMEAlert(zdt, (int) vel, density, streamName + " Alert - " + tsStr, "Bhaarat", streamName);
                                newAlerts.add(alert);
                            }
                        } catch (Exception ex) {}
                        return newAlerts;
                    }

                    @Override
                    protected void done() {
                        try {
                            List<CMEAlert> alerts = get();
                            for (CMEAlert alert : alerts) {
                                liveAlertsList.add(alert);
                                trendChart.addDataPoint(alert.speed);

                                Object[] rowData = {
                                    lastProcessedId, alert.notes, alert.streamName, alert.speed + " km/s",
                                    String.format("%.1f", alert.kineticEnergy), "0.85 W/m²", alert.marker, alert.severity.name()
                                };
                                historicalAlertsModel.insertRow(0, rowData);

                                if (alert.severity == Severity.CRITICAL || alert.severity == Severity.WARNING) {
                                    AlertSummaryItemPanel itemPanel = new AlertSummaryItemPanel(alert);
                                    alertSummaryInnerPanel.add(itemPanel, 0);
                                    alertSummaryInnerPanel.revalidate();
                                    alertSummaryInnerPanel.repaint();
                                }
                            }
                            long criticalCount = liveAlertsList.stream().filter(a -> a.severity == Severity.CRITICAL).count();
                            activeAlertsCountLabel.setText(String.valueOf(criticalCount));
                        } catch (Exception ex) {}
                    }
                }.execute();
            }
        });
        timer.start();
    }
}

class DigitalClockPanel extends JPanel {
    private JLabel titleLabel;
    private JLabel timeLabel;

    public DigitalClockPanel(String title) {
        setLayout(new BorderLayout());
        setOpaque(false);
        setBorder(BorderFactory.createEmptyBorder(2, 8, 2, 8));

        titleLabel = new JLabel(title, SwingConstants.CENTER);
        titleLabel.setFont(CME_Dashboard.HEADER_FONT);
        titleLabel.setForeground(new Color(0x94, 0xa3, 0xb8));

        timeLabel = new JLabel("00:00:00", SwingConstants.CENTER);
        timeLabel.setFont(new Font("Monospaced", Font.BOLD, 20));
        timeLabel.setForeground(CME_Dashboard.INFO_COLOR);

        add(titleLabel, BorderLayout.NORTH);
        add(timeLabel, BorderLayout.CENTER);
    }

    public void setTime(String timeStr) {
        timeLabel.setText(timeStr);
    }
}

// Live Building Trend Chart
class CMEAlertTrendChart extends JPanel {
    private final List<Integer> dataPoints = new ArrayList<>();
    private static final int MAX_POINTS = 50;

    public CMEAlertTrendChart() {
        setOpaque(false);
    }

    public void addDataPoint(int val) {
        dataPoints.add(val);
        if (dataPoints.size() > MAX_POINTS) {
            dataPoints.remove(0);
        }
        repaint();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2d = (Graphics2D) g.create();
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int w = getWidth();
        int h = getHeight();
        int maxVal = 3000;

        // Background grid
        g2d.setColor(new Color(0x2d, 0x36, 0x55));
        g2d.drawLine(40, h - 30, w - 10, h - 30);
        g2d.drawLine(40, 10, 40, h - 30);

        for (int yVal = 500; yVal <= 2500; yVal += 500) {
            int yPos = (int) ((h - 30) - ((double) yVal / maxVal) * (h - 40));
            g2d.setColor(new Color(0x25, 0x2b, 0x42));
            g2d.drawLine(40, yPos, w - 10, yPos);
            g2d.setColor(new Color(0x64, 0x74, 0x8b));
            g2d.setFont(new Font("SansSerif", Font.PLAIN, 10));
            g2d.drawString(String.valueOf(yVal), 5, yPos + 4);
        }

        if (dataPoints.size() < 2) {
            g2d.setColor(CME_Dashboard.INFO_COLOR);
            g2d.drawString("BUILDING LIVE GRAPH WAVEFORM...", w / 2 - 100, h / 2);
            g2d.dispose();
            return;
        }

        g2d.setStroke(new BasicStroke(2.5f));
        double stepX = (double) (w - 50) / (MAX_POINTS - 1);

        for (int i = 0; i < dataPoints.size() - 1; i++) {
            int x1 = (int) (40 + i * stepX);
            int y1 = (int) ((h - 30) - ((double) dataPoints.get(i) / maxVal) * (h - 40));
            int x2 = (int) (40 + (i + 1) * stepX);
            int y2 = (int) ((h - 30) - ((double) dataPoints.get(i + 1) / maxVal) * (h - 40));

            int val = dataPoints.get(i + 1);
            if (val > 2200) g2d.setColor(CME_Dashboard.CRITICAL_COLOR);
            else if (val > 1600) g2d.setColor(CME_Dashboard.WARNING_COLOR);
            else g2d.setColor(CME_Dashboard.INFO_COLOR);

            g2d.drawLine(x1, y1, x2, y2);
        }
        g2d.dispose();
    }
}

class AlertSummaryItemPanel extends JPanel {
    public AlertSummaryItemPanel(CME_Dashboard.CMEAlert alert) {
        setLayout(new BorderLayout(5, 5));
        setBackground(CME_Dashboard.PANEL_BG_COLOR);
        setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(alert.severity == CME_Dashboard.Severity.CRITICAL ? CME_Dashboard.CRITICAL_COLOR : CME_Dashboard.WARNING_COLOR, 1),
                new EmptyBorder(8, 8, 8, 8)
        ));
        setMaximumSize(new Dimension(360, 70));

        JLabel titleLabel = new JLabel("ALERT :: " + alert.notes);
        titleLabel.setFont(CME_Dashboard.BOLD_FONT);
        titleLabel.setForeground(alert.severity == CME_Dashboard.Severity.CRITICAL ? CME_Dashboard.CRITICAL_COLOR : CME_Dashboard.WARNING_COLOR);

        JLabel subLabel = new JLabel("Stream: " + alert.streamName + " | Value: " + alert.speed + " | Marker: '" + alert.marker + "'");
        subLabel.setFont(CME_Dashboard.MAIN_FONT);
        subLabel.setForeground(CME_Dashboard.TEXT_COLOR);

        add(titleLabel, BorderLayout.NORTH);
        add(subLabel, BorderLayout.CENTER);
    }
}
