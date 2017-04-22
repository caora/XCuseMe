#!/usr/bin/python
import time
import RPi.GPIO as GPIO
import requests

with open("DOMAIN") as fp:
	domain = int(fp.read())
print "Domain: %d" % domain

with open("LOCATION") as fp:
	location = int(fp.read())
print "Location: %d" % location

# Zuordnung der GPIO Pins (ggf. anpassen)
LCD_RS = 16
LCD_E  = 11
LCD_DATA4 = 29
LCD_DATA5 = 31
LCD_DATA6 = 33
LCD_DATA7 = 35

SW1 = 5
SW2 = 3

LCD_WIDTH = 16 		# Zeichen je Zeile
LCD_LINE_1 = 0x80 	# Adresse der ersten Display Zeile
LCD_LINE_2 = 0xC0 	# Adresse der zweiten Display Zeile
LCD_CHR = GPIO.HIGH
LCD_CMD = GPIO.LOW
E_PULSE = 0.0005
E_DELAY = 0.0005

def lcd_send_byte(bits, mode):
	# Pins auf LOW setzen
	GPIO.output(LCD_RS, mode)
	GPIO.output(LCD_DATA4, GPIO.LOW)
	GPIO.output(LCD_DATA5, GPIO.LOW)
	GPIO.output(LCD_DATA6, GPIO.LOW)
	GPIO.output(LCD_DATA7, GPIO.LOW)
	if bits & 0x10 == 0x10:
	  GPIO.output(LCD_DATA4, GPIO.HIGH)
	if bits & 0x20 == 0x20:
	  GPIO.output(LCD_DATA5, GPIO.HIGH)
	if bits & 0x40 == 0x40:
	  GPIO.output(LCD_DATA6, GPIO.HIGH)
	if bits & 0x80 == 0x80:
	  GPIO.output(LCD_DATA7, GPIO.HIGH)
	time.sleep(E_DELAY)    
	GPIO.output(LCD_E, GPIO.HIGH)  
	time.sleep(E_PULSE)
	GPIO.output(LCD_E, GPIO.LOW)  
	time.sleep(E_DELAY)      
	GPIO.output(LCD_DATA4, GPIO.LOW)
	GPIO.output(LCD_DATA5, GPIO.LOW)
	GPIO.output(LCD_DATA6, GPIO.LOW)
	GPIO.output(LCD_DATA7, GPIO.LOW)
	if bits&0x01==0x01:
	  GPIO.output(LCD_DATA4, GPIO.HIGH)
	if bits&0x02==0x02:
	  GPIO.output(LCD_DATA5, GPIO.HIGH)
	if bits&0x04==0x04:
	  GPIO.output(LCD_DATA6, GPIO.HIGH)
	if bits&0x08==0x08:
	  GPIO.output(LCD_DATA7, GPIO.HIGH)
	time.sleep(E_DELAY)    
	GPIO.output(LCD_E, GPIO.HIGH)  
	time.sleep(E_PULSE)
	GPIO.output(LCD_E, GPIO.LOW)  
	time.sleep(E_DELAY)  

def display_init():
	lcd_send_byte(0x33, LCD_CMD)
	lcd_send_byte(0x32, LCD_CMD)
	lcd_send_byte(0x28, LCD_CMD)
	lcd_send_byte(0x0C, LCD_CMD)  
	lcd_send_byte(0x06, LCD_CMD)
	lcd_send_byte(0x01, LCD_CMD)  

def lcd_message(message):
	message = message.ljust(LCD_WIDTH," ")  
	for i in range(LCD_WIDTH):
	  lcd_send_byte(ord(message[i]),LCD_CHR)

def init_msg():
	lcd_send_byte(LCD_LINE_1, LCD_CMD)
        lcd_message("Welcome to the")
        lcd_send_byte(LCD_LINE_2, LCD_CMD)
        lcd_message("Mos Eisley!")

def send_request():
	rs = requests.post("http://192.168.43.22:8000/orderings/domains/%d/locations/%d/token" % (domain, location))
	token = rs.json()[u'token']
	lcd_delete()
	lcd_send_byte(LCD_LINE_1, LCD_CMD)
	lcd_message(str(token))
	lcd_send_byte(LCD_LINE_2, LCD_CMD)
	lcd_message("DON'T STEAL ME!!")

def lcd_delete():
	lcd_send_byte(LCD_LINE_1, LCD_CMD)
	lcd_message("")
	lcd_send_byte(LCD_LINE_2, LCD_CMD)
	lcd_message("")
	
if __name__ == '__main__':
	# initialisieren
	GPIO.setmode(GPIO.BOARD)
	GPIO.setwarnings(False)
	
	# LCD Pins
	GPIO.setup(LCD_E, GPIO.OUT)
	GPIO.setup(LCD_RS, GPIO.OUT)
	GPIO.setup(LCD_DATA4, GPIO.OUT)
	GPIO.setup(LCD_DATA5, GPIO.OUT)
	GPIO.setup(LCD_DATA6, GPIO.OUT)
	GPIO.setup(LCD_DATA7, GPIO.OUT)

	GPIO.setup(SW1, GPIO.IN)	# switch 1
	GPIO.setup(SW2, GPIO.IN)	# switch 2

	display_init()

	lcd_send_byte(LCD_LINE_1, LCD_CMD)
	lcd_message("Welcome to the")
	lcd_send_byte(LCD_LINE_2, LCD_CMD)
	lcd_message("Mos Eisley!")
	
#	GPIO.add_event_detect(SW2, GPIO.RISING, callback=lcd_delete, bouncetime=200)
#	GPIO.add_event_detect(SW1, GPIO.RISING, callback=send_request, bouncetime=200)
	GPIO.add_event_detect(SW1, GPIO.RISING, bouncetime=200)
	GPIO.add_event_detect(SW2, GPIO.RISING, bouncetime=200)
	
	btn_enable = True;
	
	while True:
		#if btn_enable:
		if GPIO.event_detected(SW1):
			send_request()
			GPIO.remove_event_detect(SW1)
				#btn_enable = False;
				#lcd_delete()

		if GPIO.event_detected(SW2):
			lcd_delete()
			init_msg()
			GPIO.add_event_detect(SW1, GPIO.RISING, bouncetime=200)
			#btn_enable = True;
			#send_request()
