import re
import unittest

class TestIndex3DVisualizer(unittest.TestCase):
    def setUp(self):
        with open('richa/main3dvisual.html', 'r', encoding='utf-8') as f:
            self.html = f.read()

    def test_threejs_and_structure(self):
        self.assertIn('three.min.js', self.html)
        self.assertIn('canvas-container', self.html)
        self.assertIn('THREE.Scene()', self.html)

    def test_international_missions(self):
        self.assertIn('Aditya-L1 (ISRO Bhaarat)', self.html)
        self.assertIn('Parker Solar Probe (NASA USA)', self.html)
        self.assertIn('Solar Orbiter (ESA Europe)', self.html)
        self.assertIn('Spektr-RG Deep Relay (Roscosmos)', self.html)
        self.assertIn('MMX Phobos Relay (JAXA Japan)', self.html)
        self.assertIn('Starshield Relay 1 (SpaceX)', self.html)
        self.assertIn('Mars Operations Station (ISRO Mangalyaan Base)', self.html)

    def test_sun_sprinkler_particles(self):
        self.assertIn('sprinklerParticleCount', self.html)
        self.assertIn('sprinklerParticles', self.html)

    def test_console_and_hud_toggle_controls(self):
        self.assertIn('toggleConsolePanel', self.html)
        self.assertIn('toggleHudPanel', self.html)
        self.assertIn('close-btn', self.html)
        self.assertIn('sidebarConsole', self.html)
        self.assertIn('hudStatusBox', self.html)

    def test_no_duplicate_code_snippets(self):
        # Ensure animate() and script functions are declared exactly once
        animate_count = len(re.findall(r'function animate\(\)', self.html))
        log_console_count = len(re.findall(r'function logConsole\(', self.html))
        self.assertEqual(animate_count, 1)
        self.assertEqual(log_console_count, 1)

if __name__ == '__main__':
    unittest.main()
