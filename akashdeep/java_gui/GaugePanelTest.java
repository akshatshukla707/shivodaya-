import java.awt.Dimension;

public class GaugePanelTest {
    public static void main(String[] args) {
        int failures = 0;

        // Test 1: GaugePanel preferred size height should allow full circular/arc gauge display without clipping
        GaugePanel gauge = new GaugePanel(1200, 3000);
        Dimension prefSize = gauge.getPreferredSize();
        if (prefSize.height <= 100) {
            System.err.println("FAIL Test 1: GaugePanel height is too small (" + prefSize.height + "), causing clipping!");
            failures++;
        } else {
            System.out.println("PASS Test 1: GaugePanel preferred size height is adequate: " + prefSize.height);
        }

        // Test 2: Ratio calculation bounds
        if (Math.abs(gauge.getRatio() - 0.4) > 0.001) {
            System.err.println("FAIL Test 2: GaugePanel getRatio expected 0.4, got " + gauge.getRatio());
            failures++;
        } else {
            System.out.println("PASS Test 2: GaugePanel getRatio returned correct value: " + gauge.getRatio());
        }

        // Test 3: Needle angle sweep (START_ANGLE = 210, value 1200/3000 => 0.4 * 240 deg = 96 deg sweep => 114 deg)
        double needleAngle = gauge.getNeedleAngleDegrees();
        if (Math.abs(needleAngle - 114.0) > 0.001) {
            System.err.println("FAIL Test 3: GaugePanel getNeedleAngleDegrees expected 114.0, got " + needleAngle);
            failures++;
        } else {
            System.out.println("PASS Test 3: GaugePanel needle angle calculated correctly: " + needleAngle);
        }

        // Test 4: Dynamic setValue updates properties correctly
        gauge.setValue(3000, 3000);
        if (Math.abs(gauge.getRatio() - 1.0) > 0.001 || Math.abs(gauge.getNeedleAngleDegrees() - (-30.0)) > 0.001) {
            System.err.println("FAIL Test 4: GaugePanel setValue at max failed. Ratio=" + gauge.getRatio() + " Angle=" + gauge.getNeedleAngleDegrees());
            failures++;
        } else {
            System.out.println("PASS Test 4: GaugePanel setValue updated values correctly.");
        }

        // Test 5: HealthMeterPanel update
        HealthMeterPanel healthMeter = new HealthMeterPanel();
        healthMeter.setHealth(35, 2500);
        System.out.println("PASS Test 5: HealthMeterPanel initialized and updated without error.");

        // Test 6: FlightSuggestionPanel update
        FlightSuggestionPanel suggestionPanel = new FlightSuggestionPanel();
        suggestionPanel.updateSuggestions(2600, 800, 30);
        System.out.println("PASS Test 6: FlightSuggestionPanel advisory updated without error.");

        if (failures > 0) {
            System.err.println("TOTAL FAILURES: " + failures);
            System.exit(1);
        } else {
            System.out.println("ALL DASHBOARD & GAUGEPANEL REGRESSION TESTS PASSED.");
        }
    }
}
