import os
import time
import threading
import socket


def a():
    os.system("python C:\\Users\\Lenovo\\Desktop\\Needs\\ZANKA\\run.py")	    
	
def b():
    time.sleep(3)
    os.system("start \"\" http://"+socket.gethostbyname(socket.gethostname())+":5000/")

threading.Thread(target=a).start()
threading.Thread(target=b).start()