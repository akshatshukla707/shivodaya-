package earthcontrol;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.LinkedList;

public class TelemetryChartPanel extends JPanel {
    private LinkedList<Double> cmePoints = new LinkedList<>();
    private LinkedList<Double> sepPoints = new LinkedList<>();
    private LinkedList<Double> xrayPoints = new LinkedList<>();
    private int maxPoints = 50;

    public TelemetryChartPanel() {
        setBackground(ModernTheme.CARD_BG);
        setBorder(ModernTheme.createSharpBorder(ModernTheme.VIVID_CYAN));
        setPreferredSize(new Dimension(340, 180));

        for (int i = 0; i < maxPoints; i++) {
            cmePoints.add(1200.0 + Math.random() * 600.0);
            sepPoints.add(20.0 + Math.random() * 80.0);
            xrayPoints.add(0.1 + Math.random() * 1.5);
        }

        // Live Telemetry Waveform Timer (200ms refresh)
        Timer timer = new Timer(200, new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cmePoints.removeFirst();
                cmePoints.addLast(1200.0 + Math.random() * 600.0);

                sepPoints.removeFirst();
                sepPoints.addLast(20.0 + Math.random() * 80.0);

                xrayPoints.removeFirst();
                xrayPoints.addLast(0.1 + Math.random() * 1.5);

                repaint();
            }
        });
        timer.start();
    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int width = getWidth();
        int height = getHeight();

        // HUD Chart Grid Lines
        g2.setColor(ModernTheme.GRID_COLOR);
        for (int y = 20; y < height - 20; y += 25) {
            g2.drawLine(10, y, width - 10, y);
        }
        for (int x = 20; x < width - 10; x += 30) {
            g2.drawLine(x, 15, x, height - 15);
        }

        // Title Legend
        g2.setFont(ModernTheme.FONT_MONO_BOLD);
        g2.setColor(ModernTheme.VIVID_RED);
        g2.drawString("■ CME Speed (km/s)", 15, 20);
        g2.setColor(ModernTheme.VIVID_ORANGE);
        g2.drawString("■ SEP Surge", 140, 20);
        g2.setColor(ModernTheme.VIVID_CYAN);
        g2.drawString("■ X-Ray Flux", 240, 20);

        // Draw CME Waveform Line (Red)
        drawWaveform(g2, cmePoints, 1000.0, 2000.0, ModernTheme.VIVID_RED, height, width);

        // Draw SEP Waveform Line (Orange)
        drawWaveform(g2, sepPoints, 0.0, 100.0, ModernTheme.VIVID_ORANGE, height, width);

        // Draw X-Ray Waveform Line (Cyan)
        drawWaveform(g2, xrayPoints, 0.0, 2.0, ModernTheme.VIVID_CYAN, height, width);
    }

    private void drawWaveform(Graphics2D g2, LinkedList<Double> points, double minVal, double maxVal, Color color, int height, int width) {
        g2.setColor(color);
        g2.setStroke(new BasicStroke(1.8f));

        double stepX = (double) (width - 20) / (maxPoints - 1);
        int chartH = height - 40;

        for (int i = 0; i < points.size() - 1; i++) {
            double val1 = points.get(i);
            double val2 = points.get(i + 1);

            int x1 = 10 + (int) (i * stepX);
            int x2 = 10 + (int) ((i + 1) * stepX);

            int y1 = (height - 20) - (int) (((val1 - minVal) / (maxVal - minVal)) * chartH);
            int y2 = (height - 20) - (int) (((val2 - minVal) / (maxVal - minVal)) * chartH);

            y1 = Math.max(25, Math.min(height - 15, y1));
            y2 = Math.max(25, Math.min(height - 15, y2));

            g2.drawLine(x1, y1, x2, y2);
        }
    }
}
