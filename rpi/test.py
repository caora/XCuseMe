import time
import RPi.GPIO as gpio

gpio.setmode(gpio.BOARD)
gpio.setup(5, gpio.IN)

def test(_):
	print 'ok'

gpio.add_event_detect(5, gpio.RISING, callback=test, bouncetime=200)

while True:
	time.sleep(1)

