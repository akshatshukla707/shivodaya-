import subprocess
import time
import os

def test_single_choices():
    proc = subprocess.Popen(
        ['./richa/ion_dtn_demo/ion_dtn_engine', 'sender'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd='/home/akshat/shivodaya'
    )
    out, err = proc.communicate(input="1\n2\n3\n4\n0\n", timeout=10)
    
    assert "TYPE: CME" in out, "Choice 1 should send CME alert"
    assert "TYPE: SEP" in out, "Choice 2 should send SEP alert"
    assert "TYPE: SOLAR_WIND" in out, "Choice 3 should send Solar Wind alert"
    assert "TYPE: XRAY_FLUX" in out, "Choice 4 should send X-Ray Flux alert"

def test_auto_stream():
    proc = subprocess.Popen(
        ['./richa/ion_dtn_demo/ion_dtn_engine', 'sender'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd='/home/akshat/shivodaya'
    )
    out, err = proc.communicate(input="5\n0\n", timeout=20)
    
    assert "Dispatching 20 Multi-Radiation BPv7 Alerts" in out, f"Auto stream header mismatch. Got:\n{out}"
    assert "TYPE: CME" in out, "Auto stream should contain CME"
    assert "TYPE: SEP" in out, "Auto stream should contain SEP"
    assert "TYPE: SOLAR_WIND" in out, "Auto stream should contain SOLAR_WIND"
    assert "TYPE: XRAY_FLUX" in out, "Auto stream should contain XRAY_FLUX"

def test_delayed_receiver_timing():
    # Clean store
    if os.path.exists('/tmp/ion_dtn_bpv7_custody.store'):
        os.remove('/tmp/ion_dtn_bpv7_custody.store')
        
    proc_send = subprocess.Popen(
        ['./richa/ion_dtn_demo/ion_dtn_engine', 'sender'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd='/home/akshat/shivodaya'
    )
    proc_send.communicate(input="1\n0\n", timeout=5)
    
    time.sleep(1.5) # simulate blackout delay
    
    proc_recv = subprocess.Popen(
        ['./richa/ion_dtn_demo/ion_dtn_engine', 'recv_delayed'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        cwd='/home/akshat/shivodaya'
    )
    out_recv, _ = proc_recv.communicate(timeout=10)
    
    assert "[DELAYED TIME]: Transmission latency / blackout duration =" in out_recv, "Delayed time display missing in receiver"
    assert "seconds" in out_recv, "Latency unit missing in receiver"

if __name__ == '__main__':
    test_single_choices()
    print("test_single_choices PASSED")
    test_auto_stream()
    print("test_auto_stream PASSED")
    test_delayed_receiver_timing()
    print("test_delayed_receiver_timing PASSED")
