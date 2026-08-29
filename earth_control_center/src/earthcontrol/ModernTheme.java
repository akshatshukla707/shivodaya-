package earthcontrol;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;
import java.awt.*;

public class ModernTheme {
    // Deep Space Space-Grade Dark Palette
    public static final Color BG_DARK = new Color(11, 14, 20);           // Deep Space Black #0B0E14
    public static final Color PANEL_BG = new Color(18, 24, 34);         // Primary Surface Dark #121822
    public static final Color CARD_BG = new Color(24, 32, 46);          // Component Card BG #18202E
    public static final Color INPUT_BG = new Color(13, 18, 26);         // Input Field BG #0D121A

    // High-Contrast Vivid Accent Palette (Red, Orange, Yellow, Green, Cyan, White, Amber)
    public static final Color VIVID_RED = new Color(255, 59, 48);        // Critical Alert Red #FF3B30
    public static final Color VIVID_ORANGE = new Color(255, 149, 0);     // Warning Orange #FF9500
    public static final Color VIVID_YELLOW = new Color(255, 204, 0);     // Caution Yellow #FFCC00
    public static final Color VIVID_AMBER = new Color(255, 171, 0);      // Tactical Amber #FFAB00
    public static final Color VIVID_GREEN = new Color(52, 199, 89);      // Nominal Green #34C759
    public static final Color VIVID_CYAN = new Color(90, 200, 250);      // Tactical Cyan #5AC8FA
    public static final Color VIVID_PURPLE = new Color(175, 82, 222);    // Telemetry Purple #AF52DE
    public static final Color WHITE = new Color(255, 255, 255);

    // Text & Borders
    public static final Color TEXT_PRIMARY = new Color(245, 247, 250);
    public static final Color TEXT_MUTED = new Color(140, 155, 175);
    public static final Color BORDER_COLOR = new Color(40, 54, 75);
    public static final Color GRID_COLOR = new Color(28, 38, 54);

    // Monospaced & Clean Typography
    public static final Font FONT_TITLE = new Font("Consolas", Font.BOLD, 19);
    public static final Font FONT_SUBTITLE = new Font("Consolas", Font.BOLD, 14);
    public static final Font FONT_MONO_BOLD = new Font("Consolas", Font.BOLD, 13);
    public static final Font FONT_MONO = new Font("Consolas", Font.PLAIN, 12);
    public static final Font FONT_SANS = new Font("SansSerif", Font.BOLD, 12);

    public static void applyFlatLafSettings() {
        try {
            UIManager.setLookAndFeel("com.formdev.flatlaf.FlatDarkLaf");
        } catch (Exception e) {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
        }

        // Sharp Geometric HUD Look (Arc = 0, focusWidth = 1)
        UIManager.put("Button.arc", 0);
        UIManager.put("Component.arc", 0);
        UIManager.put("ProgressBar.arc", 0);
        UIManager.put("TextComponent.arc", 0);
        UIManager.put("Component.focusWidth", 1);
        UIManager.put("Component.innerFocusWidth", 0);

        // System Overrides
        UIManager.put("Panel.background", PANEL_BG);
        UIManager.put("Table.background", PANEL_BG);
        UIManager.put("Table.foreground", TEXT_PRIMARY);
        UIManager.put("Table.gridColor", GRID_COLOR);
        UIManager.put("TableHeader.background", CARD_BG);
        UIManager.put("TableHeader.foreground", VIVID_CYAN);
        UIManager.put("TableHeader.font", FONT_MONO_BOLD);
    }

    public static Border createSharpBorder(Color color) {
        return new CompoundBorder(new LineBorder(color, 1), new EmptyBorder(6, 10, 6, 10));
    }

    public static JButton createTacticalButton(String text, Color bg, Color fg) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_MONO_BOLD);
        btn.setBackground(bg);
        btn.setForeground(fg);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setBorder(new CompoundBorder(new LineBorder(bg.brighter(), 1), new EmptyBorder(7, 12, 7, 12)));
        return btn;
    }

    // Dynamic Monospaced JTable Cell Renderer with High-Contrast Alert Highlighting
    public static DefaultTableCellRenderer createDynamicTableRenderer() {
        return new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(JTable table, Object value, boolean isSelected, boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(table, value, isSelected, hasFocus, row, column);
                setFont(FONT_MONO);
                setBorder(new EmptyBorder(3, 8, 3, 8));

                if (isSelected) {
                    c.setBackground(new Color(0, 110, 190));
                    c.setForeground(WHITE);
                    return c;
                }

                c.setBackground(row % 2 == 0 ? PANEL_BG : CARD_BG);
                c.setForeground(TEXT_PRIMARY);

                String strVal = value != null ? value.toString() : "";
                if (strVal.contains("HARMFUL") || strVal.contains("CRITICAL") || strVal.contains("COLLISION RISK")) {
                    c.setForeground(VIVID_RED);
                    setFont(FONT_MONO_BOLD);
                } else if (strVal.contains("WARNING") || strVal.contains("MONITORING") || strVal.contains("SEP_SURGE")) {
                    c.setForeground(VIVID_ORANGE);
                    setFont(FONT_MONO_BOLD);
                } else if (strVal.contains("ACTIVE") || strVal.contains("SAFE") || strVal.contains("NOMINAL")) {
                    c.setForeground(VIVID_GREEN);
                } else if (strVal.contains("Bhaarat Transceiver")) {
                    c.setForeground(VIVID_CYAN);
                }
                return c;
            }
        };
    }
}
