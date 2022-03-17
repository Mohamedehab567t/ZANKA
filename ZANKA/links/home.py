from operator import le
from flask import Blueprint , render_template , url_for , redirect , request
from ZANKA import forms
from ZANKA.frontend import Front
from ZANKA import db
from ZANKA.forms import Login
from ZANKA.models import ctp , printers , paper_type , service_ctp , service_name  , recipt
import datetime
import shutil
import secrets
home = Blueprint('home' , __name__)

days = {
        "Sunday" : "الاحد",
        "Monday" : "الاثنين",
        "Tuesday" : "الثلاثاء",
        "Wednesday" : "الاربعاء",
        "Thursday" : "الخميس",
        "Friday" : "الجمعة",
        "Saturday" : "السبت"
    }

@home.route('/loginpopo' , methods=['POST' , 'GET'])
def login():
    css = Front.Getcss('home')
    js = Front.Getjs('home.js')
    form = Login()
    if form.validate_on_submit():
        return redirect(url_for('home.main'))
    if form.errors:
        for errorfield in form.errors:
            for errorM in form[errorfield].errors:
                errorC = errorM
                return render_template('login.html', errorM=errorC, form=form , css=css , js=js )
    return render_template("login.html" , css=css , js=js , form=form)

@home.route('/')
def main():
    css = Front.Getcss('home')
    js = Front.Getjs('home.js')
    x = datetime.datetime.now()
    day = days[x.strftime('%A')]
    date = str(x.strftime('%d'))+'/'+str(x.strftime('%m'))+'/'+str(x.strftime('%Y'))
    CTP = ctp.query.all()
    PRINTERS = printers.query.all()
    PAPER_TYPE = paper_type.query.all()
    SERVICE_CTP = service_ctp.query.all()
    SERVICE_NAME = service_name.query.all()
    RECIPTS = recipt.query.all()
    print(request.remote_addr)
    RECIPTSLENGTH = len(list(RECIPTS))
    return render_template('home.html' , css=css , day=day , date=date,js=js , CTP=CTP,PRINTERS=PRINTERS,PAPER_TYPE=PAPER_TYPE
                           ,SERVICE_CTP=SERVICE_CTP,SERVICE_NAME=SERVICE_NAME , RECIPTS=RECIPTS,RECIPTSLENGTH=RECIPTSLENGTH)

@home.route("/backup")
def backup():
    original = 'E:\\zanka\\6-2\\ZANKA\\ZANKA\\zanka.db'
    date = secrets.token_hex(16)
    target = 'G:\\Backup\\'+str(date)+'.db'
    shutil.copyfile(original, target)
    return redirect(url_for('home.main'))