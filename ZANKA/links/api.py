from flask import Blueprint , render_template
from flask.globals import request
import sqlalchemy
from ZANKA import db
from ZANKA.frontend import Front
from ZANKA.helpers import filterInRecipt , getTotalofData , FixDate
from ZANKA.models import ctp , printers , paper_type , service_ctp , service_name , recipt , user
import datetime
api = Blueprint('api' , __name__ , url_prefix='/api')


dataClasses = {
    "ctp" : ctp,
    "printers" : printers,
    "paper_type" : paper_type,
    "service_ctp" : service_ctp,
    "service_name" : service_name,
    "recipt" : recipt,
    "user" : user
}


@api.route('/addData' , methods=['POST'])
def addData():
    json = request.get_json()
    getClass = dataClasses[json['type']]
    theClass = getClass()
    theClass.FromJson(json)
    db.session.add(theClass)
    try:
        db.session.commit()
        FixDate()
    except sqlalchemy.exc.IntegrityError as ex :
        print(ex)
        return "هذه البيانات موجوده من قبل"
    return 'تم الاضافة'

@api.route('/updateData' , methods=['POST'])
def updateData():
    json = request.get_json()
    getClass = dataClasses[json['type']]
    theClass = getClass()
    theClass.FromJson(json)
    theClass.update(json['id'])
    try:
        db.session.commit()
        FixDate()
    except sqlalchemy.exc.IntegrityError :
        return "هذه البيانات موجوده من قبل"
    return 'تم التعديل'

@api.route('/deleteData' , methods=['DELETE'])
def deleteData():
    json = request.get_json()
    getClass = dataClasses[json['type']]
    item=getClass.query.get_or_404(json['id'])
    db.session.delete(item)
    db.session.commit()
    return 'تم الحذف'


@api.route('/searchData' , methods=['POST'])
def searchData():
    searchObject = request.get_json()
    data = filterInRecipt(searchObject)
    rows = getTotalofData(data)
    css = Front.Getcss('home')
    js = Front.Getjs('home.js')
    x = datetime.datetime.now()
    date = str(x.strftime('%d'))+'/'+str(x.strftime('%m'))+'/'+str(x.strftime('%Y'))
    return render_template('report.html' , data=data , css=css , rows=rows , date=date , js=js)


@api.route('/getData' , methods=['POST'])
def getData():
    json = request.get_json()
    css = Front.Getcss('home')
    js = Front.Getjs('home.js')
    CTP = ctp.query.all()
    r = recipt()
    r.FromJson(json)
    PRINTERS = printers.query.all()
    PAPER_TYPE = paper_type.query.all()
    SERVICE_CTP = service_ctp.query.all()
    SERVICE_NAME = service_name.query.all()
    return render_template('updateRow.html' , css=css , js=js,CTP=CTP,PRINTERS=PRINTERS,PAPER_TYPE=PAPER_TYPE
                           ,SERVICE_CTP=SERVICE_CTP,SERVICE_NAME=SERVICE_NAME, r=r , id = json['rid'])


@api.route('/searchByDate' , methods=['POST'])
def searchByDate():
    searchObject = request.get_json()
    data = []
    result = db.session.execute('SELECT * FROM recipt WHERE dateofrecipt >= :s AND dateofrecipt <= :e' , {"s":searchObject['dateOfRecivieS'] , "e" : searchObject['dateOfRecivieE']})
    for row in result :
        data.append(row)
    rows = getTotalofData(data)
    css = Front.Getcss('home')
    js = Front.Getjs('home.js') 
    x = datetime.datetime.now()
    date = str(x.strftime('%d'))+'/'+str(x.strftime('%m'))+'/'+str(x.strftime('%Y'))
    return render_template('report.html' , data=data , css=css , rows=rows , date=date , js=js)


