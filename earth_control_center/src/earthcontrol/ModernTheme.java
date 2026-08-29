package earthcontrol;

import javax.swing.*;
import javax.swing.border.Border;
import javax.swing.border.CompoundBorder;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.table.DefaultTableCellRenderer;

import java.awt.*;

public class ModernTheme {
    // Sharp Tactical Colors (Solid Deep Charcoal / Pure Black + Tactical Cyan / Amber accents)
    public static final Color BG_DARK = new Color(10, 12, 16);          // Pure Deep Charcoal/Black #0A0C10
    public static final Color PANEL_BG = new Color(18, 22, 28);        // Surface Dark #12161C
    public static final Color CARD_BG = new Color(24, 30, 40);         // Card Surface #181E28
    public static final Color INPUT_BG = new Color(12, 16, 22);        // Input Field BG #0C1016

    // Accent Palette
    public static final Color ACCENT_CYAN = new Color(0, 229, 255);     // Tactical Bright Cyan #00E5FF
    public static final Color ACCENT_AMBER = new Color(255, 171, 0);    // Tactical Amber #FFAB00
    public static final Color ACCENT_RED = new Color(255, 45, 85);       // Alert Red #FF2D55
    public static final Color ACCENT_GREEN = new Color(0, 230, 118);    // Nominal Green #00E676

    // Text & Borders
    public static final Color TEXT_PRIMARY = new Color(245, 247, 250);
    public static final Color TEXT_SECONDARY = new Color(140, 155, 175);
    public static final Color BORDER_COLOR = new Color(40, 52, 70);
    public static final Color GRID_COLOR = new Color(30, 40, 55);

    // Modern Fonts (Roboto / Inter clean sans-serif)
    public static final Font FONT_TITLE = new Font("Roboto", Font.BOLD, 18);
    public static final Font FONT_SUBTITLE = new Font("Roboto", Font.BOLD, 14);
    public static final Font FONT_HEADER = new Font("Roboto", Font.BOLD, 12);
    public static final Font FONT_REGULAR = new Font("Roboto", Font.PLAIN, 12);
    public static final Font FONT_BOLD = new Font("Roboto", Font.BOLD, 12);
    public static final Font FONT_MONO = new Font("Monospaced", Font.BOLD, 12);

    public static void applyFlatLafSettings() {
        try {
            // Initialize FlatDarkLaf look and feel dynamically
            UIManager.setLookAndFeel("com.formdev.flatlaf.FlatDarkLaf");
        } catch (Exception e) {
            try {
                UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
            } catch (Exception ignored) {}
        }

        // Apply sharp geometric UI properties (Arc = 0, focusWidth = 1)
        UIManager.put("Button.arc", 0);
        UIManager.put("Component.arc", 0);
        UIManager.put("ProgressBar.arc", 0);
        UIManager.put("TextComponent.arc", 0);
        UIManager.put("Component.focusWidth", 1);
        UIManager.put("Component.innerFocusWidth", 0);

        // Dark Theme Overrides
        UIManager.put("Panel.background", PANEL_BG);
        UIManager.put("Table.background", PANEL_BG);
        UIManager.put("Table.foreground", TEXT_PRIMARY);
        UIManager.put("Table.gridColor", GRID_COLOR);
        UIManager.put("TableHeader.background", CARD_BG);
        UIManager.put("TableHeader.foreground", ACCENT_CYAN);
        UIManager.put("TableHeader.font", FONT_BOLD);
        UIManager.put("TabbedPane.selectedBackground", CARD_BG);
        UIManager.put("TabbedPane.selectedForeground", ACCENT_CYAN);
        UIManager.put("TabbedPane.underlineColor", ACCENT_CYAN);
        UIManager.put("TabbedPane.font", FONT_BOLD);
    }

    public static Border createSharpBorder(Color color) {
        return new CompoundBorder(new LineBorder(color, 1), new EmptyBorder(8, 12, 8, 12));
    }

    public static JButton createTacticalButton(String text, Color bg, Color fg) {
        JButton btn = new JButton(text);
        btn.setFont(FONT_BOLD);
        btn.setBackground(bg);
        btn.setForeground(fg);
        btn.setFocusPainted(false);
        btn.setCursor(new Cursor(Cursor.HAND_CURSOR));
        btn.setBorder(new CompoundBorder(new LineBorder(bg.brighter(), 1), new EmptyBorder(7, 14, 7, 14)));
        return btn;
    }

    public static DefaultTableCellRenderer createTableRenderer() {
        DefaultTableCellRenderer renderer = new DefaultTableCellRenderer();
        renderer.setBackground(PANEL_BG);
        renderer.setForeground(TEXT_PRIMARY);
        renderer.setBorder(new EmptyBorder(4, 8, 4, 8));
        return renderer;
    }
}
