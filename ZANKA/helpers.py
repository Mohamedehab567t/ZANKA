from ZANKA.models import recipt
from ZANKA import db , salt
from sqlalchemy import asc
import hashlib
import datetime
from dateutil.parser import parse
def returnJSON(list):
    for n in list:
        n.toJson()
    return list


def filterInRecipt(searchObject):
    data = []
    conditions=[]
    dictt = {}
    if searchObject == {} :
        result = recipt.query.order_by(asc(recipt.dateofrecipt2)).all()
        for row in result :
            data.append(row)
    else:
        string = 'SELECT * FROM recipt WHERE '
        for key in searchObject :
            if key == "dateOfRecivieS" :
                condition = str("dateofrecipt2" +'>=')
                date = str(parse(searchObject[key].replace(" ",""))).split(" ")[0]
                dictt[key] = date
            elif key == "dateOfRecivieE" :
                 condition = str("dateofrecipt2" +'<=')
                 date = str(parse(searchObject[key].replace(" ",""))).split(" ")[0]
                 dictt[key] = date
            else:
                 condition = str(key +'=')
                 dictt[key] = str(searchObject[key])
            conditions.append(condition+":"+key)
        wholeCondition = ' AND '.join(conditions)
        string = string+wholeCondition+" ORDER BY dateofrecipt2 ASC"
        result = db.session.execute(string , dictt)
        print(string)
        for row in result :
            data.append(row)
    return data


def getTotalofData(data):
    paperTypes = []
    paperTypesCount = {}
    for row in data :
        if row.paperType not in paperTypes :
            paperTypes.append(row.paperType)
    for pap in paperTypes :
        count = 0
        for row in data : 
            if row.paperType == pap :
                count += int(row.farkh)
        paperTypesCount[pap] = count
    return paperTypesCount
    
    
def hashPasswords(p):
    key = hashlib.pbkdf2_hmac(
    'sha256',
    p.encode('utf-8'),
    salt, 
    100000
    )
    return key


def FixDate():
    RECIPTS = list(recipt.query.all())
    for r in RECIPTS :
      date =  str(parse(r.dateofrecipt.replace(" ",""))).split(" ")[0]
      r.convert(r.id , parse(datetime.datetime.strptime(date, "%Y-%m-%d").strftime("%d-%m-%Y")))
    db.session.commit()
