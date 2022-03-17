from ZANKA import db

class ctp(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    number = db.Column(db.Integer , unique=True , nullable = False)
    
    def FromJson(self , dict):
        self.name = dict['ctp_name']
        self.number = dict['ctp_number']
        
        
    def toJson(self):
        return{
            "id" : self.id,
            "ctp_name" : self.name,
            "ctp_number" : self.number
        }
    def update(self , id):
        getOBJ = db.session.query(ctp).get(id)
        getOBJ.name = self.name
        getOBJ.number = self.number
    
    
class printers(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    number = db.Column(db.Integer , unique=True , nullable = False)
    
    
    def FromJson(self , dict):
        self.name = dict['printers_name']
        self.number = dict['printers_number']
    def toJson(self):
        return{
        "id" : self.id,
        "printers_name" : self.name,
        "printers_number" : self.number
    }
    def update(self , id):
        getOBJ = db.session.query(printers).get(id)
        getOBJ.name = self.name
        getOBJ.number = self.number
    
class paper_type(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    
    def update(self , id):
        getOBJ = db.session.query(paper_type).get(id)
        getOBJ.name = self.name
    
    def FromJson(self , dict):
        self.name = dict['paper_type_name']
    def toJson(self):
        return{
        "id" : self.id,
        "paper_type_name" : self.name,
    }
    
    
class service_name(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    def FromJson(self , dict):
        self.name = dict['service_name_name']
    def toJson(self):
        return{
        "id" : self.id,
        "service_name_name" : self.name,
    }
    def update(self , id):
        getOBJ = db.session.query(service_name).get(id)
        getOBJ.name = self.name
    
class service_ctp(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    number = db.Column(db.Integer , unique=True , nullable = False)

    def FromJson(self , dict):
        self.name = dict['service_ctp_name']
        self.number = dict['service_ctp_number']
    def toJson(self):
        return{
        "id" : self.id,
        "service_ctp_name" : self.name,
        "service_ctp_number" : self.number
    }
    def update(self , id):
        getOBJ = db.session.query(service_ctp).get(id)
        getOBJ.name = self.name
        getOBJ.number = self.number
        
class recipt(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    reciptNumber = db.Column(db.Integer , nullable = False)
    zankaName = db.Column(db.String(500) , nullable = False)
    ctpName = db.Column(db.String(500) , nullable = False)
    colorCount = db.Column(db.Integer , nullable = False)
    printerName = db.Column(db.String(500) , nullable = False)
    paperType = db.Column(db.String(500) , nullable = False)
    size = db.Column(db.Integer , nullable = False)
    sahabat = db.Column(db.Integer , nullable = False)
    farkh = db.Column(db.Integer , nullable = False)
    service = db.Column(db.String(500)  ,default='-')
    serviceCtp = db.Column(db.String(500)  , default='-')
    dateofrecipt = db.Column(db.String(500)   , nullable = False)
    dateofrecipt2 = db.Column(db.Date , nullable = True)
    notes = db.Column(db.String(500) , default='-')
    

    def FromJson(self , dict):
        self.reciptNumber = dict['recipt_number']
        self.zankaName = dict['recipt_zanka_name']
        self.ctpName = dict['recipt_ctp']
        self.colorCount = dict['recipt_zanka_color_count']
        self.printerName = dict['recipt_printers']
        self.paperType = dict['recipt_paper_type']
        self.size = dict['recipt_zanka_size']
        self.sahabat = dict['recipt_zanka_sa7abat_count']
        self.farkh = dict['recipt_zanka_far5_count']
        self.service = dict['recipt_service_name']
        self.serviceCtp = dict['recipt_service_ctp']
        self.dateofrecipt = dict['recipt_data']
        self.notes = dict['recipt_notes']
        
    def update(self , id):
        getOBJ = db.session.query(recipt).get(id)
        getOBJ.reciptNumber = self.reciptNumber
        getOBJ.zankaName = self.zankaName
        getOBJ.ctpName = self.ctpName
        getOBJ.colorCount = self.colorCount
        getOBJ.printerName = self.printerName
        getOBJ.paperType = self.paperType
        getOBJ.size = self.size
        getOBJ.sahabat = self.sahabat
        getOBJ.farkh = self.farkh
        getOBJ.service = self.service
        getOBJ.serviceCtp = self.serviceCtp
        getOBJ.dateofrecipt = self.dateofrecipt
        getOBJ.notes = self.notes
    def convert(self , id , date):
        getOBJ = db.session.query(recipt).get(id)
        getOBJ.dateofrecipt2 = date

        
from ZANKA.helpers import hashPasswords
class user(db.Model):
    id = db.Column(db.Integer , primary_key=True)
    name = db.Column(db.String(50) , unique=True , nullable = False)
    password = db.Column(db.Integer , nullable = False)
    type = db.Column(db.String(50) , nullable = False)

    def FromJson(self , dict):
        self.name = dict['user_name']
        self.password = hashPasswords(dict['user_pass'])
        self.type = dict['user_type']